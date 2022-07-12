// https://github.com/EnCiv/undebate-ssp/issues/105
import {
    SvgAccepted,
    SvgCompleted,
    SvgDeadlineMissed,
    SvgDeclined,
    SvgLock,
    SvgReminderSent,
    SvgSent,
    SvgVideoSubmitted,
} from '../components/lib/svg'

const checkDateCompleted = obj => {
    for (const key in obj) {
        if (obj[key].date !== '') {
            return true
        }
    }
    return false
}

const checkObjCompleted = obj => {
    let count = 0
    for (const key in obj) {
        count++
        if (obj[key].text === '') {
            return false
        }
    }
    return !!count // if no keys then false
}

const getLatestObjByDate = oList => {
    if (!oList) return undefined
    const latest = Object.values(oList).reduce(
        (latest, obj) => (latest.date.localeCompare(obj?.date || '') < 0 ? obj : latest),
        { date: '' }
    )
    if (!latest.date) return undefined
    return latest
}

function ProgressBar(props) {
    const classes = useStyles(props)
    return <div className={classes.progressBar} />
}

export const statusInfoEnum = {
    completed: { icon: <SvgCompleted /> },
    pending: { text: 'Pending…' },
    daysLeft: v => ({
        text: `${v} days left…`,
    }),
    reminderSent: {
        icon: <SvgReminderSent />,
        text: 'Reminder Sent',
    },
    percentComplete: v => ({
        text: <ProgressBar percentDone={v} />,
    }),
    videoSubmitted: { icon: <SvgVideoSubmitted />, text: 'Video Submitted' },
    deadlineMissed: { icon: <SvgDeadlineMissed />, text: 'Deadline Missed' },
    accepted: { icon: <SvgAccepted />, text: 'Accepted' },
    declined: { icon: <SvgDeclined />, text: 'Declined' },
    sent: { icon: <SvgSent />, text: 'Sent' },
    locked: { icon: <SvgLock /> },
}

function idCompare(a, b) {
    if (typeof a === 'object') a = a.toString()
    if (typeof b === 'object') b = b.toString()
    return a.localeCompare(b)
}

export const getLatestIota = iotas => {
    if (!iotas) return undefined
    if (typeof iotas !== 'object') return undefined
    const latest = Object.values(iotas).reduce((latest, obj) => (idCompare(latest._id, obj._id) < 0 ? obj : latest), {
        _id: '',
    })
    if (!latest._id) return undefined
    return latest
}
export const checkCandidateVideoSubmitted = candidate => {
    let result = false
    candidate?.submissions?.forEach(submission => {
        if (submission.url && submission.url !== '') {
            result = true
        }
    })
    return result
}

