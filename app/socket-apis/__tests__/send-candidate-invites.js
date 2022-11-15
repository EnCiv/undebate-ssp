// https://github.com/EnCiv/undebate-ssp/issues/146
import { expect, test, beforeAll, afterAll } from '@jest/globals'
import MongoModels from 'mongo-models'
import { Iota, User, serverEvents } from 'civil-server'
import subscribeElectionInfo from '../subscribe-election-info'
import jestSocketApiSetup from '../../lib/jest-socket-api-setup'
const handle = 'subscribe-election-info'
const socketApiUnderTest = subscribeElectionInfo
import socketApiSubscribe from '../../components/lib/socket-api-subscribe'
import '../../lib/jest-setup'

// has to be require so it happens after global.logger gets set above. imports would hoist
const sendCandidateInvites = require('../send-candidate-invites').default

// if making a copy of this, you need new node_modules/.bin/mongo-id 's here
// because multiple tests using the DB will run in parallel
const ELECTIONOBJID = '62cda55d1be44429847a9ee9'

const USERID = '62cda71a4a594b5ba8edc8f8'

// this doesn't have to be changed if copied, but it's used a lot so it's here
const SARAHID = '61e76bbefeaa4a25840d85d0'

const iotas = [
    {
        _id: Iota.ObjectID(ELECTIONOBJID),
        subject: 'Election document',
        description: 'Election document #4',
        webComponent: {
            webComponent: 'ElectionDoc',
            name: 'admin name',
            email: process.env.SENDINBLUE_DEFAULT_FROM_EMAIL,
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
            candidates: {
                [SARAHID]: {
                    uniqueId: SARAHID,
                    name: 'Sarah Jones',
                    email: process.env.SENDINBLUE_DEFAULT_FROM_EMAIL,
                    office: 'President of the U.S.',
                    region: 'United States',
                    recorders: {
                        '62cdd0c8d9427f290444a152': {
                            _id: '62cdd0c8d9427f290444a152',
                            path: `/country:us/organization:cfa/office:president-of-the-u-s/2021-03-21-recorder-${SARAHID}`,
                        },
                    },
                },
                '61e76bfc8a82733d08f0cf12': {
                    uniqueId: '61e76bfc8a82733d08f0cf12',
                    name: 'Michael Jefferson',
                    email: process.env.SENDINBLUE_DEFAULT_FROM_EMAIL,
                    office: 'President of the U.S.',
                    region: 'United States',
                    recorders: {
                        '62cdd19c68091e6060898f00': {
                            _id: '62cdd19c68091e6060898f00',
                            path: '/country:us/organization:cfa/office:president-of-the-u-s/2021-03-21-recorder-61e76bfc8a82733d08f0cf12',
                        },
                    },
                },
            },
        },
    },
]

