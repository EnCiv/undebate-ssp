// https://github.com/EnCiv/undebate-ssp/issues/71
import { expect, test, beforeAll, afterAll, describe } from '@jest/globals'
const { getPort } = require('get-port-please')
import MongoModels from 'mongo-models'
import { Iota, User, serverEvents } from 'civil-server'
import socketIo from 'socket.io'
import clientIo from 'socket.io-client'
import subscribeElectionInfo from '../subscribe-election-info'

if (typeof window === 'undefined') global.window = {} // socketApiSubscribe expects to run on the browser
import socketApiSubscribe from '../../components/lib/socket-api-subscribe'

// dummy out logger for tests
if (!global.logger) {
    global.logger = console
}

const testDoc = {
    _id: Iota.ObjectID('629f828ace9f775bb89f05df'),
    subject: 'Election Document #1',
    description: 'Election Document',
    webComponent: {
        webComponent: 'ElectionDoc',
    },
    userId: '629f850dfb8ee6220ceade47',
}

const viewerDoc = {
    _id: Iota.ObjectID('629f84602d574a52a4ce1cb3'),
    subject: 'Moderator Viewer for #4',
    description: 'Moderator Viewer for #4',
    bp_info: {
        office: 'Moderator',
    },
    webComponent: {
        webComponent: 'CandidateConversation',
    },
    parentId: '629f828ace9f775bb89f05df',
    userId: '629f850dfb8ee6220ceade47',
}

const testParticipant = {
    _id: Iota.ObjectID('621028f37b48de4820cba6ea'),
    parentId: '629f84602d574a52a4ce1cb3',
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

const exampleUser = {
    _id: User.ObjectID('629f850dfb8ee6220ceade47'),
    firstName: 'Example',
    lastName: 'User',
    email: 'example.user@example.com',
    password: 'a-really-secure-password',
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
    const user = await User.create(exampleUser)
    await Iota.create(testDoc)
    await Iota.create(viewerDoc)

    // setup socket.io server
    const SocketIoPort = await getPort() // not static port# because there may be multiple tests in parallel
    const server = socketIo()
    let connections = 0
    server.on('connection', socket => {
        connections++
        // synuser info is used by APIs
        socket.synuser = { id: User.ObjectID(user._id).toString() }
        socket.on(handle, socketApiUnderTest.bind(socket)) // this is what we are testing
        socket.on('disconnect', reason => {
            if (--connections <= 0) server.close() // so test will finish
        })
    })
    server.listen(SocketIoPort)

    // start socket.io client connection to server
    window.socket = clientIo.connect(`http://localhost:${SocketIoPort}`)
    await new Promise((ok, ko) => {
        window.socket.on('connect', () => {
            ok()
        })
    })
})

afterAll(async () => {
    MongoModels.disconnect()
})

describe('subscribeElectionInfo first returns request, then updates', () => {
    let requestedDoc

    test('subscribeElectionInfo update should match the doc', done => {
        function requestHandler(doc) {
            requestedDoc = doc
            // now simulate the Participant Create Event to cause the update
            serverEvents.emit(serverEvents.eNames.ParticipantCreated, testParticipant)
        }
        function updateHandler(doc) {
            expect(doc).toMatchInlineSnapshot(`
                Object {
                  "_id": "629f828ace9f775bb89f05df",
                  "description": "Election Document",
                  "subject": "Election Document #1",
                  "userId": "629f850dfb8ee6220ceade47",
                  "webComponent": Object {
                    "moderator": Object {
                      "submissions": Array [
                        Object {
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
                      ],
                      "viewers": Array [
                        Object {
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
                      ],
                    },
                    "webComponent": "ElectionDoc",
                  },
                }
            `)
            done()
        }
        socketApiSubscribe(handle, Iota.ObjectID(testDoc._id).toString(), requestHandler, updateHandler)
    })

    test('subscribeElectionInfo request should match the doc', () => {
        expect(requestedDoc).toMatchInlineSnapshot(`
            Object {
              "_id": "629f828ace9f775bb89f05df",
              "description": "Election Document",
              "subject": "Election Document #1",
              "userId": "629f850dfb8ee6220ceade47",
              "webComponent": Object {
                "moderator": Object {
                  "viewers": Array [
                    Object {
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
                  ],
                },
                "webComponent": "ElectionDoc",
              },
            }
        `)
    })
})

test('socket should disconnect', () => {
    let disconnectReason
    window.socket.on('disconnect', reason => (disconnectReason = reason))
    window.socket.close()
    expect(disconnectReason).toMatch('io client disconnect')
})
