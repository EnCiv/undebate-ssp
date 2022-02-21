// https://github.com/EnCiv/undebate-ssp/issues/71
import { expect, test, beforeAll, afterAll } from '@jest/globals'
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
    _id: Iota.ObjectId(),
    subject: 'Election Document #1',
    description: 'Election Document',
    webComponent: {},
}
const exampleUser = {
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
    testDoc.userId = User.ObjectID(user._id).toString()
    await Iota.create(testDoc)

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

const testParticipant = {
    _id: '621028f37b48de4820cba6ea',
    name: 'Participant1',
    parentId: Iota.ObjectID(testDoc._id).toString(),
}

let requestedDoc

test('subscribeElectionInfo update should match the doc', done => {
    function requestHandler(doc) {
        requestedDoc = doc
        serverEvents.emit(serverEvents.eNames.ParticipantCreated, testParticipant)
    }
    function updateHandler(doc) {
        expect(doc).toMatchObject({ participants: [testParticipant] })
        done()
    }
    socketApiSubscribe(handle, Iota.ObjectID(testDoc._id).toString(), requestHandler, updateHandler)
})

test('subscribeElectionInfo request should match the doc', () => {
    const _testDoc = { ...testDoc, _id: Iota.ObjectId(testDoc._id).toString() } // _id is stringified through socket.io
    expect(requestedDoc).toMatchObject(_testDoc)
})

test('socket should disconnect', () => {
    let disconnectReason
    window.socket.on('disconnect', reason => (disconnectReason = reason))
    window.socket.close()
    expect(disconnectReason).toMatch('io client disconnect')
})
