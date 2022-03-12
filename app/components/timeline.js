// https://github.com/EnCiv/undebate-ssp/issues/45

import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import ElectionCreated from './election-created'
import Submit from './submit'
import TimeLinePoint from './timeline-point'

export default function Timeline(props) {
    const { className, style, onDone, electionOM } = props
    const [electionObj, electionMethods] = electionOM
    const { timeline, undebateDate, electionDate } = electionObj
    const classes = useStyles(props)

    const {
        candidateDeadlineReminderEmails,
        candidateSubmissionDeadline,
        moderatorSubmissionDeadline,
        moderatorDeadlineReminderEmails,
    } = timeline

    return (
        <div className={cx(className, classes.wrapper)} style={style}>
            <header className={classes.heading}>
                <span>Fill the date and times for following events to automate the undebate.</span>
                <Submit onDone={onDone} />
            </header>
            <ElectionCreated electionMetadata={electionObj} />
            <TimeLinePoint
                title='Moderator Deadline Reminder Emails'
                description='Moderator will receive two emails as a reminder on this date, usually 2 days and 7 days before the deadline.'
                timelineObj={moderatorDeadlineReminderEmails}
                electionOM={electionOM}
                addOne={true}
            />
            <TimeLinePoint
                title='Moderator Submission Deadline'
                description="Moderator won't be able to record after this time."
                timelineObj={moderatorSubmissionDeadline}
                electionOM={electionOM}
            />
            <TimeLinePoint
                title='Candidate Deadline Reminder Emails'
                description='Candidates who will not have submitted will receive two emails as a reminder on this date, usually 2 days before the deadline.'
                timelineObj={candidateDeadlineReminderEmails}
                electionOM={electionOM}
                addOne={true}
            />
            <TimeLinePoint
                title='Candidate Submission Deadline'
                description="Candidates won't be able to record after this time."
                timelineObj={candidateSubmissionDeadline}
                electionOM={electionOM}
            />
            <TimeLinePoint
                title='Candidate Submission Deadline'
                description="Candidates won't be able to record after this time."
                timelineObj={candidateSubmissionDeadline}
                electionOM={electionOM}
            />
            <TimeLinePoint
                title='Undebate Goes Live'
                description='By default, undebate goes live 4 days after candidate submission deadline. But, you can change the date.'
                timelineObj={{ 0: { date: undebateDate } }}
                electionOM={electionOM}
            />
            <TimeLinePoint
                title='Last Day of Election'
                description='Undebate gets archived after this time.'
                timelineObj={{ 0: { date: electionDate } }}
                electionOM={electionOM}
            />
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
    container: {},
}))
