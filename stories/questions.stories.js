// https://github.com/EnCiv/undebate-ssp/issues/48

import React, { useState } from 'react'

import Questions from '../app/components/questions'

export default {
    title: 'Questions',
    component: Questions,
    argTypes: {},
}

const Template = args => {
    const [validity, setValidity] = useState({ valid: false, value: {} })
    return (
        <div>
            <Questions {...args} onDone={v => setValidity(v)} />
            <p>Is valid: {validity.valid ? 'True' : 'False'}</p>
            <p>Value: {JSON.stringify(validity.value)}</p>
        </div>
    )
}

export const QuestionsTest = Template.bind({})
QuestionsTest.args = {
    electionOM: [
        {
            _id: '123',
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
        },
        { upsert: obj => {}, areQuestionsLocked: () => false },
    ],
}
