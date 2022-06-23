// https://github.com/EnCiv/undebate-ssp/issues/10
import React, { useState, useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import TextareaAutosize from 'react-textarea-autosize'
import moment from 'moment'
import cx from 'classnames'
import SvgVideo from '../svgr/video'
import SvgClock from '../svgr/clock'

export default function ScriptTextInput({
    questionNumber,
    questionName,
    maxWordCount = 600,
    wordsPerMinute = 120,
    defaultValue,
    onDone,
}) {
    const classes = useStyles()
    const inputRef = useRef(null)

    const getWordCount = inputText => {
        if (!inputText) return 0
        return inputText.split(' ').filter(word => {
            return word !== '' && word !== '\n'
        }).length
    }

    const isValid = inputText => {
        const wc = getWordCount(inputText)
        return wc > 0 && wc <= maxWordCount
    }

    const [wordCount, setWordCount] = useState(getWordCount(defaultValue))

    const formatDuration = minutes => {
        const dur = moment.duration(minutes, 'minutes')
        const formatted = moment.utc(dur.asMilliseconds()).format('mm:ss')
        return formatted
    }

    const updateState = event => {
        setWordCount(getWordCount(event.target.value))
    }

    // onDone for the initial render
    useEffect(() => onDone({ valid: isValid(defaultValue), value: defaultValue }), [])
    // onDone for when the defaultValue is changed from top down
    useEffect(() => {
        if (!inputRef.current || inputRef.current.value === defaultValue) return
        inputRef.current.value = defaultValue
        setWordCount(getWordCount(defaultValue))
        onDone({ valid: isValid(defaultValue), value: defaultValue })
    }, [defaultValue]) // initiall report if default value is valid or not

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
                key='area'
                minRows={4}
                className={cx(classes.input, !(wordCount > 0 && wordCount <= maxWordCount) && classes.inputError)}
                onChange={event => {
                    updateState(event)
                }}
                onBlur={event => {
                    updateState(event)
                    onDone({
                        value: event.target.value,
                        valid: isValid(event.target.value),
                    })
                }}
                defaultValue={defaultValue}
                ref={inputRef}
            />
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'sans-serif',
        color: theme.colorSecondary,
    },
    scriptInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '.625rem',
        fontSize: theme.secondaryTextFontSize,
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
        fontSize: theme.secondaryTextFontSize,
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
        opacity: theme.secondaryTextOpacity,
    },
    words: {
        opacity: theme.secondaryTextOpacity,
        marginLeft: '2.5rem',
    },
    input: {
        backgroundColor: theme.backgroundColorComponent,
        padding: theme.inputFieldPadding,
        resize: 'none',
        border: 'none',
        borderRadius: theme.defaultBorderRadius,
        fontFamily: theme.defaultFontFamily,
        fontSize: theme.inputFieldFontSize,
        fontWeight: 'normal',
        lineHeight: '1.875rem',
        margin: '0.375rem 0rem',
    },
    inputError: {
        border: '.3rem solid red',
    },
}))
