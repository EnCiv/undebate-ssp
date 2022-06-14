import { expect, test, beforeAll, afterAll, describe } from '@jest/globals'

import MongoModels from 'mongo-models'
import { Iota, User } from 'civil-server'

import createElectionDoc from '../create-election-doc'
const OBJECTID = /^[0-9a-fA-F]{24}$/
// dummy out logger for tests
global.logger = { error: jest.fn(e => e) }

const exampleUser = {
    _id: User.ObjectID('629f850dfb8ee6220ceade47'),
    firstName: 'Example',
    lastName: 'User',
    email: 'example.user@example.com',
    password: 'a-really-secure-password',
}

beforeAll(async () => {
    // initialize Mongo
    await MongoModels.connect({ uri: global.__MONGO_URI__ }, { useUnifiedTopology: true })
    // run the init functions that models require - after the connection is setup
    const { toInit = [] } = MongoModels.toInit
    MongoModels.toInit = []
    for await (const init of toInit) await init()

    // initialize data in Mongo
    const user = await User.create(exampleUser)
})

afterAll(async () => {
    MongoModels.disconnect()
})

test('should create one', done => {
    function callback(id) {
        expect(id).toMatch(OBJECTID)
        done()
    }
    createElectionDoc.call(
        { synuser: { id: User.ObjectID(exampleUser._id).toString(), email: exampleUser.email } },
        callback
    )
})
test('it fails if no user', done => {
    async function callback(result) {
        try {
            expect(result).not.toBeTruthy()
            expect(global.logger.error.mock.results[0].value).toMatchInlineSnapshot(
                `"createElectionDoc called by no user logged in"`
            )
            done()
        } catch (error) {
            done(error)
        }
    }
    createElectionDoc.call({}, callback)
})
