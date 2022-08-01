// https://github.com/EnCiv/undebate-ssp/issues/72
import { expect, test, beforeAll, afterAll, jest } from '@jest/globals'
import MongoModels from 'mongo-models'
import { Iota, User } from 'civil-server'
import iotas from '../../../iotas.json'
import createModeratorRecorder from '../create-moderator-recorder'
import { merge, cloneDeep } from 'lodash'

const ObjectID = Iota.ObjectId

// dummy out logger for tests
global.logger = { error: jest.fn(e => e) }

// making a clone so giving it it's own unique id so jest tests can run in parallel
const testDoc = cloneDeep(iotas.filter(iota => iota.subject === 'Undebate SSP Test Iota')[0])
testDoc._id = ObjectID('62c8f51b002a10563c43d205')

const objectIdPattern = /^[0-9a-fA-F]{24}$/

const exampleUser = {
    _id: ObjectID('62c8f58a7e5866104cc793b4'),
    firstName: 'Example',
    lastName: 'User',
    email: 'example.user@example.com',
    password: 'a-really-secure-password',
}

// apis are called with 'this' that has synuser defined
const apisThis = { synuser: {} }

beforeAll(async () => {
    await MongoModels.connect({ uri: global.__MONGO_URI__ }, { useUnifiedTopology: true })
    // run the init functions that models require - after the connection is setup
    const { toInit = [] } = MongoModels.toInit
    MongoModels.toInit = []
    // eslint-disable-next-line no-restricted-syntax
    for await (const init of toInit) await init()
    const user = await User.create(exampleUser)
    apisThis.synuser.id = ObjectID(user._id).toString()

    testDoc.userId = apisThis.synuser.id
    await Iota.create(testDoc)
})

