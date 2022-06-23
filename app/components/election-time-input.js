// https://github.com/EnCiv/undebate-ssp/issues/6

import React, { useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import ClockSolidSVG from '../svgr/clock-solid'

function ElectionTimeInput(props) {
    const { className, style, disabled = false, defaultValue = '', onDone = () => {} } = props
    const classes = useStyles({ defaultValue, disabled })
    const inputRef = useRef(null)

    // onDone for the initial render
    useEffect(() => onDone({ valid: !!defaultValue, value: defaultValue }), [])
    // onDone for when the defaultValue is changed from top down
    useEffect(() => {
        if (!inputRef.current || inputRef.current.value === defaultValue) return
        inputRef.current.value = defaultValue
        onDone({ valid: !!defaultValue, value: defaultValue })
    }, [defaultValue])

    const handleDone = () => {
        const value = inputRef.current.value
        onDone({ valid: !!value, value })
    }

    return (
        <div className={cx(className, classes.electionTimeInput)} style={style}>
            <input
                key='input'
                className={classes.input}
                type='time'
                defaultValue={defaultValue}
                disabled={disabled}
                onBlur={handleDone}
                onKeyPress={e => {
                    if (e.key === 'Enter') inputRef.current.blur()
                }}
                ref={inputRef}
            />
            <ClockSolidSVG className={classes.clockIcon} key='icon' />
        </div>
    )
}

export default ElectionTimeInput

const useStyles = createUseStyles(theme => ({
    electionTimeInput: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: theme.defaultBorderRadius,
        background: theme.backgroundColorComponent,
        padding: theme.inputFieldPadding,
        width: '100%',
        height: 'fit-content',
    },
    input: ({ time, disabled }) => ({
        border: 'none',
        background: 'transparent',
        color: time && !disabled ? 'black' : 'grey',
        fontSize: theme.inputFieldFontSize,
        fontFamily: theme.defaultFontFamily,
        width: '100%',
        '&::-webkit-calendar-picker-indicator': {
            display: 'none',
        },
        cursor: disabled ? 'not-allowed' : 'pointer',
    }),
    clockIcon: {
        height: theme.iconSize,
        width: theme.iconSize,
    },
}))
