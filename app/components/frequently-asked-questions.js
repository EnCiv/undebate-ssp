import React, { useEffect, useRef, useState } from 'react'

const faqs = [
    {
        question: 'This is the first question?',
        answer: 'This is the answer to the first question.',
    },
    {
        question: 'This is the second question?',
        answer: 'This is the answer to the second question.',
    },
    {
        question: 'This is the third question?',
        answer: 'This is the answer to the third question. The answer to this question is very long. There was a lot to talk about. It takes up a lot of space on the page. I wonder how this will look. It will probably look pretty good by the time it is finished but lets give it a nice start. What do you say?',
    },
    {
        question: 'This is the fourth question?',
        answer: 'This is the answer to the fourth question.',
    },
    {
        question: 'This is the fifth question?',
        answer: 'This is the answer to the fifth question.',
    },
]
const headerStyle = { textAlign: 'center', paddingTop: '1rem' }

const answerStyle = {
    paddingLeft: '1rem',
    paddingRight: '2rem',
    fontWeight: '500',
    paddingBottom: 'max(15px, .2rem)',
    transition: 'all, .5s, ease-in-out, .5s',
    maxHeight: 'max-content',
}
const answerHidden = {
    fontSize: '0px',
    paddingLeft: '1rem',
    paddingRight: '2rem',
    maxHeight: 'max-content',
    transition: 'all, .5s, ease-in-out, 0s',
}
const questionLine = { display: 'inline' }

const questionStyle = { paddingLeft: '1rem', fontWeight: '300', display: 'inline-block' }

const Caret = { display: 'inline-block', float: 'right', paddingRight: '2rem' }

export default function FrequentlyAskedQuestions() {
    const [active, setActive] = useState(false)

    return (
        <>
            <h3 style={headerStyle}>Frequently Asked Questions</h3>
            {faqs.map(value => (
                <div>
                    <div
                        style={questionLine}
                        key={value.question}
                        onClick={() => {
                            active === value.question ? setActive(false) : setActive(value.question)
                        }}
                    >
                        <p style={questionStyle}>{value.question}</p>
                        {active === value.question ? <p style={Caret}>^</p> : <p style={Caret}>v</p>}
                        <hr></hr>
                    </div>
                    <p style={active === value.question ? answerStyle : answerHidden}>
                        {active === value.question ? value.answer : ' '}
                    </p>
                </div>
            ))}
        </>
    )
}
