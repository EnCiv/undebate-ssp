// https://github.com/EnCiv/undebate-ssp/issues/45

import React, { useState, useEffect } from 'react'
import Timeline from '../app/components/timeline'

export default {
    title: 'Timeline',
    component: Timeline,
    argTypes: { electionOM: { type: 'object' } },
}

const Template = (args, context) => {
    const { electionOM, onDone } = context
    const { defaultElectionObj, customMethods = {}, ...otherArgs } = args
    const [electionObj, electionMethods] = electionOM
    Object.assign(electionMethods, customMethods)
    useEffect(() => electionMethods.upsert(defaultElectionObj), [defaultElectionObj])
    return <Timeline electionOM={electionOM} onDone={onDone} {...args} />
}

const addDays = (date, days) => {
    return new Date(date.getTime() + days * 86400000)
}

export const TimelineTest = Template.bind({})
TimelineTest.args = {
    defaultElectionObj: {
        id: '621aef18cdd5d35c69336ad0',
        electionName: 'U.S Presidential Election',
        organizationName: 'United States Federal Government',
        undebateDate: addDays(new Date(), 3),
        electionDate: addDays(new Date(), 6),
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
    },
}

export const EmptyTimeline = Template.bind({})
EmptyTimeline.args = {
    defaultElectionObj: {
        id: '621aef18cdd5d35c69336ad0',
        electionName: 'U.S Presidential Election',
        organizationName: 'United States Federal Government',
        timeline: {
            moderatorDeadlineReminderEmails: {},
            moderatorSubmissionDeadline: {},
            candidateDeadlineReminderEmails: {},
            candidateSubmissionDeadline: {},
            moderatorInviteDeadline: {},
        },
    },
}

export const EmptyAll = Template.bind({})
EmptyAll.args = {
    defaultElectionObj: {},
}
