import { React, useEffect, useState, useRef } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'

import ElectionTimeInput from './election-time-input'
import ElectionDateInput from './election-date-input'
import moment from 'moment'

function DateTimeInput(props) {
    const { defaultValue, className, style, onDone = () => {}, electionOM } = props
    const classes = useStyles()

    const [timeObj, setTimeObj] = useState()
    const [dateObj, setDateObj] = useState()
    const disabledRef = useRef(false)

    const isDateTimePassed = () => {
        const date = new Date(`${dateObj.value} ${timeObj.value}`)
        if (Date.now() > date) {
            return true
        }
        return false
    }

    // Checks whether dateObj/timeObj states are: 1. valid,
    // 2. were set by the defaultValue, 3. are in the past
    const shouldBeDisabled = () => {
        if (isDateTimePassed() && defaultValue.date === dateObj.value && defaultValue.time === timeObj.value) {
            return true
        }
        return false
    }

    const getTime = dateString => {
        return new Date(dateString).toLocaleTimeString()
    }

    useEffect(() => {
        if (!timeObj || !dateObj) return

        if (shouldBeDisabled()) {
            disabledRef.current = true
        }

        const isValid = dateObj.valid && timeObj.valid
        const newDate = moment(`${dateObj.value} ${timeObj.value}`, 'MM/DD/YYYY HH:mm:ss').toISOString()
        onDone({ value: newDate, valid: isValid })
    }, [timeObj, dateObj, defaultValue])

    return (
        <div className={cx(className, classes.dateTimePair)} style={style}>
            <ElectionDateInput
                defaultValue={new Date(defaultValue)}
                onDone={({ valid, value }) => setDateObj({ value, valid })}
                disabled={disabledRef.current}
            />
            <ElectionTimeInput
                defaultValue={getTime(defaultValue)}
                onDone={({ valid, value }) => setTimeObj({ value, valid })}
                disabled={disabledRef.current}
            />
        </div>
    )
}

const useStyles = createUseStyles({
    dateTimePair: {
        display: 'flex',
        width: '100%',
        gap: '3rem',
    },
})

export default DateTimeInput
