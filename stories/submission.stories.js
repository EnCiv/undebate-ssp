// https://github.com/EnCiv/undebate-ssp/issues/51
import React from 'react'
import Submission from '../app/components/submission'

export default {
    title: 'Submission',
    component: Submission,
    argTypes: {},
}

const Template = (args, context) => {
    const { onDone } = context
    return <Submission electionObj={onDone} {...args} />
}

export const Default = Template.bind({})
Default.args = {
    electionObj: {
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

export const ReminderSent = Template.bind({})
ReminderSent.args = {
    electionObj: {
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
    electionObj: {
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
    electionObj: {
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
