// https://github.com/EnCiv/undebate-ssp/issues/127
import { expect, test, beforeAll, afterAll, jest } from '@jest/globals'
import MongoModels from 'mongo-models'
import { Iota, User } from 'civil-server'
import iotas from '../../../iotas.json'
import createCandidateRecorder from '../create-candidate-recorder'
import { merge } from 'lodash'

const ObjectID = Iota.ObjectId

// dummy out logger for tests
global.logger = { error: jest.fn(e => e) }

const testDoc = iotas.filter(iota => iota.subject === 'Undebate SSP Test Iota')[0]

const exampleUser = {
    firstName: 'Example',
    lastName: 'User2',
    email: 'example.user2@example.com',
    password: 'a-really-secure-password',
}

// apis are called with 'this' that has synuser defined
const apisThis = { synuser: {} }

const objectIdPattern = /^[0-9a-fA-F]{24}$/

beforeAll(async () => {
    await MongoModels.connect({ uri: global.__MONGO_URI__ }, { useUnifiedTopology: true })
    // run the init functions that models require - after the connection is setup
    const { toInit = [] } = MongoModels.toInit
    MongoModels.toInit = []
    // eslint-disable-next-line no-restricted-syntax
    for await (const init of toInit) await init()
    const user = await User.create(exampleUser)
    apisThis.synuser.id = MongoModels.ObjectID(user._id).toString()

    testDoc.userId = apisThis.synuser.id
    testDoc._id = ObjectID()
    await Iota.create(testDoc)
})

afterAll(async () => {
    await Iota.deleteOne({ id: testDoc._id })
    MongoModels.disconnect()
})

afterEach(() => {
    global.logger.error.mockReset()
})

let viewerId

