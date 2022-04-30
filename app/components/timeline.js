// https://github.com/EnCiv/undebate-ssp/issues/45

import React, { useEffect, useReducer, useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import ElectionCreated from './election-created'
import Submit from './submit'
import TimeLinePoint from './timeline-point'

export default function Timeline(props) {
    const { className, style, onDone, electionOM } = props
    const [electionObj, electionMethods] = electionOM
    const classes = useStyles(props)

    const pointsData = [
        {
            title: 'Moderator Deadline Reminder Emails',
            description:
                'Moderator will receive two emails as a reminder on this date, usually 2 days and 7 days before the deadline.',
            timelineKey: 'moderatorDeadlineReminderEmails',
            addOne: true,
        },
        {
            title: 'Moderator Submission Deadline',
            description:
                'Moderator will receive two emails as a reminder on this date, usually 2 days and 7 days before the deadline.',
            timelineKey: 'moderatorSubmissionDeadline',
        },
        {
            title: 'Candidate Deadline Reminder Emails',
            description:
                'Candidates who will not have submitted will receive two emails as a reminder on this date, usually 2 days before the deadline.',
            timelineKey: 'candidateDeadlineReminderEmails',
            addOne: true,
        },
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
    const [isValid, setIsValid] = useState(false)
    const allValid = () => Object.values(validInputs).every(v => !!v)

    useEffect(() => {
        setIsValid(allValid())
    }, [isValid, validInputs])

    return (
        <div className={cx(className, classes.wrapper)} style={style}>
            <header className={classes.heading}>
                <span>Fill the date and times for following events to automate the undebate.</span>
                <Submit onDone={onDone} disabled={!isValid} />
            </header>
            <ElectionCreated electionMetadata={electionObj} />
            <div className={classes.container}>
                {pointsData.map(pointData => (
                    <TimeLinePoint
                        {...pointData}
                        electionOM={electionOM}
                        onDone={({ valid, value }) => {
                            setValidInputs({ [pointData.timelineKey]: valid })
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    wrapper: {
        padding: '1rem',
    },
    heading: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    container: {
        marginTop: '1.5rem',
    },
}))
