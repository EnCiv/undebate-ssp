import { React, useEffect, useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'

import ElectionTimeInput from './election-time-input'
import ElectionDateInput from './election-date-input'

function DateTimeInput(props) {
    const { defaultValue, className, style, onDone = () => {}, electionOM } = props
    const classes = useStyles()

    const [timeObj, setTimeObj] = useState()
    const [dateObj, setDateObj] = useState()

    const [disabled, setDisabled] = useState()

    const isDateTimePassed = () => {
        if (!timeObj || !dateObj) return
        const date = new Date(`${dateObj.value} ${timeObj.value}`)
        if (Date.now() > date) {
            return true
        }
        return false
    }

    const shouldBeDisabled = () => {
        if (isDateTimePassed() && defaultValue.date === dateObj.value && defaultValue.time === timeObj.value) {
            return true
        }
        return false
    }
    useEffect(() => {
        if (shouldBeDisabled()) {
            setDisabled(true)
        }

        const isValid = !isDateTimePassed() && dateObj?.valid && timeObj?.valid

        onDone({ value: { date: dateObj?.value, time: timeObj?.value }, valid: isValid })
    }, [timeObj, dateObj])

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
