// subcomponent of https://github.com/EnCiv/undebate-ssp/issues/56

import React from 'react'
import { createUseStyles } from 'react-jss'
import { validStatuses } from './lib/get-candidate-invite-status'
import CandidateStatusIcon from './candidate-status-icon'

const sumArray = arr => arr.reduce((prev, v) => prev + v, 0)

export default function InviteMeter({ electionOM, className, style }) {
    const [electionObj, electionMethods] = electionOM
    electionObj.candidates ??= {}

    const statusCounts = electionMethods.getCandidatesStatusCounts()
    const orderedStatusCounts = validStatuses.map(k => statusCounts[k])

    const meterCandidateCount = sumArray(Object.values(orderedStatusCounts))
    const candidateCount = Object.values(electionObj.candidates).length
    const statusPercentages = orderedStatusCounts
        .map(v => {
            const percent = (v * 100) / meterCandidateCount
            return Number.isNaN(percent) ? 0 : percent
        })
        .map((v, i, arr) => `${sumArray(arr.slice(0, i)) + v}% 100%`)
    if (meterCandidateCount === 0) {
        statusPercentages[statusPercentages.length - 1] = '100% 100%'
    }

    const classes = useStyles({ statusPercentages })
    return (
        <div className={className} style={style}>
            <div className={classes.meter} />
            <div className={classes.info}>
                <CandidateStatusIcon value={statusCounts.deadlineMissed}
                                     themeColorName={'colorDeadlineMissed'}
                                     displayText={'Deadline Missed'}
                                     visibleText={true}/>
                <CandidateStatusIcon value={statusCounts.videoSubmitted}
                                     themeColorName={'colorSubmitted'}
                                     displayText={'Video Submitted'}
                                     visibleText={true}/>
                <CandidateStatusIcon value={statusCounts.sent}
                                     themeColorName={'colorSent'}
                                     displayText={'Invite Pending'}
                                     visibleText={true}/>
                <CandidateStatusIcon value={candidateCount}
                                     themeColorName={'colorSecondary'}
                                     numberColor={'#FFFFFF'}
                                     displayText={'Total Number of Candidates'}
                                     visibleText={true}/>
            </div>
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    meter: ({ statusPercentages }) => ({
        height: '1rem',
        borderRadius: theme.defaultBorderRadius,
        backgroundImage: [
            `linear-gradient(${theme.colorDeclined}, ${theme.colorDeclined})`,
            `linear-gradient(${theme.colorAccepted}, ${theme.colorAccepted})`,
            `linear-gradient(${theme.colorDeadlineMissed}, ${theme.colorDeadlineMissed})`,
            `linear-gradient(${theme.colorSubmitted}, ${theme.colorSubmitted})`,
            `linear-gradient(${theme.colorSent}, ${theme.colorSent})`,
        ],
        // toString is to make the resulting string split with commas, not spaces
        backgroundSize: statusPercentages.toString(),
        backgroundRepeat: 'no-repeat',
    }),
    info: {
        display: 'flex',
        width: '80%',
        marginTop: '2rem',
        justifyContent: 'space-between',
    },
}))
