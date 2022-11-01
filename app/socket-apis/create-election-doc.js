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
            questions: {
                0: {
                    text: 'Please say your name; city and state; one word to describe yourself; and what office you are running for.',
                    time: '15',
                },
                1: { text: 'What do you love most about where you live?', time: '30' },
                2: { text: 'What inspired you to run for office?', time: '30' },
                3: { text: 'If elected, what will be your top two priorities?', time: '30' },
                4: { text: "If elected, how will you know that you've succeeded in this position?", time: '30' },
            },
        },
        userId,
    })
    cb(doc.webComponent)
}
