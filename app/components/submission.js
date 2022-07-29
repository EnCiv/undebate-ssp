// https://github.com/EnCiv/undebate-ssp/issues/51

import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import SvgDeadlineMissed from '../svgr/deadline-missed'
import SvgCheck from '../svgr/check'
import SvgReminder from '../svgr/reminder-sent'
import SvgFeelingBlue from '../svgr/feeling-blue'
import { getLatestIota } from '../lib/get-election-status-methods'
import ObjectID from 'isomorphic-mongo-objectid'
import scheme from '../lib/scheme'

export default function Submission(props) {
    const { className, style, electionOM } = props
    const [electionObj, electionMethods] = electionOM
    const classes = useStyles(props)

    const submission = getLatestIota(electionObj?.moderator?.submissions)
    const viewer = getLatestIota(electionObj?.moderator?.viewers)
    const src = viewer ? scheme() + process.env.HOSTNAME + viewer?.path : undefined

    const getSubmissionDaysLeft = () => {
        const dueDate = Date.parse(electionObj.timeline.moderatorSubmissionDeadline[0].date)
        const currDate = new Date()
        return Math.round((dueDate - currDate) / 86400000)
    }

    const getSubmissionDaysAgo = () => {
        if (!submission?._id) return 100 * 365.25 * 24 * 60 * 60
        const sentDate = ObjectID(submission?._id).getDate()
        const currDate = Date.now()
        return Math.round((currDate - sentDate) / 86400000)
    }

    let statusTitle
    let statusDesc
    let prevIcon
    let cornerPic
    let missed = false
    let empty = false
    const submissionStatus = electionMethods.getSubmissionStatus()
    switch (submissionStatus) {
        case 'missed':
            statusTitle = 'Deadline Missed!'
            prevIcon = <SvgDeadlineMissed />
            cornerPic = <SvgFeelingBlue />
            missed = true
            break
        case 'submitted':
            statusTitle = 'Video Submitted!'
            statusDesc = getSubmissionDaysAgo() + ' days ago'
            prevIcon = <SvgCheck />
            break
        case 'sent':
            statusTitle = 'Reminder Sent!'
            statusDesc = getSubmissionDaysLeft() + ' days left'
            prevIcon = <SvgReminder />
            break
        case 'default':
            statusDesc = getSubmissionDaysLeft() + ' days left'
            statusTitle = 'No Submission Yet'
            break
        case 'empty':
            empty = true
            break
    }

    const icon = <div className={classes.icon}>{prevIcon}</div>
    return (
        <div className={cx(className, classes.container)} style={style}>
            {!empty && (
                <>
                    <div className={cx(classes.card, { [classes.backgroundRed]: missed })}>
                        <div className={classes.preview}>
                            {src ? (
                                <iframe width={'100%'} height={'100%'} src={src} frameBorder='0' key='iframe'>
                                    {icon}
                                </iframe>
                            ) : (
                                <div className={classes.placeholder} key='placeholder'>
                                    {icon}
                                </div>
                            )}
                        </div>
                        <div className={classes.meta}>
                            <p className={cx(classes.title, { [classes.colorWhite]: missed })}>{statusTitle}</p>
                            <p className={cx(classes.desc, { [classes.colorLightRed]: missed })}>{statusDesc}</p>
                        </div>
                    </div>
                    <div className={classes.cornerPic}>{cornerPic}</div>
                </>
            )}
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    container: {
        padding: '2rem',
        backgroundColor: theme.backgroundColorApp,
    },
    card: {
        maxWidth: '60rem',
        backgroundColor: theme.colorLightGray,
        padding: '.5rem',
        borderRadius: '0.625rem',
    },
    preview: {
        backgroundColor: 'white',
        height: '40rem',
    },
    title: {
        paddingTop: '.5rem',
        paddingLeft: '.5rem',
        margin: '0',
        fontWeight: '500',
    },
    desc: {
        padding: '0',
        margin: '0',
        color: theme.colorGray,
        fontSize: '0.875rem',
        paddingLeft: '.5rem',
        paddingBottom: '.5rem',
    },
    cornerPic: {
        display: 'flex',
        fontSize: '14rem',
        justifyContent: 'right',
        marginBottom: '0',
    },
    icon: {
        fontSize: '3rem',
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholder: {
        width: '100%',
        height: '100%',
    },
    backgroundRed: {
        backgroundColor: theme.colorWarning,
    },
    colorWhite: {
        color: 'white',
    },
    colorLightRed: {
        color: theme.colorLightRed,
    },
}))
