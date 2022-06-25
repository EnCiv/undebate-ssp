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
    testDoc._id = ObjectID(testDoc._id.$oid || testDoc._id)
    await Iota.create(testDoc)
})

afterAll(async () => {
    MongoModels.disconnect()
})

let viewerId

/* test('it should create a viewer', done => {}) */

const objectIdPattern = /^[0-9a-fA-F]{24}$/

/* test('it should create a recorder', async () => {}) */

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
