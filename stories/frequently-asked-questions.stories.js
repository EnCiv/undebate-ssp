import React from 'react'

import FrequentlyAskedQuestions from '../app/components/frequently-asked-questions'

export default {
    title: 'Frequently Asked Questions',
    component: FrequentlyAskedQuestions,
    argTypes: {},
}

const faqs = [
    { question: 'This is the first question?', answer: 'This is the answer to the first question.' },
    { question: 'This is the second question?', answer: 'This is the answer to the second question.' },
    { question: 'This is the third question?', answer: 'This is the answer to the third question.' },
    { question: 'This is the fourth question?', answer: 'This is the answer to the fourth question.' },
    { question: 'This is the fifth question?', answer: 'This is the answer to the fifth question.' },
]

const Template = args => <FrequentlyAskedQuestions {...args} />

export const FrequentlyAskedQuestionsTest = Template.bind({})
FrequentlyAskedQuestionsTest.args = {}
