// refactored to separate component in https://github.com/EnCiv/undebate-ssp/issues/21
import React from 'react'
import { createUseStyles } from 'react-jss'
import { statusInfoEnum } from '../lib/get-election-status-methods'

export default function CandidateStatusTable({ className, style, tableArray, statusObj }) {
    let displayArray = tableArray ? [...tableArray] : []
    // tableArray was used in ElectionCategory when it was written, but this wasn't very flexible
    // statusArray is a simplified way to use this component that extracted only the relevent
    //   methods from ElectionCategory specific to CandidateStatusTable. ElectionCategory was not
    //   refactored to use statusArray because it would have affected the performance of ElectionCategory
    //   and the refactor effort to avoid that was too large.
    const classes = useStyles()
    if (statusObj && Object.keys(statusObj).length) {
        const getStatusEnumsFromObj = obj => {
            return Object.keys(obj).map((key, i) => {
                return [statusInfoEnum[key].icon, obj[key]]
            })
        }
        displayArray = getStatusEnumsFromObj(statusObj)
    }

    if (displayArray && displayArray.length) {
        return (
            <table className={className} style={style}>
                <thead>
                    <tr>
                        {displayArray.map(v => (
                            <th className={classes.tableItem}>{v[0]}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {displayArray.map(v => (
                            <td className={classes.tableItem}>{v[1]}</td>
                        ))}
                    </tr>
                </tbody>
            </table>
        )
    } else {
        return ''
    }
}

const useStyles = createUseStyles(theme => ({
    tableItem: {
        textAlign: 'center',
        padding: '0px .2rem',
    },
}))
