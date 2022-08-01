// https://github.com/EnCiv/undebate-ssp/issues/51

import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import SvgDeadlineMissed from '../svgr/deadline-missed'
import SvgCheck from '../svgr/check'
import SvgReminder from '../svgr/reminder-sent'
import SvgSolidClock from '../svgr/clock-solid'
import SvgFeelingBlue from '../svgr/feeling-blue'
import { getLatestIota } from '../lib/get-election-status-methods'
import ObjectID from 'isomorphic-mongo-objectid'
import Submit from './submit'
import scheme from '../lib/scheme'

export default function ModeratorRecorder(props) {
    const { className, style, electionOM } = props
    const [electionObj, electionMethods] = electionOM
    const classes = useStyles(props)
    const { moderator = {} } = electionObj
    const viewer = getLatestIota(moderator.viewers)
    const [submitted, setSubmitted] = useState(!!viewer)

    const getRecorderStatus = () => {
        if (viewer) return 'submitted'
        const date = electionObj?.timeline?.moderatorSubmissionDeadline?.[0]?.date
        if (date < new Date().toISOString()) return 'missed'
        return 'default'
    }

    const getSubmissionDaysLeft = () => {
        const dueDate = Date.parse(electionObj?.timeline?.moderatorSubmissionDeadline?.[0]?.date)
        const currDate = new Date()
        return Math.round((dueDate - currDate) / 86400000)
    }

    const getSubmissionDaysAgo = () => {
        const sentDate = ObjectID(viewer._id).getDate()
        const currDate = Date.now()
        return Math.round((currDate - sentDate) / 86400000)
    }

    let statusTitle
    let statusDesc
    let prevIcon = <SvgSolidClock />
    let cornerPic
    let missed = false
    switch (getRecorderStatus()) {
        case 'missed':
            statusTitle = 'Deadline Missed!'
            prevIcon = <SvgDeadlineMissed />
            cornerPic = <SvgFeelingBlue />
            missed = true
            break
        case 'submitted':
            statusTitle = 'Recorder Created!'
            statusDesc = getSubmissionDaysAgo() + ' days ago'
            prevIcon = <SvgCheck />
            break
        case 'default':
            statusDesc = getSubmissionDaysLeft() + ' days left'
            statusTitle = 'No Submission Yet'
            break
    }
    const src = scheme() + process.env.HOSTNAME + viewer?.path
    const icon = <div className={classes.icon}>{prevIcon}</div>
    return (
        <div className={cx(className, classes.container)} style={style}>
            <div className={classes.innerLeft}>
                <h2>
                    This is what the moderatory will see, along with the scrip when recording. Review it before sending
                    the invitation to record.
                </h2>
                <div className={cx(classes.card, { [classes.backgroundRed]: missed })}>
                    <div className={classes.preview}>
                        {viewer?.path && getRecorderStatus() === 'submitted' ? (
                            <iframe width={'100%'} height={'100%'} src={src} frameBorder='0'>
                                {icon}
                            </iframe>
                        ) : (
                            <div className={classes.placeholder}>{icon}</div>
                        )}
                    </div>
                    <div className={classes.meta}>
                        <p className={cx(classes.title, { [classes.colorWhite]: missed })}>{statusTitle}</p>
                        <p className={cx(classes.desc, { [classes.colorLightRed]: missed })}>{statusDesc}</p>
                    </div>
                </div>
                <div className={classes.cornerPic}>{cornerPic}</div>
            </div>
            <Submit
                name='Generate Recorder'
                disabled={submitted || viewer}
                onDone={() => {
                    setSubmitted(true)
                    electionMethods.createModeratorRecorder()
                }}
                className={classes.submitButton}
            />
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    container: {
        padding: '2rem',
        backgroundColor: theme.backgroundColorApp,
    },
    innerLeft: {
        maxWidth: '60rem',
        float: 'left',
    },
    card: {
        width: '100%',
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
    submitButton: { float: 'right' },
}))