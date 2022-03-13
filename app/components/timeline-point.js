// https://github.com/EnCiv/undebate-ssp/issues/12

import { React, useState, useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import Plus from '../svgr/plus'
import DateTimeInput from './datetime-input'

function TimelinePoint(props) {
    const {
        className,
        style,
        electionOM,
        title,
        description,
        onDone = () => {},
        timelineObj,
        timelineKey,
        addOne,
        ref,
    } = props
    const [_, electionMethods] = electionOM
    const classes = useStyles()
    const state = useRef({})

    const [sideEffects] = useState([])
    useEffect(() => {
        while (sideEffects.length) sideEffects.shift()()
    })

    const datesToArray = obj => {
        let arr = Object.entries(obj).sort(function (a, b) {
            return ('' + Date.parse(b.date)).localeCompare(Date.parse(a.date))
        })
        if (!arr.length) {
            arr.push([])
        }
        return arr.map(([_, timelineObj]) => {
            let datetime = ''
            if (timelineObj) {
                datetime = new Date(timelineObj.date)
            }
            return datetime
        })
    }

    const areAllPairsValid = () => {
        const dateTimeObjs = Object.values(state.current)
        if (!dateTimeObjs.length) return false
        for (let i = 0; i < dateTimeObjs.length; i += 1) {
            if (!dateTimeObjs[i].valid) return false
        }
        return true
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
                                state.current[i] = { valid, value }
                                const isValid = areAllPairsValid()
                                const newValue = Object.values(state.current).map(dateTimeObj => dateTimeObj.value)
                                sideEffects.push(() => {
                                    electionMethods.upsert({ timeline: { [timelineKey]: { [i]: { date: newValue } } } })
                                })
                                onDone({
                                    value: newValue,
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
                                    timeline: { [key]: { [Object.keys(timelineObj).length]: { date: '' } } },
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
}

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
