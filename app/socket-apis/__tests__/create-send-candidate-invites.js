import { expect, test, beforeAll, afterAll, jest } from '@jest/globals'
import MongoModels from 'mongo-models'
import { Iota } from 'civil-server'
import { merge } from 'lodash'

const ObjectID = Iota.ObjectId
global.logger = { ...console }
if (process.env.JEST_LOGGER_ERRORS_TO_CONSOLE)
    // see the error messages during jest tests
    global.logger.error = jest.fn((...args) => (console.error(args), args))
else global.logger.error = jest.fn((...args) => args)
global.logger.warn = jest.fn((...args) => args)

// must be require after logger is mocked, import would hoist
const createSendCandidateInvites = require('../create-send-candidate-invites').default

Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + parseInt(days))
    return this
}

// if making a copy of this, you need new node_modules/.bin/mongo-id 's here
// because multiple tests using the DB will run in parallel
const ELECTIONOBJID = '62e4505ae2cb8355286e5525'

const USERID = '62e450656347605160c2c8b5'

// this doesn't have to be changed if copied, but it's used a lot so it's here
const SARAHID = '61e76bbefeaa4a25840d85d0'

const testDoc = {
    _id: Iota.ObjectID(ELECTIONOBJID),
    userId: USERID,
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
            submissions: {
                '628d2d25c945f836b8be0901': {
                    _id: '628d2d25c945f836b8be0901',
                    component: {
                        component: 'MergeParticipants',
                        participant: {
                            listening:
                                'https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510649/5d5b73c01e3b194174cd9b92-0-seat2.webm',
                            name: 'david',
                            speaking: [
                                'https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510654/5d5b73c01e3b194174cd9b92-1-speaking.webm',
                                'https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510659/5d5b73c01e3b194174cd9b92-2-speaking.webm',
                                'https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510665/5d5b73c01e3b194174cd9b92-3-speaking.webm',
                            ],
                        },
                    },
                    description: 'Moderator Recording for #4',
                    parentId: '628d0b225f7a7746488c0bff',
                    subject: 'Moderator Recording for #4',
                    userId: '628d0a2afacbb605f4d8e6ac',
                },
            },
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
            },
            '61e76bfc8a82733d08f0cf12': {
                uniqueId: '61e76bfc8a82733d08f0cf12',
                name: 'Michael Jefferson',
                email: process.env.SENDINBLUE_DEFAULT_FROM_EMAIL,
                office: 'President of the U.S.',
                region: 'United States',
            },
        },
    },
}

// apis are called with 'this' that has synuser defined
const apisThis = { synuser: { id: USERID } }

const objectIdPattern = /^[0-9a-fA-F]{24}$/

beforeAll(async () => {
    await MongoModels.connect({ uri: global.__MONGO_URI__ }, { useUnifiedTopology: true })
    // run the init functions that models require - after the connection is setup
    const { toInit = [] } = MongoModels.toInit
    MongoModels.toInit = []
    // eslint-disable-next-line no-restricted-syntax
    for await (const init of toInit) await init()
    await Iota.create(testDoc)
})

afterAll(async () => {
    MongoModels.disconnect()
})

afterEach(() => {
    global.logger.error.mockReset()
    global.logger.warn.mockReset()
})

let viewerId

