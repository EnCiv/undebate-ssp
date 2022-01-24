// https://github.com/EnCiv/undebate-ssp/issues/6

import React, { useEffect, useRef, useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import ClockSolidSVG from '../svgr/clock-solid'

function ElectionTimeInput(props) {
    const { className, style, defaultValue = '', onDone = () => {} } = props
    const [time, setTime] = useState(defaultValue)
    const classes = useStyles(time)
    const inputRef = useRef(null)

    useEffect(() => {
        handleDone(time)
    }, [])

    const handleChange = e => {
        setTime(e.target.value)
    }

    const handleDone = () => {
        onDone({ valid: !!time, value: time })
    }

    return (
        <div className={cx(className, classes.electionTimeInput)} style={style}>
            <input
                className={classes.input}
                type='time'
                defaultValue={time}
                onBlur={handleDone}
                onChange={handleChange}
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
    },
    input: time => ({
        border: 'none',
        background: 'transparent',
        color: time ? 'black' : 'grey',
        fontSize: theme.inputFieldFontSize,
        fontFamily: theme.defaultFontFamily,
        width: '100%',
        '&::-webkit-calendar-picker-indicator': {
            display: 'none',
        },
    }),
    clockIcon: {
        height: theme.iconSize,
        width: theme.iconSize,
    },
}))
