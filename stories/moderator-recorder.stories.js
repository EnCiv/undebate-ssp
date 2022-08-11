import component from '../app/components/moderator-recorder'
import makeChapter from './make-chapter'
const mC = makeChapter(component)

export default {
    title: 'Moderator Recorder',
    component,
    argTypes: { electionOM: { type: 'object' } },
}

const viewer = {
    _id: '62d5fc793d4af57ff9a9f4ac',
    component: { component: 'MergeParticipants' },
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
                    'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893719/5d5b74751e3b194174cd9b94-6-speaking20210304T213517927Z.mp4',
                    'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614894042/5d5b74751e3b194174cd9b94-1-speaking20210304T214041075Z.mp4',
                    'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614894043/5d5b74751e3b194174cd9b94-2-speaking20210304T214041861Z.mp4',
                ],
                name: 'David Fridley, EnCiv',
                listening:
                    'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893720/5d5b74751e3b194174cd9b94-0-listening20210304T213518628Z.mp4',
                agenda: [
                    ['What is your favorite color?'],
                    ['Do you have a pet?'],
                    ['Should we try to fix income inequality?'],
                    ['Make your closing - to the audience'],
                    ['Thank you'],
                ],
                timeLimits: ['30', '60', '90'],
            },
        },
    },
    bp_info: {
        electionList: ['/country:us/org:usfg/office:moderator/2022-11-07'],
        office: 'Moderator',
        election_date: '11/07/2022',
        election_source: 'United States Federal Government',
    },
    parentId: '62196fd6b2eff30b70ba36e0',
    path: '/country:us/org:usfg/office:moderator/2022-11-08',
    subject: 'Moderator',
    description: 'A Candidate Conversation for: Moderator',
}

export const Empty = mC({
    defaultElectionObj: {},
})

export const AlmostReady = mC({
    defaultElectionObj: {
        doneLocked: {
            Election: { done: '2022-08-08T20:08:55.165Z' },
            Timeline: { done: '2022-08-08T20:08:56.165Z' },
        },
        timeline: {
            moderatorSubmissionDeadline: {
                0: {
                    date: new Date(Date.now() + 2 * 86400000).toISOString(),
                    sent: true,
                },
            },
        },
    },
})

export const Ready = mC({
    defaultElectionObj: {
        doneLocked: {
            Election: { done: '2022-08-08T20:08:55.165Z' },
            Timeline: { done: '2022-08-08T20:08:56.165Z' },
            Questions: { done: '2022-08-08T20:08:57.165Z' },
            Contact: { done: '2022-08-08T20:08:58.165Z' },
            Script: { done: '2022-08-08T20:08:59.165Z' },
        },
        timeline: {
            moderatorSubmissionDeadline: {
                0: {
                    date: new Date(Date.now() + 2 * 86400000).toISOString(),
                    sent: true,
                },
            },
        },
    },
})

export const ReadyLate = mC({
    defaultElectionObj: {
        doneLocked: {
            Election: { done: '2022-08-08T20:08:55.165Z' },
            Timeline: { done: '2022-08-08T20:08:56.165Z' },
            Questions: { done: '2022-08-08T20:08:57.165Z' },
            Contact: { done: '2022-08-08T20:08:58.165Z' },
            Script: { done: '2022-08-08T20:08:59.165Z' },
        },
        timeline: {
            moderatorSubmissionDeadline: {
                0: {
                    date: new Date(Date.now() - 2 * 86400000).toISOString(),
                    sent: true,
                },
            },
        },
    },
})

export const Recreate = mC({
    defaultElectionObj: {
        doneLocked: {
            Election: { done: '2022-08-08T20:08:55.165Z' },
            Timeline: { done: '2022-08-08T20:08:56.165Z' },
            Questions: { done: '2022-08-08T20:08:57.165Z' },
            Contact: { done: '2022-08-08T20:08:58.165Z' },
            Script: { done: '2022-08-08T20:08:59.165Z' },
        },
        timeline: {
            moderatorSubmissionDeadline: {
                0: {
                    date: new Date(Date.now() + 2 * 86400000).toISOString(),
                    sent: true,
                },
            },
        },
        moderator: {
            viewers: {
                [viewer._id]: { ...viewer },
            },
        },
    },
})

export const Created = mC({
    defaultElectionObj: {
        doneLocked: {
            Election: { done: '2022-08-08T20:08:55.165Z' },
            Timeline: { done: '2022-08-08T20:08:56.165Z' },
            Questions: { done: '2022-08-08T20:08:57.165Z' },
            Contact: { done: '2022-08-08T20:08:58.165Z' },
            Script: { done: '2022-08-08T20:08:59.165Z' },
        },
        timeline: {
            moderatorSubmissionDeadline: {
                0: {
                    date: new Date(Date.now() + 2 * 86400000).toISOString(),
                    sent: true,
                },
            },
        },
        moderator: {
            viewers: {
                ['62f174eca733565c743a065a']: { ...viewer, _id: '62f174eca733565c743a065a' }, // id created after doneLocked Dates
            },
        },
    },
})

export const Sent = mC({
    defaultElectionObj: {
        doneLocked: {
            Election: { done: '2022-08-08T20:08:55.165Z' },
            Timeline: { done: '2022-08-08T20:08:56.165Z' },
            Questions: { done: '2022-08-08T20:08:57.165Z' },
            Contact: { done: '2022-08-08T20:08:58.165Z' },
            Script: { done: '2022-08-08T20:08:59.165Z' },
        },
        timeline: {
            moderatorSubmissionDeadline: {
                0: {
                    date: new Date(Date.now() + 2 * 86400000).toISOString(),
                    sent: true,
                },
            },
        },
        moderator: {
            viewers: {
                ['62f174eca733565c743a065a']: { ...viewer, _id: '62f174eca733565c743a065a' }, // id created after doneLocked Dates
            },
            invitations: {
                '62f175b39de35d5448248e2d': {
                    _id: '62f175b39de35d5448248e2d',
                    sentDate: '2022-08-08T20:45:09.814Z',
                },
            },
        },
    },
})

export const Completed = mC({
    defaultElectionObj: {
        doneLocked: {
            Election: { done: '2022-08-08T20:08:55.165Z' },
            Timeline: { done: '2022-08-08T20:08:56.165Z' },
            Questions: { done: '2022-08-08T20:08:57.165Z' },
            Contact: { done: '2022-08-08T20:08:58.165Z' },
            Script: { done: '2022-08-08T20:08:59.165Z' },
        },
        timeline: {
            moderatorSubmissionDeadline: {
                0: {
                    date: new Date(Date.now() + 2 * 86400000).toISOString(),
                    sent: true,
                },
            },
        },
        moderator: {
            viewers: {
                ['62f174eca733565c743a065a']: { ...viewer, _id: '62f174eca733565c743a065a' }, // id created after doneLocked Dates
            },
            invitations: {
                '62f175b39de35d5448248e2d': {
                    _id: '62f175b39de35d5448248e2d',
                    sentDate: '2022-08-08T20:45:09.814Z',
                },
            },
            submissions: {
                '62f17781aa8b830bf81a7115': {
                    _id: '62f17781aa8b830bf81a7115',
                },
            },
        },
    },
})
