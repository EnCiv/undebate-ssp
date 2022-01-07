// https://github.com/EnCiv/undebate-ssp/issues/8
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import TextareaAutosize from 'react-textarea-autosize'

export default function CountLimitedTextInput({ name, maxCount, defaultValue, onDone }) {
    const classes = useStyles()
    const [inputText, setInputText] = useState(defaultValue)

    const updateState = event => {
        setInputText(event.target.value)
    }

    return (
        <div className={classes.container}>
            <div className={classes.scriptInfo}>
                <div className={classes.question}>{name}</div>
                <div className={classes.quantity}>
                    ({inputText.length}/{maxCount})
                </div>
            </div>
            <TextareaAutosize
                className={classes.input}
                onChange={event => {
                    updateState(event)
                }}
                onBlur={() => {
                    onDone({
                        value: inputText,
                        valid: inputText.length <= maxCount && inputText.length >= 1,
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
        fontFamily: 'Poppins',
        color: '#262D33',
    },
    scriptInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '.625rem',
    },
    question: {
        display: 'flex',
        alignItems: 'center',
        fontWeight: '600',
    },
    quantity: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '0.875rem',
        opacity: '70%',
    },
    input: {
        background: 'linear-gradient(0deg, rgba(38, 45, 51, 0.2), rgba(38, 45, 51, 0.2)), #FFFFFF',
        padding: '0.9375rem 1.25rem',
        resize: 'none',
        border: 'none',
        borderRadius: '0.625rem',
        fontSize: '1rem',
        margin: '0.375rem 0rem',
        opacity: '80%',
    },
})
