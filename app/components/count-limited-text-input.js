// https://github.com/EnCiv/undebate-ssp/issues/8
import React, { useState, useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import TextareaAutosize from 'react-textarea-autosize'

export default function CountLimitedTextInput({ name = '', maxCount = 0, defaultValue = '', onDone = () => {} }) {
    const classes = useStyles()
    const [length, setLength] = useState(defaultValue.length)

    useEffect(() => {
        handleDone() // if default value changes, inputRef.value will be set to it by the time useEffect is called - need to update the validity
    }, [defaultValue])

    const inputRef = useRef(null)

    // eslint-disable-next-line no-unused-vars
    const handleDone = e => {
        onDone({ valid: isTextValid(inputRef?.current?.value), value: inputRef?.current?.value })
    }

    const isTextValid = txt => txt?.length <= maxCount && txt?.length >= 1

    const handleKeyPress = e => {
        if (e.key === 'Enter') inputRef.current.blur()
    }

    return (
        <div className={classes.container}>
            <div className={classes.scriptInfo}>
                <div className={classes.question}>{name}</div>
                <div className={classes.quantity}>
                    ({length}/{maxCount})
                </div>
            </div>

            <TextareaAutosize
                className={classes.input}
                defaultValue={defaultValue}
                maxLength={maxCount}
                onBlur={handleDone}
                onKeyPress={handleKeyPress}
                onChange={e => {
                    setLength(e.target.value.length)
                }}
                ref={inputRef}
            />
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
