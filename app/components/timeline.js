// https://github.com/EnCiv/undebate-ssp/issues/45

import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import ElectionCreated from './election-created'
import Submit from './submit'
import ElectionDateInput from './election-date-input'
import ElectionTimeInput from './election-time-input'

export default function Timeline(props) {
    const { className, style, onDone, electionOM } = props
    const [electionObj, electionMethods] = electionOM
    const [election] = electionObj.elections
    const { timeline, undebateDate, electionDate } = election
    const classes = useStyles(props)

    const datesToArray = obj => {
        let arr = Object.entries(obj).sort(function (a, b) {
            return ('' + Date.parse(b.date)).localeCompare(Date.parse(a.date))
        })
        if (!arr.length) {
            arr.push([])
        }
        return arr
    }

    const moderatorDeadlineReminderEmails = datesToArray(timeline.moderatorDeadlineReminderEmails)
    const moderatorSubmissionDeadline = datesToArray(timeline.moderatorSubmissionDeadline)
    const candidateDeadlineReminderEmails = datesToArray(timeline.candidateDeadlineReminderEmails)
    const candidateSubmissionDeadline = datesToArray(timeline.candidateSubmissionDeadline)

    return (
        <div className={cx(className, classes.wrapper)} style={style}>
            <header className={classes.heading}>
                <span>Fill the date and times for following events to automate the undebate.</span>
                <Submit onDone={onDone} />
            </header>

            <ElectionCreated electionMetadata={election} />
            <div>
                <h4>Moderator Deadline Reminder Emails</h4>
                <p>
                    Moderator will receive two emails as a reminder on this date, usually 2 days and 7 days before the
                    deadline.
                </p>
                <div className={classes.buttonGrid}>
                    {moderatorDeadlineReminderEmails.map(([key, timelineObj]) => {
                        let date = ''
                        let time = ''
                        if (timelineObj) {
                            date = new Date(timelineObj.date)
                            time = date.toLocaleTimeString()
                        }
                        return (
                            <>
                                <ElectionDateInput defaultValue={date} />
                                <ElectionTimeInput defaultValue={time} />
                            </>
                        )
                    })}
                </div>
            </div>
            <div>
                <h4>Moderator Submission Deadline</h4>
                <p>Moderator won't be able to record after this time.</p>
                <div className={classes.buttonGrid}>
                    {moderatorSubmissionDeadline.map(([key, timelineObj]) => {
                        let date = ''
                        let time = ''
                        if (timelineObj) {
                            date = new Date(timelineObj.date)
                            time = date.toLocaleTimeString()
                        }
                        return (
                            <>
                                <ElectionDateInput defaultValue={date} />
                                <ElectionTimeInput defaultValue={time} />
                            </>
                        )
                    })}
                </div>
            </div>
            <div>
                <h4>Candidate Deadline Reminder Emails</h4>
                <p>
                    Candidates who will not have submitted will receive two emails as a reminder on this date, usually 2
                    days before the deadline.
                </p>
                <div className={classes.buttonGrid}>
                    {candidateDeadlineReminderEmails.map(([key, timelineObj]) => {
                        let date = ''
                        let time = ''
                        if (timelineObj) {
                            date = new Date(timelineObj.date)
                            time = date.toLocaleTimeString()
                        }
                        return (
                            <>
                                <ElectionDateInput defaultValue={date} />
                                <ElectionTimeInput defaultValue={time} />
                            </>
                        )
                    })}
                </div>
            </div>
            <div>
                <h4>Candidate Submission Deadline</h4>
                <p>Candidates won't be able to record after this time.</p>
                <div className={classes.buttonGrid}>
                    {candidateSubmissionDeadline.map(([key, timelineObj]) => {
                        let date = ''
                        let time = ''
                        if (timelineObj) {
                            date = new Date(timelineObj.date)
                            time = date.toLocaleTimeString()
                        }
                        return (
                            <>
                                <ElectionDateInput defaultValue={date} />
                                <ElectionTimeInput defaultValue={time} />
                            </>
                        )
                    })}
                </div>
            </div>
            <div>
                <h4>Undebate Goes Live</h4>
                <p>
                    By default, undebate goes live 4 days after candidate submission deadline. But, you can change the
                    date.
                </p>
                <div className={classes.buttonGrid}>
                    <ElectionDateInput defaultValue={undebateDate ?? ''} />
                    <ElectionTimeInput defaultValue={undebateDate && undebateDate.toLocaleTimeString()} />
                </div>
            </div>
            <div>
                <h4>Last Day of Election</h4>
                <p>Undebate gets archived after this time.</p>
                <div className={classes.buttonGrid}>
                    <ElectionDateInput defaultValue={electionDate ?? ''} />
                    <ElectionTimeInput defaultValue={electionDate && electionDate.toLocaleTimeString()} />
                </div>
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
    buttonGrid: {
        display: 'grid',
        gridTemplateRows: 'repeat(2, 5rem)',
        gridTemplateColumns: 'repeat(2, 12rem)',
        justifyContent: 'space-between',
        maxWidth: '450px',
    },
}))
