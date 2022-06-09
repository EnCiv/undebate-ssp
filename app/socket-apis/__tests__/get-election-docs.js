// https://github.com/EnCiv/undebate-ssp/issues/71
import { expect, test, beforeAll, afterAll } from '@jest/globals'
import MongoModels from 'mongo-models'
import { Iota, User } from 'civil-server'
import getElectionDocs, { getElectionDocById } from '../get-election-docs'

// dummy out logger for tests
if (!global.logger) {
    global.logger = console
}

const iotas = [
    {
        _id: Iota.ObjectID('628c739b0d8c5d32e4f4ff51'),
        subject: 'Election document',
        description: 'Election document #1',
        webComponent: {
            webComponent: 'ElectionDoc',
        },
    },
    {
        _id: Iota.ObjectID('628c73af5a4b8e3c04b5f895'),
        subject: 'Election document',
        description: 'Election document #2',
        webComponent: {
            webComponent: 'ElectionDoc',
        },
    },
    {
        _id: Iota.ObjectID('628c73c61be5e1526c288f18'),
        subject: 'Election document',
        description: 'Election document #3',
        webComponent: {
            webComponent: 'ElectionDoc',
        },
    },
    {
        _id: Iota.ObjectID('628c73daf2014b3f4c5da4ee'),
        subject: 'Election document',
        description: 'Election document #4',
        webComponent: {
            webComponent: 'ElectionDoc',
        },
    },
    {
        _id: Iota.ObjectID('628d076dcf19df5aa438c07a'),
        subject: 'Moderator Recorder for #4',
        description: 'Moderator Recorder for #4',
        bp_info: {
            office: 'Moderator',
        },
        component: {
            component: 'undebateCreator',
        },
        parentId: '628c73daf2014b3f4c5da4ee',
    },
    {
        _id: Iota.ObjectID('628d0b225f7a7746488c0bff'),
        subject: 'Moderator Viewer for #4',
        description: 'Moderator Viewer for #4',
        bp_info: {
            office: 'Moderator',
        },
        webComponent: {
            webComponent: 'CandidateConversation',
        },
        parentId: '628c73daf2014b3f4c5da4ee',
    },
    {
        _id: Iota.ObjectID('628d2d25c945f836b8be0901'),
        parentId: '628d0b225f7a7746488c0bff',
        subject: 'Moderator Recording for #4',
        description: 'Moderator Recording for #4',
        component: {
            component: 'MergeParticipants',
            participant: {
                speaking: [
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510654/5d5b73c01e3b194174cd9b92-1-speaking.webm',
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510659/5d5b73c01e3b194174cd9b92-2-speaking.webm',
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510665/5d5b73c01e3b194174cd9b92-3-speaking.webm',
                ],
                name: 'david',
                listening:
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510649/5d5b73c01e3b194174cd9b92-0-seat2.webm',
            },
        },
    },
]

