import { React, useEffect, useState, useRef } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'

import ElectionTimeInput from './election-time-input'
import ElectionDateInput from './election-date-input'

function getDateTimeFromDateString(str = '') {
    if (typeof str !== 'string') {
        return ['', '']
    }
    const d = new Date(str)
    const localeStr = d.toLocaleString()
    if (localeStr === 'Invalid Date') {
        const parts = str.split('T')
        const date = parts[0] || ''
        const time = (parts[1] || '').split('Z')[0] || ''
        return [date, time]
    } else {
        const dd = d.toLocaleDateString()
        let mm = d.getMinutes() // becasue toLocaleTimeString() has AM/PM that the input won't accept
        if (mm < 10) mm = '0' + mm
        let hh = d.getHours()
        if (hh < 10) hh = '0' + hh
        return [dd, hh + ':' + mm]
    }
}

function dateTimeStringFromObj(dateTimeObj) {
    if (dateTimeObj.date.valid && dateTimeObj.time.valid) {
        const date = new Date(dateTimeObj.date.value + ', ' + dateTimeObj.time.value)
        if (date.toLocaleString() !== 'Invalid Date') return date.toISOString() // because toISOString thows error if date is not valid
    }
    let str = ''
    if (dateTimeObj.date.value) str += dateTimeObj.date.value
    if (dateTimeObj.time.value) str += 'T' + dateTimeObj.time.value + 'Z'
    return str
}

function DateTimeInput(props) {
    const { defaultValue = '', className, style, onDone = () => {} } = props
    const classes = useStyles()

    const [dateTimeObj] = useState({ time: { valid: false, value: null }, date: { valid: false, value: null } })
    const [prev] = useState({ defaultValue })
    if (prev.defaultValue != defaultValue) {
        prev.defaultValue = defaultValue
        const [date, time] = getDateTimeFromDateString(defaultValue)
        if (dateTimeObj.time.value !== time) {
            dateTimeObj.time.value = time
            dateTimeObj.time.valid = false // the subcomponent to validate
        }
        if (dateTimeObj.date.value !== date) {
            dateTimeObj.date.value = date
            dateTimeObj.date.valid = false // subcomponent to validate
        }
    }
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
    const [date, time] = getDateTimeFromDateString(defaultValue)
    const shouldBeDisabled = () => {
        if (isDateTimePassed() && date === dateTimeObj.date.value && time === dateTimeObj.time.value) {
            return true
        }
        return false
    }

    useEffect(() => {
        if (shouldBeDisabled()) {
            disabledRef.current = true
        }
    }, [dateTimeObj, defaultValue])

    return (
        <div className={cx(className, classes.dateTimePair)} style={style}>
            <ElectionDateInput
                defaultValue={date}
                onDone={({ valid, value }) => {
                    if (dateTimeObj.date.value === value && dateTimeObj.date.valid === valid) return // don't send unnecessary onDones
                    dateTimeObj.date = { value, valid }
                    if (dateTimeObj.time.value === null) return // wait for time to get set by onDone
                    onDone({
                        value: dateTimeStringFromObj(dateTimeObj),
                        valid: dateTimeObj.date.valid && dateTimeObj.time.valid,
                    })
                }}
                disabled={disabledRef.current}
            />
            <ElectionTimeInput
                defaultValue={time}
                onDone={({ valid, value }) => {
                    if (dateTimeObj.time.value === value && dateTimeObj.time.valid === valid) return // don't send unnecessary onDones
                    dateTimeObj.time = { value, valid }
                    if (dateTimeObj.date.value === null) return // wait for date to get set by onDone
                    onDone({
                        value: dateTimeStringFromObj(dateTimeObj),
                        valid: dateTimeObj.date.valid && dateTimeObj.time.valid,
                    })
                }}
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
