// https://github.com/EnCiv/undebate-ssp/issues/146
import { expect, test, beforeAll, afterAll } from '@jest/globals'
import MongoModels from 'mongo-models'
import { Iota, User, serverEvents } from 'civil-server'
import subscribeElectionInfo from '../subscribe-election-info'
import jestSocketApiSetup from '../../lib/jest-socket-api-setup'
import socketApiSubscribe from '../../components/lib/socket-api-subscribe'
import '../../lib/jest-setup'
import createParticipant from 'undebate/dist/socket-apis/create-participant'
const ObjectID = Iota.ObjectID

// if making a copy of this, you need new node_modules/.bin/mongo-id 's here
// because multiple tests using the DB will run in parallel
const ELECTIONOBJID = '6372ba4c5f6dea0017c8fa0f'

const USERID = '621e826899902756d4ba49f5'

const iotas = [
    {
        _id: ObjectID(ELECTIONOBJID),
        subject: 'Election Doc',
        description: 'an election document',
        webComponent: {
            id: ELECTIONOBJID,
            webComponent: 'ElectionDoc',
            questions: {
                0: {
                    text: 'Please say your name; city and state; one word to describe yourself; and what office you are running for.',
                    time: '15',
                },
                1: {
                    text: 'What do you love most about where you live?',
                    time: '30',
                },
                2: {
                    text: 'What inspired you to run for office?',
                    time: '30',
                },
                3: {
                    text: 'If elected, what will be your top two priorities?',
                    time: '30',
                },
                4: {
                    text: "If elected, how will you know that you've succeeded in this position?",
                    time: '30',
                },
            },
            organizationName: 'EnCiv, Inc',
            organizationUrl: 'https://enciv.org',
            electionName: 'Run through 3',
            email: 'joe@mail.com',
            name: 'David Contact F',
            organizationLogo: '',
            doneLocked: {
                Election: {
                    done: '2022-11-14T22:00:32.647Z',
                },
                Timeline: {
                    done: '2022-11-14T22:00:56.900Z',
                },
                Questions: {
                    done: '2022-11-14T22:01:07.688Z',
                },
                Contact: {
                    done: '2022-11-14T22:01:39.952Z',
                },
                Script: {
                    done: '2022-11-14T22:02:21.267Z',
                },
                Recorder: {
                    done: '2022-11-14T22:02:24.804Z',
                },
            },
            timeline: {
                moderatorSubmissionDeadline: {
                    0: {
                        date: '2022-12-02T07:59:00.000Z',
                    },
                },
                candidateSubmissionDeadline: {
                    0: {
                        date: '2022-12-03T07:59:00.000Z',
                    },
                },
            },
            undebateDate: '2022-12-04T07:59:00.000Z',
            electionDate: '2022-12-05T07:59:00.000Z',
            moderator: {
                name: 'David Moderator F',
                email: 'joe@mail.org',
                message: 'Thank you for moderating!',
            },
            script: {
                0: {
                    text: 'Hi, I\'m "David Moderator F", welcome to our Undebate! Our first question is "Please say your name; city and state; one word to describe yourself; and what office you are running for."',
                },
                1: {
                    text: 'Awesome, the next question is "What do you love most about where you live?"',
                },
                2: {
                    text: 'Great, the next question is "What inspired you to run for office?"',
                },
                3: {
                    text: 'Awesome, the next question is "If elected, what will be your top two priorities?"',
                },
                4: {
                    text: 'Great, the next question is "If elected, how will you know that you\'ve succeeded in this position?"',
                },
                5: {
                    text: "I'd like to thank the candidates for answering our questions, and thank you for participating in the democratic process!",
                },
            },
            candidates: {
                '6372bee31b92314cf0000003': {
                    name: 'David Candidate F',
                    uniqueId: '6372bee31b92314cf0000003',
                    email: 'joey@mail.com',
                    office: 'Pres',
                },
            },
        },
        userId: '621e826899902756d4ba49f5',
    },
    {
        _id: ObjectID('6372baf15f6dea0017c8fa16'),
        component: {
            component: 'MergeParticipants',
        },
        webComponent: {
            webComponent: 'CandidateConversation',
            logo: 'undebate',
            instructionLink: '',
            closing: {
                thanks: 'Thank You.',
                iframe: {
                    src: 'https://docs.google.com/forms/d/e/1FAIpQLSdDJIcMltkYr5_KRTS9q1-eQd3g79n0yym9yCmTkKpR61uPLA/viewform?embedded=true',
                    width: '640',
                    height: '4900',
                },
            },
            shuffle: true,
            participants: {
                moderator: {
                    speaking: [
                        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893717/5d5b74751e3b194174cd9b94-3-speaking20210304T213516602Z.mp4',
                        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893718/5d5b74751e3b194174cd9b94-5-speaking20210304T213517487Z.mp4',
                        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893718/5d5b74751e3b194174cd9b94-5-speaking20210304T213517487Z.mp4',
                        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893718/5d5b74751e3b194174cd9b94-5-speaking20210304T213517487Z.mp4',
                        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893719/5d5b74751e3b194174cd9b94-6-speaking20210304T213517927Z.mp4',
                        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614894042/5d5b74751e3b194174cd9b94-1-speaking20210304T214041075Z.mp4',
                        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614894043/5d5b74751e3b194174cd9b94-2-speaking20210304T214041861Z.mp4',
                    ],
                    name: 'David Fridley, EnCiv',
                    listening:
                        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893720/5d5b74751e3b194174cd9b94-0-listening20210304T213518628Z.mp4',
                    agenda: [
                        [
                            'Please say your name; city and state; one word to describe yourself; and what office you are running for.',
                        ],
                        ['What do you love most about where you live?'],
                        ['What inspired you to run for office?'],
                        ['If elected, what will be your top two priorities?'],
                        ["If elected, how will you know that you've succeeded in this position?"],
                        ['Make your closing - to the audience'],
                        ['Thank you'],
                    ],
                    timeLimits: ['15', '30', '30', '30', '30'],
                },
            },
        },
        bp_info: {
            electionList: ['/country:us/org:enciv-org:run-through-3/office:moderator/2022-12-05'],
            office: 'Moderator',
            election_date: '12/05/2022',
            election_source: 'EnCiv, Inc',
        },
        parentId: '6372ba4c5f6dea0017c8fa0f',
        path: '/country:us/org:enciv-org:run-through-3/office:moderator/2022-12-05',
        subject: 'Moderator',
        description: 'A Candidate Conversation for: Moderator',
    },
    {
        _id: ObjectID('6372baf15f6dea0017c8fa18'),
        component: {
            component: 'UndebateCreator',
            participants: {
                moderator: {
                    speaking: [
                        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893716/5d5b74751e3b194174cd9b94-1-speaking20210304T213504684Z.mp4',
                        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893717/5d5b74751e3b194174cd9b94-3-speaking20210304T213516602Z.mp4',
                        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893718/5d5b74751e3b194174cd9b94-5-speaking20210304T213517487Z.mp4',
                        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893718/5d5b74751e3b194174cd9b94-5-speaking20210304T213517487Z.mp4',
                        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893718/5d5b74751e3b194174cd9b94-5-speaking20210304T213517487Z.mp4',
                        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893719/5d5b74751e3b194174cd9b94-6-speaking20210304T213517927Z.mp4',
                        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614894042/5d5b74751e3b194174cd9b94-1-speaking20210304T214041075Z.mp4',
                        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614894043/5d5b74751e3b194174cd9b94-2-speaking20210304T214041861Z.mp4',
                    ],
                    name: 'David Fridley, EnCiv',
                    listening:
                        'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893720/5d5b74751e3b194174cd9b94-0-listening20210304T213518628Z.mp4',
                    agenda: [
                        ['How this works', 'Placeholder'],
                        [
                            'Please say your name; city and state; one word to describe yourself; and what office you are running for.',
                        ],
                        ['What do you love most about where you live?'],
                        ['What inspired you to run for office?'],
                        ['If elected, what will be your top two priorities?'],
                        ["If elected, how will you know that you've succeeded in this position?"],
                        ['Make your closing - to the audience'],
                        ['Thank you'],
                    ],
                    timeLimits: [15, 300, 300, 300, 300, 300, 300],
                },
                human: {
                    listening: {
                        round: 0,
                        seat: 'speaking',
                    },
                    name: 'David Moderator F',
                },
            },
        },
        webComponent: {
            webComponent: 'Undebate',
            logo: 'undebate',
            instructionLink: '',
            participants: {},
            opening: {
                noPreamble: false,
            },
            closing: {
                thanks: 'Thank You.',
                iframe: {
                    src: 'https://docs.google.com/forms/d/e/1FAIpQLSchcQjvnbpwEcOl9ysmZ4-KwDyK7RynwJvxPqRTWhdq8SN02g/viewform?embedded=true',
                    width: 640,
                    height: 1550,
                },
            },
        },
        bp_info: {
            office: 'Moderator',
            election_date: '12/05/2022',
            candidate_name: 'David Moderator F',
            last_name: 'F',
            unique_id: '6372baf15f6dea0017c8fa17',
            candidate_emails: ['joe@mail.org'],
            party: '',
            election_source: 'EnCiv, Inc',
        },
        subject: 'Moderator-Candidate Recorder',
        description: 'A Candidate Recorder for the undebate: Moderator',
        path: '/country:us/org:enciv-org:run-through-3/office:moderator/2022-12-05-recorder-6372baf15f6dea0017c8fa17',
        parentId: ELECTIONOBJID,
    },
    {
        _id: ObjectID('6372bf0a5f6dea0017c8fa4f'),
        component: {
            component: 'MergeParticipants',
        },
        webComponent: {
            webComponent: 'CandidateConversation',
            logo: 'undebate',
            instructionLink: '',
            closing: {
                thanks: 'Thank You.',
                iframe: {
                    src: 'https://docs.google.com/forms/d/e/1FAIpQLSdDJIcMltkYr5_KRTS9q1-eQd3g79n0yym9yCmTkKpR61uPLA/viewform?embedded=true',
                    width: '640',
                    height: '4900',
                },
            },
            shuffle: true,
            participants: {
                moderator: {
                    speaking: [
                        'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463625/6303f6bbb2d45f001797bf98-0-speaking20221114T220654468Z.mp4',
                        'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463628/6303f6bbb2d45f001797bf98-1-speaking20221114T220704564Z.mp4',
                        'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463631/6303f6bbb2d45f001797bf98-2-speaking20221114T220707669Z.mp4',
                        'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463635/6303f6bbb2d45f001797bf98-3-speaking20221114T220710623Z.mp4',
                        'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463641/6303f6bbb2d45f001797bf98-4-speaking20221114T220714656Z.mp4',
                        'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463646/6303f6bbb2d45f001797bf98-5-speaking20221114T220720200Z.mp4',
                    ],
                    name: 'David Moderator F',
                    listening:
                        'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463655/6303f6bbb2d45f001797bf98-0-listening20221114T220725284Z.mp4',
                    agenda: [
                        [
                            'Please say your name; city and state; one word to describe yourself; and what office you are running for.',
                        ],
                        ['What do you love most about where you live?'],
                        ['What inspired you to run for office?'],
                        ['If elected, what will be your top two priorities?'],
                        ["If elected, how will you know that you've succeeded in this position?"],
                        ['Thank You'],
                    ],
                    timeLimits: ['15', '30', '30', '30', '30'],
                },
            },
        },
        bp_info: {
            electionList: ['/country:us/org:enciv-org:run-through-3/office:pres/2022-12-05'],
            office: 'Pres',
            election_date: '12/05/2022',
            election_source: 'EnCiv, Inc',
        },
        parentId: '6372ba4c5f6dea0017c8fa0f',
        path: '/country:us/org:enciv-org:run-through-3/office:pres/2022-12-05',
        subject: 'Pres',
        description: 'A Candidate Conversation for: Pres',
    },
    {
        _id: ObjectID('6372bf0a5f6dea0017c8fa50'),
        component: {
            component: 'UndebateCreator',
            participants: {
                moderator: {
                    speaking: [
                        'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1661378414/621e826899902756d4ba49f5-0-speaking20220824T220002681Z.mp4',
                        'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463625/6303f6bbb2d45f001797bf98-0-speaking20221114T220654468Z.mp4',
                        'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463628/6303f6bbb2d45f001797bf98-1-speaking20221114T220704564Z.mp4',
                        'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463631/6303f6bbb2d45f001797bf98-2-speaking20221114T220707669Z.mp4',
                        'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463635/6303f6bbb2d45f001797bf98-3-speaking20221114T220710623Z.mp4',
                        'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463641/6303f6bbb2d45f001797bf98-4-speaking20221114T220714656Z.mp4',
                        'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463646/6303f6bbb2d45f001797bf98-5-speaking20221114T220720200Z.mp4',
                    ],
                    name: 'David Moderator F',
                    listening:
                        'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463655/6303f6bbb2d45f001797bf98-0-listening20221114T220725284Z.mp4',
                    agenda: [
                        ['How this works', 'Record placeholder'],
                        [
                            'Please say your name; city and state; one word to describe yourself; and what office you are running for.',
                        ],
                        ['What do you love most about where you live?'],
                        ['What inspired you to run for office?'],
                        ['If elected, what will be your top two priorities?'],
                        ["If elected, how will you know that you've succeeded in this position?"],
                        ['Thank You'],
                    ],
                    timeLimits: [15, '15', '30', '30', '30', '30'],
                    names: ['David Fridley, EnCiv'],
                    listeningURLs: [
                        'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1661378417/621e826899902756d4ba49f5-0-listening20220824T220015791Z.mp4',
                    ],
                },
                human: {
                    listening: {
                        round: 0,
                        seat: 'speaking',
                    },
                },
            },
        },
        webComponent: {
            webComponent: 'Undebate',
            logo: 'undebate',
            instructionLink: '',
            participants: {},
            opening: {
                noPreamble: false,
            },
            closing: {
                thanks: 'Thank You.',
                iframe: {
                    src: 'https://docs.google.com/forms/d/e/1FAIpQLSchcQjvnbpwEcOl9ysmZ4-KwDyK7RynwJvxPqRTWhdq8SN02g/viewform?embedded=true',
                    width: 640,
                    height: 1550,
                },
            },
        },
        bp_info: {
            office: 'Pres',
            election_date: '12/05/2022',
            candidate_name: 'David Candidate F',
            last_name: 'F',
            unique_id: '6372bee31b92314cf0000003',
            candidate_emails: ['joey@mail.com'],
            party: '',
            election_source: 'EnCiv, Inc',
        },
        subject: 'Pres-Candidate Recorder',
        description: 'A Candidate Recorder for the undebate: Pres',
        path: '/country:us/org:enciv-org:run-through-3/office:pres/2022-12-05-recorder-6372bee31b92314cf0000003',
        parentId: '6372bf0a5f6dea0017c8fa4f',
    },
]

