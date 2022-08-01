// https://github.com/EnCiv/undebate-ssp/issues/71
import { expect, test, beforeAll, afterAll } from '@jest/globals'
import MongoModels from 'mongo-models'
import { Iota, User } from 'civil-server'
import getElectionDocs, { getElectionDocById, intoObjOfDocsAtObjPathMergeDoc } from '../get-election-docs'

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
            candidates: {
                '61e76bbefeaa4a25840d85d0': {
                    uniqueId: '61e76bbefeaa4a25840d85d0',
                    name: 'Sarah Jones',
                    email: 'sarahjones@mail.com',
                    office: 'President of the U.S.',
                    region: 'United States',
                },
                '61e76bfc8a82733d08f0cf12': {
                    uniqueId: '61e76bfc8a82733d08f0cf12',
                    name: 'Michael Jefferson',
                    email: 'mikejeff@mail.com',
                    office: 'President of the U.S.',
                    region: 'United States',
                },
            },
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
            component: 'UndebateCreator',
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
        bp_info: {
            office: 'Moderator',
        },
    },
    {
        _id: Iota.ObjectID('62b8e859582e3b95dc83e78b'),
        subject: 'Candidate Recorder 1 for #4',
        description: 'Candidate Recorder 1 for #4',
        bp_info: {
            office: 'President of the U.S.',
            unique_id: '61e76bbefeaa4a25840d85d0',
        },
        component: {
            component: 'UndebateCreator',
        },
        parentId: '628c73daf2014b3f4c5da4ee',
    },
    {
        _id: Iota.ObjectID('62bf6d0f4dfc3a2b510881cd'),
        subject: 'Candidate Recorder 2 for #4',
        description: 'Candidate Recorder 2 for #4',
        bp_info: {
            office: 'President of the U.S.',
            unique_id: '61e76bfc8a82733d08f0cf12',
        },
        component: {
            component: 'UndebateCreator',
        },
        parentId: '628c73daf2014b3f4c5da4ee',
    },
    {
        _id: Iota.ObjectID('62b8e8e2e1fcf3bae96a4f48'),
        subject: 'Candidate Viewer for POTUS on #4',
        description: 'Candidate Viewer for POTUS on #4',
        bp_info: {
            office: 'President of the U.S.',
        },
        webComponent: {
            webComponent: 'CandidateConversation',
        },
        parentId: '628c73daf2014b3f4c5da4ee',
    },
    {
        _id: Iota.ObjectID('62b8e8eee48604bcfe9108fd'),
        parentId: '62b8e8e2e1fcf3bae96a4f48',
        subject: 'Candidate Recording for #4',
        description: 'Candidate Recording for #4',
        bp_info: {
            office: 'President of the U.S.',
        },
        component: {
            component: 'MergeParticipants',
            participant: {
                speaking: [
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510654/5d5b73c01e3b194174cd9b92-1-speaking.webm',
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510659/5d5b73c01e3b194174cd9b92-2-speaking.webm',
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510665/5d5b73c01e3b194174cd9b92-3-speaking.webm',
                ],
                name: 'Sarah Jones',
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
                    "webComponent": "ElectionDoc",
                  },
                  Object {
                    "webComponent": "ElectionDoc",
                  },
                  Object {
                    "webComponent": "ElectionDoc",
                  },
                  Object {
                    "candidates": Object {
                      "61e76bbefeaa4a25840d85d0": Object {
                        "email": "sarahjones@mail.com",
                        "name": "Sarah Jones",
                        "office": "President of the U.S.",
                        "recorders": Object {
                          "62b8e859582e3b95dc83e78b": Object {
                            "_id": "62b8e859582e3b95dc83e78b",
                            "bp_info": Object {
                              "office": "President of the U.S.",
                              "unique_id": "61e76bbefeaa4a25840d85d0",
                            },
                            "component": Object {
                              "component": "UndebateCreator",
                            },
                            "description": "Candidate Recorder 1 for #4",
                            "parentId": "628c73daf2014b3f4c5da4ee",
                            "subject": "Candidate Recorder 1 for #4",
                            "userId": "628d0a2afacbb605f4d8e6ac",
                          },
                        },
                        "region": "United States",
                        "submissions": Object {
                          "62b8e8eee48604bcfe9108fd": Object {
                            "_id": "62b8e8eee48604bcfe9108fd",
                            "bp_info": Object {
                              "office": "President of the U.S.",
                            },
                            "component": Object {
                              "component": "MergeParticipants",
                              "participant": Object {
                                "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510649/5d5b73c01e3b194174cd9b92-0-seat2.webm",
                                "name": "Sarah Jones",
                                "speaking": Array [
                                  "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510654/5d5b73c01e3b194174cd9b92-1-speaking.webm",
                                  "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510659/5d5b73c01e3b194174cd9b92-2-speaking.webm",
                                  "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510665/5d5b73c01e3b194174cd9b92-3-speaking.webm",
                                ],
                              },
                            },
                            "description": "Candidate Recording for #4",
                            "parentId": "62b8e8e2e1fcf3bae96a4f48",
                            "subject": "Candidate Recording for #4",
                            "userId": "628d0a2afacbb605f4d8e6ac",
                          },
                        },
                        "uniqueId": "61e76bbefeaa4a25840d85d0",
                      },
                      "61e76bfc8a82733d08f0cf12": Object {
                        "email": "mikejeff@mail.com",
                        "name": "Michael Jefferson",
                        "office": "President of the U.S.",
                        "recorders": Object {
                          "62bf6d0f4dfc3a2b510881cd": Object {
                            "_id": "62bf6d0f4dfc3a2b510881cd",
                            "bp_info": Object {
                              "office": "President of the U.S.",
                              "unique_id": "61e76bfc8a82733d08f0cf12",
                            },
                            "component": Object {
                              "component": "UndebateCreator",
                            },
                            "description": "Candidate Recorder 2 for #4",
                            "parentId": "628c73daf2014b3f4c5da4ee",
                            "subject": "Candidate Recorder 2 for #4",
                            "userId": "628d0a2afacbb605f4d8e6ac",
                          },
                        },
                        "region": "United States",
                        "uniqueId": "61e76bfc8a82733d08f0cf12",
                      },
                    },
                    "moderator": Object {
                      "recorders": Object {
                        "628d076dcf19df5aa438c07a": Object {
                          "_id": "628d076dcf19df5aa438c07a",
                          "bp_info": Object {
                            "office": "Moderator",
                          },
                          "component": Object {
                            "component": "UndebateCreator",
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
                          "bp_info": Object {
                            "office": "Moderator",
                          },
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
                    "offices": Object {
                      "president-of-the-u-s": Object {
                        "viewers": Object {
                          "62b8e8e2e1fcf3bae96a4f48": Object {
                            "_id": "62b8e8e2e1fcf3bae96a4f48",
                            "bp_info": Object {
                              "office": "President of the U.S.",
                            },
                            "description": "Candidate Viewer for POTUS on #4",
                            "parentId": "628c73daf2014b3f4c5da4ee",
                            "subject": "Candidate Viewer for POTUS on #4",
                            "userId": "628d0a2afacbb605f4d8e6ac",
                            "webComponent": Object {
                              "webComponent": "CandidateConversation",
                            },
                          },
                        },
                      },
                    },
                    "webComponent": "ElectionDoc",
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
                "candidates": Object {
                  "61e76bbefeaa4a25840d85d0": Object {
                    "email": "sarahjones@mail.com",
                    "name": "Sarah Jones",
                    "office": "President of the U.S.",
                    "recorders": Object {
                      "62b8e859582e3b95dc83e78b": Object {
                        "_id": "62b8e859582e3b95dc83e78b",
                        "bp_info": Object {
                          "office": "President of the U.S.",
                          "unique_id": "61e76bbefeaa4a25840d85d0",
                        },
                        "component": Object {
                          "component": "UndebateCreator",
                        },
                        "description": "Candidate Recorder 1 for #4",
                        "parentId": "628c73daf2014b3f4c5da4ee",
                        "subject": "Candidate Recorder 1 for #4",
                        "userId": "628d0a2afacbb605f4d8e6ac",
                      },
                    },
                    "region": "United States",
                    "submissions": Object {
                      "62b8e8eee48604bcfe9108fd": Object {
                        "_id": "62b8e8eee48604bcfe9108fd",
                        "bp_info": Object {
                          "office": "President of the U.S.",
                        },
                        "component": Object {
                          "component": "MergeParticipants",
                          "participant": Object {
                            "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510649/5d5b73c01e3b194174cd9b92-0-seat2.webm",
                            "name": "Sarah Jones",
                            "speaking": Array [
                              "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510654/5d5b73c01e3b194174cd9b92-1-speaking.webm",
                              "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510659/5d5b73c01e3b194174cd9b92-2-speaking.webm",
                              "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510665/5d5b73c01e3b194174cd9b92-3-speaking.webm",
                            ],
                          },
                        },
                        "description": "Candidate Recording for #4",
                        "parentId": "62b8e8e2e1fcf3bae96a4f48",
                        "subject": "Candidate Recording for #4",
                        "userId": "628d0a2afacbb605f4d8e6ac",
                      },
                    },
                    "uniqueId": "61e76bbefeaa4a25840d85d0",
                  },
                  "61e76bfc8a82733d08f0cf12": Object {
                    "email": "mikejeff@mail.com",
                    "name": "Michael Jefferson",
                    "office": "President of the U.S.",
                    "recorders": Object {
                      "62bf6d0f4dfc3a2b510881cd": Object {
                        "_id": "62bf6d0f4dfc3a2b510881cd",
                        "bp_info": Object {
                          "office": "President of the U.S.",
                          "unique_id": "61e76bfc8a82733d08f0cf12",
                        },
                        "component": Object {
                          "component": "UndebateCreator",
                        },
                        "description": "Candidate Recorder 2 for #4",
                        "parentId": "628c73daf2014b3f4c5da4ee",
                        "subject": "Candidate Recorder 2 for #4",
                        "userId": "628d0a2afacbb605f4d8e6ac",
                      },
                    },
                    "region": "United States",
                    "uniqueId": "61e76bfc8a82733d08f0cf12",
                  },
                },
                "moderator": Object {
                  "recorders": Object {
                    "628d076dcf19df5aa438c07a": Object {
                      "_id": "628d076dcf19df5aa438c07a",
                      "bp_info": Object {
                        "office": "Moderator",
                      },
                      "component": Object {
                        "component": "UndebateCreator",
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
                      "bp_info": Object {
                        "office": "Moderator",
                      },
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
                "offices": Object {
                  "president-of-the-u-s": Object {
                    "viewers": Object {
                      "62b8e8e2e1fcf3bae96a4f48": Object {
                        "_id": "62b8e8e2e1fcf3bae96a4f48",
                        "bp_info": Object {
                          "office": "President of the U.S.",
                        },
                        "description": "Candidate Viewer for POTUS on #4",
                        "parentId": "628c73daf2014b3f4c5da4ee",
                        "subject": "Candidate Viewer for POTUS on #4",
                        "userId": "628d0a2afacbb605f4d8e6ac",
                        "webComponent": Object {
                          "webComponent": "CandidateConversation",
                        },
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

test('intoObjOfDocsAtObjPathMergeDoc', () => {
    const doc = {
        webComponent: {
            moderator: {},
        },
    }
    const path = 'webComponent.moderator.recorders'
    const obj = iotas.find(el => el.subject === 'Moderator Recorder for #4')
    intoObjOfDocsAtObjPathMergeDoc(doc, path, obj)
    expect(doc).toMatchInlineSnapshot(`
        Object {
          "webComponent": Object {
            "moderator": Object {
              "recorders": Object {
                "628d076dcf19df5aa438c07a": Object {
                  "_id": "628d076dcf19df5aa438c07a",
                  "bp_info": Object {
                    "office": "Moderator",
                  },
                  "component": Object {
                    "component": "UndebateCreator",
                  },
                  "description": "Moderator Recorder for #4",
                  "parentId": "628c73daf2014b3f4c5da4ee",
                  "subject": "Moderator Recorder for #4",
                  "userId": "628d0a2afacbb605f4d8e6ac",
                },
              },
            },
          },
        }
        `)
})