const exampleUser = {
    _id: User.ObjectID(USERID),
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
maybe('Test the send candidate invites API', () => {
    jest.setTimeout(30000) // sometimes send in blue is just slow
    let requestedDoc
    let updatedDoc
    beforeAll(async () => {
        serverEvents.eNameAdd('ParticipantCreated') // event names need to be added before socketApiUnderTest subscribes to them
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
        await jestSocketApiSetup(apisThis.synuser.id, [[handle, socketApiUnderTest]])
        function requestHandler(doc) {
            requestedDoc = doc
        }
        function updateHandler(doc) {
            // if the test below for updatedDoc has already been executed, then it will have set updatedDoc to a function
            // if the test has not started, then just give it the value
            if (!updatedDoc) updatedDoc = doc
            else updatedDoc(doc)
        }
        socketApiSubscribe(handle, ELECTIONOBJID, requestHandler, updateHandler)
    })

    afterAll(async () => {
        window.socket.close()
        MongoModels.disconnect()
    })

    test('should return undefined if no user logged in', done => {
        function callback(messageIds) {
            try {
                expect(messageIds).toEqual(undefined)
                done()
            } catch (error) {
                done(error)
            }
        }
        sendCandidateInvites.call({}, ELECTIONOBJID, 'ALL', callback)
    })
    test('should send an email', done => {
        function callback(messageIds) {
            try {
                expect(messageIds.length).toEqual(2)
                done()
            } catch (error) {
                done(error)
            }
        }
        sendCandidateInvites.call(apisThis, ELECTIONOBJID, 'ALL', callback)
    })
    test('subscribeElectionInfo update should receive update', done => {
        // this asynchronous update from the socket api may have already happend, or we may need to wait for it.
        function updated(doc) {
            // invitations is an object of key: doc, where the key could be anything
            // can't create a matcher for that in toMatchInlinSnapshot so pull it out manually
            expect(doc.candidates[SARAHID].invitations).toBeDefined()
            let invitations = Object.values(doc.candidates[SARAHID].invitations)
            expect(invitations.length).toEqual(1)
            let invitation = invitations[0]
            expect(invitation).toMatchInlineSnapshot(
                {
                    _id: expect.toBeObjectId(),
                    to: [{ email: expect.toBeEmail() }],
                    sender: { email: expect.any(String) },
                    messageId: expect.any(String),
                    replyTo: { email: expect.toBeEmail() },
                    sentDate: expect.toBeIsoDate(),
                    templateId: expect.any(Number),
                    params: {
                        email: expect.toBeEmail(),
                        moderator: {
                            email: expect.toBeEmail(),
                        },

                        candidate: {
                            submissionDeadline: expect.any(String),
                            recorder_url: `http://localhost:3011/country:us/organization:cfa/office:president-of-the-u-s/2021-03-21-recorder-${SARAHID}`,
                            uniqueId: SARAHID,
                            email: expect.toBeEmail(),
                        },
                    },
                },
                `
                Object {
                  "_id": StringMatching /\\^\\[0-9a-fA-F\\]\\{24\\}\\$/,
                  "component": "CandidateInviteSent",
                  "messageId": Any<String>,
                  "params": Object {
                    "candidate": Object {
                      "email": StringMatching /\\(\\?:\\[a-z0-9!#\\$%&'\\*\\+/=\\?\\^_\`\\{\\|\\}~-\\]\\+\\(\\?:\\\\\\.\\[a-z0-9!#\\$%&'\\*\\+/=\\?\\^_\`\\{\\|\\}~-\\]\\+\\)\\*\\|"\\(\\?:\\[\\\\x01-\\\\x08\\\\x0b\\\\x0c\\\\x0e-\\\\x1f\\\\x21\\\\x23-\\\\x5b\\\\x5d-\\\\x7f\\]\\|\\\\\\\\\\[\\\\x01-\\\\x09\\\\x0b\\\\x0c\\\\x0e-\\\\x7f\\]\\)\\*"\\)@\\(\\?:\\(\\?:\\[a-z0-9\\]\\(\\?:\\[a-z0-9-\\]\\*\\[a-z0-9\\]\\)\\?\\\\\\.\\)\\+\\[a-z0-9\\]\\(\\?:\\[a-z0-9-\\]\\*\\[a-z0-9\\]\\)\\?\\|\\\\\\[\\(\\?:\\(\\?:\\(2\\(5\\[0-5\\]\\|\\[0-4\\]\\[0-9\\]\\)\\|1\\[0-9\\]\\[0-9\\]\\|\\[1-9\\]\\?\\[0-9\\]\\)\\)\\\\\\.\\)\\{3\\}\\(\\?:\\(2\\(5\\[0-5\\]\\|\\[0-4\\]\\[0-9\\]\\)\\|1\\[0-9\\]\\[0-9\\]\\|\\[1-9\\]\\?\\[0-9\\]\\)\\|\\[a-z0-9-\\]\\*\\[a-z0-9\\]:\\(\\?:\\[\\\\x01-\\\\x08\\\\x0b\\\\x0c\\\\x0e-\\\\x1f\\\\x21-\\\\x5a\\\\x53-\\\\x7f\\]\\|\\\\\\\\\\[\\\\x01-\\\\x09\\\\x0b\\\\x0c\\\\x0e-\\\\x7f\\]\\)\\+\\)\\\\\\]\\)/,
                      "name": "Sarah Jones",
                      "office": "President of the U.S.",
                      "recorder_url": "http://localhost:3011/country:us/organization:cfa/office:president-of-the-u-s/2021-03-21-recorder-61e76bbefeaa4a25840d85d0",
                      "submissionDeadline": Any<String>,
                      "uniqueId": "61e76bbefeaa4a25840d85d0",
                    },
                    "email": StringMatching /\\(\\?:\\[a-z0-9!#\\$%&'\\*\\+/=\\?\\^_\`\\{\\|\\}~-\\]\\+\\(\\?:\\\\\\.\\[a-z0-9!#\\$%&'\\*\\+/=\\?\\^_\`\\{\\|\\}~-\\]\\+\\)\\*\\|"\\(\\?:\\[\\\\x01-\\\\x08\\\\x0b\\\\x0c\\\\x0e-\\\\x1f\\\\x21\\\\x23-\\\\x5b\\\\x5d-\\\\x7f\\]\\|\\\\\\\\\\[\\\\x01-\\\\x09\\\\x0b\\\\x0c\\\\x0e-\\\\x7f\\]\\)\\*"\\)@\\(\\?:\\(\\?:\\[a-z0-9\\]\\(\\?:\\[a-z0-9-\\]\\*\\[a-z0-9\\]\\)\\?\\\\\\.\\)\\+\\[a-z0-9\\]\\(\\?:\\[a-z0-9-\\]\\*\\[a-z0-9\\]\\)\\?\\|\\\\\\[\\(\\?:\\(\\?:\\(2\\(5\\[0-5\\]\\|\\[0-4\\]\\[0-9\\]\\)\\|1\\[0-9\\]\\[0-9\\]\\|\\[1-9\\]\\?\\[0-9\\]\\)\\)\\\\\\.\\)\\{3\\}\\(\\?:\\(2\\(5\\[0-5\\]\\|\\[0-4\\]\\[0-9\\]\\)\\|1\\[0-9\\]\\[0-9\\]\\|\\[1-9\\]\\?\\[0-9\\]\\)\\|\\[a-z0-9-\\]\\*\\[a-z0-9\\]:\\(\\?:\\[\\\\x01-\\\\x08\\\\x0b\\\\x0c\\\\x0e-\\\\x1f\\\\x21-\\\\x5a\\\\x53-\\\\x7f\\]\\|\\\\\\\\\\[\\\\x01-\\\\x09\\\\x0b\\\\x0c\\\\x0e-\\\\x7f\\]\\)\\+\\)\\\\\\]\\)/,
                    "moderator": Object {
                      "email": StringMatching /\\(\\?:\\[a-z0-9!#\\$%&'\\*\\+/=\\?\\^_\`\\{\\|\\}~-\\]\\+\\(\\?:\\\\\\.\\[a-z0-9!#\\$%&'\\*\\+/=\\?\\^_\`\\{\\|\\}~-\\]\\+\\)\\*\\|"\\(\\?:\\[\\\\x01-\\\\x08\\\\x0b\\\\x0c\\\\x0e-\\\\x1f\\\\x21\\\\x23-\\\\x5b\\\\x5d-\\\\x7f\\]\\|\\\\\\\\\\[\\\\x01-\\\\x09\\\\x0b\\\\x0c\\\\x0e-\\\\x7f\\]\\)\\*"\\)@\\(\\?:\\(\\?:\\[a-z0-9\\]\\(\\?:\\[a-z0-9-\\]\\*\\[a-z0-9\\]\\)\\?\\\\\\.\\)\\+\\[a-z0-9\\]\\(\\?:\\[a-z0-9-\\]\\*\\[a-z0-9\\]\\)\\?\\|\\\\\\[\\(\\?:\\(\\?:\\(2\\(5\\[0-5\\]\\|\\[0-4\\]\\[0-9\\]\\)\\|1\\[0-9\\]\\[0-9\\]\\|\\[1-9\\]\\?\\[0-9\\]\\)\\)\\\\\\.\\)\\{3\\}\\(\\?:\\(2\\(5\\[0-5\\]\\|\\[0-4\\]\\[0-9\\]\\)\\|1\\[0-9\\]\\[0-9\\]\\|\\[1-9\\]\\?\\[0-9\\]\\)\\|\\[a-z0-9-\\]\\*\\[a-z0-9\\]:\\(\\?:\\[\\\\x01-\\\\x08\\\\x0b\\\\x0c\\\\x0e-\\\\x1f\\\\x21-\\\\x5a\\\\x53-\\\\x7f\\]\\|\\\\\\\\\\[\\\\x01-\\\\x09\\\\x0b\\\\x0c\\\\x0e-\\\\x7f\\]\\)\\+\\)\\\\\\]\\)/,
                      "name": "bob",
                    },
                    "name": "admin name",
                    "organizationLogo": "https://www.bringfido.com/assets/images/bfi-logo-new.jpg",
                    "organizationName": "The Organization",
                    "questions": Object {
                      "0": Object {
                        "text": "What is your favorite color?",
                        "time": "30",
                      },
                      "1": Object {
                        "text": "Do you have a pet?",
                        "time": "60",
                      },
                      "2": Object {
                        "text": "Should we try to fix income inequality?",
                        "time": "90",
                      },
                    },
                  },
                  "replyTo": Object {
                    "email": StringMatching /\\(\\?:\\[a-z0-9!#\\$%&'\\*\\+/=\\?\\^_\`\\{\\|\\}~-\\]\\+\\(\\?:\\\\\\.\\[a-z0-9!#\\$%&'\\*\\+/=\\?\\^_\`\\{\\|\\}~-\\]\\+\\)\\*\\|"\\(\\?:\\[\\\\x01-\\\\x08\\\\x0b\\\\x0c\\\\x0e-\\\\x1f\\\\x21\\\\x23-\\\\x5b\\\\x5d-\\\\x7f\\]\\|\\\\\\\\\\[\\\\x01-\\\\x09\\\\x0b\\\\x0c\\\\x0e-\\\\x7f\\]\\)\\*"\\)@\\(\\?:\\(\\?:\\[a-z0-9\\]\\(\\?:\\[a-z0-9-\\]\\*\\[a-z0-9\\]\\)\\?\\\\\\.\\)\\+\\[a-z0-9\\]\\(\\?:\\[a-z0-9-\\]\\*\\[a-z0-9\\]\\)\\?\\|\\\\\\[\\(\\?:\\(\\?:\\(2\\(5\\[0-5\\]\\|\\[0-4\\]\\[0-9\\]\\)\\|1\\[0-9\\]\\[0-9\\]\\|\\[1-9\\]\\?\\[0-9\\]\\)\\)\\\\\\.\\)\\{3\\}\\(\\?:\\(2\\(5\\[0-5\\]\\|\\[0-4\\]\\[0-9\\]\\)\\|1\\[0-9\\]\\[0-9\\]\\|\\[1-9\\]\\?\\[0-9\\]\\)\\|\\[a-z0-9-\\]\\*\\[a-z0-9\\]:\\(\\?:\\[\\\\x01-\\\\x08\\\\x0b\\\\x0c\\\\x0e-\\\\x1f\\\\x21-\\\\x5a\\\\x53-\\\\x7f\\]\\|\\\\\\\\\\[\\\\x01-\\\\x09\\\\x0b\\\\x0c\\\\x0e-\\\\x7f\\]\\)\\+\\)\\\\\\]\\)/,
                    "name": "admin name",
                  },
                  "sender": Object {
                    "email": Any<String>,
                    "name": "admin name @ The Organization via EnCiv.org",
                  },
                  "sentDate": StringMatching /\\\\d\\{4\\}-\\[01\\]\\\\d-\\[0-3\\]\\\\dT\\[0-2\\]\\\\d:\\[0-5\\]\\\\d:\\[0-5\\]\\\\d\\\\\\.\\\\d\\+\\(\\[\\+-\\]\\[0-2\\]\\\\d:\\[0-5\\]\\\\d\\|Z\\)/,
                  "tags": Array [
                    "id:62cda55d1be44429847a9ee9",
                    "role:candidate",
                    "office:President of the U.S.",
                  ],
                  "templateId": Any<Number>,
                  "to": Array [
                    Object {
                      "email": StringMatching /\\(\\?:\\[a-z0-9!#\\$%&'\\*\\+/=\\?\\^_\`\\{\\|\\}~-\\]\\+\\(\\?:\\\\\\.\\[a-z0-9!#\\$%&'\\*\\+/=\\?\\^_\`\\{\\|\\}~-\\]\\+\\)\\*\\|"\\(\\?:\\[\\\\x01-\\\\x08\\\\x0b\\\\x0c\\\\x0e-\\\\x1f\\\\x21\\\\x23-\\\\x5b\\\\x5d-\\\\x7f\\]\\|\\\\\\\\\\[\\\\x01-\\\\x09\\\\x0b\\\\x0c\\\\x0e-\\\\x7f\\]\\)\\*"\\)@\\(\\?:\\(\\?:\\[a-z0-9\\]\\(\\?:\\[a-z0-9-\\]\\*\\[a-z0-9\\]\\)\\?\\\\\\.\\)\\+\\[a-z0-9\\]\\(\\?:\\[a-z0-9-\\]\\*\\[a-z0-9\\]\\)\\?\\|\\\\\\[\\(\\?:\\(\\?:\\(2\\(5\\[0-5\\]\\|\\[0-4\\]\\[0-9\\]\\)\\|1\\[0-9\\]\\[0-9\\]\\|\\[1-9\\]\\?\\[0-9\\]\\)\\)\\\\\\.\\)\\{3\\}\\(\\?:\\(2\\(5\\[0-5\\]\\|\\[0-4\\]\\[0-9\\]\\)\\|1\\[0-9\\]\\[0-9\\]\\|\\[1-9\\]\\?\\[0-9\\]\\)\\|\\[a-z0-9-\\]\\*\\[a-z0-9\\]:\\(\\?:\\[\\\\x01-\\\\x08\\\\x0b\\\\x0c\\\\x0e-\\\\x1f\\\\x21-\\\\x5a\\\\x53-\\\\x7f\\]\\|\\\\\\\\\\[\\\\x01-\\\\x09\\\\x0b\\\\x0c\\\\x0e-\\\\x7f\\]\\)\\+\\)\\\\\\]\\)/,
                      "name": "Sarah Jones",
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
    test("filter with NOT_YET_INVITED shouldn't send any", done => {
        function callback(messageIds) {
            try {
                expect(messageIds.length).toEqual(0)
                done()
            } catch (error) {
                done(error)
            }
        }
        sendCandidateInvites.call(apisThis, ELECTIONOBJID, 'NOT_YET_INVITED', callback)
    })
    test('filter with NOT_YET_SUBMITTED should send them again', done => {
        function callback(messageIds) {
            try {
                expect(messageIds.length).toEqual(2)
                done()
            } catch (error) {
                done(error)
            }
        }
        sendCandidateInvites.call(apisThis, ELECTIONOBJID, 'NOT_YET_SUBMITTED', callback)
    })
})