const moderatorRecording = {
    _id: ObjectID('6372bc285f6dea0017c8fa46'),
    parentId: '6372baf15f6dea0017c8fa16',
    subject: 'Participant:Moderator-Candidate Recorder',
    description: 'A participant in the following discussion:A Candidate Recorder for the undebate: Moderator',
    component: {
        component: 'MergeParticipants',
        participant: {
            speaking: [
                'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463625/6303f6bbb2d45f001797bf98-0-speaking20221114T220654468Z.mp4',
                'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463628/6303f6bbb2d45f001797bf98-1-speaking20221114T220704564Z.mp4',
                'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463631/6303f6bbb2d45f001797bf98-2-speaking20221114T220707669Z.mp4',
                'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463635/6303f6bbb2d45f001797bf98-3-speaking20221114T220710623Z.mp4',
                'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463641/6303f6bbb2d45f001797bf98-4-speaking20221114T220714656Z.mp4',
                'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463646/6303f6bbb2d45f001797bf98-5-speaking20221114T220720200Z.mp4',
            ],
            name: 'David Moderator F',
            listening:
                'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463655/6303f6bbb2d45f001797bf98-0-listening20221114T220725284Z.mp4',
            bp_info: {
                office: 'Moderator',
                election_date: '12/05/2022',
                candidate_name: 'David Moderator F',
                last_name: 'F',
                unique_id: '6372baf15f6dea0017c8fa17',
                candidate_emails: ['joe@mail.org'],
                party: '',
                election_source: 'EnCiv, Inc',
            },
        },
    },
    userId: '6303f6bbb2d45f001797bf98',
}

