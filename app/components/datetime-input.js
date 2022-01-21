import { React, useEffect, useState, useReducer } from 'react'
import { createUseStyles } from 'react-jss'

import ElectionTimeInput from './election-time-input'
import ElectionDateInput from './election-date-input'

const DateTimeInput = function (props) {
    const { defaultValue, className, style, onDone = () => {}, electionOM } = props
    const classes = useStyles()

    const [timeObj, setTimeObj] = useState({})
    const [dateObj, setDateObj] = useState({})

    useEffect(() => {
        onDone({ value: { date: dateObj.value, time: timeObj.value }, valid: timeObj.valid && dateObj.valid })
    }, [timeObj, dateObj])

    return (
        <div className={classes.dateTimePair}>
            <ElectionDateInput
                defaultValue={defaultValue.date}
                onDone={({ valid, value }) => setDateObj({ value, valid })}
            />
            <ElectionTimeInput
                defaultValue={defaultValue.time}
                onDone={({ valid, value }) => setTimeObj({ value, valid })}
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
