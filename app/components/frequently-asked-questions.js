import React, { useRef, useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import Opener from './opener'

export default function FrequentlyAskedQuestions(props) {
    const [active, setActive] = useState(false)
    const { className, style, faqs } = props
    const classes = useStyles()

    return (
        <div>
            <h3 className={cx(className, classes.headerStyle)} style={style}>
                Frequently Asked Questions
            </h3>
            {faqs &&
                faqs.map(value => (
                    <div>
                        <div
                            className={cx(className, classes.questionLine)}
                            style={style}
                            key={value.question}
                            onClick={() => {
                                active === value.question ? setActive(false) : setActive(value.question)
                            }}
                        >
                            <p className={cx(className, classes.questionStyle)} style={style}>
                                {value.question}
                            </p>
                            {active === value.question ? (
                                <p className={cx(className, classes.caret)} style={style}>
                                    ^
                                </p>
                            ) : (
                                <p className={cx(className, classes.caret)} style={style}>
                                    v
                                </p>
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

    headerStyle: { textAlign: 'center', paddingTop: '1rem' },

    answerStyle: {
        whiteSpace: 'pre-wrap',
        paddingLeft: '1rem',
        paddingRight: '2rem',
        fontWeight: '500',
        // used px here to maintain a minimum distance from the bottom of the page for ease of visibility
        paddingBottom: 'max(1rem, .2rem)',
        // transition: 'all, .5s, ease-in-out, .1s',
    },

    questionLine: { display: 'inline' },

    questionStyle: { paddingLeft: '1rem', fontWeight: '300', display: 'inline-block', cursor: 'pointer' },
})
