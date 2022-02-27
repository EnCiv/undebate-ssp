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
    const classes = useStyles(props)
    console.log(electionOM)

    return (
        <div className={cx(className, classes.wrapper)} style={style}>
            <header className={classes.heading}>
                <span>Fill the date and times for following events to automate the undebate.</span>
                <Submit onDone={onDone} />
            </header>

            <ElectionCreated electionMetadata={electionObj.elections[0]} />
            <div>
                <h4>Moderator Deadline Reminder Emails</h4>
                <p>
                    Moderator will receive two emails as a reminder on this date, usually 2 days and 7 days before the
                    deadline.
                </p>
                <div className={classes.buttonGrid}>
                    <ElectionDateInput />
                    <ElectionTimeInput />
                    <ElectionDateInput />
                    <ElectionTimeInput />
                </div>
            </div>
            <div>
                <h4>Moderator Submission Deadline</h4>
                <p>Moderator won't be able to record after this time.</p>
                <div className={classes.buttonGrid}>
                    <ElectionDateInput />
                    <ElectionTimeInput />
                </div>
            </div>
            <div>
                <h4>Candidate Deadline Reminder Emails</h4>
                <p>
                    Candidates who will not have submitted will receive two emails as a reminder on this date, usually 2
                    days before the deadline.
                </p>
                <div className={classes.buttonGrid}>
                    <ElectionDateInput />
                    <ElectionTimeInput />
                    <ElectionDateInput />
                    <ElectionTimeInput />
                </div>
            </div>
            <div>
                <h4>Candidate Submission Deadline</h4>
                <p>Candidates won't be able to record after this time.</p>
                <div className={classes.buttonGrid}>
                    <ElectionDateInput />
                    <ElectionTimeInput />
                </div>
            </div>
            <div>
                <h4>Undebate Goes Live</h4>
                <p>
                    By default, undebate goes live 4 days after candidate submission deadline. But, you can change the
                    date.
                </p>
                <div className={classes.buttonGrid}>
                    <ElectionDateInput />
                    <ElectionTimeInput />
                </div>
            </div>
            <div>
                <h4>Last Day of Election</h4>
                <p>Undebate gets archived after this time.</p>
                <div className={classes.buttonGrid}>
                    <ElectionDateInput />
                    <ElectionTimeInput />
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
