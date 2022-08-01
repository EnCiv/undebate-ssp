// https://github.com/EnCiv/undebate-ssp/issues/71
import { expect, test, beforeAll, afterAll, describe } from '@jest/globals'

import MongoModels from 'mongo-models'
import { Iota, User, serverEvents } from 'civil-server'
import subscribeElectionInfo from '../subscribe-election-info'
import jestSocketApiSetup from '../../lib/jest-socket-api-setup'
import clientIo from 'socket.io-client'

import socketApiSubscribe, { subscribeEventName } from '../../components/lib/socket-api-subscribe'

// dummy out logger for tests
if (!global.logger) {
    global.logger = console
}

// if you are cloning this test change these id's to new node_modules/.bin/mongo-id because jest runs tests in parallel
const testDocId = '629f828ace9f775bb89f05df'
const viewerDocId = '629f84602d574a52a4ce1cb3'
const testParticipantId = '621028f37b48de4820cba6ea'
const recorderId = '62df04426b78e81b70e0c283'
const userId = '629f850dfb8ee6220ceade47'

const testDoc = {
    _id: Iota.ObjectID(testDocId),
    subject: 'Election Document #1',
    description: 'Election Document',
    webComponent: {
        webComponent: 'ElectionDoc',
    },
    userId,
}

const viewerDoc = {
    _id: Iota.ObjectID(viewerDocId),
    subject: 'Moderator Viewer for #4',
    description: 'Moderator Viewer for #4',
    bp_info: {
        office: 'Moderator',
    },
    webComponent: {
        webComponent: 'CandidateConversation',
    },
    parentId: testDocId,
    userId,
}

const testParticipant = {
    _id: Iota.ObjectID(testParticipantId),
    parentId: viewerDocId,
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
    userId: '629f856022c0b4428c123c5b',
}

// just enough for getElectionDocs to notice not a complete example
const recorderDoc = {
    _id: Iota.ObjectID(recorderId),
    subject: 'Moderator recorder for #4',
    path: '/undebate-moderator-recorder-example',
    description: 'Moderator recorder for #4',
    component: { component: 'UndebateCreator' },
    parentId: viewerDocId,
    userId,
    bp_info: {
        office: 'Moderator',
    },
}

const handle = 'subscribe-election-info'
const socketApiUnderTest = subscribeElectionInfo

beforeAll(async () => {
    serverEvents.eNameAdd('ParticipantCreated') // event names need to be added before socketApiUnderTest subscribes to them

    // initialize Mongo
    await MongoModels.connect({ uri: global.__MONGO_URI__ }, { useUnifiedTopology: true })
    // run the init functions that models require - after the connection is setup
    const { toInit = [] } = MongoModels.toInit
    MongoModels.toInit = []
    for await (const init of toInit) await init()

    // initialize data in Mongo
    await Iota.create(testDoc)
    await Iota.create(viewerDoc)

    // setup socket.io server
    await jestSocketApiSetup(userId, handle, socketApiUnderTest)
})

afterAll(async () => {
    MongoModels.disconnect()
})

