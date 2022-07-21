// https://github.com/EnCiv/undebate-ssp/issues/16
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import ElectionCategory from './election-category'
import { SvgRightArrow } from './lib/svg'

export default function NavigationPanel({ className, style, electionOM, onDone }) {
    const classes = useStyles()
    const [electionObj, electionMethods] = electionOM
    const [current, setCurrent] = useState('Election')

    const convertStringDate = date => {
        const d = new Date(date)
        return `${d.getDate()} ${d.toLocaleString('en-us', { month: 'long' })} ${d.getFullYear()}`
    }

    const handleClick = (e, valid, value) => {
        setCurrent(e.target.parentNode.innerText)
        onDone({ valid, value })
    }

    const onMouseEnterHandler = e => {
        e.target.style.cursor = 'pointer'
    }

    function RenderBar(props) {
        const { name, statusObjs, valid } = props
        return (
            <div
                onClick={e => {
                    handleClick(e, valid, name)
                }}
                onMouseEnter={onMouseEnterHandler}
            >
                <ElectionCategory categoryName={name} statusObjs={statusObjs} selected={current === name} />
            </div>
        )
    }

    return (
        <div className={cx(className, classes.container)} style={style}>
            <div className={classes.top}>
                <div className={classes.title}>configuration</div>
                <div className={classes.line} />
            </div>
            <div className={classes.bottom}>
                <RenderBar
                    key='Election'
                    name='Election'
                    valid={electionMethods.getElectionStatus() === 'completed'}
                    statusObjs={electionMethods.getElectionStatus() === 'completed' ? 'completed' : {}}
                />
                <RenderBar
                    key='Timeline'
                    name='Timeline'
                    valid={electionMethods.getTimelineStatus() === 'completed'}
                    statusObjs={
                        electionMethods.getTimelineStatus() === 'completed'
                            ? 'completed'
                            : electionMethods.getTimelineStatus() === 'default'
                            ? {}
                            : { pending: true }
                    }
                />
                <RenderBar
                    key='Questions'
                    name='Questions'
                    valid={electionMethods.getQuestionsStatus() === 'completed'}
                    statusObjs={
                        electionMethods.getQuestionsStatus() === 'completed'
                            ? 'completed'
                            : electionMethods.getQuestionsStatus() === 'default'
                            ? {}
                            : { daysLeft: electionMethods.getQuestionsStatus() }
                    }
                />
                {/* <div onClick={handleClick} onMouseEnter={onMouseEnterHandler}>
                    <ElectionCategory categoryName='Danger Zone' selected={current?.includes('Danger Zone')} />
                </div> */}
            </div>
            <div className={classes.top}>
                <div className={classes.title}>moderator</div>
                <div className={classes.line} />
            </div>
            <div className={classes.bottom}>
                <RenderBar
                    name='Script'
                    valid={electionMethods.getScriptStatus() === 'completed'}
                    statusObjs={
                        electionMethods.getScriptStatus() === 'completed'
                            ? 'completed'
                            : electionMethods.getScriptStatus() === 'default'
                            ? {}
                            : { daysLeft: electionMethods.getScriptStatus() }
                    }
                />
                <RenderBar
                    key='Recorder'
                    name='Recorder'
                    valid={true}
                    statusObjs={
                        electionMethods.getScriptStatus() === 'completed'
                            ? 'completed'
                            : electionMethods.getScriptStatus() === 'default'
                            ? {}
                            : { daysLeft: electionMethods.getScriptStatus() }
                    }
                />
                <RenderBar
                    key='Invitation'
                    name='Invitation'
                    valid={electionMethods.getInvitationStatus() === 'completed'}
                    statusObjs={
                        electionMethods.getInvitationStatus() === 'default'
                            ? {}
                            : electionMethods.getInvitationStatus() === 'sent'
                            ? { sent: true }
                            : electionMethods.getInvitationStatus() === 'accepted'
                            ? { accepted: true }
                            : electionMethods.getInvitationStatus() === 'declined'
                            ? { declined: true }
                            : { daysLeft: electionMethods.getInvitationStatus() }
                    }
                />
                <RenderBar
                    key='Submission'
                    name='Submission'
                    valid={electionMethods.getSubmissionStatus() === 'completed'}
                    statusObjs={
                        electionMethods.getSubmissionStatus() === 'missed'
                            ? { deadlineMissed: true }
                            : electionMethods.getSubmissionStatus() === 'submitted'
                            ? 'videoSubmitted'
                            : electionMethods.getSubmissionStatus() === 'sent'
                            ? { reminderSent: true }
                            : {}
                    }
                />
            </div>
            <div className={classes.top}>
                <div className={classes.title}>candidates</div>
                <div className={classes.line} />
            </div>
            <div className={classes.bottom}>
                <RenderBar
                    key='Election Table'
                    name='Election Table'
                    valid={electionMethods.getElectionTableStatus() === 'completed'}
                    statusObjs={
                        electionMethods.getElectionTableStatus() === 'default'
                            ? {}
                            : electionMethods.getElectionTableStatus() === 'filled'
                            ? 'completed'
                            : { daysLeft: electionMethods.getElectionTableStatus() }
                    }
                />
                <RenderBar
                    key='Submissions'
                    name='Submissions'
                    valid={electionMethods.getSubmissionsStatus() !== 'default'}
                    statusObjs={
                        electionMethods.getSubmissionsStatus() === 'default'
                            ? {}
                            : [
                                  { accepted: electionMethods.getSubmissionsStatus().accepted },
                                  { declined: electionMethods.getSubmissionsStatus().declined },
                                  { reminderSent: electionMethods.getSubmissionsStatus().reminderSent },
                                  { deadlineMissed: electionMethods.getSubmissionsStatus().deadlineMissed },
                              ]
                    }
                />
            </div>
            {electionObj?.electionDate && electionObj?.undebateDate && (
                <div
                    className={cx(
                        classes.underbateSection,
                        electionMethods.getUndebateStatus() === 'archieved' && classes.archieved
                    )}
                    onClick={e => {
                        handleClick(e, true, 'Undebate')
                    }}
                    onMouseEnter={onMouseEnterHandler}
                >
                    <div className={classes.left}>
                        <div className={classes.underbate}>
                            Underbate{' '}
                            {electionMethods.getUndebateStatus() === 'pending'
                                ? ''
                                : electionMethods.getUndebateStatus() === 'isLive'
                                ? 'is Live'
                                : 'Archieved'}
                        </div>
                        <div className={classes.description}>
                            {electionMethods.getUndebateStatus() === 'pending'
                                ? `Live on ${convertStringDate(electionObj?.undebateDate)}`
                                : electionMethods.getUndebateStatus() === 'isLive'
                                ? `Live until ${convertStringDate(electionObj?.electionDate)}`
                                : `Election ended on ${convertStringDate(electionObj?.electionDate)}`}
                        </div>
                        <div className={classes.dayLeft}>{electionMethods.countDayLeft()} days left</div>
                    </div>
                    <div className={classes.arrow}>
                        <SvgRightArrow />
                    </div>
                </div>
            )}
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    top: {
        display: 'flex',
        alignItems: 'center',
        paddingTop: '3.125rem',
        '&:first-child': {
            paddingTop: '0px',
        },
    },
    title: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: theme.colorSecondary,
        marginLeft: '2.5rem',
    },
    line: {
        border: `1px solid ${theme.colorSecondary}`,
        opacity: '25%',
        width: '100%',
        margin: '0.625rem',
    },
    bottom: {
        padding: '1.5625rem',
    },
    underbateSection: {
        margin: '0 1.5625rem',
        background: theme.colorPrimary,
        borderRadius: theme.defaultBorderRadius,
        padding: '1.5rem',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    archieved: {
        background: theme.colorSecondary,
    },
    underbate: {
        fontWeight: '600',
        fontSize: '1.125rem',
    },
    description: {
        fontSize: '1rem',
        opacity: '0.7',
        padding: '0.625rem 0',
    },
    dayLeft: {
        fontSize: '1rem',
        opacity: '0.5',
    },
}))