const candidateParticipant = {
    _id: ObjectID('6372bff05f6dea0017c8fa79'),
    parentId: '6372bf0a5f6dea0017c8fa4f',
    subject: 'Participant:Pres-Candidate Recorder',
    description: 'A participant in the following discussion:A Candidate Recorder for the undebate: Pres',
    component: {
        component: 'MergeParticipants',
        participant: {
            speaking: [
                'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668464614/621e826899902756d4ba49f5-0-speaking20221114T222327292Z.mp4',
                'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668464617/621e826899902756d4ba49f5-1-speaking20221114T222333662Z.mp4',
                'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668464619/621e826899902756d4ba49f5-2-speaking20221114T222336648Z.mp4',
                'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668464621/621e826899902756d4ba49f5-3-speaking20221114T222338432Z.mp4',
                'https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668464623/621e826899902756d4ba49f5-4-speaking20221114T222341122Z.mp4',
            ],
            name: 'David Candidate F',
            bp_info: {
                office: 'Pres',
                election_date: '12/05/2022',
                candidate_name: 'David Candidate F',
                last_name: 'F',
                unique_id: '6372bee31b92314cf0000003',
                candidate_emails: ['joey@mail.com'],
                party: '',
                election_source: 'EnCiv, Inc',
            },
        },
    },
    userId: '621e826899902756d4ba49f5',
}

