// https://github.com/EnCiv/undebate-ssp/issues/71
// https://github.com/EnCiv/undebate-ssp/issues/52

import { Iota } from 'civil-server'
import S from 'underscore.string'

// get all the ElectionDoc component belonging to the user, and all of the children of those docs
// up to depth 2. but depth can be extended by extending the aggregation operators
const aggLookupChildren = [
    { $project: { depth0: ['$$CURRENT'] } },
    {
        $graphLookup: {
            from: 'iotas',
            startWith: { $toString: '$_id' },
            connectFromField: 'notused1',
            connectToField: 'parentId',
            as: 'depth1',
            maxDepth: 0,
        },
    },
    {
        $graphLookup: {
            from: 'iotas',
            startWith: {
                $map: {
                    input: '$depth1',
                    in: { $toString: '$$this._id' },
                },
            },
            connectFromField: 'notused2',
            connectToField: 'parentId',
            as: 'depth2',
            maxDepth: 0,
        },
    },
    {
        $project: {
            _id: false,
            children: { $concatArrays: ['$depth0', '$depth1', '$depth2'] },
        },
    },
    { $unwind: '$children' },
    { $replaceRoot: { newRoot: '$children' } },
    { $sort: { _id: 1 } },
]

export default async function getElectionDocs(cb) {
    if (!this.synuser) {
        if (cb) cb() // no user
        return
    }
    try {
        const iotas = await Iota.aggregate(
            [{ $match: { userId: this.synuser.id, 'webComponent.webComponent': 'ElectionDoc' } }].concat(
                aggLookupChildren
            )
        )
        if (!iotas) return cb && cb()
        if (!iotas.length) return cb && cb(iotas)
        const merged = mergeElectionChildren(iotas)
        if (cb) cb(merged.map(doc => doc.webComponent || {})) // electionDocs of the webComponent of Iotas
    } catch (err) {
        logger.error('getElectionDocs caught error:', err)
        if (cb) cb()
    }
}

export async function getElectionDocById(id, cb) {
    if (!this.synuser) {
        if (cb) cb() // no user
        return
    }
    const _id = typeof id !== 'object' ? Iota.ObjectID(id) : id
    try {
        const iotas = await Iota.aggregate([{ $match: { _id } }].concat(aggLookupChildren))
        if (!iotas) return cb && cb()
        if (!iotas.length) return cb && cb(iotas)
        const merged = mergeElectionChildren(iotas)
        const doc = merged.find(doc => doc._id.toString() === _id.toString())
        if (cb) cb(doc)
    } catch (err) {
        logger.error('getElectionDocs caught error:', err)
        if (cb) cb()
    }
}

// lets say we get back an array of docs that match ElectionDoc and all their children and childrens' children ...
function mergeElectionChildren(iotas) {
    const results = []
    const usedIndexes = {}
    function doMerge() {
        for (const i in iotas) {
            if (usedIndexes[i]) continue
            const iota = iotas[i]
            if (iota?.webComponent?.webComponent === 'ElectionDoc') {
                usedIndexes[i] = true
                intoDstOfRootMergeChildrenOfParentFromIotasMarkingUsedIndexs(
                    iota,
                    iota,
                    getId(iota._id),
                    iotas,
                    usedIndexes
                )
                results.push(iota)
            }
        }
    }
    function countUnmerged() {
        let unmerged = 0
        for (const i in iotas) {
            if (!usedIndexes[i]) {
                unmerged++
                logger.error('getElectionDocs.mergeElectionChildren did not merge', iotas[i])
            }
        }
        return unmerged
    }
    let lastUnmerged = Number.POSITIVE_INFINITY
    doMerge()
    let unmerged = countUnmerged()
    while (unmerged > 0 && unmerged < lastUnmerged) {
        lastUnmerged = unmerged
        doMerge()
        unmerged = countUnmerged()
    }
    return results
}

function getId(id) {
    if (typeof id === 'object') return Iota.ObjectID(id).toString()
    return id
}

export function intoDstOfRootMergeChildrenOfParentFromIotasMarkingUsedIndexs(dst, root, parentId, iotas, usedIndexes) {
    for (const i in iotas) {
        if (usedIndexes[i]) continue
        const child = iotas[i]
        if (parentId !== child.parentId) continue
        let result
        for (const op of Object.values(mergeOps)) {
            if ((result = op(dst, root, child, iotas, usedIndexes))) {
                usedIndexes[i] = true
                if (typeof result == 'function') result()
                break
            }
        }
    }
}

function intoArrayAtObjPathPushDoc(obj, path, doc) {
    let o = obj
    const keys = path.split('.')
    let key
    while (((key = keys.shift()), keys.length > 0)) {
        if (!o[key]) o[key] = {}
        o = o[key]
    }
    // key will be the last of the path
    if (!o[key]) o[key] = []
    o[key].push(doc)
}

