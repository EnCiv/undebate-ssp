import { React, useEffect, useState, useRef } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'

import ElectionTimeInput from './election-time-input'
import ElectionDateInput from './election-date-input'

function DateTimeInput(props) {
    const { defaultValue = {}, className, style, onDone = () => {}, electionOM } = props
    const classes = useStyles()

    const [dateTimeObj] = useState({ time: { valid: false, value: '' }, date: { valid: false, value: '' } })
    const disabledRef = useRef(false)

    const isDateTimePassed = () => {
        const date = new Date(`${dateTimeObj.date.value} ${dateTimeObj.time.value}`)
        if (Date.now() > date) {
            return true
        }
        return false
    }

    // Checks whether dateObj/timeObj states are: 1. valid,
    // 2. were set by the defaultValue, 3. are in the past
    const shouldBeDisabled = () => {
        if (
            isDateTimePassed() &&
            defaultValue.date === dateTimeObj.date.value &&
            defaultValue.time === dateTimeObj.time.value
        ) {
            return true
        }
        return false
    }

    useEffect(() => {
        if (!dateTimeObj.date || !dateTimeObj.time) return

        if (shouldBeDisabled()) {
            disabledRef.current = true
        }

        const isValid = dateTimeObj.date.valid && dateTimeObj.time.valid
        onDone({ value: { date: dateTimeObj.date.value, time: dateTimeObj.time.value }, valid: isValid })
    }, [dateTimeObj, defaultValue])

    return (
        <div className={cx(className, classes.dateTimePair)} style={style}>
            <ElectionDateInput
                defaultValue={defaultValue.date}
                onDone={({ valid, value }) => (dateTimeObj.date = { value, valid })}
                disabled={disabledRef.current}
            />
            <ElectionTimeInput
                defaultValue={defaultValue.time}
                onDone={({ valid, value }) => (dateTimeObj.time = { value, valid })}
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
