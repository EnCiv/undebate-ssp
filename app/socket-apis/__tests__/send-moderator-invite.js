// https://github.com/EnCiv/undebate-ssp/issues/71
import { expect, test, beforeAll, afterAll } from '@jest/globals'
import MongoModels from 'mongo-models'
import { Iota, User } from 'civil-server'

global.logger = console
global.logger = { error: jest.fn((...args) => args) }

// has to be require so it happens after global.logger gets set above. imports would hoist
const sendModeratorInvite = require('../send-moderator-invite').default

Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + parseInt(days))
    return this
}

const iotas = [
    {
        _id: Iota.ObjectID('629950b73100ea171064d4b7'),
        subject: 'Election document',
        description: 'Election document #4',
        webComponent: {
            webComponent: 'ElectionDoc',
            name: 'admin name',
            email: 'admin@email.com',
            electionName: 'The Election',
            organizationName: 'The Organization',
            organizationLogo: 'https://www.bringfido.com/assets/images/bfi-logo-new.jpg',
            undebateDate: new Date().addDays(5).toISOString(),
            electionDate: new Date().addDays(5).toISOString(),
            moderator: {
                name: 'bob',
                email: process.env.SENDINBLUE_DEFAULT_FROM_EMAIL,
            },
            timeline: {
                moderatorDeadlineReminderEmails: {
                    0: { date: new Date().addDays(1).toISOString() },
                },
                moderatorSubmissionDeadline: {
                    0: { date: new Date().addDays(2).toISOString() },
                },
                candidateDeadlineReminderEmails: {
                    0: { date: new Date().addDays(3).toISOString() },
                },
                candidateSubmissionDeadline: {
                    0: { date: new Date().addDays(4).toISOString() },
                },
            },
            questions: {
                0: {
                    text: 'What is your favorite color?',
                    time: '30',
                },
                1: {
                    text: 'Do you have a pet?',
                    time: '60',
                },
                2: {
                    text: 'Should we try to fix income inequality?',
                    time: '90',
                },
            },
            script: {
                0: {
                    text: 'Welcome everyone. Our first question is: What is your favorite color?',
                },
                1: {
                    text: 'Thank you. Our next Question is: Do you have a pet?',
                },
                2: {
                    text: 'Great. And our last question is: Should we try to fix income inequality?',
                },
                3: {
                    text: 'Thanks everyone for watching this!',
                },
            },
        },
    },
    {
        _id: Iota.ObjectID('629952046bf16a07dc69e2d5'),
        subject: 'Moderator Recorder for #4',
        description: 'Moderator Recorder for #4',
        bp_info: {
            office: 'Moderator',
        },
        component: {
            component: 'undebateCreator',
        },
        path: '/moderator-recorder',
        parentId: '629950b73100ea171064d4b7',
    },
    {
        _id: Iota.ObjectID('62995210214f715b3c3084c8'),
        subject: 'Moderator Viewer for #4',
        description: 'Moderator Viewer for #4',
        bp_info: {
            office: 'Moderator',
        },
        webComponent: {
            webComponent: 'CandidateConversation',
        },
        path: '/moderator-viewer',
        parentId: '629950b73100ea171064d4b7',
    },
]

const exampleUser = {
    _id: User.ObjectID('62995151f50a0d478415d6f1'),
    firstName: 'Example',
    lastName: 'User',
    email: 'example.user2@example.com',
    password: 'a-really-secure-password',
}

// apis are called with 'this' that has synuser defined
const apisThis = { synuser: {} }

const maybe = process.env.SENDINBLUE_API_KEY && process.env.SENDINBLUE_DEFAULT_FROM_EMAIL ? describe : describe.skip
const maybeNot = !(process.env.SENDINBLUE_API_KEY && process.env.SENDINBLUE_DEFAULT_FROM_EMAIL)
    ? describe
    : describe.skip

maybeNot('Is Sendinblue environment setup for testing?', () => {
    test('No, go to https://github.com/EnCiv/undebate-ssp/wiki/Send-In-Blue-Transactional for info on setup', () => {
        expect(global.logger.error.mock.results[0].value).toMatchInlineSnapshot(`
            Array [
              "env ",
              "SENDINBLUE_API_KEY",
              "not set. sendModeratorInvite disabled.",
            ]
        `)
    })
})
maybe('Test the send moderator invite API', () => {
    beforeAll(async () => {
        await MongoModels.connect({ uri: global.__MONGO_URI__ }, { useUnifiedTopology: true })
        // run the init functions that models require - after the connection is setup
        const { toInit = [] } = MongoModels.toInit
        MongoModels.toInit = []
        // eslint-disable-next-line no-restricted-syntax
        for await (const init of toInit) await init()
        const user = await User.create(exampleUser)
        apisThis.synuser.id = MongoModels.ObjectID(user._id).toString()
        // eslint-disable-next-line no-restricted-syntax
        for await (const doc of iotas) {
            if (!doc.userId) doc.userId = apisThis.synuser.id
            await Iota.create(doc)
        }
    })

    afterAll(async () => {
        MongoModels.disconnect()
    })

    test('should return undefined if no user logged in', done => {
        function callback(messageId) {
            try {
                expect(messageId).toEqual(undefined)
                done()
            } catch (error) {
                done(error)
            }
        }
        sendModeratorInvite.call({}, '629950b73100ea171064d4b7', callback)
    })
    test('should send an email', done => {
        function callback(messageId) {
            try {
                expect(messageId).toMatch(/.+/)
                done()
            } catch (error) {
                done(error)
            }
        }
        sendModeratorInvite.call(apisThis, '629950b73100ea171064d4b7', callback)
    })
})
