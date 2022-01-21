import { React, useEffect, useState, useReducer } from 'react'
import { createUseStyles } from 'react-jss'

import ElectionTimeInput from './election-time-input'
import ElectionDateInput from './election-date-input'

const DateTimeInput = function (props) {
    const { dateTime, className, style, onDone = () => {}, electionOM } = props
    const classes = useStyles()

    const [time, setTime] = useState({})
    const [date, setDate] = useState({})

    useEffect(() => {
        console.log('time', time)
        console.log('date', date)
        onDone({ value: { date, time }, valid: time.valid && date.valid })
    }, [time, date])

    return (
        <div className={classes.dateTimePair}>
            <ElectionDateInput
                defaultValue={dateTime.date}
                onDone={({ valid, value }) => setDate({ date: value, valid })}
            />
            <ElectionTimeInput
                defaultValue={dateTime.time}
                onDone={({ valid, value }) => setTime({ time: value, valid })}
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
