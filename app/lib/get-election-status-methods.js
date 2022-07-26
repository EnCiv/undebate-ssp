// https://github.com/EnCiv/undebate-ssp/issues/105

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
        return !!Object.keys(state?.moderator?.submissions || {}).length
    }
    const checkSubmissionBeforeDeadline = () => {
        const deadline = getLatestObjByDate(state?.timeline?.moderatorSubmissionDeadline)?.date
        return new Date().toISOString() < deadline && !checkVideoSubmitted()
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
    const getRecorderStatus = () => {
        if (getScriptStatus() === 'completed') {
            if (Object.keys(state?.moderator?.recorders || {}).length) return 'completed'
            else return 'ready'
        }
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
    const areCandidatesReadyForInvites = () =>
        Object.values(state.candidates).every(candidate => {
            return (
                candidate.name &&
                candidate.email &&
                candidate.uniqueId &&
                candidate.office &&
                candidate.recorders &&
                Object.keys(candidate.recorders).length > 0
            )
        })
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
        getRecorderStatus,
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
        areCandidatesReadyForInvites,
    }
}

export default getElectionStatusMethods
