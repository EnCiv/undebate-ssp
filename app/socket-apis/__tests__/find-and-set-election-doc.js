// https://github.com/EnCiv/undebate-ssp/issues/72
import { expect, test, beforeAll, afterAll } from '@jest/globals'
import MongoModels from 'mongo-models'
import { Iota, User } from 'civil-server'
import findAndSetElectionDoc from '../find-and-set-election-doc'
const ObjectID = Iota.ObjectId

global.logger = {
    error: jest.fn((...args) => args),
    warn: jest.fn((...args) => args), // ignore warnings about logger.warn('updateSubscribers - electionObjSubscriber of', rootId, 'not found')
}

const testDoc = {
    _id: ObjectID('62ac1922d6812e1f90583e43'),
    subject: 'Election Document #1',
    description: 'Election Document',
    webComponent: {},
    userId: '62ac19bb1fa2ea539849b122',
}

const mockElection = {
    webComponent: 'ElectionDoc',
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
        invitations: {
            // derived data, list may be empty or not present
            '62ac19413a924c163c12a88b': {
                _id: ObjectID('62ac19413a924c163c12a88b'),
                text: 'Hi Mike, please send answers',
                sentDate: '2022-02-10T00:50:16.802Z',
                responseDate: '2022-02-10T00:50:16.802Z',
                status: 'Accepted',
            },
        },
        submissions: {
            // derived data, list may be empty or not present
            '62ac1955520661234c14d5fd': {
                _id: ObjectID('62ac1955520661234c14d5fd'),
                url: 'url',
                date: '2022-02-10T00:50:16.802Z',
            },
        },
    },
    candidates: {
        '61e76bbefeaa4a25840d85d0': {
            uniqueId: '61e76bbefeaa4a25840d85d0',
            name: 'Sarah Jones',
            email: 'sarahjones@mail.com',
            office: 'President of the U.S.',
            region: 'United States',
            invitations: {
                // derived data - list may be empty or not present
                '62ac196cf1a3893c84d0b41d': {
                    _id: ObjectID('62ac196cf1a3893c84d0b41d'),
                    text: 'text',
                    sentDate: '2022-02-10T00:50:16.802Z',
                    responseDate: '2022-02-10T00:50:16.802Z',
                    status: 'Accepted',
                },
            },
            submissions: {
                // derived data - list may be empty or not present
                '62ac197d51df8d46dc0b45b0': {
                    _id: ObjectID('62ac197d51df8d46dc0b45b0'),
                    url: 'url',
                    date: '2022-02-10T00:50:16.802Z',
                    parentId: '6204672e8d39d45d1cbcc0a6',
                },
            },
        },
        '61e76bfc8a82733d08f0cf12': {
            uniqueId: '61e76bfc8a82733d08f0cf12',
            name: 'Michael Jefferson',
            email: 'mikejeff@mail.com',
            office: 'President of the U.S.',
            region: 'United States',
            invitations: {
                '62ac198e4b78fa3fd81beebb': {
                    _id: ObjectID('62ac198e4b78fa3fd81beebb'),
                    text: 'Hi Mike, please send answers',
                    sentDate: '2022-02-10T00:50:16.802Z',
                    responseDate: '2022-02-10T00:50:16.802Z',
                    status: 'Declined',
                },
            },
            submissions: {
                '62ac199835ae8635b0076b62': {
                    _id: ObjectID('62ac199835ae8635b0076b62'),
                    url: 'url.com',
                    date: '2022-02-10T00:50:16.802Z',
                    parentId: '6204672e8d39d45d1cbcc0a6',
                },
            },
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
    _id: User.ObjectID('62ac19bb1fa2ea539849b122'),
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
    apisThis.synuser.id = User.ObjectID(exampleUser._id).toString()

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
    findAndSetElectionDoc.call({}, { _id: '62ac1922d6812e1f90583e43' }, mockElection, callback)
})

test('it can find and set a valid doc', done => {
    async function callback(res) {
        try {
            expect(res).toBeTruthy()
            const result = await Iota.findOne({ _id: Iota.ObjectID('62ac1922d6812e1f90583e43') })
            expect(result.webComponent).toEqual(mockElection)
            done()
        } catch (error) {
            done(error)
        }
    }
    findAndSetElectionDoc.call(apisThis, { _id: '62ac1922d6812e1f90583e43' }, mockElection, callback)
})

