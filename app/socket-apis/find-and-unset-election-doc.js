// https://github.com/EnCiv/undebate-ssp/issues/72

import { Iota } from 'civil-server'
import { updateSubscribers } from './subscribe-election-info'

function lp(path) {
    return path ? path + '.' : ''
}

function docToSets(doc, sets = {}, path = '') {
    Object.keys(doc).forEach(key => {
        if (typeof doc[key] === 'object' && !(doc[key] instanceof Iota.ObjectID) && !(doc[key] instanceof Date)) {
            docToSets(doc[key], sets, lp(path) + key)
        } else if (typeof doc[key] === 'function') return
        //just skip functions
        else sets[lp(path) + key] = doc[key]
    })
    return sets
}

export default async function findAndUnsetElectionDoc(query, doc, cb) {
    if (!this.synuser) return cb && cb() // no user
    const id = query._id
    if (typeof id !== 'string') logger.error('id was not a string', id)
    if (query._id) query._id = Iota.ObjectID(query._id)
    try {
        // upsert
        const $unset = docToSets({ webComponent: doc })
        await Iota.updateOne(query, { $unset })
        updateSubscribers.call(this, id, undefined, { webComponent: doc })
        return cb && cb(true)
    } catch (err) {
        logger.error('upsertElectionDoc', err)
        return cb && cb()
    }
}
