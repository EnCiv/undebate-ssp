/* eslint-disable no-unused-vars */
// https://github.com/EnCiv/undebate-ssp/issues/48

import React, { useState, useEffect } from 'react'

import Questions from '../app/components/questions'

export default {
    title: 'Questions',
    component: Questions,
    argTypes: {},
}

const Template = (args, context) => {
    const { electionOM } = context
    const { defaultElectionObj, ...otherArgs } = args
    const [electionObj, electionMethods] = electionOM
    useEffect(() => electionMethods.upsert(defaultElectionObj), [defaultElectionObj])
    const [validity, setValidity] = useState({ valid: false, value: {} })
    return (
        <div>
            <Questions electionOM={electionOM} onDone={v => setValidity(v)} {...otherArgs} />
            <p>Is valid: {validity.valid ? 'True' : 'False'}</p>
            <p>Value: {JSON.stringify(validity.value)}</p>
        </div>
    )
}

export const QuestionsTest = Template.bind({})
QuestionsTest.args = {
    defaultElectionObj: {
        _id: '123',
        questions: {
            0: {
                text: '',
            },
        },
    },
}

export const WithData = Template.bind({})
WithData.args = {
    defaultElectionObj: {
        _id: '2349099238402',
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
}
