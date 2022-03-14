// https://github.com/EnCiv/undebate-ssp/issue/57

import React from 'react'
import Undebate from '../app/components/undebate'

export default {
    title: 'undebate',
    component: Undebate,
    argTypes: {},
}

const Template = (args, context) => {
    const { electionOM } = context
    const { defaultElectionObj, ...otherArgs } = args
    const [electionObj, electionMethods] = electionOM
    useEffect(() => electionMethods.upsert(defaultElectionObj), [defaultElectionObj])
    return <Undebate electionOM={[electionObj, electionOM]} {...args} />
}

export const Default = Template.bind({})
Default.args = {
    defaultElectionObj: {
        undebate: {
            url: 'https://github.com',
        },
    },
}