test('it should fail if setting webComponent to wrong value', done => {
    async function callback(res) {
        expect(res).toEqual(undefined)
        try {
            expect(global.logger.error.mock.results[0].value).toMatchInlineSnapshot(`
                Array [
                  "ElectionDoc validation",
                  "{
                  \\"value\\": {
                    \\"webComponent\\": \\"Dummy\\"
                  },
                  \\"error\\": {
                    \\"_original\\": {
                      \\"webComponent\\": \\"Dummy\\"
                    },
                    \\"details\\": [
                      {
                        \\"message\\": \\"\\\\\\"webComponent\\\\\\" must be [ElectionDoc]\\",
                        \\"path\\": [
                          \\"webComponent\\"
                        ],
                        \\"type\\": \\"any.only\\",
                        \\"context\\": {
                          \\"valids\\": [
                            \\"ElectionDoc\\"
                          ],
                          \\"label\\": \\"webComponent\\",
                          \\"value\\": \\"Dummy\\",
                          \\"key\\": \\"webComponent\\"
                        }
                      }
                    ]
                  }
                }",
                ]
            `)
            const result = await Iota.findOne({ _id: Iota.ObjectID('62ac1922d6812e1f90583e43') })
            expect(result.webComponent).toEqual(mockElection)
            done()
        } catch (error) {
            done(error)
        }
    }
    findAndSetElectionDoc.call(apisThis, { _id: '62ac1922d6812e1f90583e43' }, { webComponent: 'Dummy' }, callback)
})

test('it should set a deep property without deleting other properties', done => {
    async function callback(res) {
        try {
            expect(res).toBeTruthy()
            const result = await Iota.findOne({ _id: Iota.ObjectID('62ac1922d6812e1f90583e43') })
            expect(result.webComponent.moderator).toMatchInlineSnapshot(`
                Object {
                  "email": "billsmith@gmail.com",
                  "invitations": Object {
                    "62ac19413a924c163c12a88b": Object {
                      "_id": "62ac19413a924c163c12a88b",
                      "responseDate": "2022-02-10T00:50:16.802Z",
                      "sentDate": "2022-02-10T00:50:16.802Z",
                      "status": "Accepted",
                      "text": "Hi Mike, please send answers",
                    },
                  },
                  "message": "Please be a moderator",
                  "name": "William Smith",
                  "submissions": Object {
                    "62ac1955520661234c14d5fd": Object {
                      "_id": "62ac1955520661234c14d5fd",
                      "date": "2022-02-10T00:50:16.802Z",
                      "url": "url",
                    },
                  },
                }
            `)
            done()
        } catch (error) {
            done(error)
        }
    }
    findAndSetElectionDoc.call(
        apisThis,
        { _id: '62ac1922d6812e1f90583e43' },
        { moderator: { name: 'William Smith' } },
        callback
    )
})

test('it should be able to add a new property to an object-list', done => {
    async function callback(res) {
        try {
            expect(res).toBeTruthy()
            const result = await Iota.findOne({ _id: Iota.ObjectID('62ac1922d6812e1f90583e43') })
            expect(result.webComponent.moderator).toMatchInlineSnapshot(`
                Object {
                  "email": "billsmith@gmail.com",
                  "invitations": Object {
                    "62ac19413a924c163c12a88b": Object {
                      "_id": "62ac19413a924c163c12a88b",
                      "responseDate": "2022-02-10T00:50:16.802Z",
                      "sentDate": "2022-02-10T00:50:16.802Z",
                      "status": "Accepted",
                      "text": "Hi Mike, please send answers",
                    },
                  },
                  "message": "Please be a moderator",
                  "name": "William Smith",
                  "submissions": Object {
                    "62ac1955520661234c14d5fd": Object {
                      "_id": "62ac1955520661234c14d5fd",
                      "date": "2022-02-10T00:50:16.802Z",
                      "url": "url",
                    },
                    "62aca621acfdb80f40cbf2b4": Object {
                      "_id": "62aca621acfdb80f40cbf2b4",
                      "date": "2022-06-10T00:50:16.802Z",
                      "parentId": "6204672e8d39d45d1cbcc0a6",
                      "url": "url.com",
                    },
                  },
                }
            `)
            done()
        } catch (error) {
            done(error)
        }
    }
    findAndSetElectionDoc.call(
        apisThis,
        { _id: '62ac1922d6812e1f90583e43' },
        {
            moderator: {
                submissions: {
                    '62aca621acfdb80f40cbf2b4': {
                        _id: ObjectID('62aca621acfdb80f40cbf2b4'),
                        url: 'url.com',
                        date: '2022-06-10T00:50:16.802Z',
                        parentId: '6204672e8d39d45d1cbcc0a6',
                    },
                },
            },
        },
        callback
    )
})