const exampleUser = {
    _id: User.ObjectID(USERID),
    firstName: 'Example',
    lastName: 'User',
    email: 'example.user2@example.com',
    password: 'a-really-secure-password',
}

// apis are called with 'this' that has synuser defined
const apisThis = { synuser: {} }
const DONE = {}
describe('Test Async Create Participants', () => {
    let requestedDoc
    let updatedDoc = []
    beforeAll(async () => {
        serverEvents.eNameAdd('ParticipantCreated') // event names need to be added before subscribeElectionInfo subscribes to them
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
            if (!doc.userId) doc.userId = apisThis.synuser.id
            await Iota.create(doc)
        }
        await jestSocketApiSetup(apisThis.synuser.id, [
            ['create-participant', createParticipant],
            ['subscribe-election-info', subscribeElectionInfo],
        ])
        let socketPromiseOk
        const socketPromise = new Promise((ok, ko) => (socketPromiseOk = ok))
        function requestHandler(doc) {
            requestedDoc = doc
            socketPromiseOk()
        }
        function updateHandler(doc) {
            // if the test below for updatedDoc has already been executed, then it will have set updatedDoc to a function
            // if the test has not started, then just give it the value
            if (!updatedDoc[0]) updatedDoc[0] = doc
            else if (typeof updatedDoc[0] === 'function') updatedDoc[0](doc)
            else if (!updatedDoc[1]) updatedDoc[1] = doc
            else if (typeof updatedDoc[1] === 'function') updatedDoc[1](doc)
        }
        socketApiSubscribe('subscribe-election-info', ELECTIONOBJID, requestHandler, updateHandler)
        await socketPromise
    })

    afterAll(async () => {
        window.socket.close()
        MongoModels.disconnect()
    })
    test('createParticipant for moderator should return', done => {
        function callback() {
            done()
        }
        createParticipant.call(apisThis, moderatorRecording, callback)
    })
    test('subscribeElectionInfo update should receive update', done => {
        // this asynchronous update from the socket api may have already happend, or we may need to wait for it.
        function updated(doc) {
            updatedDoc[0] = 'done'
            // invitations is an object of key: doc, where the key could be anything
            // can't create a matcher for that in toMatchInlinSnapshot so pull it out manually
            expect(doc).toMatchInlineSnapshot(`
                Object {
                  "moderator": Object {
                    "submissions": Object {
                      "6372bc285f6dea0017c8fa46": Object {
                        "_id": "6372bc285f6dea0017c8fa46",
                        "component": Object {
                          "component": "MergeParticipants",
                          "participant": Object {
                            "bp_info": Object {
                              "candidate_emails": Array [
                                "joe@mail.org",
                              ],
                              "candidate_name": "David Moderator F",
                              "election_date": "12/05/2022",
                              "election_source": "EnCiv, Inc",
                              "last_name": "F",
                              "office": "Moderator",
                              "party": "",
                              "unique_id": "6372baf15f6dea0017c8fa17",
                            },
                            "listening": "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463655/6303f6bbb2d45f001797bf98-0-listening20221114T220725284Z.mp4",
                            "name": "David Moderator F",
                            "speaking": Array [
                              "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463625/6303f6bbb2d45f001797bf98-0-speaking20221114T220654468Z.mp4",
                              "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463628/6303f6bbb2d45f001797bf98-1-speaking20221114T220704564Z.mp4",
                              "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463631/6303f6bbb2d45f001797bf98-2-speaking20221114T220707669Z.mp4",
                              "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463635/6303f6bbb2d45f001797bf98-3-speaking20221114T220710623Z.mp4",
                              "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463641/6303f6bbb2d45f001797bf98-4-speaking20221114T220714656Z.mp4",
                              "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668463646/6303f6bbb2d45f001797bf98-5-speaking20221114T220720200Z.mp4",
                            ],
                          },
                        },
                        "description": "A participant in the following discussion:A Candidate Recorder for the undebate: Moderator",
                        "parentId": "6372baf15f6dea0017c8fa16",
                        "subject": "Participant:Moderator-Candidate Recorder",
                        "userId": "621e826899902756d4ba49f5",
                      },
                    },
                  },
                }
            `)
            done()
        }
        if (updatedDoc[0]) {
            // I haven't seend it go this way - but it's here if that happens
            updated(updatedDoc[0])
        } else {
            // i've only see it go this way
            updatedDoc[0] = updated
        }
    })
    test('update after candidate records', done => {
        function callback() {}
        createParticipant.call(apisThis, candidateParticipant, callback)
        function updated(doc) {
            updatedDoc[1] = 'done'
            // invitations is an object of key: doc, where the key could be anything
            // can't create a matcher for that in toMatchInlinSnapshot so pull it out manually
            expect(doc).toMatchInlineSnapshot(`
                Object {
                  "candidates": Object {
                    "6372bee31b92314cf0000003": Object {
                      "submissions": Object {
                        "6372bff05f6dea0017c8fa79": Object {
                          "_id": "6372bff05f6dea0017c8fa79",
                          "component": Object {
                            "component": "MergeParticipants",
                            "participant": Object {
                              "bp_info": Object {
                                "candidate_emails": Array [
                                  "joey@mail.com",
                                ],
                                "candidate_name": "David Candidate F",
                                "election_date": "12/05/2022",
                                "election_source": "EnCiv, Inc",
                                "last_name": "F",
                                "office": "Pres",
                                "party": "",
                                "unique_id": "6372bee31b92314cf0000003",
                              },
                              "name": "David Candidate F",
                              "speaking": Array [
                                "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668464614/621e826899902756d4ba49f5-0-speaking20221114T222327292Z.mp4",
                                "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668464617/621e826899902756d4ba49f5-1-speaking20221114T222333662Z.mp4",
                                "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668464619/621e826899902756d4ba49f5-2-speaking20221114T222336648Z.mp4",
                                "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668464621/621e826899902756d4ba49f5-3-speaking20221114T222338432Z.mp4",
                                "https://res.cloudinary.com/dpev0jzip/video/upload/q_auto/v1668464623/621e826899902756d4ba49f5-4-speaking20221114T222341122Z.mp4",
                              ],
                            },
                          },
                          "description": "A participant in the following discussion:A Candidate Recorder for the undebate: Pres",
                          "parentId": "6372bf0a5f6dea0017c8fa4f",
                          "subject": "Participant:Pres-Candidate Recorder",
                          "userId": "621e826899902756d4ba49f5",
                        },
                      },
                    },
                  },
                }
            `)
            done()
        }
        if (updatedDoc[1]) {
            // I haven't seend it go this way - but it's here if that happens
            updated(updatedDoc[1])
        } else {
            // i've only see it go this way
            updatedDoc[1] = updated
        }
    })
})
