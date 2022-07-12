// from issue: https://github.com/EnCiv/undebate-ssp/issues/5

import React from 'react'
import { createUseStyles } from 'react-jss'
import { statusInfoEnum } from '../lib/get-election-status-methods'
import CandidateStatusTable from './candidate-status-table'

function ElectionCategory(props) {
    const classes = useStyles(props)
    const { categoryName = '', statusObjs = [], className = '' } = props

    // Converts array of objects into one object
    // Also converts strings into keys of that object
    const toCleanStatusObj = val => {
        if (Array.isArray(val)) {
            return val.reduce((obj, v) => {
                const vv = typeof v === 'string' ? { [v]: true } : v
                return { ...obj, ...vv }
            }, {})
        } else if (typeof val === 'string') {
            return { [val]: true }
        }
        return val
    }

    const cleanStatusObj = toCleanStatusObj(statusObjs)
    // What shows up as the status text based on the values in cleanStatusObj:
    // If a value === false, don't show
    // Else if the key is unknown and its value === true, show key
    // Else if the key is unknown, show value + key
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
                    text: (param !== true ? `${param} ` : '') + key,
                }
            } else if (content instanceof Function) {
                content = content(param)
            }
            if (content.icon != null && param !== true) {
                return [content.icon, param]
            }
            const icon = content.icon == null ? '' : <span className={classes.icon}>{content.icon}</span>
            const contentText = content.text == null ? '' : <span className={classes.contentText}>{content.text}</span>
            return (
                <span className={`${i === 0 ? '' : classes.grow}`}>
                    {icon} {contentText}
                </span>
            )
        })

    const tableArray = statusArray.filter(v => Array.isArray(v))

    const statusTextArray = statusArray
        .filter(v => React.isValidElement(v))
        .reduce((previous, v, index, source) => {
            const result = [...previous, v]
            if (source.length - 1 !== index) {
                result.push(<hr className={classes.lineBreak} />)
            }
            return result
        }, [])

    return (
        <div className={`${classes.category} ${className}`}>
            <span className={classes.categoryText}>{categoryName}</span>
            {statusTextArray}
            <CandidateStatusTable tableArray={tableArray} />
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    category: props => ({
        display: 'flex',
        flexWrap: 'wrap',
        borderRadius: theme.defaultBorderRadius,
        padding: `${
            props.statusObjs?.pending ||
            props.statusObjs?.daysLeft ||
            props.statusObjs?.declined ||
            props.statusObjs?.deadlineMissed ||
            props.selected
                ? 1.3
                : 0.7
        }rem 0.7rem`,
        margin: `rem`,
        backgroundColor: `${
            !props.selected &&
            (props.statusObjs?.pending ||
                props.statusObjs?.daysLeft ||
                props.statusObjs?.declined ||
                props.statusObjs?.deadlineMissed)
                ? theme.backgroundColorWarning
                : props.selected
                ? theme.inputFieldBackgroundColor
                : theme.backgroundColorApp
        }`,

        border: `5px solid ${
            !props.selected
                ? 'transparent'
                : props.selected &&
                  (props.statusObjs?.pending ||
                      props.statusObjs?.daysLeft ||
                      props.statusObjs?.declined ||
                      props.statusObjs?.deadlineMissed)
                ? theme.backgroundColorWarning
                : 'transparent'
        }`,
        alignItems: 'center',
        minHeight: '1.5rem',
    }),
    categoryText: {
        flex: 1,
    },
    grow: { flex: '1 1 100%' },
    icon: {
        marginRight: '0.2rem',
        width: theme.iconSize,
        height: theme.iconSize,
    },
    contentText: props => ({
        color: `${
            props.statusObjs?.pending ||
            props.statusObjs?.daysLeft ||
            props.statusObjs?.declined ||
            props.statusObjs?.deadlineMissed
                ? theme.colorWarning
                : theme.colorSecondary
        }`,
    }),
    lineBreak: {
        width: '100%',
        border: 'none',
        marginTop: '.1rem',
    },
    progressBar: props => {
        const { percentDone } = props
        return {
            background: `linear-gradient(to right, ${theme.colorPrimary} ${percentDone}%, #FFFFFF 0%)`,
            width: '100%',
            height: '1em',
            borderRadius: theme.defaultBorderRadius,
        }
    },
}))

export default ElectionCategory
