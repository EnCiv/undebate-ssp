// https://github.com/EnCiv/undebate-ssp/issues/48

import React, { useState } from 'react'

import Questions from '../app/components/questions'

export default {
    title: 'Questions',
    component: Questions,
    argTypes: {},
}

const Template = args => {
    const [validity, setValidity] = useState({ valid: false, value: '' })
    return (
        <div>
            <Questions {...args} onDone={v => setValidity(v)} />
            <p>Is valid: {validity.valid ? 'True' : 'False'}</p>
            <p>Value: {validity.value}</p>
        </div>
    )
}

export const QuestionsTest = Template.bind({})
QuestionsTest.args = {
    electionOM: {
        electionObj: { _id: '123', moderator: { name: '', email: '' } },
        electionMethods: {
            areQuestionsLocked: () => false,
        },
    },
}
