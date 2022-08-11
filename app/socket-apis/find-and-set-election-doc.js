// https://github.com/EnCiv/undebate-ssp/issues/72

import { Iota } from 'civil-server'
import Joi from 'joi'
import JoiObjectID from 'joi-objectid'
import { updateSubscribers } from './subscribe-election-info'

Joi.objectId = JoiObjectID(Joi)

const Integer = /^[0-9]+$/
const ObjectID = /^[0-9a-fA-F]{24}$/
const SANE = 4096

function invitations() {
    return Joi.object().pattern(
        Joi.string().pattern(ObjectID),
        Joi.object({
            _id: Joi.objectId(),
            text: Joi.string().max(SANE),
            sentDate: Joi.string().isoDate(),
            responseDate: Joi.string().isoDate(),
            status: Joi.string().max(SANE),
        })
    )
}
function submissions() {
    return Joi.object().pattern(
        Joi.string().pattern(ObjectID),
        Joi.object({
            _id: Joi.objectId(),
            url: Joi.string().max(SANE),
            date: Joi.string().isoDate(),
            parentId: Joi.string().pattern(ObjectID),
        })
    )
}
const electionSchema = Joi.object({
    id: Joi.string().pattern(ObjectID),
    webComponent: 'ElectionDoc',
    electionName: Joi.string().max(SANE),
    organizationName: Joi.string().max(SANE),
    organizationUrl: Joi.string().uri(),
    organizationLogo: Joi.string().uri(),
    electionDate: Joi.string().isoDate(),
    email: Joi.string().email(),
    questions: Joi.object().pattern(
        Joi.string().pattern(Integer),
        Joi.object({
            text: Joi.string().max(SANE),
            time: Joi.string().pattern(Integer),
        })
    ),
    script: Joi.object().pattern(
        Joi.string().pattern(Integer),
        Joi.object({
            text: Joi.string().max(SANE),
        })
    ),
    moderator: Joi.object({
        name: Joi.string().max(SANE),
        email: Joi.string().email(),
        message: Joi.string().max(SANE),
        invitations: invitations(),
        submissions: submissions(),
        recorders: Joi.object(),
        viewers: Joi.object(),
    }),
    candidates: Joi.object().pattern(
        Joi.string().pattern(ObjectID),
        Joi.object({
            uniqueId: Joi.string().pattern(ObjectID),
            name: Joi.string().max(SANE),
            email: Joi.string().email(),
            office: Joi.string().max(SANE),
            region: Joi.string().max(SANE),
            invitations: invitations(),
            submissions: submissions(),
            recorders: Joi.object(),
        })
    ),
    timeline: {
        moderatorDeadlineReminderEmails: Joi.object().pattern(
            Joi.string().pattern(Integer),
            Joi.object({
                date: Joi.string().isoDate(),
                sent: Joi.boolean(),
            })
        ),
        moderatorSubmissionDeadline: Joi.object().pattern(
            Joi.string().pattern(Integer),
            Joi.object({
                date: Joi.string().isoDate(),
                sent: Joi.boolean(),
            })
        ),
        moderatorInviteDeadline: Joi.object().pattern(
            Joi.string().pattern(Integer),
            Joi.object({
                date: Joi.string().isoDate(),
                sent: Joi.boolean(),
            })
        ),
        candidateDeadlineReminderEmails: Joi.object().pattern(
            Joi.string().pattern(Integer),
            Joi.object({
                date: Joi.string().isoDate(),
                sent: Joi.boolean(),
            })
        ),
        candidateSubmissionDeadline: Joi.object().pattern(
            Joi.string().pattern(Integer),
            Joi.object({
                date: Joi.string().isoDate(),
                sent: Joi.boolean(),
            })
        ),
    },
    undebateDate: Joi.string().isoDate(),
    doneLocked: Joi.object(),
})

function lp(path) {
    return path ? path + '.' : ''
}
function docToSetUnset(doc, sets = {}, unsets = {}, path = '') {
    Object.keys(doc).forEach(key => {
        if (typeof doc[key] === 'object' && !(doc[key] instanceof Iota.ObjectID) && !(doc[key] instanceof Date)) {
            docToSetUnset(doc[key], sets, unsets, lp(path) + key)
        } else if (typeof doc[key] === 'function') return
        //just skip functions
        else if (typeof doc[key] === 'undefined') {
            unsets[lp(path) + key] = ''
        } else sets[lp(path) + key] = doc[key]
    })
    return [sets, unsets]
}

export default async function findAndSetElectionDoc(query, doc, cb) {
    if (!this.synuser) return cb && cb() // no user
    const valid = electionSchema.validate(doc)
    if (valid.error) {
        logger.error('ElectionDoc validation', JSON.stringify(valid, null, 2))
        return cb && cb()
    }
    const id = query._id
    if (typeof id !== 'string') logger.error('id was not a string', id)
    if (query._id) query._id = Iota.ObjectID(query._id)
    const [sets, unsets] = docToSetUnset({ webComponent: doc })
    try {
        // upsert
        await Iota.updateOne(query, { $set: sets, $unset: unsets })
        updateSubscribers.call(this, id, { webComponent: doc })
        return cb && cb(true)
    } catch (err) {
        logger.error('upsertElectionDoc', err)
        return cb && cb()
    }
}
