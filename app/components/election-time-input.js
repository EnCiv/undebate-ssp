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

const useStyles = createUseStyles({
    electionTimeInput: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '0.625rem',
        background: 'linear-gradient(0deg, rgba(38, 45, 51, 0.2), rgba(38, 45, 51, 0.2)), #FFFFFF',
        padding: '1rem 1.25rem',
        width: '100%',
    },
    input: time => ({
        border: 'none',
        background: 'transparent',
        color: time ? 'black' : 'grey',
        fontSize: '1.125rem',
        width: '100%',
        '&::-webkit-calendar-picker-indicator': {
            display: 'none',
        },
    }),
    clockIcon: {
        height: '1.25rem',
        width: '1.25rem',
    },
})
