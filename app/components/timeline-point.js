// https://github.com/EnCiv/undebate-ssp/issues/12

import React, { forwardRef, useState, useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import Plus from '../svgr/plus'
import DateTimeInput from './datetime-input'

const TimelinePoint = forwardRef((props, ref) => {
    const {
        className,
        style,
        electionOM,
        title,
        description,
        onDone = () => {},
        timelineKey,
        addOne,
        electionObjKey,
    } = props
    const [electionObj, electionMethods] = electionOM
    const classes = useStyles()
    const [validValues] = useState([])
    const { timeline = {} } = electionObj
    const timelineObj = timelineKey ? timeline[timelineKey] || {} : { 0: { date: electionObj[electionObjKey] || '' } }

    const [sideEffects] = useState([])
    useEffect(() => {
        while (sideEffects.length) sideEffects.shift()()
    })

    const datesToArray = obj => {
        let arr = Object.entries(obj).sort(function (a, b) {
            return ('' + Date.parse(b.date)).localeCompare(Date.parse(a.date))
        })
        if (!arr.length) {
            return ['']
        }
        return arr.map(([_, timelineObj]) => timelineObj?.date || '')
    }

    const areAllPairsValid = () => {
        return validValues.length && validValues.every(({ valid, value }) => !!valid)
    }

    return (
        <div ref={ref} className={className} style={style}>
            <div className={classes.title}>{title}</div>
            <div className={classes.description}>{description}</div>
            <div className={classes.container}>
                <div className={classes.datetimes}>
                    {datesToArray(timelineObj).map((dateTime, i) => (
                        <DateTimeInput
                            className={classes.dateTimeInput}
                            defaultValue={dateTime}
                            onDone={({ valid, value }) => {
                                validValues[i] = { valid, value }
                                const isValid = areAllPairsValid()
                                if (timelineKey) {
                                    if (timeline?.[timelineKey]?.[i]?.date !== value) {
                                        sideEffects.push(() => {
                                            electionMethods.upsert({
                                                timeline: { [timelineKey]: { [i]: { date: value } } },
                                            })
                                        })
                                    }
                                } else {
                                    if (electionObj[electionObjKey] !== value)
                                        sideEffects.push(() => {
                                            electionMethods.upsert({ [electionObjKey]: value })
                                        })
                                }
                                onDone({
                                    value: value,
                                    valid: isValid,
                                })
                            }}
                        />
                    ))}
                </div>
                {addOne && (
                    <div
                        className={classes.plusButton}
                        onClick={() => {
                            // no side effect from within an event because a rerender won't happen
                            electionMethods.upsert({
                                timeline: { [timelineKey]: { [Object.keys(timelineObj).length]: { date: '' } } },
                            })
                        }}
                    >
                        <Plus className={classes.plusIcon} />
                    </div>
                )}
            </div>
        </div>
    )
})

const useStyles = createUseStyles(theme => ({
    title: {
        fontWeight: '600',
        marginBottom: '.1875rem',
    },
    description: {
        color: theme.colorSecondary,
        fontSize: theme.secondaryTextFontSize,
        opacity: theme.secondaryTextOpacity,
        fontWeight: '500',
    },
    container: {
        display: 'flex',
        marginTop: '1rem',
        marginBottom: '4rem',
        gap: '1rem',
        alignItems: 'flex-end',
    },
    datetimes: {
        display: 'flex',
        gap: '1rem',
        flexDirection: 'column',
        maxWidth: '25rem',
    },
    plusButton: {
        opacity: '50%',
        backgroundColor: theme.colorLightGray,
        width: '3.8125rem',
        height: '3.8125rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '0.625rem',
        '&:hover': {
            opacity: '100%',
            cursor: 'pointer',
        },
    },
    plusIcon: {
        fontSize: '1.5rem',
    },
}))

export default TimelinePoint
