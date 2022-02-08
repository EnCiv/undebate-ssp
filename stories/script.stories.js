// https://github.com/EnCiv/undebate-ssp/issues/49

import React, { useEffect } from 'react'

import Script from '../app/components/script'

export default {
    title: 'Script Page',
    component: Script,
    argTypes: { electionOM: { type: 'object' } },
}

const Template = (args, context) => {
    const { electionOM } = context
    const { defaultElectionObj, customMethods = {}, ...otherArgs } = args
    const [electionObj, electionMethods] = electionOM
    Object.assign(electionMethods, customMethods)
    useEffect(() => electionMethods.upsert(defaultElectionObj), [defaultElectionObj])
    return <Script {...otherArgs} electionOM={electionOM} />
}

export const Default = Template.bind({})
Default.args = {
    defaultElectionObj: {
        questions: {
            0: {
                text: 'What is your favorite color?',
                time: '30',
            },
            1: {
                text: 'Do you have a pet?',
                time: '60',
            },
            2: {
                text: 'Should we try to fix income inequality?',
                time: '90',
            },
        },
        script: {},
        moderator: { name: 'Bill Smith' },
    },
}

export const Empty = Template.bind({})

export const Locked = Template.bind({})
Locked.args = {
    defaultElectionObj: Default.args.defaultElectionObj,
    customMethods: { areQuestionsLocked: () => true },
}

export const Edit = Template.bind({})
Edit.args = {
    defaultElectionObj: { ...Default.args.defaultElectionObj, script: { 0: { text: 'Lorem Ipsum Dolor Amet' } } },
}

export const GivenQA = Template.bind({})
GivenQA.args = {
    defaultElectionObj: {
        ...Default.args.defaultElectionObj,
        questions: {
            0: { text: 'Lorem Ipsum?' },
            1: { text: 'Dolor Amet?' },
        },
        script: {
            0: { text: 'Lorem Ipsum Dolor Amet' },
            1: { text: 'Lorem Ipsum Dolor Amet' },
            2: { text: 'Consectetur adipiscing elit' },
            3: { text: 'Sed do eiusmod tempor' },
        },
    },
}

export const Error = Template.bind({})
Error.args = {
    defaultElectionObj: {
        ...Default.args.defaultElectionObj,
        script: {
            0: { text: 'Lorem Ipsum Dolor Amet '.repeat(160) },
        },
    },
}
