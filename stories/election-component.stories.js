// https://github.com/EnCiv/undebate-ssp/issues/44

import React, { useState, useEffect } from 'react'
import ElectionComponent from '../app/components/election-component'

export default {
    title: 'Election Component',
    component: ElectionComponent,
    argTypes: {},
}

const Template = (args, context) => {
    const { electionOM, onDone } = context
    const { delayedUpdate, defaultElectionObj, customMethods = {}, ...otherArgs } = args
    const [electionObj, electionMethods] = electionOM
    Object.assign(electionMethods, customMethods)
    useEffect(() => electionMethods.upsert(defaultElectionObj), [defaultElectionObj])
    const [updated] = useState({ done: false })
    if (!updated.done && delayedUpdate) {
        updated.done = true
        setTimeout(() => {
            electionMethods.upsert(delayedUpdate)
        }, 2000)
    }
    return <ElectionComponent {...otherArgs} electionOM={electionOM} onDone={onDone} />
}

export const NoData = Template.bind({})
NoData.args = {}

export const InitialData = Template.bind({})
InitialData.args = {
    defaultElectionObj: { electionName: 'US General Election', organizationName: 'The United States of America' },
}

export const UpdateAfter2Seconds = Template.bind({})
UpdateAfter2Seconds.args = {
    defaultElectionObj: { electionName: 'US General Election' },
    delayedUpdate: { organizationName: 'The United States of America' },
}
