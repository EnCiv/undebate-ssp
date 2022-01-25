import { React, useEffect, useState, useRef } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'

import ElectionTimeInput from './election-time-input'
import ElectionDateInput from './election-date-input'

function DateTimeInput(props) {
    const { defaultValue = '', className, style, onDone = () => {}, electionOM } = props
    const classes = useStyles()

    const [timeObj, setTimeObj] = useState({ value: defaultValue.time, valid: defaultValue.time.valid })
    const [dateObj, setDateObj] = useState({ value: defaultValue.date, valid: null })
    const [init, setInit] = useState(true)
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        if (init && dateObj.valid && timeObj.valid) {
            setInit(false)
            const date = new Date(dateObj.value)
            if (Date.now() > date) {
                setDisabled(true)
                console.log('time has passed')
            }
            console.log(date)
        }
        onDone({ value: { date: dateObj.value, time: timeObj.value }, valid: timeObj.valid && dateObj.valid })
    }, [timeObj, dateObj])

    // only on init if the time is passed, the input must be disabled

    return (
        <div className={cx(className, classes.dateTimePair)} style={style}>
            <ElectionDateInput
                defaultValue={defaultValue.date}
                onDone={({ valid, value }) => setDateObj({ value, valid })}
                disabled={disabled}
            />
            <ElectionTimeInput
                defaultValue={defaultValue.time}
                onDone={({ valid, value }) => setTimeObj({ value, valid })}
                disabled={disabled}
            />
        </div>
    )
}

const useStyles = createUseStyles(theme => {
    return {
        dateTimePair: {
            display: 'flex',
            width: '100%',
            padding: '1rem',
            gap: '3rem',
        },
    }
})

export default DateTimeInput
