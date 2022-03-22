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
    const [current, setCurrent] = useState('')

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

    return (
        <div className={cx(className, classes.container)} style={style}>
            <div className={classes.top}>
                <div className={classes.title}>configuration</div>
                <div className={classes.line} />
            </div>
            <div className={classes.bottom}>
                <div
                    onClick={e => {
                        handleClick(e, electionMethods.getElectionStatus() === 'completed', 'Election')
                    }}
                    onMouseEnter={onMouseEnterHandler}
                >
                    <ElectionCategory
                        categoryName='Election'
                        statusObjs={electionMethods.getElectionStatus() === 'completed' ? 'completed' : {}}
                        selected={current?.includes('Election') && !current?.includes('Table')}
                    />
                </div>
                <div
                    onClick={e => {
                        handleClick(e, electionMethods.getTimelineStatus() === 'completed', 'Timeline')
                    }}
                    onMouseEnter={onMouseEnterHandler}
                >
                    <ElectionCategory
                        categoryName='Timeline'
                        statusObjs={
                            electionMethods.getTimelineStatus() === 'completed'
                                ? 'completed'
                                : electionMethods.getTimelineStatus() === 'default'
                                ? {}
                                : { pending: true }
                        }
                        selected={current?.includes('Timeline')}
                    />
                </div>
                <div
                    onClick={e => {
                        handleClick(e, electionMethods.getQuestionsStatus() === 'completed', 'Questions')
                    }}
                    onMouseEnter={onMouseEnterHandler}
                >
                    <ElectionCategory
                        categoryName='Questions'
                        statusObjs={
                            electionMethods.getQuestionsStatus() === 'completed'
                                ? 'completed'
                                : electionMethods.getQuestionsStatus() === 'default'
                                ? {}
                                : { daysLeft: electionMethods.getQuestionsStatus() }
                        }
                        selected={current?.includes('Questions')}
                    />
                </div>
                <div onClick={handleClick} onMouseEnter={onMouseEnterHandler}>
                    <ElectionCategory categoryName='Danger Zone' selected={current?.includes('Danger Zone')} />
                </div>
            </div>
            <div className={classes.top}>
                <div className={classes.title}>moderator</div>
                <div className={classes.line} />
            </div>
            <div className={classes.bottom}>
                <div
                    onClick={e => {
                        handleClick(e, electionMethods.getScriptStatus() === 'completed', 'Script')
                    }}
                    onMouseEnter={onMouseEnterHandler}
                >
                    <ElectionCategory
                        categoryName='Script'
                        statusObjs={
                            electionMethods.getScriptStatus() === 'completed'
                                ? 'completed'
                                : electionMethods.getScriptStatus() === 'default'
                                ? {}
                                : { daysLeft: electionMethods.getScriptStatus() }
                        }
                        selected={current?.includes('Script')}
                    />
                </div>
                <div
                    onClick={e => {
                        handleClick(e, electionMethods.getInvitationStatus() === 'completed', 'Invitation')
                    }}
                    onMouseEnter={onMouseEnterHandler}
                >
                    <ElectionCategory
                        categoryName='Invitation'
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
                        selected={current?.includes('Invitation')}
                    />
                </div>
                <div
                    onClick={e => {
                        handleClick(e, electionMethods.getSubmissionStatus() === 'completed', 'Submission')
                    }}
                    onMouseEnter={onMouseEnterHandler}
                >
                    <ElectionCategory
                        categoryName='Submission'
                        statusObjs={
                            electionMethods.getSubmissionStatus() === 'missed'
                                ? { deadlineMissed: true }
                                : electionMethods.getSubmissionStatus() === 'submitted'
                                ? 'videoSubmitted'
                                : electionMethods.getSubmissionStatus() === 'sent'
                                ? { reminderSent: true }
                                : {}
                        }
                        selected={current?.includes('Submission') && !current?.includes('Submissions')}
                    />
                </div>
            </div>

            <div className={classes.top}>
                <div className={classes.title}>candidate</div>
                <div className={classes.line} />
            </div>

            <div className={classes.bottom}>
                <div
                    onClick={e => {
                        handleClick(e, electionMethods.getElectionTableStatus() === 'completed', 'Election Table')
                    }}
                    onMouseEnter={onMouseEnterHandler}
                >
                    <ElectionCategory
                        categoryName='Election Table'
                        statusObjs={
                            electionMethods.getElectionTableStatus() === 'default'
                                ? {}
                                : electionMethods.getElectionTableStatus() === 'filled'
                                ? 'completed'
                                : { daysLeft: electionMethods.getElectionTableStatus() }
                        }
                        selected={current?.includes('Election Table')}
                    />
                </div>
                <div
                    onClick={e => {
                        handleClick(e, electionMethods.getSubmissionsStatus() !== 'default', 'Submissions')
                    }}
                    onMouseEnter={onMouseEnterHandler}
                >
                    <ElectionCategory
                        categoryName='Submissions'
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
                        selected={current?.includes('Submissions')}
                    />
                </div>
            </div>
            {electionObj?.electionDate && electionObj?.undebateDate && (
                <div
                    className={cx(
                        classes.underbateSection,
                        electionMethods.getUndebateStatus() === 'archieved' && classes.archieved
                    )}
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
    },
    title: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: theme.colorSecondary,
        marginLeft: '1.5625rem',
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
