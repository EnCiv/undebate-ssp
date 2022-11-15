import { expect, test, beforeAll, afterAll, describe } from '@jest/globals'

import MongoModels from 'mongo-models'
import { Iota, User } from 'civil-server'

import createElectionDoc from '../create-election-doc'
const OBJECTID = /^[0-9a-fA-F]{24}$/
// dummy out logger for tests
global.logger = { error: jest.fn(e => e) }

const exampleUser = {
    _id: User.ObjectID('62acafc571a636160c5b1926'),
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
    async function callback(doc) {
        expect(doc.id).toMatch(OBJECTID)
        expect(doc).toMatchInlineSnapshot(
            {
                id: expect.stringMatching(OBJECTID),
            },
            `
            Object {
              "id": StringMatching /\\^\\[0-9a-fA-F\\]\\{24\\}\\$/,
              "questions": Object {
                "0": Object {
                  "text": "Please say your name; city and state; one word to describe yourself; and what office you are running for.",
                  "time": "15",
                },
                "1": Object {
                  "text": "What do you love most about where you live?",
                  "time": "30",
                },
                "2": Object {
                  "text": "What inspired you to run for office?",
                  "time": "30",
                },
                "3": Object {
                  "text": "If elected, what will be your top two priorities?",
                  "time": "30",
                },
                "4": Object {
                  "text": "If elected, how will you know that you've succeeded in this position?",
                  "time": "30",
                },
              },
              "webComponent": "ElectionDoc",
            }
        `
        )
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
                `"createElectionDoc called but no user logged in"`
            )
            done()
        } catch (error) {
            done(error)
        }
    }
    createElectionDoc.call({}, callback)
})
