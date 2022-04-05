// https://github.com/EnCiv/undebate-ssp/issues/6

import React, { useEffect, useRef, useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import ClockSolidSVG from '../svgr/clock-solid'

function ElectionTimeInput(props) {
    const { className, style, disabled = false, defaultValue = '', onDone = () => {} } = props
    const classes = useStyles({ defaultValue, disabled })
    const inputRef = useRef(null)

    useEffect(() => {
        handleDone()
    }, [defaultValue])

    const getTime = () => {
        return inputRef.current.value
    }

    const handleDone = () => {
        const time = getTime()
        onDone({ valid: !!time, value: time })
    }

    return (
        <div className={cx(className, classes.electionTimeInput)} style={style}>
            <input
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
            <ClockSolidSVG className={classes.clockIcon} />
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
