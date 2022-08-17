// https://github.com/EnCiv/undebate-ssp/issues/45

import React, { useEffect, useRef, useReducer, useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import ElectionCreated from './election-created'
import TimeLinePoint from './timeline-point'
import VerticalTimeline from './vertical-timeline'
import DoneLockedButton from './done-locked-button'

const panelName = 'Timeline'
export default function Timeline(props) {
    const { className, style, onDone, electionOM } = props
    const classes = useStyles(props)
    const [timelinePointRefs] = useState([])
    const [_this] = useState({ renderCount: 0 })
    const [electionObj, electionMethods] = electionOM
    _this.renderCount++ // VerticalTimline needs to update when this component updates

    const pointsData = [
        /* REMINDERS not implemented yet
        {
            title: 'Moderator Deadline Reminder Emails',
            description:
                'Moderator will receive two emails as a reminder on this date, usually 2 days and 7 days before the deadline.',
            timelineKey: 'moderatorDeadlineReminderEmails',
            addOne: true,
        },
    */
        {
            title: 'Moderator Submission Deadline',
            description:
                'Moderator will receive two emails as a reminder on this date, usually 2 days and 7 days before the deadline.',
            timelineKey: 'moderatorSubmissionDeadline',
        },
        /* REMINDERS not implemented yet
        {
            title: 'Candidate Deadline Reminder Emails',
            description:
                'Candidates who will not have submitted will receive two emails as a reminder on this date, usually 2 days before the deadline.',
            timelineKey: 'candidateDeadlineReminderEmails',
            addOne: true,
        },
    */
        {
            title: 'Candidate Submission Deadline',
            description: "Candidates won't be able to record after this time.",
            timelineKey: 'candidateSubmissionDeadline',
        },
        {
            title: 'Undebate Goes Live',
            description:
                'By default, undebate goes live 4 days after candidate submission deadline. But, you can change the date.',
            electionObjKey: 'undebateDate',
        },
        {
            title: 'Last Day of Election',
            description: 'Undebate gets archived after this time.',
            electionObjKey: 'electionDate',
        },
    ]

    const [validInputs, setValidInputs] = useReducer((state, action) => ({ ...state, ...action }), {})
    const allValid = Object.values(validInputs).every(v => !!v)
    const disabled =
        electionObj?.doneLocked?.[panelName]?.done || electionMethods.getModeratorSubmissionStatus() === 'submitted'

    return (
        <div className={cx(className, classes.timeline)} style={style}>
            <VerticalTimeline refs={timelinePointRefs} renderEveryTime={_this.renderCount} />
            <div className={classes.content}>
                <header className={classes.heading} key='header'>
                    <span>Fill the date and times for following events to automate the undebate.</span>
                    <DoneLockedButton
                        className={classes.submitButton}
                        electionOM={electionOM}
                        panelName={panelName}
                        isValid={allValid}
                        isLocked={electionMethods.getModeratorSubmissionStatus() === 'submitted'}
                        onDone={({ valid, value }) => valid && onDone({ valid: allValid })}
                    />
                </header>
                <ElectionCreated
                    key='created'
                    electionOM={electionOM}
                    className={classes.created}
                    ref={el => {
                        timelinePointRefs[0] = el
                    }}
                />
                {pointsData.map((pointData, i) => (
                    <TimeLinePoint
                        key={i}
                        {...pointData}
                        electionOM={electionOM}
                        onDone={({ valid, value }) => {
                            setValidInputs({ [pointData.timelineKey || pointData.electionObjKey]: valid })
                        }}
                        ref={el => {
                            timelinePointRefs[i + 1] = el
                        }}
                        disabled={disabled}
                    />
                ))}
            </div>
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    timeline: {
        display: 'flex',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    created: {
        marginBottom: '1.5rem',
    },
    heading: {
        display: 'flex',
        justifyContent: 'space-between',
    },
}))
