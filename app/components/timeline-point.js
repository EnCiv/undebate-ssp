import { React, useEffect, useReducer } from 'react'
import { createUseStyles } from 'react-jss'

import ElectionTimeInput from './election-time-input'
import ElectionDateInput from './election-date-input'

const TimelinePoint = function (props) {
    const { className, style, electionOM, title, description, dateTimes = [], onDone = () => {}, ref } = props
    const classes = useStyles()

    // onDone is if we receive 'dones' from all input fields
    // 1. Keep track of the number of 'dones' received as state, each time a new 'done' is received, check if we have all those necessary
    // 2. State could just be the current date times and their validity and we could just go through all of them to check if they are valid
    const reducer = (state, action) => {
        console.log('action: ', action)
        switch (action.type) {
            case 'valid':
                // if
                return { ...state, ...{ [`${action.payload.id}`]: action.payload.value } }
            case 'invalid':
                // if it has become invalid, it must be removed from the state
                // if it is just initially invalid, in just must not be added
                delete state[`${action.payload.id}`]

                //return state.filter((el)=> el)
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
        handleChange()
    })

    // maybe set initial state shape
    const [state, dispatch] = useReducer(reducer, {})

    const handleChange = () => {
        const values = Object.values(state)
        for (let i = 0; i < values.length; i += 1) {
            if (!values[i].date || !values[i].time) {
                onDone({ valid: false, value: state })
            }
            onDone({ valid: true, value: state })
        }
    }

    return (
        <div ref={ref}>
            <div>{title}</div>
            <div>{description}</div>
            {dateTimes.map(({ date, time }, i) => {
                return (
                    <div className={classes.dateTimePair}>
                        <ElectionDateInput
                            className={classes.input}
                            defaultValue={date}
                            onDone={({ valid, value }) =>
                                dispatch({
                                    type: valid ? 'valid' : 'invalid',
                                    payload: { value: { date: value }, id: `date-${i}` },
                                })
                            }
                        />
                        <ElectionTimeInput
                            className={classes.input}
                            defaultValue={time}
                            onDone={({ valid, value }) => {
                                dispatch({
                                    type: valid ? 'valid' : 'invalid',
                                    payload: { value: { time: value }, id: `time-${i}` },
                                })
                            }}
                        />
                    </div>
                )
            })}
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
        input: {
            //width: '50%',
        },
    }
})

export default TimelinePoint