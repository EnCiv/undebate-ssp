// https://github.com/EnCiv/undebate-ssp/issues/51
import React, { useEffect } from 'react'
import Submission from '../app/components/submission'

export default {
    title: 'Submission',
    component: Submission,
    argTypes: { electionOM: { type: 'object' } },
}

const Template = (args, context) => {
    const { electionOM, onDone } = context
    const { defaultElectionObj, customMethods = {}, ...otherArgs } = args
    const [electionObj, electionMethods] = electionOM
    Object.assign(electionMethods, customMethods)
    useEffect(() => electionMethods.upsert(defaultElectionObj), [defaultElectionObj])
    return <Submission electionOM={electionOM} {...args} />
}

export const Default = Template.bind({})
Default.args = {
    defaultElectionObj: {
        moderator: {
            submissions: [],
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
}

export const Empty = Template.bind({})
Empty.args = {
    defaultElectionObj: {},
}

export const ReminderSent = Template.bind({})
ReminderSent.args = {
    defaultElectionObj: {
        moderator: {
            submissions: [],
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
}

export const VideoSubmitted = Template.bind({})
VideoSubmitted.args = {
    defaultElectionObj: {
        moderator: {
            submissions: [
                {
                    _id: 'some_id',
                    url: 'https://cc.enciv.org/ucla-student-association-2021-moderator',
                    date: new Date(Date.now() - 8 * 86400000).toISOString(),
                },
            ],
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
}

export const DeadlineMissed = Template.bind({})
DeadlineMissed.args = {
    defaultElectionObj: {
        moderator: {
            submissions: [
                {
                    _id: 'some_id',
                    url: 'https://cc.enciv.org/ucla-student-association-2021-moderator',
                    date: new Date(Date.now() + 8 * 86400000).toISOString(),
                },
            ],
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
                    sent: false,
                },
            },
        },
    },
}