test('it should create a viewer', done => {
    async function callback({ rowObjs, messages, sentMessages }) {
        try {
            expect(global.logger.warn).toHaveBeenLastCalledWith(
                'updateElectionInfo - electionObjSubscriber of',
                '62e4505ae2cb8355286e5525',
                'not found'
            )
            expect(rowObjs).toBeTruthy()
            expect(sentMessages.length).toBe(2)
            const iotas = await Iota.find({
                parentId: ObjectID(testDoc._id).toString(),
                'webComponent.webComponent': 'CandidateConversation',
            })
            expect(iotas).toHaveLength(1)
            viewerId = ObjectID(iotas[0]._id).toString()
            expect(iotas[0]).toMatchInlineSnapshot(
                {
                    _id: expect.any(ObjectID),
                    parentId: expect.stringMatching(objectIdPattern),
                    bp_info: {
                        electionList: [
                            expect.stringMatching(
                                /\/country:us\/org:to\/office:president-of-the-u-s\/\d\d\d\d-\d\d-\d\d/
                            ),
                        ],

                        election_date: expect.stringMatching(/\d\d\/\d\d\/\d\d\d\d/),
                    },

                    path: expect.stringMatching(
                        /\/country:us\/org:to\/office:president-of-the-u-s\/\d\d\d\d-\d\d-\d\d/
                    ),
                },
                `
                Object {
                  "_id": Any<ObjectID>,
                  "bp_info": Object {
                    "electionList": Array [
                      StringMatching /\\\\/country:us\\\\/org:to\\\\/office:president-of-the-u-s\\\\/\\\\d\\\\d\\\\d\\\\d-\\\\d\\\\d-\\\\d\\\\d/,
                    ],
                    "election_date": StringMatching /\\\\d\\\\d\\\\/\\\\d\\\\d\\\\/\\\\d\\\\d\\\\d\\\\d/,
                    "election_source": "The Organization",
                    "office": "President of the U.S.",
                  },
                  "component": Object {
                    "component": "MergeParticipants",
                  },
                  "description": "A Candidate Conversation for: President of the U.S.",
                  "parentId": StringMatching /\\^\\[0-9a-fA-F\\]\\{24\\}\\$/,
                  "path": StringMatching /\\\\/country:us\\\\/org:to\\\\/office:president-of-the-u-s\\\\/\\\\d\\\\d\\\\d\\\\d-\\\\d\\\\d-\\\\d\\\\d/,
                  "subject": "President of the U.S.",
                  "webComponent": Object {
                    "closing": Object {
                      "iframe": Object {
                        "height": "4900",
                        "src": "https://docs.google.com/forms/d/e/1FAIpQLSdDJIcMltkYr5_KRTS9q1-eQd3g79n0yym9yCmTkKpR61uPLA/viewform?embedded=true",
                        "width": "640",
                      },
                      "thanks": "Thank You.",
                    },
                    "instructionLink": "",
                    "logo": "undebate",
                    "participants": Object {
                      "moderator": Object {
                        "agenda": Array [
                          Array [
                            "What is your favorite color?",
                          ],
                          Array [
                            "Do you have a pet?",
                          ],
                          Array [
                            "Should we try to fix income inequality?",
                          ],
                          Array [
                            "Thank You",
                          ],
                        ],
                        "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510649/5d5b73c01e3b194174cd9b92-0-seat2.webm",
                        "name": "bob",
                        "speaking": Array [
                          "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510654/5d5b73c01e3b194174cd9b92-1-speaking.webm",
                          "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510659/5d5b73c01e3b194174cd9b92-2-speaking.webm",
                          "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510665/5d5b73c01e3b194174cd9b92-3-speaking.webm",
                        ],
                        "timeLimits": Array [
                          "30",
                          "60",
                          "90",
                        ],
                      },
                    },
                    "shuffle": true,
                    "webComponent": "CandidateConversation",
                  },
                }
            `
            )
            done()
        } catch (error) {
            done(error)
        }
    }
    createSendCandidateInvites.call(apisThis, ObjectID(testDoc._id).toString(), callback)
})

