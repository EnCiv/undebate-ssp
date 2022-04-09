// https://github.com/EnCiv/undebate-ssp/issues/20
import React, { useEffect } from 'react'
import UndebateHomepage from '../app/components/undebate-homepage'

export default {
    title: 'Undebate Homepage',
    component: UndebateHomepage,
    argTypes: {},
}

const Template = (args, context) => {
    const { electionOM } = context
    const { defaultElectionObj, ...otherArgs } = args
    const [electionObj, electionMethods] = electionOM
    useEffect(() => electionMethods.upsert(defaultElectionObj), [defaultElectionObj])
    return <UndebateHomepage electionOM={electionOM} />
}

export const Default = Template.bind({})

Default.args = {}
