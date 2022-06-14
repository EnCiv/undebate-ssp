import { Iota } from 'civil-server'

export default async function createElectionDoc(cb) {
    if (!this.synuser || !this.synuser.id) {
        logger.error('createElectionDoc called by no user logged in')
        return cb && cb() // no user
    }
    const userId = this.synuser.userId
    const doc = await Iota.create({
        subject: 'Election Doc',
        description: 'an election document',
        webComponent: {
            webComponent: 'ElectionDoc',
        },
        userId,
    })
    cb(Iota.ObjectID(doc._id).toString())
}
