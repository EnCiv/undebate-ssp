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
            <div className={classes.scriptInfo} key='header'>
                <div className={classes.question}>{name}</div>
                <div className={classes.quantity}>
                    ({length}/{maxCount})
                </div>
            </div>

            <TextareaAutosize
                key='area'
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

const useStyles = createUseStyles(theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        fontFamily: theme.defaultFontFamily,
        color: theme.colorSecondary,
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
        fontSize: theme.secondaryTextFontSize,
        opacity: theme.secondaryTextOpacity,
    },
    input: {
        background: theme.backgroundColorComponent,
        padding: theme.inputFieldPadding,
        fontFamily: theme.defaultFontFamily,
        resize: 'none',
        border: 'none',
        borderRadius: theme.defaultBorderRadius,
        fontSize: '1rem',
        margin: '0.375rem 0rem',
    },
}))
