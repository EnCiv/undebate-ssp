// subcomponent of https://github.com/EnCiv/undebate-ssp/issues/56

import React from 'react'
import { createUseStyles } from 'react-jss'
import { getStatus } from './lib/utilities'

function StatusIcon({ value, themeColorName, textColor }) {
    const classes = statusIconUseStyles({ themeColorName, textColor })
    return (
        <span className={classes.statusIcon}>
            <span className={classes.text}>{value}</span>
        </span>
    )
}

const statusIconUseStyles = createUseStyles(theme => ({
    statusIcon: ({ themeColorName }) => ({
        borderRadius: '3rem',
        backgroundColor: theme[themeColorName],
        margin: '0.75rem',
    }),
    text: ({ textColor }) => ({
        color: textColor ?? theme.colorSecondary,
        padding: '0.625rem',
        fontWeight: 'bold',
    }),
}))

// function BarComponent({ statusPercentages, themeColorName }) {}
// const barComponentUseStyles = createUseStyles(theme => {

// })

const sumArray = arr => arr.reduce((prev, v) => prev + v, 0)

export default function InviteMeter({ electionOM, className, style }) {
    const [electionObj, electionMethods] = electionOM
    const deadline = electionObj.timeline.candidateSubmissionDeadline[0].date
    const statusCounts = Object.values(electionObj.candidates).reduce(
        (prev, v) => ({ ...prev, [getStatus(v, deadline)]: prev[getStatus(v, deadline)] + 1 }),
        {
            videoSubmitted: 0,
            declined: 0,
            sent: 0,
            accepted: 0,
        }
    )
    const candidateCount = sumArray(Object.values(statusCounts))
    const orderedStatusCounts = [
        statusCounts.declined,
        statusCounts.accepted,
        statusCounts.videoSubmitted,
        statusCounts.sent,
    ]
    const statusPercentages = orderedStatusCounts
        .map(v => (v * 100) / candidateCount)
        .map((v, i, arr) => `${sumArray(arr.slice(0, i)) + v}%`)
    const classes = useStyles({ statusPercentages })
    return (
        <div className={className} style={style}>
            <div className={classes.meter} />
            <div className={classes.info}>
                <span>
                    <StatusIcon value={statusCounts.declined} themeColorName='colorDeclined' />
                    <span className={classes.statusText}>Invite Declined</span>
                </span>
                <span>
                    <StatusIcon value={statusCounts.accepted} themeColorName='colorAccepted' />
                    <span className={classes.statusText}>Invite Accepted</span>
                </span>
                <span>
                    <StatusIcon value={statusCounts.videoSubmitted} themeColorName='colorSubmitted' />
                    <span className={classes.statusText}>Video Submitted</span>
                </span>
                <span>
                    <StatusIcon value={statusCounts.sent} themeColorName='colorSent' />
                    <span className={classes.statusText}>Invite Pending</span>
                </span>
                <span>
                    <StatusIcon value={candidateCount} themeColorName='colorSecondary' textColor='#FFFFFF' />
                    <span className={classes.statusText}>Total Number of Candidates</span>
                </span>
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
    statusText: { margin: '0rem' },
}))
