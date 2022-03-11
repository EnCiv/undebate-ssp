import React, { useEffect, useRef, useState } from 'react'

const faqs = [
    {
        question: 'This is the first question?',
        answer: 'This is the answer to the first question.',
        displayed: false,
    },
    {
        question: 'This is the second question?',
        answer: 'This is the answer to the second question.',
        displayed: false,
    },
    {
        question: 'This is the third question?',
        answer: 'This is the answer to the third question.',
        displayed: false,
    },
    {
        question: 'This is the fourth question?',
        answer: 'This is the answer to the fourth question.',
        displayed: false,
    },
    {
        question: 'This is the fifth question?',
        answer: 'This is the answer to the fifth question.',
        displayed: false,
    },
]

export default function FrequentlyAskedQuestions() {
    const [active, setActive] = useState(false)

    const toggleAnswer = () => {
        setActive(false)
    }

    return (
        <>
            <h3>Frequently Asked Questions</h3>
            {faqs.map(value => (
                <div>
                    {console.log(active)}
                    <div>
                        <div>
                            <p
                                key={value.question}
                                onClick={() => {
                                    active === value.question ? setActive(false) : setActive(value.question)
                                }}
                            >
                                {value.question}
                            </p>
                            <hr></hr>
                        </div>
                        <p>{active === value.question && value.answer}</p>
                    </div>
                </div>
            ))}
        </>
    )
}
