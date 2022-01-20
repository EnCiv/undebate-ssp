import { React, useEffect, useReducer } from 'react'

import ElectionTimeInput from './election-time-input'
import ElectionDateInput from './election-date-input'

const TimelinePoint = function (props) {
    const { className, style, electionOM, title, description, dateTimes = [], onDone = () => {}, ref } = props

    // onDone is if we receive 'dones' from all input fields
    // 1. Keep track of the number of 'dones' received as state, each time a new 'done' is received, check if we have all those necessary
    // 2. State could just be the current date times and their validity and we could just go through all of them to check if they are valid
    const reducer = (state, action) => {
        console.log('action: ', action)
        switch (action.type) {
            case 'valid':
                const entry = { [`dateTime${action.payload.id}`]: action.payload.value }
                return { ...state, ...entry }
            case 'invalid':
                // if it has become invalid, it must be removed from the state
                // if it is just initially invalid, in just must not be added
                return state
            default:
                return state
        }
    }

    useEffect(() => {
        console.log('current state:', state)
        if (state.length === dateTimes.length * 2) {
            console.log('done')
        } else {
            console.log('not done')
        }
    })
    const [state, dispatch] = useReducer(reducer, {})

    //onDone({ valid: true, dateTimes: [] })

    return (
        <div ref={ref}>
            <div>{title}</div>
            <div>{description}</div>
            {dateTimes.map(({ date, time }, i) => {
                return (
                    <div>
                        <ElectionDateInput
                            defaultValue={date}
                            onDone={({ valid, value }) =>
                                dispatch({
                                    type: valid ? 'valid' : 'invalid',
                                    payload: { value: value, id: i },
                                })
                            }
                        />
                        <ElectionTimeInput
                            defaultValue={time}
                            onDone={({ valid, value }) => {
                                dispatch({ type: valid ? 'valid' : 'invalid', payload: value })
                            }}
                        />
                    </div>
                )
            })}
        </div>
    )
}

export default TimelinePoint
