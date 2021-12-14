// from issue: https://github.com/EnCiv/undebate-ssp/issues/5

import humanizeString from 'humanize-string'

import React from 'react'
import { createUseStyles } from 'react-jss'
import {
    SvgAccepted,
    SvgCompleted,
    SvgDeadlineMissed,
    SvgDeclined,
    SvgReminderSent,
    SvgSent,
    SvgVideoSubmitted,
} from './lib/svg.js'

const statusInfoEnum = {
    completed: { icon: <SvgCompleted /> },
    pending: { text: 'Pending…' },
    daysLeft: v => ({
        text: `${v} days left…`,
    }),
    reminderSent: {
        icon: <SvgReminderSent />,
        text: 'Reminder Sent',
    },
    percentComplete: v => ({
        text: <ProgressBar percentDone={v} />,
    }),
    videoSubmitted: { icon: <SvgVideoSubmitted />, text: 'Video Submitted' },
    deadlineMissed: { icon: <SvgDeadlineMissed />, text: 'Deadline Missed' },
    accepted: { icon: <SvgAccepted />, text: 'Accepted' },
    declined: { icon: <SvgDeclined />, text: 'Declined' },
    sent: { icon: <SvgSent />, text: 'Sent' },
}

const ProgressBar = props => {
    const classes = useStyles(props)
    const {
        // percentDone // used in styles
    } = props
    return <div className={classes.progressBar} />
}

export const ElectionCategory = props => {
    const classes = useStyles(props)
    const { categoryName = '', statusObjs = [], className = '' } = props

    // Converts array of objects into one object
    // Also converts strings into keys of that object
    const toCleanStatusObj = val => {
        if (Array.isArray(val)) {
            return val.reduce((obj, v) => {
                if (typeof v === 'string') {
                    v = { [v]: true }
                }
                return { ...obj, ...v }
            }, {})
        }
        if (typeof val === 'string') {
            return { [val]: true }
        }
        return val
    }

    const cleanStatusObj = toCleanStatusObj(statusObjs)

    // What shows up as the status text based on the values in cleanStatusObj:
    // If a value === false, don't show
    // Else if the key is unknown and its value === true, show humanizeString(key)
    // Else if the key is unknown, show value + humanizeString(key)
    // Else if a key's value === true, show its icon + text (both found in statusInfoEnum)
    // Else if the key has an icon, show its icon and value in a table
    // Else if the key is known but doesn't have an icon, show text only-- assume that a function in
    //   statusInfoEnum has already interpreted the value

    // statusArray is an array of elements to be displayed and [icon, value] arrays to be turned into a table
    const statusArray = Object.keys(cleanStatusObj)
        .filter(key => cleanStatusObj[key] !== false)
        .map((key, i) => {
            const param = cleanStatusObj[key]
            let content = statusInfoEnum[key]
            if (content == null) {
                content = {
                    text: (param !== true ? `${param} ` : '') + humanizeString(key),
                }
            } else if (content instanceof Function) {
                content = content(param)
            }
            if (content.icon != null && param !== true) {
                return [content.icon, param]
            }
            const icon = content.icon == null ? '' : <span className={classes.icon}>{content.icon}</span>
            return (
                <span className={`${i === 0 ? '' : classes.grow}`}>
                    {icon} {content.text}
                </span>
            )
        })

    const tableArray = statusArray.filter(v => Array.isArray(v))
    const statusTable = tableArray.length ? (
        <table>
            <thead>
                <tr>
                    {tableArray.map(v => (
                        <th className={classes.tableItem}>{v[0]}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {tableArray.map(v => (
                        <td className={classes.tableItem}>{v[1]}</td>
                    ))}
                </tr>
            </tbody>
        </table>
    ) : (
        ''
    )
    const statusTextArray = statusArray
        .filter(v => React.isValidElement(v))
        .reduce((previous, v, index, source) => {
            const result = [...previous, v]
            if (source.length - 1 != index) {
                result.push(<hr className={classes.lineBreak} />)
            }
            return result
        }, [])

    return (
        <div className={`${classes.category} ${className}`}>
            <span className={classes.categoryText}>{categoryName}</span>
            {statusTextArray}
            {statusTable}
        </div>
    )
}

const useStyles = createUseStyles({
    category: props => ({
        display: 'flex',
        flexWrap: 'wrap',
        borderRadius: '0.5rem',
        padding: `${props.selected ? 1.3 : 0.7}rem 0.7rem`,
        margin: 'rem',
        backgroundColor: props.backgroundColor,
        alignItems: 'center',
    }),
    categoryText: {
        textTransform: 'capitalize',
        flex: 1,
    },
    grow: { flex: '1 1 100%' },
    icon: { marginRight: '0.2rem' },
    lineBreak: {
        width: '100%',
        border: 'none',
        marginTop: '.1rem',
    },
    tableItem: {
        textAlign: 'center',
        padding: '0px .2rem',
    },
    progressBar: props => {
        const { percentDone } = props
        return {
            background: `linear-gradient(to right, #7470FF ${percentDone}%, #FFFFFF 0%)`,
            width: '100%',
            height: '1em',
            borderRadius: '0.3vw',
        }
    },
})

export default ElectionCategory
