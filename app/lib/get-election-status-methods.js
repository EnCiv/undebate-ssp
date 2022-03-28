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
    for (const key in obj) {
        if (obj[key].text !== '') {
            return true
        }
    }
    return false
}

function getElectionStatusMethods(dispatch, state) {
    const recentInvitationStatus = () => {
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

    return {
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
    }
}

export default getElectionStatusMethods
