// https://github.com/EnCiv/undebate-ssp/issues/71
import { expect, test, beforeAll, afterAll } from '@jest/globals'
const { getPort } = require('get-port-please')
import MongoModels from 'mongo-models'
import { Iota, User, serverEvents } from 'civil-server'
import socketIo from 'socket.io'
import clientIo from 'socket.io-client'
import subscribeElectionInfo from '../subscribe-election-info'
if (typeof window === 'undefined') global.window = { addEventListener: () => {} } // socketApiSubscribe expects to run on the browser
import socketApiSubscribe, { subscribeEventName } from '../../components/lib/socket-api-subscribe'

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

// apis are called with 'this' that has synuser defined
var apisThis = {}

const handle = 'subscribe-election-info'

let SocketIoPort // an available PORT for Socket.io

beforeAll(async () => {
    SocketIoPort = await getPort()
    serverEvents.eNameAdd('ParticipantCreated') // we will be simulating this event
    await MongoModels.connect({ uri: global.__MONGO_URI__ }, { useUnifiedTopology: true })
    // run the init functions that models require - after the connection is setup
    const { toInit = [] } = MongoModels.toInit
    MongoModels.toInit = []
    // eslint-disable-next-line no-restricted-syntax
    for await (const init of toInit) await init()
    const server = socketIo()
    let connections = 0
    server.on('connection', socket => {
        connections++
        // eslint-disable-next-line no-param-reassign
        socket.synuser = { id: MongoModels.ObjectID(user._id).toString() }
        socket.on(handle, subscribeElectionInfo.bind(socket))
        socket.on('disconnect', reason => {
            if (--connections <= 0) server.close()
        })
    })
    server.listen(SocketIoPort)
    const user = await User.create(exampleUser)
    apisThis.synuser = { id: MongoModels.ObjectID(user._id).toString() }
    // eslint-disable-next-line no-restricted-syntax
    testDoc.userId = apisThis.synuser.id
    await Iota.create(testDoc)
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
let disconnectReason

test('subscribeElectionInfo update should match the doc', done => {
    const ioClient = clientIo.connect(`http://localhost:${SocketIoPort}`)
    window.socket = ioClient // as if we were running on the browser
    function requestHandler(doc) {
        requestedDoc = doc
        serverEvents.emit(serverEvents.eNames.ParticipantCreated, testParticipant)
    }
    function updateHandler(doc) {
        expect(doc).toMatchObject({ participants: [testParticipant] })
        ioClient.close()
        done()
    }
    ioClient.on('connect', () => {
        socketApiSubscribe(handle, Iota.ObjectID(testDoc._id).toString(), requestHandler, updateHandler)
    })
    ioClient.on('disconnect', reason => (disconnectReason = reason))
})

test('subscribeElectionInfo request should match the doc', () => {
    const _testDoc = { ...testDoc, _id: Iota.ObjectId(testDoc._id).toString() } // _id is stringified through socket.io
    expect(requestedDoc).toMatchObject(_testDoc)
})

test('it should disconnect', () => {
    expect(disconnectReason).toMatch('io client disconnect')
})
