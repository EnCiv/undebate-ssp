// refactored to separate component in https://github.com/EnCiv/undebate-ssp/issues/21
import React from 'react'
import {createUseStyles} from 'react-jss'
import {statusInfoEnum} from '../lib/get-election-status-methods'
import CandidateStatusIcon from "./candidate-status-icon";

export default function CandidateStatusComponent({className, style, tableArray, statusObj}) {
    let displayArray = tableArray ? [...tableArray] : []
    const classes = useStyles()
    // todo change what's passed into this
    // todo fully rewrite this component
    // if (statusObj && Object.keys(statusObj).length) {
    //     const getStatusEnumsFromObj = obj => {
    //         return Object.keys(obj).map((key, i) => {
    //             return [statusInfoEnum[key].icon, obj[key]]
    //         })
    //     }
    //     displayArray = getStatusEnumsFromObj(statusObj)
    // }

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
    } else if (statusObj && Object.keys(statusObj).length) {
        return (
            <table className={className} style={style}>
                <tbody>
                <tr>
                    <td>
                        <CandidateStatusIcon value={statusObj.deadlineMissed}
                                             themeColorName={'colorDeadlineMissed'}
                                             displayText={'Deadline Missed'}/>
                    </td>
                    <td>
                        <CandidateStatusIcon value={statusObj.videoSubmitted}
                                             themeColorName={'colorSubmitted'}
                                             displayText={'Video Submitted'}/>
                    </td>
                    <td>
                        <CandidateStatusIcon value={statusObj.sent}
                                             themeColorName={'colorSent'}
                                             displayText={'Invite Pending'}/>
                    </td>
                    <td>
                        <CandidateStatusIcon value={statusObj.candidateCount}
                                             themeColorName={'colorSecondary'}
                                             numberColor={'#FFFFFF'}
                                             displayText={'Total Number of Candidates'}/>
                    </td>
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
