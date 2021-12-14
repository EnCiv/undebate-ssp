'use-strict'

// https://github.com/EnCiv/undebate-ssp/issues/10

import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import TextareaAutosize from 'react-textarea-autosize'
import moment from 'moment'
import SvgVideo from '../svgr/video'
import SvgClock from '../svgr/clock'

export const ScriptTextInput = ({
    questionNumber,
    questionName,
    maxWordCount,
    wordsPerMinute,
    defaultValue,
    onDone,
}) => {
    const classes = useStyles()
    const [inputText, setInputText] = useState(defaultValue)

    const getWordCount = () => inputText.split(' ').filter(word => word != '' && word != '\n').length

    const [wordCount, setWordCount] = useState(getWordCount())

    const formatDuration = minutes => {
        const dur = moment.duration(minutes, 'minutes')
        const formatted = moment.utc(dur.asMilliseconds()).format('mm:ss')
        return formatted
    }

    const updateState = event => {
        setInputText(event.target.value)
        setWordCount(getWordCount())
    }

    return (
        <div className={classes.container}>
            <div className={classes.scriptInfo}>
                <div className={classes.question}>
                    <SvgVideo />
                    <h5 className={classes.questionNum}>{questionNumber}</h5>
                    <h5 className={classes.questionName}>{questionName}</h5>
                </div>
                <div className={classes.quantity}>
                    <div className={classes.time}>
                        <span className={classes.duration}>{formatDuration(wordCount / wordsPerMinute)}</span>
                        <SvgClock />
                    </div>
                    <div className={classes.words}>
                        <span>
                            {wordCount}/{maxWordCount}
                        </span>
                    </div>
                </div>
            </div>
            <TextareaAutosize
                minRows={4}
                className={classes.input}
                onChange={event => {
                    updateState(event)
                }}
                onBlur={event => {
                    updateState(event)
                    const wc = getWordCount()
                    onDone({
                        value: inputText,
                        valid: wc <= maxWordCount && wc >= 1,
                    })
                }}
            >
                {inputText}
            </TextareaAutosize>
        </div>
    )
}

const useStyles = createUseStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'sans-serif',
        color: '#262D33',
    },
    scriptInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '.625rem',
        fontSize: '0.875rem',
    },
    question: {
        display: 'flex',
        alignItems: 'center',
        gap: '.4rem',
    },
    questionNum: {
        margin: 0,
    },
    questionName: {
        margin: '0rem 0rem 0rem .4rem',
        fontSize: '0.875rem',
    },
    quantity: {
        display: 'flex',
        alignItems: 'center',
    },
    time: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.438rem',
    },
    duration: {
        opacity: '70%',
    },
    words: {
        opacity: '70%',
        marginLeft: '2.5rem',
    },
    input: {
        opacity: '70%',
        background: 'linear-gradient(0deg, rgba(38, 45, 51, 0.2), rgba(38, 45, 51, 0.2)), #FFFFFF',
        padding: '0.938rem',
        resize: 'none',
        border: 'none',
        borderRadius: '0.438rem',
        fontSize: '1rem',
        fontWeight: '500',
        lineHeight: '1.875rem',
        margin: '0.375rem 0rem',
    },
})
