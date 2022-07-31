// https://github.com/EnCiv/undebate-ssp/issues/51
import React, { useEffect } from 'react'
import component from '../app/components/submission'
import makeChapter from './make-chapter'
const mC = makeChapter(component)

export default {
    title: 'Submission',
    component,
    argTypes: { electionOM: { type: 'object' } },
}

export const Default = mC({
    defaultElectionObj: {
        moderator: {
            submissions: {},
        },
        timeline: {
            moderatorDeadlineReminderEmails: {
                0: {
                    date: '2022-01-07T22:09:32.952Z',
                    sent: false,
                },
            },
            moderatorSubmissionDeadline: {
                0: {
                    date: new Date(Date.now() + 12 * 86400000).toISOString(),
                    sent: true,
                },
            },
        },
    },
})

export const Empty = mC({
    defaultElectionObj: {},
})

export const ReminderSent = mC({
    defaultElectionObj: {
        moderator: {
            submissions: {},
        },
        timeline: {
            moderatorDeadlineReminderEmails: {
                0: {
                    date: new Date(Date.now() + 2 * 86400000).toISOString(),
                    sent: true,
                },
            },
            moderatorSubmissionDeadline: {
                0: {
                    date: new Date(Date.now() + 2 * 86400000).toISOString(),
                    sent: true,
                },
            },
        },
    },
})

export const VideoSubmitted = mC({
    defaultElectionObj: {
        moderator: {
            submissions: {
                '62e4b86056f305685c9f27d2': {
                    _id: '62e4b86056f305685c9f27d2',
                    parentId: '62e4b8ad044d8548346010f1',
                },
            },
            viewers: {
                '62e4b8ad044d8548346010f1': {
                    _id: '62e4b8ad044d8548346010f1',
                    path: '/schoolboard-undebate',
                },
            },
        },
        timeline: {
            moderatorDeadlineReminderEmails: {
                0: {
                    date: new Date(Date.now() + 2 * 86400000).toISOString(),
                    sent: true,
                },
            },
            moderatorSubmissionDeadline: {
                0: {
                    date: new Date(Date.now() + 2 * 86400000).toISOString(),
                    sent: true,
                },
            },
        },
    },
})

export const DeadlineMissed = mC({
    defaultElectionObj: {
        moderator: {},
        timeline: {
            moderatorDeadlineReminderEmails: {
                0: {
                    date: new Date(Date.now() - 2 * 86400000).toISOString(),
                    sent: true,
                },
            },
            moderatorSubmissionDeadline: {
                0: {
                    date: new Date(Date.now() - 2 * 86400000).toISOString(),
                    sent: false,
                },
            },
        },
    },
})
