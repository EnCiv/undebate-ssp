// https://github.com/EnCiv/undebate-ssp/issues/45

import React, { useState, useEffect } from 'react'
import Timeline from '../app/components/timeline'

export default {
    title: 'Timeline',
    component: Timeline,
    argTypes: { electionOM: { type: 'object' } },
}

const Template = (args, context) => {
    const { defaultElectionObj, ...otherArgs } = args
    const submit = () => {
        console.log('Submitted!')
    }
    return (
        <div>
            <Timeline electionOM={[defaultElectionObj]} onDone={submit} {...args} />
        </div>
    )
}

export const TimelineTest = Template.bind({})
TimelineTest.args = {
    defaultElectionObj: {
        elections: [
            {
                _id: '621aef18cdd5d35c69336ad0',
                electionName: 'U.S Presidential Election',
                organizationName: 'United States Federal Government',
                electionDate: '2022-11-07T23:59:59.999Z',
            },
        ],
    },
}