describe('subscribeElectionInfo first returns request, then updates', () => {
    let requestedDoc
    let addedRequestedDoc
    let updatedWithSubmission
    let updatedWithRecorder
    let timesThrough = 0

    test('subscribeElectionInfo should return docs and handle 2 updates', done => {
        // the new subscription after a new record has been added will cause an update to the first subscription
        async function addRecorderDocAndSubscribe() {
            await Iota.create(recorderDoc)
            // creating a new socket connection to the same server because
            // socket-apis/subscribe-election-info.js updateSubscribers does not update the socket that originates an update
            const newSocketToSameServer = clientIo.connect(window.socket.io.uri)
            await new Promise((ok, ko) => newSocketToSameServer.on('connect', ok))
            // this is what app/components/socket-api-subscribe does, but we need it to use the new socket and NOT window.socket
            newSocketToSameServer.on(subscribeEventName(handle, testDocId), doc => {
                console.error('In this test we should never get here', doc)
            })
            newSocketToSameServer.emit(handle, testDocId, doc => {
                addedRequestedDoc = doc
                newSocketToSameServer.close()
                expect(timesThrough).toBe(2)
                done()
            })
        }
        async function requestHandler(doc) {
            requestedDoc = doc
            // add the testParticipant to the db first, so that new getElectionDocs will get it
            await Iota.create(testParticipant)
            // now simulate the Participant Create Event to cause the update
            serverEvents.emit(serverEvents.eNames.ParticipantCreated, testParticipant)
        }
        function updateHandler(doc) {
            if (timesThrough === 0) {
                updatedWithSubmission = doc
                timesThrough++
                addRecorderDocAndSubscribe()
            } else if (timesThrough === 1) {
                timesThrough++
                updatedWithRecorder = doc
            }
        }
        socketApiSubscribe(handle, testDocId, requestHandler, updateHandler)
    })
    test('the original request doc should match', () => {
        expect(requestedDoc).toMatchInlineSnapshot(`
            Object {
              "moderator": Object {
                "viewers": Object {
                  "629f84602d574a52a4ce1cb3": Object {
                    "_id": "629f84602d574a52a4ce1cb3",
                    "bp_info": Object {
                      "office": "Moderator",
                    },
                    "description": "Moderator Viewer for #4",
                    "parentId": "629f828ace9f775bb89f05df",
                    "subject": "Moderator Viewer for #4",
                    "userId": "629f850dfb8ee6220ceade47",
                    "webComponent": Object {
                      "webComponent": "CandidateConversation",
                    },
                  },
                },
              },
              "webComponent": "ElectionDoc",
            }
        `)
    })
    test('the participant submission update should have been received ', () => {
        expect(updatedWithSubmission).toMatchInlineSnapshot(`
          Object {
            "moderator": Object {
              "submissions": Object {
                "621028f37b48de4820cba6ea": Object {
                  "_id": "621028f37b48de4820cba6ea",
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
                  "parentId": "629f84602d574a52a4ce1cb3",
                  "subject": "Moderator Recording for #4",
                  "userId": "629f856022c0b4428c123c5b",
                },
              },
            },
          }
      `)
    })
    test('expect a update with just the moderator recorder after a recorder has been added to the db, and a new subscription has been made', () => {
        expect(updatedWithRecorder).toMatchInlineSnapshot(`
          Object {
            "moderator": Object {
              "recorders": Object {
                "62df04426b78e81b70e0c283": Object {
                  "_id": "62df04426b78e81b70e0c283",
                  "bp_info": Object {
                    "office": "Moderator",
                  },
                  "component": Object {
                    "component": "UndebateCreator",
                  },
                  "description": "Moderator recorder for #4",
                  "parentId": "629f84602d574a52a4ce1cb3",
                  "path": "/undebate-moderator-recorder-example",
                  "subject": "Moderator recorder for #4",
                  "userId": "629f850dfb8ee6220ceade47",
                },
              },
            },
          }
      `)
    })
    test('the new subscription should include the submission and the recorder', () => {
        expect(addedRequestedDoc).toMatchInlineSnapshot(`
            Object {
              "moderator": Object {
                "recorders": Object {
                  "62df04426b78e81b70e0c283": Object {
                    "_id": "62df04426b78e81b70e0c283",
                    "bp_info": Object {
                      "office": "Moderator",
                    },
                    "component": Object {
                      "component": "UndebateCreator",
                    },
                    "description": "Moderator recorder for #4",
                    "parentId": "629f84602d574a52a4ce1cb3",
                    "path": "/undebate-moderator-recorder-example",
                    "subject": "Moderator recorder for #4",
                    "userId": "629f850dfb8ee6220ceade47",
                  },
                },
                "submissions": Object {
                  "621028f37b48de4820cba6ea": Object {
                    "_id": "621028f37b48de4820cba6ea",
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
                    "parentId": "629f84602d574a52a4ce1cb3",
                    "subject": "Moderator Recording for #4",
                    "userId": "629f856022c0b4428c123c5b",
                  },
                },
                "viewers": Object {
                  "629f84602d574a52a4ce1cb3": Object {
                    "_id": "629f84602d574a52a4ce1cb3",
                    "bp_info": Object {
                      "office": "Moderator",
                    },
                    "description": "Moderator Viewer for #4",
                    "parentId": "629f828ace9f775bb89f05df",
                    "subject": "Moderator Viewer for #4",
                    "userId": "629f850dfb8ee6220ceade47",
                    "webComponent": Object {
                      "webComponent": "CandidateConversation",
                    },
                  },
                },
              },
              "webComponent": "ElectionDoc",
            }
        `)
    })
})

test('socket should disconnect', () => {
    let disconnectReason
    global.window.socket.on('disconnect', reason => (disconnectReason = reason))
    global.window.socket.close()
    expect(disconnectReason).toMatch('io client disconnect')
})
