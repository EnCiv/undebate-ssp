// https://github.com/EnCiv/undebate-ssp/issues/72

import { Iota } from 'civil-server'

export default async function upsertElectionDoc(doc, cb) {
    if (!this.synuser) return cb && cb() // no user
    if (!doc._id) {
        logger.error('ElectionDoc must container an _id', doc)
        return cb && cb()
    }
    try {
        // upsert
        await Iota.findAndModify({ query: { _id: doc._id }, update: { $set: doc }, upsert: true })
        cb && cb(true)
    } catch (err) {
        logger.error('upsertElectionDoc', err)
        cb && cb()
    }
}
