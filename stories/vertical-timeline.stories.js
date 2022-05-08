// https://github.com/EnCiv/undebate-ssp/issues/13
import React, { useEffect } from 'react'
import VerticalTimeline from '../app/components/vertical-timeline'
import Timeline from '../app/components/timeline'

export default {
    title: 'Vertical Timeline',
    component: VerticalTimeline,
    argTypes: {},
}

const Template = (args, context) => {
    const { electionOM, onDone } = context
    const { defaultElectionObj, customMethods = {}, ...otherArgs } = args
    const [electionObj, electionMethods] = electionOM
    Object.assign(electionMethods, customMethods)
    useEffect(() => electionMethods.upsert(defaultElectionObj), [defaultElectionObj])
    return <Timeline electionOM={[defaultElectionObj, electionMethods]} onDone={onDone} {...args} />
}

export const Default = Template.bind({})

Default.args = {
    defaultElectionObj: {
        _id: '621aef18cdd5d35c69336ad0',
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
