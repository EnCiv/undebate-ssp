import { React, useEffect, useReducer } from "react"

import ElectionTimeInput from "./election-time-input"
import ElectionDateInput from "./election_date_input"

const TimelinePoint = props => {
    const { className, style, title, description, dateTimes = [], onDone = () => {}, ref } = props

    // onDone is if we receive 'dones' from all input fields
    // 1. Keep track of the number of 'dones' received as state, each time a new 'done' is received, check if we have all those necessary
    // 2. State could just be the current date times and their validity and we could just go through all of them to check if they are valid
    const reducer = (state, action) => {
        switch (action.type) {
            case "valid":
                return [...state, action.payload]
            case "invalid":
                return state
        }
    }

    useEffect(() => {
        console.log(state)
    }, [state])
    const [state, dispatch] = useReducer(reducer, [])

    //onDone({ valid: true, dateTimes: [] })

    return (
        <div ref={ref}>
            <div>{title}</div>
            <div>{description}</div>
            {dateTimes.map(({ date, time }) => {
                return (
                    <div>
                        <ElectionDateInput
                            defaultValue={date}
                            onDone={({ valid, value }) =>
                                dispatch(state, { type: valid ? "valid" : "invalid", payload: value })
                            }
                        />
                        <ElectionTimeInput
                            defaultValue={time}
                            onDone={({ valid, value }) =>
                                dispatch(state, { type: valid ? "valid" : "invalid", payload: value })
                            }
                        />
                    </div>
                )
            })}
        </div>
    )
}

export default TimelinePoint