const exampleUser = {
    _id: User.ObjectID('628d0a2afacbb605f4d8e6ac'),
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

test('get election docs should return undefined if user not logged in', done => {
    function callback(docs) {
        try {
            expect(docs).toEqual(undefined)
            done()
        } catch (error) {
            done(error)
        }
    }
    getElectionDocs.call({}, callback)
})

test('get election docs should return empty array if user has no docs', done => {
    function callback(docs) {
        try {
            expect(docs.length).toEqual(0)
            done()
        } catch (error) {
            done(error)
        }
    }
    getElectionDocs.call({ synuser: 'abc123' }, callback)
})

test('get election docs should get them', done => {
    function callback(docs) {
        try {
            // order is not guaranteed so
            docs.sort((a, b) => (a._id < b._id ? -1 : a._id > b._id ? 1 : 0))
            expect(docs).toMatchInlineSnapshot(`
                Array [
                  Object {
                    "_id": "628c739b0d8c5d32e4f4ff51",
                    "description": "Election document #1",
                    "subject": "Election document",
                    "userId": "628d0a2afacbb605f4d8e6ac",
                    "webComponent": Object {
                      "webComponent": "ElectionDoc",
                    },
                  },
                  Object {
                    "_id": "628c73af5a4b8e3c04b5f895",
                    "description": "Election document #2",
                    "subject": "Election document",
                    "userId": "628d0a2afacbb605f4d8e6ac",
                    "webComponent": Object {
                      "webComponent": "ElectionDoc",
                    },
                  },
                  Object {
                    "_id": "628c73c61be5e1526c288f18",
                    "description": "Election document #3",
                    "subject": "Election document",
                    "userId": "628d0a2afacbb605f4d8e6ac",
                    "webComponent": Object {
                      "webComponent": "ElectionDoc",
                    },
                  },
                  Object {
                    "_id": "628c73daf2014b3f4c5da4ee",
                    "description": "Election document #4",
                    "subject": "Election document",
                    "userId": "628d0a2afacbb605f4d8e6ac",
                    "webComponent": Object {
                      "moderator": Object {
                        "recorders": Object {
                          "628d076dcf19df5aa438c07a": Object {
                            "_id": "628d076dcf19df5aa438c07a",
                            "bp_info": Object {
                              "office": "Moderator",
                            },
                            "component": Object {
                              "component": "undebateCreator",
                            },
                            "description": "Moderator Recorder for #4",
                            "parentId": "628c73daf2014b3f4c5da4ee",
                            "subject": "Moderator Recorder for #4",
                            "userId": "628d0a2afacbb605f4d8e6ac",
                          },
                        },
                        "submissions": Object {
                          "628d2d25c945f836b8be0901": Object {
                            "_id": "628d2d25c945f836b8be0901",
                            "component": Object {
                              "component": "MergeParticipants",
                              "participant": Object {
                                "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510649/5d5b73c01e3b194174cd9b92-0-seat2.webm",
                                "name": "david",
                                "speaking": Array [
                                  "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510654/5d5b73c01e3b194174cd9b92-1-speaking.webm",
                                  "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510659/5d5b73c01e3b194174cd9b92-2-speaking.webm",
                                  "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510665/5d5b73c01e3b194174cd9b92-3-speaking.webm",
                                ],
                              },
                            },
                            "description": "Moderator Recording for #4",
                            "parentId": "628d0b225f7a7746488c0bff",
                            "subject": "Moderator Recording for #4",
                            "userId": "628d0a2afacbb605f4d8e6ac",
                          },
                        },
                        "viewers": Object {
                          "628d0b225f7a7746488c0bff": Object {
                            "_id": "628d0b225f7a7746488c0bff",
                            "bp_info": Object {
                              "office": "Moderator",
                            },
                            "description": "Moderator Viewer for #4",
                            "parentId": "628c73daf2014b3f4c5da4ee",
                            "subject": "Moderator Viewer for #4",
                            "userId": "628d0a2afacbb605f4d8e6ac",
                            "webComponent": Object {
                              "webComponent": "CandidateConversation",
                            },
                          },
                        },
                      },
                      "webComponent": "ElectionDoc",
                    },
                  },
                ]
            `)
            done()
        } catch (error) {
            done(error)
        }
    }
    getElectionDocs.call(apisThis, callback)
})

test('get election doc by id should get one', done => {
    function callback(doc) {
        expect(doc).toMatchInlineSnapshot(`
            Object {
              "_id": "628c73daf2014b3f4c5da4ee",
              "description": "Election document #4",
              "subject": "Election document",
              "userId": "628d0a2afacbb605f4d8e6ac",
              "webComponent": Object {
                "moderator": Object {
                  "recorders": Object {
                    "628d076dcf19df5aa438c07a": Object {
                      "_id": "628d076dcf19df5aa438c07a",
                      "bp_info": Object {
                        "office": "Moderator",
                      },
                      "component": Object {
                        "component": "undebateCreator",
                      },
                      "description": "Moderator Recorder for #4",
                      "parentId": "628c73daf2014b3f4c5da4ee",
                      "subject": "Moderator Recorder for #4",
                      "userId": "628d0a2afacbb605f4d8e6ac",
                    },
                  },
                  "submissions": Object {
                    "628d2d25c945f836b8be0901": Object {
                      "_id": "628d2d25c945f836b8be0901",
                      "component": Object {
                        "component": "MergeParticipants",
                        "participant": Object {
                          "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510649/5d5b73c01e3b194174cd9b92-0-seat2.webm",
                          "name": "david",
                          "speaking": Array [
                            "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510654/5d5b73c01e3b194174cd9b92-1-speaking.webm",
                            "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510659/5d5b73c01e3b194174cd9b92-2-speaking.webm",
                            "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510665/5d5b73c01e3b194174cd9b92-3-speaking.webm",
                          ],
                        },
                      },
                      "description": "Moderator Recording for #4",
                      "parentId": "628d0b225f7a7746488c0bff",
                      "subject": "Moderator Recording for #4",
                      "userId": "628d0a2afacbb605f4d8e6ac",
                    },
                  },
                  "viewers": Object {
                    "628d0b225f7a7746488c0bff": Object {
                      "_id": "628d0b225f7a7746488c0bff",
                      "bp_info": Object {
                        "office": "Moderator",
                      },
                      "description": "Moderator Viewer for #4",
                      "parentId": "628c73daf2014b3f4c5da4ee",
                      "subject": "Moderator Viewer for #4",
                      "userId": "628d0a2afacbb605f4d8e6ac",
                      "webComponent": Object {
                        "webComponent": "CandidateConversation",
                      },
                    },
                  },
                },
                "webComponent": "ElectionDoc",
              },
            }
        `)
        done()
    }
    getElectionDocById.call(apisThis, '628c73daf2014b3f4c5da4ee', callback)
})
