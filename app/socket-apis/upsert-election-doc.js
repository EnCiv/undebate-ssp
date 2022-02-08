// https://github.com/EnCiv/undebate-ssp/issues/72

import { Iota } from 'civil-server'
import Joi from 'joi'
import ObjectID from 'joi-objectid'
Joi.objectId = ObjectID(Joi)

const ID = Joi.object({
    increment: Joi.number(),
    machine: Joi.number(),
    pid: Joi.number(),
    timestamp: Joi.number(),
})

const electionSchema = Joi.object({
    _id: ID,
    webComponent: 'ElectionDoc',
    electionName: Joi.string(),
    organizationName: Joi.string(),
    electionDate: Joi.string(),
    questions: Joi.object().pattern(
        Joi.string(),
        Joi.object({
            text: Joi.string(),
            time: Joi.string(),
        })
    ),
    script: Joi.object().pattern(
        Joi.string(),
        Joi.object({
            text: Joi.string(),
        })
    ),
    moderator: Joi.object({
        name: Joi.string(),
        email: Joi.string(),
        message: Joi.string(),
        invitations: Joi.array().items(
            Joi.object({
                _id: ID,
                text: Joi.string(),
                sentDate: Joi.string(),
                responseDate: Joi.string(),
                status: Joi.string(),
            })
        ),
        submissions: Joi.array().items(
            Joi.object({
                _id: ID,
                url: Joi.string(),
                date: Joi.string(),
            })
        ),
    }),
    candidates: Joi.object().pattern(
        Joi.string(),
        Joi.object({
            uniqueId: ID,
            name: Joi.string(),
            email: Joi.string(),
            office: Joi.string(),
            region: Joi.string(),
            invitations: Joi.array().items(
                Joi.object({
                    _id: ID,
                    text: Joi.string(),
                    sentDate: Joi.string(),
                    responseDate: Joi.string(),
                    status: Joi.string(),
                })
            ),
            submissions: Joi.array().items(
                Joi.object({
                    _id: ID,
                    url: Joi.string(),
                    date: Joi.string(),
                    parentId: Joi.string(),
                })
            ),
        })
    ),
    timeline: {
        moderatorDeadlineReminderEmails: Joi.object().pattern(
            Joi.string(),
            Joi.object({
                date: Joi.string(),
                sent: Joi.boolean(),
            })
        ),
        moderatorSubmissionDeadline: Joi.object().pattern(
            Joi.string(),
            Joi.object({
                date: Joi.string(),
                sent: Joi.boolean(),
            })
        ),
        moderatorInviteDeadline: Joi.object().pattern(
            Joi.string(),
            Joi.object({
                date: Joi.string(),
                sent: Joi.boolean(),
            })
        ),
        candidateDeadlineReminderEmails: Joi.object().pattern(
            Joi.string(),
            Joi.object({
                date: Joi.string(),
                sent: Joi.boolean(),
            })
        ),
        candidateSubmissionDeadline: Joi.object().pattern(
            Joi.string(),
            Joi.object({
                date: Joi.string(),
                sent: Joi.boolean(),
            })
        ),
    },
    undebateDate: Joi.string(),
})

const schema = Joi.object({
    _id: ID,
    subject: Joi.string(),
    description: Joi.string(),
    webComponent: electionSchema,
})

export default async function findAndSetElectionDoc(query, doc, cb) {
    if (!this.synuser) return cb && cb() // no user
    if (!doc._id) {
        logger.error('ElectionDoc must container an _id', doc)
        return cb && cb()
    }
    const valid = electionSchema.validate(doc)
    if (valid.error) {
        logger.error('ElectionDoc validation', valid)
        return cb && cb()
    }
    try {
        // upsert
        await Iota.updateOne(query, { $set: { webComponent: doc } }, { upsert: true })
        cb && cb(true)
    } catch (err) {
        logger.error('upsertElectionDoc', err)
        cb && cb()
    }
}
