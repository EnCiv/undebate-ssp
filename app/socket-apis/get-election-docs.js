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

// lets say we get back an array of docs that match ElectionDoc and all their children and childrens' children ...
function mergeElectionChildren(iotas) {
    const results = []
    for (const iota of iotas) {
        if (iota.webComponent === 'ElectionDoc') {
            const id = Iota.ObjectId(iota._id).toString()
            mergeChildren(
                iota,
                arrayExtract(doc => doc.parentId === id)
            )
            results.push(iota)
        }
    }
}

//??? this will mutate the aray that's beeing iteratated on

// return a list of objects that match the function
// and remove them from the original array
function arrayExtract(iota, a, filter, action, indexes) {
    const results = []
    for (const i in a) {
        if (filter(a[i])) {
            results.push(a)
            indexes.push(i)
        }
    }
    for (const i = is.length - 1; i >= 0; i--) {
        a.splice(i, 1)
    }
    return results
}
