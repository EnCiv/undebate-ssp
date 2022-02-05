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
    const [electionObj] = electionOM
    const [current, setCurrent] = useState('')

    const getElectionStatus = () => {
        if (electionObj?.electionName && electionObj?.organizationName) return 'completed'
        return 'default'
    }

    const checkDateCompleted = obj => {
        // eslint-disable-next-line no-restricted-syntax
        for (const key in obj) {
            if (obj[key].date !== '') {
                return true
            }
        }
        return false
    }

    const checkTimelineCompleted = () => {
        return (
            checkDateCompleted(electionObj?.timeline?.moderatorDeadlineReminderEmails) &&
            checkDateCompleted(electionObj?.timeline?.moderatorSubmissionDeadline) &&
            checkDateCompleted(electionObj?.timeline?.candidateDeadlineReminderEmails) &&
            checkDateCompleted(electionObj?.timeline?.candidateSubmissionDeadline)
        )
    }

    const getTimelineStatus = () => {
        if (getElectionStatus() === 'default') return 'default'
        if (getElectionStatus() === 'completed' && !checkTimelineCompleted()) return 'pending'
        return 'completed'
    }

    const checkObjCompleted = obj => {
        // eslint-disable-next-line no-restricted-syntax
        for (const key in obj) {
            if (obj[key].text !== '') {
                return true
            }
        }
        return false
    }

    const countDayLeft = () =>
        ((new Date(electionObj?.electionDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)).toFixed()

    const getQuestionsStatus = () => {
        if (getTimelineStatus() === 'completed' && !checkObjCompleted(electionObj?.questions)) return countDayLeft()
        if (getTimelineStatus() === 'completed' && checkObjCompleted(electionObj?.questions)) return 'completed'
        return 'default'
    }

    const getScriptStatus = () => {
        if (getQuestionsStatus() === 'completed' && !checkObjCompleted(electionObj?.script)) return countDayLeft()
        if (getQuestionsStatus() === 'completed' && checkObjCompleted(electionObj?.script)) return 'completed'
        return 'default'
    }

    const recentInvitationStatus = () => {
        let recent = electionObj?.moderator?.invitations[0]
        electionObj?.moderator?.invitations.forEach(invitation => {
            if (new Date(invitation?.responseDate).getTime() > new Date(recent?.responseDate).getTime()) {
                recent = invitation
            }
        })
        return recent
    }

    const getInvitationStatus = () => {
        if (getScriptStatus() !== 'completed') return 'default'
        if (recentInvitationStatus()?.status === 'Accepted') return 'accepted'
        if (recentInvitationStatus()?.status === 'Declined') return 'declined'
        if (recentInvitationStatus()?.sentDate) return 'sent'
        return countDayLeft()
    }

    const checkReminderSent = () => {
        let result = false
        const reminder = electionObj?.timeline?.moderatorDeadlineReminderEmails
        // eslint-disable-next-line no-restricted-syntax
        for (const key in reminder) {
            if (reminder[key]?.sent) {
                result = true
            }
        }
        return result
    }

    const checkVideoSubmitted = () => {
        let result = false
        // eslint-disable-next-line consistent-return
        electionObj?.moderator?.submissions?.forEach(submission => {
            if (submission.url !== '') {
                result = true
            }
        })
        return result
    }

    const checkSubmissionBeforeDeadline = () => {
        let result = false
        const submission = electionObj?.timeline?.moderatorSubmissionDeadline
        // eslint-disable-next-line no-restricted-syntax
        for (const key in submission) {
            if (submission[key]?.date && submission[key]?.sent) {
                result = true
            }
        }
        return result
    }

    const getSubmissionStatus = () => {
        if (!checkSubmissionBeforeDeadline()) return 'missed'
        if (checkVideoSubmitted()) return 'submitted'
        if (checkReminderSent()) return 'sent'
        return 'default'
    }

    const getElectionTableStatus = () => {
        if (electionObj?.candidates && Object.keys(electionObj?.candidates)?.length >= 1) return 'filled'
        if (recentInvitationStatus()?.sentDate) return countDayLeft()
        return 'default'
    }

    const countSubmissionAccepted = () => {
        let count = 0
        electionObj?.moderator?.invitations?.forEach(invitation => {
            if (invitation?.status === 'Accepted') {
                count += 1
            }
        })
        return count
    }

    const countSubmissionDeclined = () => {
        let count = 0
        electionObj?.moderator?.invitations?.forEach(invitation => {
            if (invitation?.status === 'Declined') {
                count += 1
            }
        })
        return count
    }

    const countSubmissionReminderSet = () => {
        let count = 0
        const reminder = electionObj?.timeline?.moderatorDeadlineReminderEmails
        // eslint-disable-next-line no-restricted-syntax
        for (const key in reminder) {
            if (reminder[key]?.sent) {
                count += 1
            }
        }
        return count
    }

    const countSubmissionDeadlineMissed = () => {
        let count = 0
        const submission = electionObj?.timeline?.moderatorSubmissionDeadline
        // eslint-disable-next-line no-restricted-syntax
        for (const key in submission) {
            if (!submission[key]?.sent) {
                count += 1
            }
        }
        return count
    }

    const getSubmissionsStatus = () => {
        if (recentInvitationStatus()?.sentDate)
            return {
                accepted: countSubmissionAccepted(),
                declined: countSubmissionDeclined(),
                reminderSent: countSubmissionReminderSet(),
                deadlineMissed: countSubmissionDeadlineMissed(),
            }
        return 'default'
    }

    const getUnderbateStatus = () => {
        if (new Date(electionObj?.electionDate).getTime() < new Date().getTime()) return 'archieved'
        if (new Date(electionObj?.undebateDate).getTime() < new Date().getTime()) return 'pending'
        return 'isLive'
    }

    const convertStringDate = date => {
        const d = new Date(date)
        return `${d.getDate()} ${d.toLocaleString('en-us', { month: 'long' })} ${d.getFullYear()}`
    }

    const handleClick = (e, valid, value) => {
        setCurrent(e.target.parentNode.innerText)
        onDone({ valid, value })
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
                        handleClick(e, getElectionStatus() === 'completed', 'Election')
                    }}
                >
                    <ElectionCategory
                        categoryName='Election'
                        statusObjs={getElectionStatus() === 'completed' ? 'completed' : {}}
                        selected={current?.includes('Election')}
                    />
                </div>
                <div
                    onClick={e => {
                        handleClick(e, getTimelineStatus() === 'completed', 'Timeline')
                    }}
                >
                    <ElectionCategory
                        categoryName='Timeline'
                        statusObjs={
                            getTimelineStatus() === 'completed'
                                ? 'completed'
                                : getTimelineStatus() === 'default'
                                ? {}
                                : { pending: true }
                        }
                        selected={current?.includes('Timeline')}
                    />
                </div>
                <div
                    onClick={e => {
                        handleClick(e, getQuestionsStatus() === 'completed', 'Questions')
                    }}
                >
                    <ElectionCategory
                        categoryName='Questions'
                        statusObjs={
                            getQuestionsStatus() === 'completed'
                                ? 'completed'
                                : getQuestionsStatus() === 'default'
                                ? {}
                                : { daysLeft: getQuestionsStatus() }
                        }
                        selected={current?.includes('Questions')}
                    />
                </div>
                <div onClick={handleClick}>
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
                        handleClick(e, getScriptStatus() === 'completed', 'Script')
                    }}
                >
                    <ElectionCategory
                        categoryName='Script'
                        statusObjs={
                            getScriptStatus() === 'completed'
                                ? 'completed'
                                : getScriptStatus() === 'default'
                                ? {}
                                : { daysLeft: getScriptStatus() }
                        }
                        selected={current?.includes('Script')}
                    />
                </div>
                <div
                    onClick={e => {
                        handleClick(e, getInvitationStatus() === 'completed', 'Invitation')
                    }}
                >
                    <ElectionCategory
                        categoryName='Invitation'
                        statusObjs={
                            getInvitationStatus() === 'default'
                                ? {}
                                : getInvitationStatus() === 'sent'
                                ? { sent: true }
                                : getInvitationStatus() === 'accepted'
                                ? { accepted: true }
                                : getInvitationStatus() === 'declined'
                                ? { declined: true }
                                : { daysLeft: getInvitationStatus() }
                        }
                        selected={current?.includes('Invitation')}
                    />
                </div>
                <div
                    onClick={e => {
                        handleClick(e, getSubmissionStatus() === 'completed', 'Submission')
                    }}
                >
                    <ElectionCategory
                        categoryName='Submission'
                        statusObjs={
                            getSubmissionStatus() === 'missed'
                                ? { deadlineMissed: true }
                                : getSubmissionStatus() === 'submitted'
                                ? 'videoSubmitted'
                                : getSubmissionStatus() === 'sent'
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
                        handleClick(e, getElectionTableStatus() === 'completed', 'Election Table')
                    }}
                >
                    <ElectionCategory
                        categoryName='Election Table'
                        statusObjs={
                            getElectionTableStatus() === 'default'
                                ? {}
                                : getElectionTableStatus() === 'filled'
                                ? 'completed'
                                : { daysLeft: getElectionTableStatus() }
                        }
                        selected={current?.includes('Election Table')}
                    />
                </div>
                <div
                    onClick={e => {
                        handleClick(e, getSubmissionsStatus() !== 'default', 'Submissions')
                    }}
                >
                    <ElectionCategory
                        categoryName='Submissions'
                        statusObjs={
                            getSubmissionsStatus() === 'default'
                                ? {}
                                : [
                                      { accepted: getSubmissionsStatus().accepted },
                                      { declined: getSubmissionsStatus().declined },
                                      { reminderSent: getSubmissionsStatus().reminderSent },
                                      { deadlineMissed: getSubmissionsStatus().deadlineMissed },
                                  ]
                        }
                        selected={current?.includes('Submissions')}
                    />
                </div>
            </div>
            {electionObj?.electionDate && electionObj?.undebateDate && (
                <div
                    className={cx(classes.underbateSection, getUnderbateStatus() === 'archieved' && classes.archieved)}
                >
                    <div className={classes.left}>
                        <div className={classes.underbate}>
                            Underbate{' '}
                            {getUnderbateStatus() === 'pending'
                                ? ''
                                : getUnderbateStatus() === 'isLive'
                                ? 'is Live'
                                : 'Archieved'}
                        </div>
                        <div className={classes.description}>
                            {getUnderbateStatus() === 'pending'
                                ? `Live on ${convertStringDate(electionObj?.undebateDate)}`
                                : getUnderbateStatus() === 'isLive'
                                ? `Live until ${convertStringDate(electionObj?.electionDate)}`
                                : `Election ended on ${convertStringDate(electionObj?.electionDate)}`}
                        </div>
                        <div className={classes.dayLeft}>{countDayLeft()} days left</div>
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