function getElectionStatusMethods(dispatch, state) {
    const recentInvitationStatus = () => {
        if (!state?.moderator?.invitations || !state?.moderator?.invitations[0]) return {}
        let recent = state?.moderator?.invitations[0]
        state?.moderator?.invitations.forEach(invitation => {
            if (new Date(invitation?.responseDate).getTime() > new Date(recent?.responseDate).getTime()) {
                recent = invitation
            }
        })
        return recent
    }
    const checkTimelineCompleted = () => {
        return (
            checkDateCompleted(state?.timeline?.moderatorDeadlineReminderEmails) &&
            checkDateCompleted(state?.timeline?.moderatorSubmissionDeadline) &&
            checkDateCompleted(state?.timeline?.candidateDeadlineReminderEmails) &&
            checkDateCompleted(state?.timeline?.candidateSubmissionDeadline)
        )
    }
    const getElectionStatus = () => {
        if (state?.electionName && state?.organizationName) return 'completed'
        return 'default'
    }

    const getTimelineStatus = () => {
        if (getElectionStatus() === 'default') return 'default'
        if (getElectionStatus() === 'completed' && !checkTimelineCompleted()) return 'pending'
        return 'completed'
    }

    const countDayLeft = () => {
        return ((new Date(state?.electionDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)).toFixed()
    }

    const checkVideoSubmitted = () => {
        let result = false
        state?.moderator?.submissions?.forEach(submission => {
            if (submission.url !== '') {
                result = true
            }
        })
        return result
    }
    const checkSubmissionBeforeDeadline = () => {
        let result = false
        const submission = state?.timeline?.moderatorSubmissionDeadline
        for (const key in submission) {
            if (submission[key]?.date && submission[key]?.sent) {
                result = true
            }
        }
        return result
    }
    const countSubmissionAccepted = () => {
        let count = 0
        state?.moderator?.invitations?.forEach(invitation => {
            if (invitation?.status === 'Accepted') {
                count += 1
            }
        })
        return count
    }
    const countSubmissionDeclined = () => {
        let count = 0
        state?.moderator?.invitations?.forEach(invitation => {
            if (invitation?.status === 'Declined') {
                count += 1
            }
        })
        return count
    }

    const countSubmissionReminderSet = () => {
        let count = 0
        const reminder = state?.timeline?.moderatorDeadlineReminderEmails
        for (const key in reminder) {
            if (reminder[key]?.sent) {
                count += 1
            }
        }
        return count
    }

    const countSubmissionDeadlineMissed = () => {
        let count = 0
        const submission = state?.timeline?.moderatorSubmissionDeadline
        for (const key in submission) {
            if (!submission[key]?.sent) {
                count += 1
            }
        }
        return count
    }

    const checkReminderSent = () => {
        let result = false
        const reminder = state?.timeline?.moderatorDeadlineReminderEmails
        // eslint-disable-next-line no-restricted-syntax
        for (const key in reminder) {
            if (reminder[key]?.sent) {
                result = true
            }
        }
        return result
    }

    const areQuestionsLocked = () => {
        const invites = state?.moderator?.invitations
        if (invites) {
            for (const inv of invites) {
                if (inv.sentDate) return true
            }
        }
        return false
    }

    const getQuestionsStatus = () => {
        if (getTimelineStatus() === 'completed' && !checkObjCompleted(state?.questions)) return countDayLeft()
        if (getTimelineStatus() === 'completed' && checkObjCompleted(state?.questions)) return 'completed'
        return 'default'
    }
    const getScriptStatus = () => {
        if (getQuestionsStatus() === 'completed' && !checkObjCompleted(state?.script)) return countDayLeft()
        if (getQuestionsStatus() === 'completed' && checkObjCompleted(state?.script)) return 'completed'
        return 'default'
    }
    const getInvitationStatus = () => {
        if (getScriptStatus() !== 'completed') return 'default'
        if (recentInvitationStatus()?.status === 'Accepted') return 'accepted'
        if (recentInvitationStatus()?.status === 'Declined') return 'declined'
        if (recentInvitationStatus()?.sentDate) return 'sent'
        return countDayLeft()
    }
    const getSubmissionStatus = () => {
        if (state?.timeline?.moderatorSubmissionDeadline && !checkSubmissionBeforeDeadline()) return 'missed'
        if (state?.moderator?.submissions && checkVideoSubmitted()) return 'submitted'
        if (state?.timeline?.moderatorDeadlineReminderEmails && checkReminderSent()) return 'sent'
        return 'default'
    }
    const getElectionTableStatus = () => {
        if (state?.candidates && Object.keys(state?.candidates)?.length >= 1) return 'filled'
        if (recentInvitationStatus()?.sentDate) return countDayLeft()
        return 'default'
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
    const getUndebateStatus = () => {
        if (new Date(state?.electionDate).getTime() < new Date().getTime()) return 'archived'
        if (new Date(state?.undebateDate).getTime() < new Date().getTime()) return 'pending'
        return 'isLive'
    }

    const isModeratorReadyForCreateRecorder = () => {
        if (!state?.moderator?.name) return false
        if (!state?.moderator?.email) return false
        if (getQuestionsStatus() !== 'completed') return false
        if (getScriptStatus() !== 'completed') return false
        return true
    }

    const isModeratorReadyToInvite = () => {
        if (!isModeratorReadyForCreateRecorder()) return false
        if (!getLatestObjByDate(state?.timeline?.moderatorSubmissionDeadline)) return false
        if (!getLatestIota(state?.moderator?.recorders)) return false
        return true
    }

    const areCandidatesReadyToInvite = () => {
        // todo
        return false
    }

    const getModeratorStatus = () => {
        // todo validate this logic
        if (!checkTimelineCompleted()) {
            return '-'
        }
        const scriptStatus = getScriptStatus()
        const inviteStatus = getInvitationStatus()
        const submissionStatus = getSubmissionStatus()
        if (scriptStatus !== 'completed') {
            return 'Script Pending...'
        } else if (scriptStatus === 'completed' && inviteStatus === 'sent') {
            return 'Script Sent'
        }
        if (inviteStatus === 'declined') {
            return 'Invite Declined'
        } else if (inviteStatus === 'accepted' && submissionStatus === 'default') {
            return 'Invite Accepted'
        }
        if (submissionStatus === 'sent') {
            return 'Reminder Sent'
        } else if (submissionStatus === 'submitted') {
            return 'Video Submitted'
        } else if (submissionStatus === 'missed') {
            return 'Deadline Missed'
        }
        return 'unknown'
    }

    const getElectionListStatus = () => {
        // todo validate this logic
        const undebateStatus = getUndebateStatus()
        const moderatorStatus = getModeratorStatus()
        if (undebateStatus === 'archived') {
            return 'Archived'
        } else if (undebateStatus === 'isLive') {
            return 'Live'
        } else if (['Script Pending...', 'Script Sent'].includes(moderatorStatus)) {
            return 'Configuring'
        } else {
            return 'In Progress'
        }
    }

    const getCandidatesStatus = () => {
        // todo validate this logic
        // Election Table Pending..., Invite Pending..., All Submitted, All Missed Deadline, x/y
        if (!checkTimelineCompleted()) {
            return '-'
        }
        if (getElectionTableStatus() !== 'filled') {
            return 'Election Table Pending...'
        }
        // todo fix this - any candidate doesn't have invitations list?
        if (areCandidatesReadyToInvite() && getSubmissionsStatus() === 'default') {
            return 'Invite Pending...'
        }
        if (getSubmissionsStatus() !== 'default') {
            const totalCandidatesCount = Object.values(state?.candidates).length
            let completeCandidatesCount = 0
            Object.values(state?.candidates)?.forEach(candidate => {
                if (checkCandidateVideoSubmitted(candidate)) {
                    completeCandidatesCount += 1
                }
            })
            return completeCandidatesCount + '/' + totalCandidatesCount
        }
        return 'unknown'
    }

    return {
        getLatestObj: getLatestObjByDate,
        getLatestIota,
        checkDateCompleted,
        checkTimelineCompleted,
        getTimelineStatus,
        getElectionStatus,
        countDayLeft,
        checkObjCompleted,
        getUndebateStatus,
        recentInvitationStatus,
        getQuestionsStatus,
        getScriptStatus,
        getInvitationStatus,
        checkVideoSubmitted,
        checkSubmissionBeforeDeadline,
        countSubmissionAccepted,
        countSubmissionDeclined,
        countSubmissionReminderSet,
        countSubmissionDeadlineMissed,
        getSubmissionStatus,
        getElectionTableStatus,
        getSubmissionsStatus,
        checkReminderSent,
        areQuestionsLocked,
        isModeratorReadyForCreateRecorder,
        isModeratorReadyToInvite,
        getModeratorStatus,
        getElectionListStatus,
        getCandidatesStatus,
    }
}

export default getElectionStatusMethods
