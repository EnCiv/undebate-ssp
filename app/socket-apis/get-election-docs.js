// https://github.com/EnCiv/undebate-ssp/issues/71

import { Iota } from 'civil-server'

export default async function getElectionDocs(cb) {
    if (!this.synuser) {
        if (cb) cb() // no user
        return
    }
    try {
        const results = await Iota.aggregate([
            { $match: { userId: this.synuser.id, webComponent: 'ElectionDoc' } },
            { $sort: { _id: -1 } },
        ])
        if (cb) cb(results)
    } catch (err) {
        if (cb) cb()
    }
}