test('it should create a recorder', async () => {
    const iotas = await Iota.find({ 'webComponent.webComponent': 'Undebate', parentId: viewerId })
    expect(iotas).toHaveLength(2)
    expect(iotas[0]).toMatchInlineSnapshot(
        {
            _id: expect.any(ObjectID),
            bp_info: {
                unique_id: expect.stringMatching(objectIdPattern),
                election_date: expect.stringMatching(/\d\d\/\d\d\/\d\d\d\d/),
            },

            parentId: expect.stringMatching(objectIdPattern),
            path: expect.stringMatching(
                /\/country:us\/org:to\/office:president-of-the-u-s\/\d\d\d\d-\d\d-\d\d-recorder-[0-9-a-fA-F]{24}$/
            ),
        },
        `
        Object {
          "_id": Any<ObjectID>,
          "bp_info": Object {
            "candidate_emails": Array [
              "ddfridley@yahoo.com",
            ],
            "candidate_name": "Sarah Jones",
            "election_date": StringMatching /\\\\d\\\\d\\\\/\\\\d\\\\d\\\\/\\\\d\\\\d\\\\d\\\\d/,
            "election_source": "The Organization",
            "last_name": "Jones",
            "office": "President of the U.S.",
            "party": "",
            "unique_id": StringMatching /\\^\\[0-9a-fA-F\\]\\{24\\}\\$/,
          },
          "component": Object {
            "component": "UndebateCreator",
            "participants": Object {
              "human": Object {
                "listening": Object {
                  "round": 0,
                  "seat": "speaking",
                },
              },
              "moderator": Object {
                "agenda": Array [
                  Array [
                    "How this works",
                    "Record placeholder",
                  ],
                  Array [
                    "What is your favorite color?",
                  ],
                  Array [
                    "Do you have a pet?",
                  ],
                  Array [
                    "Should we try to fix income inequality?",
                  ],
                  Array [
                    "Thank You",
                  ],
                ],
                "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510649/5d5b73c01e3b194174cd9b92-0-seat2.webm",
                "name": "",
                "speaking": Array [
                  "https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893716/5d5b74751e3b194174cd9b94-1-speaking20210304T213504684Z.mp4",
                  "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510654/5d5b73c01e3b194174cd9b92-1-speaking.webm",
                  "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510659/5d5b73c01e3b194174cd9b92-2-speaking.webm",
                  "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510665/5d5b73c01e3b194174cd9b92-3-speaking.webm",
                ],
                "timeLimits": Array [
                  15,
                  "30",
                  "60",
                  "90",
                ],
              },
            },
          },
          "description": "A Candidate Recorder for the undebate: President of the U.S.",
          "parentId": StringMatching /\\^\\[0-9a-fA-F\\]\\{24\\}\\$/,
          "path": StringMatching /\\\\/country:us\\\\/org:to\\\\/office:president-of-the-u-s\\\\/\\\\d\\\\d\\\\d\\\\d-\\\\d\\\\d-\\\\d\\\\d-recorder-\\[0-9-a-fA-F\\]\\{24\\}\\$/,
          "subject": "President of the U.S.-Candidate Recorder",
          "webComponent": Object {
            "closing": Object {
              "iframe": Object {
                "height": 1550,
                "src": "https://docs.google.com/forms/d/e/1FAIpQLSchcQjvnbpwEcOl9ysmZ4-KwDyK7RynwJvxPqRTWhdq8SN02g/viewform?embedded=true",
                "width": 640,
              },
              "thanks": "Thank You.",
            },
            "instructionLink": "",
            "logo": "undebate",
            "opening": Object {
              "noPreamble": false,
            },
            "participants": Object {},
            "webComponent": "Undebate",
          },
        }
    `
    )
    expect(iotas[1]).toMatchInlineSnapshot(
        {
            _id: expect.any(ObjectID),
            bp_info: {
                unique_id: expect.stringMatching(objectIdPattern),
                election_date: expect.stringMatching(/\d\d\/\d\d\/\d\d\d\d/),
            },

            parentId: expect.stringMatching(objectIdPattern),
            path: expect.stringMatching(
                /\/country:us\/org:to\/office:president-of-the-u-s\/\d\d\d\d-\d\d-\d\d-recorder-[0-9-a-fA-F]{24}$/
            ),
        },
        `
        Object {
          "_id": Any<ObjectID>,
          "bp_info": Object {
            "candidate_emails": Array [
              "ddfridley@yahoo.com",
            ],
            "candidate_name": "Michael Jefferson",
            "election_date": StringMatching /\\\\d\\\\d\\\\/\\\\d\\\\d\\\\/\\\\d\\\\d\\\\d\\\\d/,
            "election_source": "The Organization",
            "last_name": "Jefferson",
            "office": "President of the U.S.",
            "party": "",
            "unique_id": StringMatching /\\^\\[0-9a-fA-F\\]\\{24\\}\\$/,
          },
          "component": Object {
            "component": "UndebateCreator",
            "participants": Object {
              "human": Object {
                "listening": Object {
                  "round": 0,
                  "seat": "speaking",
                },
              },
              "moderator": Object {
                "agenda": Array [
                  Array [
                    "How this works",
                    "Record placeholder",
                  ],
                  Array [
                    "What is your favorite color?",
                  ],
                  Array [
                    "Do you have a pet?",
                  ],
                  Array [
                    "Should we try to fix income inequality?",
                  ],
                  Array [
                    "Thank You",
                  ],
                ],
                "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510649/5d5b73c01e3b194174cd9b92-0-seat2.webm",
                "name": "",
                "speaking": Array [
                  "https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893716/5d5b74751e3b194174cd9b94-1-speaking20210304T213504684Z.mp4",
                  "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510654/5d5b73c01e3b194174cd9b92-1-speaking.webm",
                  "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510659/5d5b73c01e3b194174cd9b92-2-speaking.webm",
                  "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510665/5d5b73c01e3b194174cd9b92-3-speaking.webm",
                ],
                "timeLimits": Array [
                  15,
                  "30",
                  "60",
                  "90",
                ],
              },
            },
          },
          "description": "A Candidate Recorder for the undebate: President of the U.S.",
          "parentId": StringMatching /\\^\\[0-9a-fA-F\\]\\{24\\}\\$/,
          "path": StringMatching /\\\\/country:us\\\\/org:to\\\\/office:president-of-the-u-s\\\\/\\\\d\\\\d\\\\d\\\\d-\\\\d\\\\d-\\\\d\\\\d-recorder-\\[0-9-a-fA-F\\]\\{24\\}\\$/,
          "subject": "President of the U.S.-Candidate Recorder",
          "webComponent": Object {
            "closing": Object {
              "iframe": Object {
                "height": 1550,
                "src": "https://docs.google.com/forms/d/e/1FAIpQLSchcQjvnbpwEcOl9ysmZ4-KwDyK7RynwJvxPqRTWhdq8SN02g/viewform?embedded=true",
                "width": 640,
              },
              "thanks": "Thank You.",
            },
            "instructionLink": "",
            "logo": "undebate",
            "opening": Object {
              "noPreamble": false,
            },
            "participants": Object {},
            "webComponent": "Undebate",
          },
        }
    `
    )
})

