// https://github.com/EnCiv/undebate-ssp/issues/72

import { Iota } from 'civil-server'
import Joi from 'joi'

const ID = Joi.object({
    increment: Joi.number(),
    machine: Joi.number(),
    pid: Joi.number(),
    timestamp: Joi.number(),
})

const schema = Joi.object({
    _id: ID,
    subject: Joi.string(),
    description: Joi.string(),
    electionName: Joi.string(),
    organizationName: Joi.string(),
    electionDate: Joi.string(),
    questions: Joi.object().pattern(
        Joi.number(),
        Joi.object({
            text: Joi.string(),
            time: Joi.string(),
        })
    ),
    script: Joi.object().pattern(
        Joi.number(),
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
                acceptedDate: Joi.string(),
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
            uniqueId: Joi.string(),
            name: Joi.string(),
            email: Joi.string(),
            office: Joi.string(),
            region: Joi.string(),
            invitations: Joi.array().items(
                Joi.object({
                    _id: ID,
                    text: Joi.string(),
                    sentDate: Joi.string(),
                    acceptedDate: Joi.string(),
                })
            ),
            submissions: Joi.array().items(
                Joi.object({
                    _id: ID,
                    url: Joi.string(),
                    date: Joi.string(),
                })
            ),
        })
    ),
    timeline: {
        moderatorDeadlineReminderEmails: Joi.object().pattern(
            Joi.number(),
            Joi.object({
                date: Joi.string(),
                sent: Joi.boolean(),
            })
        ),
        moderatorSubmissionDeadline: Joi.object().pattern(
            Joi.number(),
            Joi.object({
                date: Joi.string(),
                sent: Joi.boolean(),
            })
        ),
        moderatorInviteDeadline: Joi.object().pattern(
            Joi.number(),
            Joi.object({
                date: Joi.string(),
                sent: Joi.boolean(),
            })
        ),
        candidateDeadlineReminderEmails: Joi.object().pattern(
            Joi.number(),
            Joi.object({
                date: Joi.string(),
                sent: Joi.boolean(),
            })
        ),
        candidateSubmissionDeadline: Joi.object().pattern(
            Joi.number(),
            Joi.object({
                date: Joi.string(),
                sent: Joi.boolean(),
            })
        ),
    },
    undebateDate: Joi.string(),
})

export default async function upsertElectionDoc(doc, cb) {
    if (!this.synuser) return cb && cb() // no user
    if (!doc._id) {
        logger.error('ElectionDoc must container an _id', doc)
        return cb && cb()
    }
    const valid = schema.validate(doc)
    if (valid.error) {
        logger.error('ElectionDoc validation', valid)
        return cb && cb()
    }
    try {
        // upsert
        await Iota.updateOne({ _id: doc._id }, { $set: doc }, { upsert: true })
        cb && cb(true)
    } catch (err) {
        logger.error('upsertElectionDoc', err)
        cb && cb()
    }
}
