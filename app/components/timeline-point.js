import { React, useEffect, useState, useReducer } from 'react'
import { createUseStyles } from 'react-jss'

import DateTimeInput from './datetime-input'

const TimelinePoint = function (props) {
    const { className, style, electionOM, title, description, dateTimes = [], onDone = () => {}, ref } = props
    const classes = useStyles()

    const [dateTimePairs, setDateTimePairs] = useState({})

    const handleChange = ({ valid, value, id }) => {
        //const dateTimePairsCopy = { ...dateTimePairs }
        //dateTimePairsCopy[id] = { valid, value }

        setDateTimePairs({ ...dateTimePairs, [id]: { valid, value } })
    }

    const areAllPairsValid = () => {
        const dateTimeObjs = Object.values(dateTimePairs)
        if (!dateTimeObjs.length) return false
        for (let i = 0; i < dateTimeObjs.length; i += 1) {
            if (!dateTimeObjs[i].valid) return false
        }
        return true
    }

    useEffect(() => {
        const valid = areAllPairsValid()
        console.log('valid?', valid)
        console.log(dateTimePairs)
        onDone({ value: dateTimePairs, valid })
    }, [dateTimePairs])

    // updating the state works correctly but the initial state is wrong

    return (
        <div ref={ref}>
            <div>{title}</div>
            <div>{description}</div>
            {dateTimes.map((dateTime, i) => (
                <DateTimeInput
                    defaultValue={dateTime}
                    onDone={({ valid, value }) => handleChange({ valid, value, id: i })}
                />
            ))}
        </div>
    )
}

const useStyles = createUseStyles(theme => {
    return {}
})

export default TimelinePoint