afterAll(async () => {
    await Iota.deleteOne({ id: testDoc._id })
    MongoModels.disconnect()
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
            viewerId = ObjectID(iotas[0]._id).toString()
            expect(iotas[0]).toMatchInlineSnapshot(
                {
                    _id: expect.any(ObjectID),
                    parentId: expect.stringMatching(objectIdPattern),
                },
                `
                Object {
                  "_id": Any<ObjectID>,
                  "bp_info": Object {
                    "electionList": Array [
                      "/country:us/org:usfg/office:moderator/2022-11-07",
                    ],
                    "election_date": "11/07/2022",
                    "election_source": "United States Federal Government",
                    "office": "Moderator",
                  },
                  "component": Object {
                    "component": "MergeParticipants",
                  },
                  "description": "A Candidate Conversation for: Moderator",
                  "parentId": StringMatching /\\^\\[0-9a-fA-F\\]\\{24\\}\\$/,
                  "path": "/country:us/org:usfg/office:moderator/2022-11-07",
                  "subject": "Moderator",
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
                            "Make your closing - to the audience",
                          ],
                          Array [
                            "Thank you",
                          ],
                        ],
                        "listening": "https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893720/5d5b74751e3b194174cd9b94-0-listening20210304T213518628Z.mp4",
                        "name": "David Fridley, EnCiv",
                        "speaking": Array [
                          "https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893717/5d5b74751e3b194174cd9b94-3-speaking20210304T213516602Z.mp4",
                          "https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893718/5d5b74751e3b194174cd9b94-5-speaking20210304T213517487Z.mp4",
                          "https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893719/5d5b74751e3b194174cd9b94-6-speaking20210304T213517927Z.mp4",
                          "https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614894042/5d5b74751e3b194174cd9b94-1-speaking20210304T214041075Z.mp4",
                          "https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614894043/5d5b74751e3b194174cd9b94-2-speaking20210304T214041861Z.mp4",
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
    createModeratorRecorder.call(apisThis, ObjectID(testDoc._id).toString(), callback)
})
test('it should create a recorder', async () => {
    const iotas = await Iota.find({ 'webComponent.webComponent': 'Undebate', parentId: viewerId })
    expect(iotas).toHaveLength(1)
    expect(iotas[0]).toMatchInlineSnapshot(
        {
            _id: expect.any(ObjectID),
            bp_info: {
                unique_id: expect.stringMatching(objectIdPattern),
            },

            parentId: expect.stringMatching(objectIdPattern),
            path: expect.stringMatching(
                /\/country:us\/org:usfg\/office:moderator\/2022-11-07-recorder-[0-9a-fA-F]{24}$/
            ),
        },
        `
        Object {
          "_id": Any<ObjectID>,
          "bp_info": Object {
            "candidate_emails": Array [
              "billsmith@gmail.com",
            ],
            "candidate_name": "Bill Smith",
            "election_date": "11/07/2022",
            "election_source": "United States Federal Government",
            "last_name": "Smith",
            "office": "Moderator",
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
                "name": "Bill Smith",
              },
              "moderator": Object {
                "agenda": Array [
                  Array [
                    "How this works",
                    "Placeholder",
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
                    "Make your closing - to the audience",
                  ],
                  Array [
                    "Thank you",
                  ],
                ],
                "listening": "https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893720/5d5b74751e3b194174cd9b94-0-listening20210304T213518628Z.mp4",
                "name": "David Fridley, EnCiv",
                "speaking": Array [
                  "https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893716/5d5b74751e3b194174cd9b94-1-speaking20210304T213504684Z.mp4",
                  "https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893717/5d5b74751e3b194174cd9b94-3-speaking20210304T213516602Z.mp4",
                  "https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893718/5d5b74751e3b194174cd9b94-5-speaking20210304T213517487Z.mp4",
                  "https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893719/5d5b74751e3b194174cd9b94-6-speaking20210304T213517927Z.mp4",
                  "https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614894042/5d5b74751e3b194174cd9b94-1-speaking20210304T214041075Z.mp4",
                  "https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614894043/5d5b74751e3b194174cd9b94-2-speaking20210304T214041861Z.mp4",
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
          },
          "description": "A Candidate Recorder for the undebate: Moderator",
          "parentId": StringMatching /\\^\\[0-9a-fA-F\\]\\{24\\}\\$/,
          "path": StringMatching /\\\\/country:us\\\\/org:usfg\\\\/office:moderator\\\\/2022-11-07-recorder-\\[0-9a-fA-F\\]\\{24\\}\\$/,
          "subject": "Moderator-Candidate Recorder",
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

test('it fails if no user', done => {
    async function callback(result) {
        try {
            expect(result).not.toBeTruthy()
            expect(global.logger.error.mock.results[0].value).toMatchInlineSnapshot(
                `"createModeratorRecorder called, but no user "`
            )
            done()
        } catch (error) {
            done(error)
        }
    }
    createModeratorRecorder.call({}, ObjectID(testDoc._id).toString(), callback)
})

test('it fails if no id', done => {
    async function callback(result) {
        try {
            expect(result).not.toBeTruthy()
            expect(global.logger.error.mock.results[1].value).toMatchInlineSnapshot(
                `"createModeratorRecorder called, but bad id:"`
            )
            done()
        } catch (error) {
            done(error)
        }
    }
    createModeratorRecorder.call(apisThis, '', callback)
})

test('it fails if bad id', done => {
    async function callback(result) {
        try {
            expect(result).not.toBeTruthy()
            expect(global.logger.error.mock.results[2].value).toMatch(/^createModeratorRecorder called, but bad id:/)
            done()
        } catch (error) {
            done(error)
        }
    }
    createModeratorRecorder.call(apisThis, 'abc123', callback)
})

test('it fails if electionName is missing', done => {
    async function callback(result) {
        try {
            expect(result).not.toBeTruthy()
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

        createModeratorRecorder.call(apisThis, ObjectID(badDoc._id).toString(), callback)
    }
    doAsync()
})

test('it fails if script is missing', done => {
    async function callback(result) {
        try {
            expect(result).not.toBeTruthy()
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
        createModeratorRecorder.call(apisThis, ObjectID(badDoc._id).toString(), callback)
    }
    doAsync()
})

test('it fails if script is short', done => {
    async function callback(result) {
        try {
            expect(result).not.toBeTruthy()
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
        createModeratorRecorder.call(apisThis, ObjectID(badDoc._id).toString(), callback)
    }
    doAsync()
})