/* test('it should create a submission??', async () => {}) */

test('it fails if no user', done => {
    async function callback(result) {
        try {
            expect(result).toBeUndefined()
            expect(global.logger.error).toHaveBeenLastCalledWith(
                'createSendCandidateInvites user not logged in',
                undefined
            )
            done()
        } catch (error) {
            done(error)
        }
    }
    createSendCandidateInvites.call({}, ObjectID(testDoc._id).toString(), callback)
})

test('it fails if no id', done => {
    async function callback(result) {
        try {
            expect(result).toBeUndefined()
            expect(global.logger.error).toHaveBeenLastCalledWith('createCandidateRecorder called, but bad id:', '')
            done()
        } catch (error) {
            done(error)
        }
    }
    createSendCandidateInvites.call(apisThis, '', callback)
})

test('it fails if bad id', done => {
    async function callback(result) {
        try {
            expect(result).toBeUndefined()
            expect(global.logger.error).toHaveBeenLastCalledWith(
                'createCandidateRecorder called, but bad id:',
                'abc123'
            )
            done()
        } catch (error) {
            done(error)
        }
    }
    createSendCandidateInvites.call(apisThis, 'abc123', callback)
})

test('it fails if electionName is missing', done => {
    async function callback(result) {
        try {
            expect(result).toBeUndefined()
            expect(global.logger.error).toHaveBeenLastCalledWith('not ready for candidate recorder:', [
                'electionName required',
            ])
            done()
        } catch (error) {
            done(error)
        }
    }
    async function doAsync() {
        const badDoc = {}
        merge(badDoc, testDoc, { webComponent: { electionName: '' } })
        badDoc._id = ObjectID() // give it a new objectId
        await Iota.create(badDoc)

        createSendCandidateInvites.call(apisThis, ObjectID(badDoc._id).toString(), callback)
    }
    doAsync()
})

test('it fails if script is missing', done => {
    async function callback(result) {
        try {
            expect(result).toBeUndefined()
            expect(global.logger.error).toHaveBeenLastCalledWith('not ready for candidate recorder:', [
                'script required',
                'length of script 0 was not one more than length of questions 3.',
            ])
            done()
        } catch (error) {
            done(error)
        }
    }
    async function doAsync() {
        const badDoc = {}
        merge(badDoc, testDoc)
        badDoc._id = ObjectID() // give it a new objectId
        badDoc.webComponent.script = undefined
        await Iota.create(badDoc)

        createSendCandidateInvites.call(apisThis, ObjectID(badDoc._id).toString(), callback)
    }
    doAsync()
})

test('it fails if script is short', done => {
    async function callback(result) {
        try {
            expect(result).toBeUndefined()
            expect(global.logger.error).toHaveBeenLastCalledWith('not ready for candidate recorder:', [
                'length of script 3 was not one more than length of questions 3.',
            ])
            done()
        } catch (error) {
            done(error)
        }
    }
    async function doAsync() {
        const badDoc = {}
        merge(badDoc, testDoc)
        badDoc._id = ObjectID() // give it a new objectId
        const scriptKeys = Object.keys(badDoc.webComponent.script)
        delete badDoc.webComponent.script[scriptKeys[scriptKeys.length - 1]]
        await Iota.create(badDoc)

        createSendCandidateInvites.call(apisThis, ObjectID(badDoc._id).toString(), callback)
    }
    doAsync()
})

test('it fails if missing info on candidate', done => {
    async function callback(result) {
        try {
            expect(result).toBeUndefined()
            expect(global.logger.error).toHaveBeenLastCalledWith('not ready for candidate recorder:', [
                'candidate name required',
                'candidate email required',
            ])
            done()
        } catch (error) {
            done(error)
        }
    }
    async function doAsync() {
        const badDoc = {}
        merge(badDoc, testDoc)
        badDoc._id = ObjectID() // give it a new objectId
        delete badDoc.webComponent.candidates['61e76bbefeaa4a25840d85d0'].name
        delete badDoc.webComponent.candidates['61e76bbefeaa4a25840d85d0'].email
        /* delete badDoc.webComponent.candidates['61e76bbefeaa4a25840d85d0'].message */
        await Iota.create(badDoc)

        createSendCandidateInvites.call(apisThis, ObjectID(badDoc._id).toString(), callback)
    }
    doAsync()
})