// an object of docs is an object where each key is a doc's _id and the value is the doc
// { '62a17c01635c4c4700ced877': {_id: '62a17c01635c4c4700ced877, subject: "an iota doc", description: 'this is an iota in an object of docs, ...}}
export function intoObjOfDocsAtObjPathMergeDoc(obj, path, doc) {
    let o = obj
    const keys = path.split('.')
    let key
    while (((key = keys.shift()), keys.length > 0)) {
        if (!o[key]) o[key] = {}
        o = o[key]
    }
    // key will be the last of the path
    if (!o[key]) o[key] = {}
    if (!o[key][doc._id]) o[key][doc._id] = doc
    else merge(o[key][doc._id], doc)
}

function doesArrayAtObjPathContainDocWithId(obj, path, id) {
    if (!id) return false
    id = getId(id)
    const keys = path.split('.')
    let o = obj
    while (keys.length > 0) {
        o = o[keys.shift()]
        if (typeof o === 'undefined') return false
    }
    if (!Array.isArray(o)) return false
    for (const e of o) {
        if (typeof e !== 'object') continue
        if (getId(e._id) === id) return true
    }
    return false
}

// function name should describe the destination of the merge into the root
// return false if child does not match conditions for the merge
// return true if merge successful
// return a function if merge successful and more work needs to be done, after the child is marked used
const mergeOps = {
    // iotas and usedIndexes are props in case the op needs to run recursively
    moderatorRecorders(dst, root, child, iotas, usedIndexes) {
        if (!(child?.component?.component === 'UndebateCreator' && child?.bp_info?.office === 'Moderator')) return false
        intoObjOfDocsAtObjPathMergeDoc(dst, 'webComponent.moderator.recorders', child)
        return true
    },
    moderatorViewers(dst, root, child, iotas, usedIndexes) {
        if (!(child?.webComponent?.webComponent === 'CandidateConversation' && child?.bp_info?.office === 'Moderator'))
            return false
        intoObjOfDocsAtObjPathMergeDoc(dst, 'webComponent.moderator.viewers', child)
        return () =>
            intoDstOfRootMergeChildrenOfParentFromIotasMarkingUsedIndexs(
                dst,
                root,
                getId(child._id),
                iotas,
                usedIndexes
            )
    },
    moderatorSubmissions(dst, root, child, iotas, usedIndexes) {
        if (
            !(
                child?.component?.component === 'MergeParticipants' &&
                root?.webComponent?.moderator?.viewers?.[child?.parentId]
            )
        )
            return false
        intoObjOfDocsAtObjPathMergeDoc(dst, 'webComponent.moderator.submissions', child)
        return true
    },
    moderatorInvitations(dst, root, child, iotas, usedIndexes) {
        if (!(child?.component?.component === 'ModeratorEmailSent')) return false
        intoObjOfDocsAtObjPathMergeDoc(dst, 'webComponent.moderator.invitations', {
            _id: child._id,
            ...child.component,
        })
        return true
    },
    candidateInvitations(dst, root, child, iotas, usedIndexes) {
        if (!(child?.component?.component === 'CandidateInviteSent')) return false
        const uniqueId = child?.component?.params?.candidate?.uniqueId
        if (!uniqueId) return false
        intoObjOfDocsAtObjPathMergeDoc(dst, `webComponent.candidates.${uniqueId}.invitations`, {
            _id: child._id,
            ...child.component,
        })
        return true
    },
    candidatesRecorders(dst, root, child, iotas, usedIndexes) {
        if (!(child?.component?.component === 'UndebateCreator' && child?.bp_info?.office !== 'Moderator')) return false
        intoObjOfDocsAtObjPathMergeDoc(dst, `webComponent.candidates.${child.bp_info.unique_id}.recorders`, child)
        return true
    },
    candidatesSubmissions(dst, root, child, iotas, usedIndexes) {
        if (child?.component?.component !== 'MergeParticipants') {
            return false
        }
        const unique_id = child?.bp_info?.unique_id || child?.component?.participant?.bp_info?.unique_id
        if (!root?.webComponent?.candidates?.[unique_id]) return false
        intoObjOfDocsAtObjPathMergeDoc(dst, `webComponent.candidates.${unique_id}.submissions`, child)
        return true
    },
    officesViewers(dst, root, child, iotas, usedIndexes) {
        if (
            !(child?.webComponent?.webComponent === 'CandidateConversation' && child?.bp_info?.office !== 'Moderator')
        ) {
            return false
        }
        const bpInfoOffice = child?.bp_info?.office
        if (!bpInfoOffice) return false
        intoObjOfDocsAtObjPathMergeDoc(dst, `webComponent.offices.${S(bpInfoOffice).slugify().value()}.viewers`, child)
        return () =>
            intoDstOfRootMergeChildrenOfParentFromIotasMarkingUsedIndexs(
                dst,
                root,
                getId(child._id),
                iotas,
                usedIndexes
            )
    },
}
