// https://github.com/EnCiv/undebate-ssp/issues/8
import React, { useState, useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import TextareaAutosize from 'react-textarea-autosize'
import cx from 'classnames'

export default function CountLimitedTextInput({
    name = '',
    maxCount = 0,
    defaultValue = '',
    onDone = () => {},
    className,
    style,
    warn,
    disabled,
}) {
    const classes = useStyles()
    const [length, setLength] = useState(defaultValue.length)

    const inputRef = useRef(null)

    useEffect(() => onDone({ valid: isTextValid(defaultValue), value: defaultValue }), [])
    useEffect(() => {
        if (!inputRef.current || inputRef.current.value === defaultValue) return
        inputRef.current.value = defaultValue
        setLength(defaultValue.length)
        onDone({ valid: isTextValid(defaultValue), value: defaultValue })
    }, [defaultValue])

    // eslint-disable-next-line no-unused-vars
    const onBlur = e => {
        onDone({ valid: isTextValid(inputRef?.current?.value), value: inputRef?.current?.value })
    }

    const isTextValid = txt => txt?.length <= maxCount && txt?.length >= 1

    const handleKeyPress = e => {
        if (e.key === 'Enter') inputRef.current.blur()
    }

    return (
        <div className={cx(className, classes.container)} style={style}>
            <div className={classes.scriptInfo} key='header'>
                <div className={classes.question}>{name}</div>
                <div className={classes.quantity}>
                    ({length}/{maxCount})
                </div>
            </div>
            <TextareaAutosize
                key='area'
                className={cx(classes.input, warn && classes.warn)}
                defaultValue={defaultValue}
                maxLength={maxCount}
                onBlur={onBlur}
                onKeyPress={handleKeyPress}
                onChange={e => {
                    setLength(e.target.value.length)
                }}
                ref={inputRef}
                disabled={disabled}
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
        padding: theme.defaultBorderRadius,
        paddingTop: 0,
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
    },
    warn: {
        backgroundColor: theme.backgroundColorWarning,
    },
}))
