// https://github.com/EnCiv/undebate-ssp/issues/12

import { React, forwardRef, useState, useEffect, useRef } from 'react'
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
    const timelineObj = timelineKey ? timeline[timelineKey] || {} : { 0: electionObj[electionObjKey] || '' }

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
                                sideEffects.push(() => {
                                    if (timelineKey)
                                        electionMethods.upsert({
                                            timeline: { [timelineKey]: { [i]: { date: value } } },
                                        })
                                    else electionMethods.upsert({ [electionObjKey]: value })
                                })
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
                            sideEffects.push(() => {
                                electionMethods.upsert({
                                    timeline: { [timelineKey]: { [Object.keys(timelineObj).length]: { date: '' } } },
                                })
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
        marginBottom: '3px',
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
        maxWidth: '400px',
    },
    plusButton: {
        opacity: '50%',
        backgroundColor: theme.colorLightGray,
        width: '56px',
        height: '56px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '10px',
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
