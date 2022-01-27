// https://github.com/EnCiv/undebate-ssp/issues/71
import { expect, test, beforeAll, afterAll } from '@jest/globals'
import MongoModels from 'mongo-models'
import { Iota, User } from 'civil-server'
import getElectionDocs from '../get-election-docs'

// dummy out logger for tests
if (!global.logger) {
    global.logger = console
}

const iotas = [
    {
        subject: 'Election document',
        description: 'Election document #1',
        webComponent: 'ElectionDoc',
    },
    {
        subject: 'Election document',
        description: 'Election document #2',
        webComponent: 'ElectionDoc',
    },
    {
        subject: 'Election document',
        description: 'Election document #3',
        webComponent: 'ElectionDoc',
    },
    {
        subject: 'Election document',
        description: 'Election document #4',
        webComponent: 'ElectionDoc',
    },
]

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
    // eslint-disable-next-line no-restricted-syntax
    for await (const doc of iotas) {
        doc.userId = apisThis.synuser.id
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
            expect(docs.length).toEqual(iotas.length)
            // docs can be in any order sort in order to compare
            docs.sort((a, b) => (a.description < b.description ? -1 : a.description > b.description ? 1 : 0))
            docs.forEach((doc, i) => {
                expect(doc).toMatchObject(iotas[i])
            })
            done()
        } catch (error) {
            done(error)
        }
    }
    getElectionDocs.call(apisThis, callback)
})
