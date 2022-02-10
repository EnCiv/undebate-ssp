// https://github.com/EnCiv/undebate-ssp/issues/72
import { expect, test, beforeAll, afterAll } from '@jest/globals'
import MongoModels from 'mongo-models'
import { Iota, User } from 'civil-server'
import findAndSetElectionDoc from '../upsert-election-doc'
const ObjectID = Iota.ObjectId

// dummy out logger for tests
if (!global.logger) {
    global.logger = console
}

const testDoc = {
    _id: ObjectID(),
    subject: 'Election Document #1',
    description: 'Election Document',
    webComponent: {},
}

const mockElection = {
    electionName: 'U.S Presidential Election',
    organizationName: 'United States Federal Government',
    electionDate: '2022-11-07T23:59:59.999Z',
    questions: {
        0: {
            text: 'What is your favorite color?',
            time: '30',
        },
        1: {
            text: 'Do you have a pet?',
            time: '60',
        },
        2: {
            text: 'Should we try to fix income inequality?',
            time: '90',
        },
    },
    script: {
        0: {
            text: 'Welcome everyone. Our first question is: What is your favorite color?',
        },
        1: {
            text: 'Thank you. Our next Question is: Do you have a pet?',
        },
        2: {
            text: 'Great. And our last question is: Should we try to fix income inequality?',
        },
        3: {
            text: 'Thanks everyone for watching this!',
        },
    },
    moderator: {
        name: 'Bill Smith',
        email: 'billsmith@gmail.com',
        message: 'Please be a moderator',
        invitations: [
            // derived data, list may be empty or not present
            {
                _id: ObjectID(),
                text: 'Hi Mike, please send answers',
                sentDate: '2022-02-10T00:50:16.802Z',
                responseDate: '2022-02-10T00:50:16.802Z',
                status: 'Accepted',
            },
        ],
        submissions: [
            // derived data, list may be empty or not present
            { _id: ObjectID(), url: 'url', date: '2022-02-10T00:50:16.802Z' },
        ],
    },
    candidates: {
        '61e76bbefeaa4a25840d85d0': {
            uniqueId: '61e76bbefeaa4a25840d85d0',
            name: 'Sarah Jones',
            email: 'sarahjones@mail.com',
            office: 'President of the U.S.',
            region: 'United States',
            invitations: [
                // derived data - list may be empty or not present
                {
                    _id: ObjectID().toString(),
                    text: 'text',
                    sentDate: '2022-02-10T00:50:16.802Z',
                    responseDate: '2022-02-10T00:50:16.802Z',
                    status: 'Accepted',
                },
            ],
            submissions: [
                // derived data - list may be empty or not present
                { _id: ObjectID(), url: 'url', date: '2022-02-10T00:50:16.802Z', parentId: '6204672e8d39d45d1cbcc0a6' },
            ],
        },
        '61e76bfc8a82733d08f0cf12': {
            uniqueId: '61e76bfc8a82733d08f0cf12',
            name: 'Michael Jefferson',
            email: 'mikejeff@mail.com',
            office: 'President of the U.S.',
            region: 'United States',
            invitations: [
                {
                    _id: ObjectID().toString(),
                    text: 'Hi Mike, please send answers',
                    sentDate: '2022-02-10T00:50:16.802Z',
                    responseDate: '2022-02-10T00:50:16.802Z',
                    status: 'Declined',
                },
            ],
            submissions: [
                {
                    _id: ObjectID().toString(),
                    url: '2022-02-10T00:50:16.802Z',
                    date: '2022-02-10T00:50:16.802Z',
                    parentId: '6204672e8d39d45d1cbcc0a6',
                },
            ],
        },
    },
    timeline: {
        moderatorDeadlineReminderEmails: {
            0: {
                date: '2022-01-07T22:09:32.952Z',
                sent: true,
            },
            1: {
                date: '2022-01-07T22:09:32.952Z',
                sent: false,
            },
        },
        moderatorSubmissionDeadline: {
            0: {
                date: '2022-01-07T22:09:32.952Z',
                sent: true,
            },
        },
        candidateDeadlineReminderEmails: {
            0: {
                date: '2022-01-07T22:09:32.952Z',
                sent: true,
            },
            1: {
                date: '2022-01-07T22:09:32.952Z',
                sent: false,
            },
        },
        candidateSubmissionDeadline: {
            0: {
                date: '2022-01-07T22:09:32.952Z',
                sent: true,
            },
        },
        moderatorInviteDeadline: {
            0: {
                date: '2022-01-07T22:09:32.952Z',
                sent: true,
            },
            1: {
                date: '2022-01-07T22:09:32.952Z',
                sent: false,
            },
        },
    },
    undebateDate: '2022-02-10T00:50:16.802Z',
}

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
    await Iota.create(testDoc)
})

afterAll(async () => {
    MongoModels.disconnect()
})

test('it should return undefined if user not logged in', done => {
    function callback(res) {
        try {
            expect(res).toEqual(undefined)
            done()
        } catch (error) {
            done(error)
        }
    }
    findAndSetElectionDoc.call({}, { subject: 'Election Document #1' }, mockElection, callback)
})

test('it can find and set a valid doc', done => {
    async function callback(res) {
        try {
            expect(res).toBeTruthy()
            const result = await Iota.findOne({ subject: 'Election Document #1' })
            expect(result.webComponent).toEqual(mockElection)
            done()
        } catch (error) {
            done(error)
        }
    }
    findAndSetElectionDoc.call(apisThis, { subject: 'Election Document #1' }, mockElection, callback)
})

test('it should fail is setting webComponent to wrong value', done => {
    async function callback(res) {
        try {
            expect(res).toEqual(undefined)
            const result = await Iota.findOne({ subject: 'Election Document #1' })
            expect(result.webComponent).toEqual(mockElection)
            done()
        } catch (error) {
            done(error)
        }
    }
    findAndSetElectionDoc.call(apisThis, { subject: 'Election Document #1' }, { webComponent: 'Dummy' }, callback)
})
