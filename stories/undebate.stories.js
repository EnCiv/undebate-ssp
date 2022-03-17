// https://github.com/EnCiv/undebate-ssp/issue/57

import React, { useEffect } from 'react'
import Undebate from '../app/components/undebate'

export default {
    title: 'Undebate',
    component: Undebate,
    argTypes: {},
}

const Template = (args, context) => {
    const { electionOM } = context
    const { defaultElectionObj, ...otherArgs } = args
    const [electionObj, electionMethods] = electionOM
    useEffect(() => electionMethods.upsert(defaultElectionObj), [defaultElectionObj])
    return <Undebate style={{ height: '50rem' }} electionOM={[defaultElectionObj, electionOM]} {...args} />
}

export const Default = Template.bind({})
Default.args = {
    defaultElectionObj: {
        undebate: {
            url: 'https://github.com',
        },
    },
}

export const Empty = Template.bind({})
Empty.args = {}

export const NoUrl = Template.bind({})
NoUrl.args = {
    defaultElectionObj: {
        undebate: {},
    },
}