test('it should be able to delete a property from an object-list', done => {
    async function callback(res) {
        try {
            expect(res).toBeTruthy()
            const result = await Iota.findOne({ _id: Iota.ObjectID('62ac1922d6812e1f90583e43') })
            expect(result.webComponent.moderator).toMatchInlineSnapshot(`
                Object {
                  "email": "billsmith@gmail.com",
                  "invitations": Object {
                    "62ac19413a924c163c12a88b": Object {
                      "_id": "62ac19413a924c163c12a88b",
                      "responseDate": "2022-02-10T00:50:16.802Z",
                      "sentDate": "2022-02-10T00:50:16.802Z",
                      "status": "Accepted",
                      "text": "Hi Mike, please send answers",
                    },
                  },
                  "message": "Please be a moderator",
                  "name": "William Smith",
                  "submissions": Object {
                    "62aca621acfdb80f40cbf2b4": Object {
                      "_id": "62aca621acfdb80f40cbf2b4",
                      "date": "2022-06-10T00:50:16.802Z",
                      "parentId": "6204672e8d39d45d1cbcc0a6",
                      "url": "url.com",
                    },
                  },
                }
            `)
            done()
        } catch (error) {
            done(error)
        }
    }
    findAndSetElectionDoc.call(
        apisThis,
        { _id: '62ac1922d6812e1f90583e43' },
        {
            moderator: {
                submissions: {
                    '62ac1955520661234c14d5fd': undefined,
                },
            },
        },
        callback
    )
})

test('it should be able to set and delete multiple properties', done => {
    async function callback(res) {
        try {
            expect(res).toBeTruthy()
            const result = await Iota.findOne({ _id: Iota.ObjectID('62ac1922d6812e1f90583e43') })
            expect(result.webComponent.moderator).toMatchInlineSnapshot(`
                Object {
                  "email": "billsmith@gmail.com",
                  "invitations": Object {
                    "62ac19413a924c163c12a88b": Object {
                      "_id": "62ac19413a924c163c12a88b",
                      "responseDate": "2022-02-10T00:50:16.802Z",
                      "sentDate": "2022-02-10T00:50:16.802Z",
                      "text": "Hi Mike, please send answers",
                    },
                  },
                  "message": "Please, please, be a moderator",
                  "name": "Bill Smith",
                  "submissions": Object {
                    "62aca621acfdb80f40cbf2b4": Object {
                      "_id": "62aca621acfdb80f40cbf2b4",
                      "date": "2022-06-10T00:50:16.802Z",
                      "parentId": "6204672e8d39d45d1cbcc0a6",
                      "url": "url.com",
                    },
                    "62aca95ea9060d2e64e8402a": Object {
                      "_id": "62aca95ea9060d2e64e8402a",
                      "date": "2022-06-17T00:50:16.802Z",
                      "parentId": "6204672e8d39d45d1cbcc0a6",
                      "url": "https://enciv.org",
                    },
                  },
                }
            `)
            done()
        } catch (error) {
            done(error)
        }
    }
    findAndSetElectionDoc.call(
        apisThis,
        { _id: '62ac1922d6812e1f90583e43' },
        {
            moderator: {
                name: 'Bill Smith',
                message: 'Please, please, be a moderator',
                invitations: {
                    '62ac19413a924c163c12a88b': {
                        status: undefined,
                    },
                },
                submissions: {
                    '62ac1955520661234c14d5fd': undefined, // it's not there though
                    '62aca95ea9060d2e64e8402a': {
                        _id: ObjectID('62aca95ea9060d2e64e8402a'),
                        date: '2022-06-17T00:50:16.802Z',
                        parentId: '6204672e8d39d45d1cbcc0a6',
                        url: 'https://enciv.org',
                    },
                },
            },
        },
        callback
    )
})
