// https://github.com/EnCiv/undebate-ssp/issues/9

import React, { useRef, useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import IsEmail from 'isemail'
import isUrl from 'is-url'

function ElectionTextInput(props) {
    const classes = useStyles()
    const { className, style, name = '', defaultValue = '', type = 'text', onDone = () => {} } = props

    const inputRef = useRef(null)

    const handleKeyPress = e => {
        if (e.key === 'Enter') inputRef.current.blur()
    }

    // eslint-disable-next-line no-unused-vars
    const handleDone = e => {
        onDone({ valid: isTextValid(inputRef.current.value), value: inputRef.current.value })
    }

    // call onDone after:
    // initial render - so parent knows if it's valid or not
    // onBlur so parent gets updated data
    // when defaultValue changes so parent knows if it's valid - this happens when data is changed by external/asynchronous source
    const [sideEffects] = useState([]) // never set sideEffects
    useEffect(() => {
        while (sideEffects.length) sideEffects.shift()()
    })
    const [prev] = useState({})
    if (prev.defaultValue !== defaultValue) {
        prev.defaultValue = defaultValue
        if (defaultValue !== inputRef.current?.value) {
            if (inputRef.current) inputRef.current.value = defaultValue // input doesnt change value on rerender when defaultValue changes
            sideEffects.push(() => onDone({ valid: isTextValid(defaultValue), value: defaultValue }))
        }
    }

    const checkEmail = email => IsEmail.validate(email, { minDomainAtoms: 2 })

    const isTextValid = txt => {
        // minDomainAtoms opt force requires a two part domain name
        // ex: user@example.com
        // this can be removed to accept a one part domain name if needed
        // ex: user@example
        if (type === 'url') return !!txt && isUrl(txt)
        if (type === 'email') return !!txt && checkEmail(txt)
        else return !!txt
    }

    return (
        <div className={cx(className, classes.electionTextInput)} style={style}>
            <label htmlFor={name} className={classes.label}>
                {name}
            </label>
            <input
                key={`${name}input`}
                type={type}
                className={classes.input}
                defaultValue={defaultValue}
                name={name}
                onBlur={handleDone}
                onKeyPress={handleKeyPress}
                ref={inputRef}
            />
            {type === 'email' && inputRef?.current?.value && !checkEmail(inputRef.current.value) && (
                <span className={classes.validity}>name@example.com format expected</span>
            )}
            {type === 'url' && inputRef?.current?.value && !isUrl(inputRef.current.value) && (
                <span className={classes.validity}>https://domain.com/path format expected</span>
            )}
        </div>
    )
}

export default ElectionTextInput

const useStyles = createUseStyles(theme => ({
    electionTextInput: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0.625rem',
    },
    label: {
        margin: '0 0.625rem',
        fontWeight: '600',
    },
    input: {
        borderRadius: theme.defaultBorderRadius,
        background: theme.backgroundColorComponent,
        padding: theme.inputFieldPadding,
        border: 'none',
        fontSize: theme.inputFieldFontSize,
        width: '100%',
        boxSizing: 'border-box',
        lineHeight: '1.5rem',
    },
    validity: {
        margin: '0',
        padding: '0',
        color: 'red',
        fontSize: '.85rem',
    },
}))
