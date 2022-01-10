// https://github.com/EnCiv/undebate-ssp/issues/49

import React from 'react'

import { createUseStyles } from 'react-jss'
import Script from '../app/components/script'

export default {
    title: 'Script Page',
    component: Script,
    argTypes: { electionOM: { type: 'object' } },
}

const useStyles = createUseStyles({
    page: { width: '80%', float: 'right' },
})

const Template = args => {
    return <Script {...args} className={useStyles().page} />
}

export const Default = Template.bind({})
Default.args = {
    electionOM: [
        {
            questions: [
                {
                    number: 1,
                    text: 'What is your name and background?',
                },
                {
                    number: 2,
                    text: 'What is your favorite color?',
                },
                {
                    number: 3,
                    text: 'Do you have a pet?',
                },
                {
                    number: 4,
                    text: 'Should we try to fix income inequality?',
                },
            ],
            moderator: {
                name: 'Bill Smith',
            },
            script: [],
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
        { ...Default.args.electionOM[0], script: [{ number: 1, text: 'Lorem Ipsum Dolor Amet' }] },
        Default.args.electionOM[1],
    ],
}

export const GivenQA = Template.bind({})
GivenQA.args = {
    electionOM: [
        {
            ...Default.args.electionOM[0],
            questions: [
                { number: 1, text: 'Lorem Ipsum?' },
                { number: 2, text: 'Dolor Amet?' },
            ],
            script: [
                { number: 1, text: 'Lorem Ipsum Dolor Amet' },
                { number: 2, text: 'Consectetur adipiscing elit' },
                { number: 3, text: 'Sed do eiusmod tempor' },
            ],
        },
        Default.args.electionOM[1],
    ],
}
