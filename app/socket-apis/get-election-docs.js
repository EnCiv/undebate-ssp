// https://github.com/EnCiv/undebate-ssp/issues/71

import { Iota } from 'civil-server'

export default async function getElectionDocs(cb) {
    if (!this.synuser) return cb && cb() // no user
    try {
        const results = await Iota.aggregate([
            { $match: { userId: this.synuser.id, webComponent: 'ElectionDoc' } },
            { $sort: { _id: -1 } },
        ])
        cb && cb(results)
    } catch (err) {
        cb && cb()
    }
}
