// https://github.com/EnCiv/undebate-ssp/issues/71
import { expect, test, beforeAll, afterAll } from '@jest/globals'
import MongoModels from 'mongo-models'
import { Iota, User } from 'civil-server'
import subscribeElectionInfo from '../subscribe-election-info'
import jestSocketApiSetup from '../../lib/jest-socket-api-setup'
const handle = 'subscribe-election-info'
const socketApiUnderTest = subscribeElectionInfo
import socketApiSubscribe from '../../components/lib/socket-api-subscribe'

if (!global.logger) global.logger = console
global.logger = { error: jest.fn((...args) => args) }

// has to be require so it happens after global.logger gets set above. imports would hoist
const sendModeratorInvite = require('../send-moderator-invite').default

Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + parseInt(days))
    return this
}

// if making a copy of this, you need new node_modules/.bin/mongo-id 's here
// because multiple tests using the DB will run in parallel
const electionObjId = '629950b73100ea171064d4b7'
const recorderId = '629952046bf16a07dc69e2d5'
const viewerId = '62995210214f715b3c3084c8'
const userId = '62995151f50a0d478415d6f1'

const iotas = [
    {
        _id: Iota.ObjectID(electionObjId),
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
        _id: Iota.ObjectID(recorderId),
        subject: 'Moderator Recorder for #4',
        description: 'Moderator Recorder for #4',
        bp_info: {
            office: 'Moderator',
        },
        component: {
            component: 'UndebateCreator',
        },
        path: '/moderator-recorder',
        parentId: electionObjId,
    },
    {
        _id: Iota.ObjectID(viewerId),
        subject: 'Moderator Viewer for #4',
        description: 'Moderator Viewer for #4',
        bp_info: {
            office: 'Moderator',
        },
        webComponent: {
            webComponent: 'CandidateConversation',
        },
        path: '/moderator-viewer',
        parentId: electionObjId,
    },
]

const exampleUser = {
    _id: User.ObjectID(userId),
    firstName: 'Example',
    lastName: 'User',
    email: 'example.user2@example.com',
    password: 'a-really-secure-password',
}

// apis are called with 'this' that has synuser defined
const apisThis = { synuser: {} }

const ISODate = expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
const OBJECTID = expect.stringMatching(/^[0-9a-fA-F]{24}$/)

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
    let requestedDoc
    let updatedDoc
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
        await jestSocketApiSetup(apisThis.synuser.id, handle, socketApiUnderTest)
        function requestHandler(doc) {
            requestedDoc = doc
        }
        function updateHandler(doc) {
            // if the test below for updatedDoc has already been executed, then it will have set updatedDoc to a function
            // if the test has not started, then just give it the value
            if (!updatedDoc) updatedDoc = doc
            else updatedDoc(doc)
        }
        socketApiSubscribe(handle, electionObjId, requestHandler, updateHandler)
    })

    afterAll(async () => {
        window.socket.close()
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
        sendModeratorInvite.call({}, electionObjId, callback)
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
        sendModeratorInvite.call(apisThis, electionObjId, callback)
    })
    test('subscribeElectionInfo update should receive update', done => {
        // this asynchronous update from the socket api may have already happend, or we may need to wait for it.
        function updated(doc) {
            // invitations is an object of key: doc, where the key could be anything
            // can't create a matcher for that in toMatchInlinSnapshot so pull it out manually
            expect(doc.moderator.invitations).toBeDefined()
            let invitations = Object.values(doc.moderator.invitations)
            expect(invitations.length).toEqual(1)
            let invitation = invitations[0]
            expect(invitation).toMatchInlineSnapshot(
                {
                    _id: OBJECTID,
                    messageId: expect.any(String),
                    sentDate: ISODate,
                    templateId: expect.any(Number),
                    params: {
                        moderator: {
                            submissionDeadline: expect.any(String),
                        },
                    },
                },
                `
                Object {
                  "_id": StringMatching /\\^\\[0-9a-fA-F\\]\\{24\\}\\$/,
                  "component": "ModeratorEmailSent",
                  "messageId": Any<String>,
                  "params": Object {
                    "email": "admin@email.com",
                    "moderator": Object {
                      "email": "ddfridley@yahoo.com",
                      "name": "bob",
                      "recorder_url": "localhost:3011/moderator-recorder",
                      "submissionDeadline": Any<String>,
                    },
                    "name": "admin name",
                    "organizationLogo": "https://www.bringfido.com/assets/images/bfi-logo-new.jpg",
                    "organizationName": "The Organization",
                  },
                  "sentDate": StringMatching /\\\\d\\{4\\}-\\[01\\]\\\\d-\\[0-3\\]\\\\dT\\[0-2\\]\\\\d:\\[0-5\\]\\\\d:\\[0-5\\]\\\\d\\\\\\.\\\\d\\+\\(\\[\\+-\\]\\[0-2\\]\\\\d:\\[0-5\\]\\\\d\\|Z\\)/,
                  "tags": Array [
                    "id:629950b73100ea171064d4b7",
                    "role:moderator",
                  ],
                  "templateId": Any<Number>,
                  "to": Array [
                    Object {
                      "email": "ddfridley@yahoo.com",
                      "name": "bob",
                    },
                  ],
                }
            `
            )
            done()
        }
        if (updatedDoc) {
            // I haven't seend it go this way - but it's here if that happens
            updated(updatedDoc)
        } else {
            // i've only see it go this way
            updatedDoc = updated
        }
    })
})