test('it should create a viewer', done => {
    async function callback({ rowObjs, messages }) {
        try {
            expect(rowObjs).toBeTruthy()
            const iotas = await Iota.find({
                parentId: ObjectID(testDoc._id).toString(),
                'webComponent.webComponent': 'CandidateConversation',
            })
            expect(iotas).toHaveLength(1)
            viewerId = ObjectID(iotas[0]._id).toString
            expect(iotas[0]).toMatchInlineSnapshot(
                { _id: expect.any(ObjectID), parentId: expect.stringMatching(objectIdPattern) },
                `
                Object {
                  "_id": Any<ObjectID>,
                  "bp_info": Object {
                    "electionList": Array [
                      "/country:us/organization:cfa/office:president-of-the-u-s/2021-03-21",
                    ],
                    "election_date": "03/21/2021",
                    "election_source": "CodeForAmerica.NAC",
                    "office": "President of the U.S.",
                  },
                  "component": Object {
                    "component": "MergeParticipants",
                  },
                  "description": "A Candidate Conversation for: President of the U.S.",
                  "parentId": StringMatching /\\^\\[0-9a-fA-F\\]\\{24\\}\\$/,
                  "path": "/country:us/organization:cfa/office:president-of-the-u-s/2021-03-21",
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
                            "Introductions",
                            "1- Name",
                            "2- City and State",
                            "3- One word to describe yourself",
                            "4- What role are you running for?",
                          ],
                          Array [
                            "How did you get started with your brigade?",
                          ],
                          Array [
                            "A prospective volunteer comes to you and asks \\"what can I do as part of the CfA Brigade Network that I can’t accomplish anywhere else?\\" How would you answer?",
                          ],
                          Array [
                            "Brigades of all sizes struggle with attracting and retaining volunteers, but this is especially draining for small brigades in less populous communities. What ideas do you have for supporting participation in situations where the Brigade model is not thriving?",
                          ],
                          Array [
                            "What is the one thing you want us to know about your candidacy that was not covered by the candidate questions provided?",
                          ],
                          Array [
                            "Thank you!",
                          ],
                        ],
                        "listening": "",
                        "name": "Bill Smith",
                        "speaking": Array [
                          "https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893716/5d5b74751e3b194174cd9b94-1-speaking20210304T213504684Z.mp4",
                          "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510654/5d5b73c01e3b194174cd9b92-1-speaking.webm",
                          "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510659/5d5b73c01e3b194174cd9b92-2-speaking.webm",
                          "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510665/5d5b73c01e3b194174cd9b92-3-speaking.webm",
                        ],
                        "timeLimits": Array [
                          15,
                          60,
                          60,
                          60,
                          60,
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
    createCandidateRecorder.call(apisThis, ObjectID(testDoc._id).toString(), callback)
})

test('it should create a recorder', async () => {
    const iotas = await Iota.find({ 'webComponent.webComponent': 'Undebate', parentId: viewerId })
    expect(iotas).toHaveLength(2)
    expect(iotas[0]).toMatchInlineSnapshot(
        {
            _id: expect.any(ObjectID),
            bp_info: {
                unique_id: expect.stringMatching(objectIdPattern),
            },

            parentId: expect.stringMatching(objectIdPattern),
            path: expect.stringMatching(
                /\/country:us\/organization:cfa\/office:president-of-the-u-s\/2021-03-21-recorder-[0-9-a-fA-F]{24}$/
            ),
        },
        `
        Object {
          "_id": Any<ObjectID>,
          "bp_info": Object {
            "candidate_emails": Array [
              "sarahjones@mail.com",
            ],
            "candidate_name": "Sarah Jones",
            "election_date": "03/21/2021",
            "election_source": "CodeForAmerica.NAC",
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
                  Array [],
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
                  30,
                ],
              },
            },
          },
          "description": "A Candidate Recorder for the undebate: President of the U.S.",
          "parentId": StringMatching /\\^\\[0-9a-fA-F\\]\\{24\\}\\$/,
          "path": StringMatching /\\\\/country:us\\\\/organization:cfa\\\\/office:president-of-the-u-s\\\\/2021-03-21-recorder-\\[0-9-a-fA-F\\]\\{24\\}\\$/,
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
            },

            parentId: expect.stringMatching(objectIdPattern),
            path: expect.stringMatching(
                /\/country:us\/organization:cfa\/office:president-of-the-u-s\/2021-03-21-recorder-[0-9-a-fA-F]{24}$/
            ),
        },
        `
        Object {
          "_id": Any<ObjectID>,
          "bp_info": Object {
            "candidate_emails": Array [
              "mikejeff@mail.com",
            ],
            "candidate_name": "Michael Jefferson",
            "election_date": "03/21/2021",
            "election_source": "CodeForAmerica.NAC",
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
                  Array [],
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
                  30,
                ],
              },
            },
          },
          "description": "A Candidate Recorder for the undebate: President of the U.S.",
          "parentId": StringMatching /\\^\\[0-9a-fA-F\\]\\{24\\}\\$/,
          "path": StringMatching /\\\\/country:us\\\\/organization:cfa\\\\/office:president-of-the-u-s\\\\/2021-03-21-recorder-\\[0-9-a-fA-F\\]\\{24\\}\\$/,
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
                'createCandidateRecorder called, but no user ',
                undefined
            )
            done()
        } catch (error) {
            done(error)
        }
    }
    createCandidateRecorder.call({}, ObjectID(testDoc._id).toString(), callback)
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
    createCandidateRecorder.call(apisThis, '', callback)
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
    createCandidateRecorder.call(apisThis, 'abc123', callback)
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

        createCandidateRecorder.call(apisThis, ObjectID(badDoc._id).toString(), callback)
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

        createCandidateRecorder.call(apisThis, ObjectID(badDoc._id).toString(), callback)
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

        createCandidateRecorder.call(apisThis, ObjectID(badDoc._id).toString(), callback)
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

        createCandidateRecorder.call(apisThis, ObjectID(badDoc._id).toString(), callback)
    }
    doAsync()
})
