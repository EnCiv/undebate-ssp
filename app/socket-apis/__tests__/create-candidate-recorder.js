// https://github.com/EnCiv/undebate-ssp/issues/127
import { expect, test, beforeAll, afterAll, jest } from '@jest/globals'
import MongoModels from 'mongo-models'
import { Iota, User } from 'civil-server'
import iotas from '../../../iotas.json'
import createCandidateRecorder from '../create-candidate-recorder'
import { merge } from 'lodash'

const ObjectID = Iota.ObjectId

// dummy out logger for tests
// todo remove debug logger
/* global.logger = { error: jest.fn(e => e), debug: jest.fn() } */
global.logger = { error: jest.fn((...vals) => console.error(vals)), debug: jest.fn((...vals) => console.log(vals)) }

const testDoc = iotas.filter(iota => iota.subject === 'Undebate SSP Test Iota')[0]
const testCandidate = testDoc.webComponent.candidates['61e76bbefeaa4a25840d85d0']

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

afterEach(() => {
    global.logger.error.mockReset()
    global.logger.debug.mockReset()
})

let viewerId

test.skip('it should create a viewer', done => {
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
                { _id: expect.any(ObjectID) },
                `
                Object {
                }
                `
            )
            done()
        } catch (error) {
            done(error)
        }
    }
    createCandidateRecorder.call(apisThis, ObjectID(testDoc._id).toString(), testCandidate.uniqueId, callback)
})

const objectIdPattern = /^[0-9a-fA-F]{24}$/

test.skip('it should create a recorder', async () => {
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
                /\/country:us\/organization:cfa\/office:moderator\/2021-03-21-recorder-[0-9-a-fA-F]{24}$/
            ),
        },
        ``
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
    createCandidateRecorder.call({}, ObjectID(testDoc._id).toString(), '', callback)
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
    createCandidateRecorder.call(apisThis, '', '', callback)
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
    createCandidateRecorder.call(apisThis, 'abc123', '', callback)
})

test('it fails if no userId', done => {
    async function callback(result) {
        try {
            expect(result).toBeUndefined()
            expect(global.logger.error).toHaveBeenLastCalledWith('createCandidateRecorder called, but bad userId:', '')
            done()
        } catch (error) {
            done(error)
        }
    }
    createCandidateRecorder.call(apisThis, ObjectID(testDoc._id).toString(), '', callback)
})

test('it fails if bad userId', done => {
    async function callback(result) {
        try {
            expect(result).toBeUndefined()
            expect(global.logger.error).toHaveBeenLastCalledWith(
                'createCandidateRecorder called, but bad userId:',
                'abc321'
            )
            done()
        } catch (error) {
            done(error)
        }
    }
    createCandidateRecorder.call(apisThis, ObjectID(testDoc._id).toString(), 'abc321', callback)
})

test('it fails if userId not in candidates', done => {
    async function callback(result) {
        try {
            expect(result).toBeUndefined()
            expect(global.logger.error).toHaveBeenLastCalledWith(
                'no candidate found for userId:',
                '61edf8791dff058c2a73724d'
            )
            done()
        } catch (error) {
            done(error)
        }
    }
    createCandidateRecorder.call(apisThis, ObjectID(testDoc._id).toString(), '61edf8791dff058c2a73724d', callback)
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

        createCandidateRecorder.call(apisThis, ObjectID(badDoc._id).toString(), testCandidate.uniqueId, callback)
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

        createCandidateRecorder.call(apisThis, ObjectID(badDoc._id).toString(), testCandidate.uniqueId, callback)
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

        createCandidateRecorder.call(apisThis, ObjectID(badDoc._id).toString(), testCandidate.uniqueId, callback)
    }
    doAsync()
})
