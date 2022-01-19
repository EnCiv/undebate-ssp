// https://github.com/EnCiv/undebate-ssp/issues/49

import React, { useState } from 'react'

import { createUseStyles } from 'react-jss'
import Script from '../app/components/script'

export default {
    title: 'Script Page',
    component: Script,
    argTypes: { electionOM: { type: 'object' } },
}

const useStyles = createUseStyles({
    page: { width: '80%', float: 'right' },
    output: { whiteSpace: 'pre-wrap' },
})

const Template = args => {
    const [upsertData, setUpsertData] = useState({})
    const { electionOM } = args
    const [electionObj, electionMethods] = electionOM
    const modifiedArgs = { ...args, electionOM: [electionObj, { ...electionMethods, upsert: setUpsertData }] }
    const classes = useStyles()
    return (
        <div className={classes.page}>
            <Script {...modifiedArgs} className={classes.page} />
            <h3>Upsert Data:</h3>
            <pre className={classes.output}>
                <code>{JSON.stringify(upsertData, null, 2)}</code>
            </pre>
        </div>
    )
}

export const Default = Template.bind({})
Default.args = {
    electionOM: [
        {
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
            script: [],
            moderator: { name: 'Bill Smith' },
        },
        { areQuestionsLocked: () => false },
    ],
}

export const Locked = Template.bind({})
Locked.args = {
    electionOM: [Default.args.electionOM[0], { ...Default.args.electionOM[1], areQuestionsLocked: () => true }],
}

export const Edit = Template.bind({})
Edit.args = {
    electionOM: [
        { ...Default.args.electionOM[0], script: { 0: { text: 'Lorem Ipsum Dolor Amet' } } },
        Default.args.electionOM[1],
    ],
}

export const GivenQA = Template.bind({})
GivenQA.args = {
    electionOM: [
        {
            ...Default.args.electionOM[0],
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
        Default.args.electionOM[1],
    ],
}

export const Error = Template.bind({})
Error.args = {
    electionOM: [
        {
            ...Default.args.electionOM[0],
            script: {
                0: { text: 'Lorem Ipsum Dolor Amet '.repeat(160) },
            },
        },
        Default.args.electionOM[1],
    ],
}
