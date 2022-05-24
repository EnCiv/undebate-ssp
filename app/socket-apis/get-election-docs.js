// https://github.com/EnCiv/undebate-ssp/issues/71

import { Iota } from 'civil-server'

export default async function getElectionDocs(cb) {
    if (!this.synuser) {
        if (cb) cb() // no user
        return
    }
    try {
        // get all the ElectionDoc component belonging to the user, and all of the children of those docs
        // up to depth 2. but depth can be extended by extending the aggregation operators
        const iotas = await Iota.aggregate([
            { $match: { userId: this.synuser.id, 'webComponent.webComponent': 'ElectionDoc' } },
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
        ])
        if (!iotas) return cb && cb()
        if (!iotas.length) return cb && cb(iotas)
        const merged = mergeElectionChildren(iotas)
        if (cb) cb(merged)
    } catch (err) {
        logger.error('getElectionDocs caught error:', err)
        if (cb) cb()
    }
}

// lets say we get back an array of docs that match ElectionDoc and all their children and childrens' children ...
function mergeElectionChildren(iotas) {
    const results = []
    const usedIndexes = {}
    debugger
    for (const i in iotas) {
        if (usedIndexes[i]) continue
        const iota = iotas[i]
        if (iota?.webComponent?.webComponent === 'ElectionDoc') {
            usedIndexes[i] = true
            mergeInChildren(iota, iotas, usedIndexes)
            results.push(iota)
        }
    }
    for (const i in iotas) {
        if (!usedIndexes[i]) logger.error('getElectionDocs.mergeElectionChildren did not merge', iotas[i])
    }
    return results
}

function mergeInChildren(iota, iotas, usedIndexes) {
    const parentId = Iota.ObjectId(iota._id).toString()
    for (const i in iotas) {
        if (usedIndexes[i]) continue
        const child = iotas[i]
        if (child.parentId === parentId) {
            for (const op of Object.values(mergeOps)) {
                if (op(iota, child, iotas, usedIndexes)) {
                    usedIndexes[i] = true
                    break
                }
            }
        }
    }
}

function pushToArrayAtEndOfPath(obj, path, value) {
    debugger
    let o = obj
    const keys = path.split('.')
    let key
    while (((key = keys.shift()), keys.length > 0)) {
        if (!o[key]) o[key] = {}
        o = o[key]
    }
    // key will be the last of the path
    if (!o[key]) o[key] = []
    o[key].push(value)
}

const mergeOps = {
    // iotas and usedIndexes are props in case the op needs to run recursively
    moderatorRecorder(iota, child, iotas, usedIndexes) {
        if (!(child?.component?.component === 'undebateCreator' && child?.bp_info?.office === 'Moderator')) return false
        pushToArrayAtEndOfPath(iota, 'webComponent.moderator.recorders', child)
        return true
    },
    moderatorViewer(iota, child, iotas, usedIndexes) {
        if (!(child?.webComponent?.webComponent === 'CandidateConversation' && child?.bp_info?.office === 'Moderator'))
            return false
        pushToArrayAtEndOfPath(iota, 'webComponent.moderator.viewers', child)
        return true
    },
}
