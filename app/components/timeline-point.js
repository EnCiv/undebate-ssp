import { React, useRef } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'

import DateTimeInput from './datetime-input'

const TimelinePoint = function (props) {
    const { className, style, electionOM, title, description, dateTimes = [], onDone = () => {}, ref } = props
    const classes = useStyles()

    const state = useRef({})

    const areAllPairsValid = () => {
        const dateTimeObjs = Object.values(state.current)
        if (!dateTimeObjs.length) return false
        for (let i = 0; i < dateTimeObjs.length; i += 1) {
            if (!dateTimeObjs[i].valid) return false
        }
        return true
    }

    return (
        <div ref={ref} className={cx(className)}>
            <div>{title}</div>
            <div>{description}</div>
            {dateTimes.map((dateTime, i) => (
                <DateTimeInput
                    className={classes.dateTimeInput}
                    defaultValue={dateTime}
                    onDone={({ valid, value }) => {
                        state.current[i] = { valid, value }
                        const isValid = areAllPairsValid()
                        onDone({ value: Object.values(state.current), valid: isValid })
                    }}
                />
            ))}
        </div>
    )
}

const useStyles = createUseStyles(theme => {
    return {
        dateTimeInput: {
            padding: '1rem 0',
        },
    }
})

export default TimelinePoint
