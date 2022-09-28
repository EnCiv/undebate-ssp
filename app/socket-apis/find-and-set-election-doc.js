// https://github.com/EnCiv/undebate-ssp/issues/72

import { Iota } from 'civil-server'
import Joi from 'joi'
import JoiObjectID from 'joi-objectid'
import { updateSubscribers } from './subscribe-election-info'

Joi.objectId = JoiObjectID(Joi)

const Integer = /^[0-9]+$/
const ObjectID = /^[0-9a-fA-F]{24}$/
const SANE = 4096

const String = () => Joi.string().allow('').max(SANE)
const IsoDate = () => Joi.string().allow('').isoDate()
const Email = () => Joi.string().allow('').email()

function invitations() {
    return Joi.object().pattern(
        Joi.string().pattern(ObjectID),
        Joi.object({
            _id: Joi.objectId(),
            text: String(),
            sentDate: IsoDate(),
            responseDate: IsoDate(),
            status: String(),
        })
    )
}
function submissions() {
    return Joi.object().pattern(
        Joi.string().pattern(ObjectID),
        Joi.object({
            _id: Joi.objectId(),
            url: String(),
            date: IsoDate(),
            parentId: Joi.string().pattern(ObjectID),
        })
    )
}
const electionSchema = Joi.object({
    id: Joi.string().pattern(ObjectID),
    webComponent: 'ElectionDoc',
    electionName: String(),
    organizationName: String(),
    organizationUrl: Joi.string().allow('').uri(),
    organizationLogo: Joi.string().allow('').uri(),
    electionDate: IsoDate(),
    email: Email(),
    name: String(),
    questions: Joi.object().pattern(
        Joi.string().pattern(Integer),
        Joi.object({
            text: String(),
            time: Joi.string().allow('').pattern(Integer),
        })
    ),
    script: Joi.object().pattern(
        Joi.string().pattern(Integer),
        Joi.object({
            text: String(),
        })
    ),
    moderator: Joi.object({
        name: String(),
        email: Email(),
        message: String(),
        invitations: invitations(),
        submissions: submissions(),
        recorders: Joi.object(),
        viewers: Joi.object(),
    }),
    candidates: Joi.object().pattern(
        Joi.string().pattern(ObjectID),
        Joi.object({
            uniqueId: Joi.string().pattern(ObjectID),
            name: String(),
            email: Email(),
            office: String(),
            region: String(),
            invitations: invitations(),
            submissions: submissions(),
            recorders: Joi.object(),
        })
    ),
    timeline: {
        moderatorDeadlineReminderEmails: Joi.object().pattern(
            Joi.string().pattern(Integer),
            Joi.object({
                date: IsoDate(),
                sent: Joi.boolean(),
            })
        ),
        moderatorSubmissionDeadline: Joi.object().pattern(
            Joi.string().pattern(Integer),
            Joi.object({
                date: IsoDate(),
                sent: Joi.boolean(),
            })
        ),
        moderatorInviteDeadline: Joi.object().pattern(
            Joi.string().pattern(Integer),
            Joi.object({
                date: IsoDate(),
                sent: Joi.boolean(),
            })
        ),
        candidateDeadlineReminderEmails: Joi.object().pattern(
            Joi.string().pattern(Integer),
            Joi.object({
                date: IsoDate(),
                sent: Joi.boolean(),
            })
        ),
        candidateSubmissionDeadline: Joi.object().pattern(
            Joi.string().pattern(Integer),
            Joi.object({
                date: IsoDate(),
                sent: Joi.boolean(),
            })
        ),
    },
    undebateDate: IsoDate(),
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
    const valid = electionSchema.validate(doc, { presence: 'optional' })
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
