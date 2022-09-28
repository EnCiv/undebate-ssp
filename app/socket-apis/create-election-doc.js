import { Iota } from 'civil-server'

export default async function createElectionDoc(cb) {
    if (!this.synuser || !this.synuser.id) {
        logger.error('createElectionDoc called but no user logged in')
        return cb && cb() // no user
    }
    const userId = this.synuser.id
    const _id = Iota.ObjectID()
    const doc = await Iota.create({
        _id,
        subject: 'Election Doc',
        description: 'an election document',
        webComponent: {
            id: _id.toString(),
            webComponent: 'ElectionDoc',
        },
        userId,
    })
    cb(doc.webComponent)
}
