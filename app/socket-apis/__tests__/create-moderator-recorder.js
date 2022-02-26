// https://github.com/EnCiv/undebate-ssp/issues/72
import { expect, test, beforeAll, afterAll } from '@jest/globals'
import MongoModels from 'mongo-models'
import { Iota, User } from 'civil-server'
import iotas from '../../../iotas.json'
import createModeratorRecorder from '../create-moderator-recorder'
const ObjectID = Iota.ObjectId

// dummy out logger for tests
if (!global.logger) {
    global.logger = console
}

const testDoc = iotas.filter(iota => iota.subject === 'Undebate SSP Test Iota')[0]

const exampleUser = {
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

    testDoc.userId = apisThis.synuser.id
    testDoc._id = ObjectID(testDoc._id)
    await Iota.create(testDoc)
})

afterAll(async () => {
    MongoModels.disconnect()
})

test('it should create a viewer', done => {
    async function callback(rowObjs) {
        try {
            expect(rowObjs).toBeTruthy()
            const iotas = Iota.find({ parentId: 'testDoc._id', 'webComponent.webComponent': 'CandidateConvesration' })
            console.info('viewer', iotas[0])
            done()
        } catch (error) {
            done(error)
        }
    }
    createModeratorRecorder.call(apisThis, testDoc._id, callback)
})
