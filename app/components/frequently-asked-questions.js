import React, { useRef, useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import Opener from './opener'

export default function FrequentlyAskedQuestions(props) {
    const [active, setActive] = useState(false)
    const { className, style, faqs } = props
    const classes = useStyles()

    return (
        <div className={className} style={style}>
            <h3 className={classes.headerStyle}>Frequently Asked Questions</h3>
            {faqs &&
                faqs.map(value => (
                    <div>
                        <div
                            className={classes.questionLine}
                            key={value.question}
                            onClick={() => {
                                active === value.question ? setActive(false) : setActive(value.question)
                            }}
                        >
                            <p className={classes.questionStyle}>{value.question}</p>
                            {active === value.question ? (
                                <p className={classes.caret}>^</p>
                            ) : (
                                <p className={classes.caret}>v</p>
                            )}
                        </div>
                        <Opener classes={classes} answer={value.answer} active={active === value.question} />
                        <hr></hr>
                    </div>
                ))}
        </div>
    )
}

const useStyles = createUseStyles({
    caret: { display: 'inline-block', float: 'right', paddingRight: '2rem', cursor: 'pointer' },

    headerStyle: { textAlign: 'center', paddingTop: '1rem', fontSize: '2rem' },

    answerStyle: {
        whiteSpace: 'pre-wrap',
        paddingRight: '2rem',
        fontWeight: '500',
        fontSize: '1.5rem',
        // used px here to maintain a minimum distance from the bottom of the page for ease of visibility
        paddingBottom: 'max(1rem, .2rem)',
        color: 'rgba(38, 45, 51, 0.5)',
        // transition: 'all, .5s, ease-in-out, .1s',
    },

    questionLine: { display: 'inline' },

    questionStyle: {
        fontWeight: '300',
        display: 'inline-block',
        cursor: 'pointer',
        fontSize: '1.5rem',
        color: 'rgba(38, 45, 51, 0.5)',
    },
})
