import { React, useEffect, useState, useReducer } from 'react'
import { createUseStyles } from 'react-jss'

import DateTimeInput from './datetime-input'

const TimelinePoint = function (props) {
    const { className, style, electionOM, title, description, dateTimes = [], onDone = () => {}, ref } = props
    const classes = useStyles()

    // setEverything to currentState, then setDateTimePairs(currentState)
    // AKA modify currentState and set with setDateTimePairs
    const currentState = {}
    const [dateTimePairs, setDateTimePairs] = useState({})

    const areAllPairsValid = () => {
        const dateTimeObjs = Object.values(currentState)
        if (!dateTimeObjs.length) return false
        for (let i = 0; i < dateTimeObjs.length; i += 1) {
            if (!dateTimeObjs[i].valid) return false
        }
        return true
    }

    useEffect(() => {
        const valid = areAllPairsValid()
        console.log('valid?', valid)
        console.log('onDone value', Object.values(dateTimePairs))

        onDone({ value: Object.values(dateTimePairs), valid })
    }, [dateTimePairs])

    // updating the state works correctly but the initial state is wrong
    useEffect(() => {
        //setDateTimePairs(currentState)
        console.log(currentState)
        //currentState = {}
    }, [currentState])

    return (
        <div ref={ref}>
            <div>{title}</div>
            <div>{description}</div>
            {dateTimes.map((dateTime, i) => (
                <DateTimeInput
                    defaultValue={dateTime}
                    onDone={({ valid, value }) => {
                        currentState[i] = { valid, value }
                        console.log(i)
                        console.log('currentState', currentState)
                        const isValid = areAllPairsValid()
                        console.log('valid?', isValid)
                        console.log('onDone value', Object.values(dateTimePairs))

                        onDone({ value: Object.values(currentState), valid })
                    }}
                />
            ))}
        </div>
    )
}

const useStyles = createUseStyles(theme => {
    return {}
})

export default TimelinePoint
