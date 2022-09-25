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
import { ProgressBar } from '../components/election-category'
import ObjectID from 'isomorphic-mongo-objectid'
import {getStatus, validStatuses} from "../components/lib/get-candidate-invite-status";

export const candidateFilters = {
    ALL(candidate) {
        return true
    },
    NOT_YET_SUBMITTED(candidate) {
        return (
            Object.keys(candidate?.invitations || {}).length && Object.keys(candidate?.submissions || {}).length === 0
        )
    },
    NOT_YET_INVITED(candidate) {
        return Object.keys(candidate?.invitations || {}).length === 0
    },
}

export const checkDateCompleted = obj => {
    for (const key in obj) {
        if (obj[key].date !== '') {
            return true
        }
    }
    return false
}

export const checkObjCompleted = obj => {
    let count = 0
    for (const key in obj) {
        count++
        if (obj[key].text === '') {
            return false
        }
    }
    return !!count // if no keys then false
}

export const getLatestObjByDate = oList => {
    if (!oList) return undefined
    const latest = Object.values(oList).reduce(
        (latest, obj) => (latest.date.localeCompare(obj?.date || '') < 0 ? obj : latest),
        { date: '' }
    )
    if (!latest.date) return undefined
    return latest
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

export const allDateFilterOptions = ['Last year', 'Last 6 months', 'Last month', 'Future']
export const urgentModeratorStatuses = ['Invite Declined', 'Deadline Missed', 'Reminder Sent']
export const allModeratorStatusTexts = [
    '-',
    'Script Pending...',
    'Script Sent',
    'Invite Accepted',
    'Invite Declined',
    'Reminder Sent',
    'Video Submitted',
    'Deadline Missed',
]
export const allCandidatesStatusTexts = [
    '-',
    'Election Table Pending...',
    'Invite Pending...',
    'In Progress',
    'Missed Deadline',
]
export const allElectionStatusTexts = ['Configuring', 'In Progress', 'Live', 'Archived']

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
    return !!Object.values(candidate?.submissions || {}).length
}

export const daysBetweenDates = (date1, date2) => {
    if (!date1 || !date2) {
        return undefined
    }
    const diffInTime = date2.getTime() - date1.getTime()
    return (diffInTime / (1000 * 3600 * 24)).toFixed()
}

export const getDaysText = (daysRemaining) => {
    if (daysRemaining === undefined || daysRemaining === null || daysRemaining === '') {
        return ''
    }
    let daysText
    if (daysRemaining > 0) {
        daysText = daysRemaining + ' days left'
    } else if (daysRemaining === 0 || daysRemaining === -0) {
        daysText = 'Today'
    } else {
        daysText = daysRemaining * -1 + ' days ago'
    }
    return daysText
}

function getElectionStatusMethods(dispatch, state) {
    const recentModeratorInvitationStatus = () => getLatestIota(state?.moderator?.invitations)
    const checkTimelineCompleted = () => {
        /* REMINDERS not implemented yet
        checkDateCompleted(state?.timeline?.moderatorDeadlineReminderEmails) &&
        checkDateCompleted(state?.timeline?.candidateDeadlineReminderEmails) &&
        */
        return (
            checkDateCompleted(state?.timeline?.moderatorSubmissionDeadline) &&
            checkDateCompleted(state?.timeline?.candidateSubmissionDeadline) &&
            !!state.undebateDate &&
            !!state.electionDate
        )
    }
    const getElectionStatus = () => {
        if (
            state?.doneLocked?.['Election']?.done &&
            state?.electionName &&
            state?.organizationName &&
            state?.organizationUrl &&
            state?.email
        )
            return 'completed'
        return 'default'
    }

    const getTimelineStatus = () => {
        if (checkTimelineCompleted() && state?.doneLocked?.['Timeline']?.done) return 'completed'
        if (
            checkDateCompleted(state?.timeline?.moderatorSubmissionDeadline) ||
            checkDateCompleted(state?.timeline?.candidateSubmissionDeadline) ||
            state.undebateDate ||
            state.electionDate
        )
            return 'pending'
        return 'default'
    }

    const countDayLeft = () => {
        if (!state?.electionDate) return undefined
        return daysBetweenDates(new Date(), new Date(state?.electionDate)).toString()
    }

    const checkModeratorVideoSubmitted = () => {
        return !!Object.keys(state?.moderator?.submissions || {}).length
    }

    const getDateOfLatestIota = iotas => {
        const _id = getLatestIota(iotas)?._id
        if (!_id) return undefined
        return ObjectID(_id).getDate().toISOString()
    }

    const checkModeratorSubmissionBeforeDeadline = () => {
        const submissionDate = getDateOfLatestIota(state?.moderator?.submissions)
        if (!submissionDate) return false
        const deadline = getLatestObjByDate(state?.timeline?.moderatorSubmissionDeadline)?.date
        return submissionDate < deadline
    }

    // Start Moderator Count Methods
    const countModeratorInvitationAccepted = () =>
        Object.values(state?.moderator?.invitations || {}).reduce(
            (count, invitation) => (invitation.status === 'Accepted' ? count + 1 : count),
            0
        )

    const countModeratorInvitationDeclined = () =>
        Object.values(state?.moderator?.invitations || {}).reduce(
            (count, invitation) => (invitation.status === 'Declined' ? count + 1 : count),
            0
        )

    const countModeratorInvitationReminderSent = () => {
        let count = 0
        const reminder = state?.timeline?.moderatorDeadlineReminderEmails
        for (const key in reminder) {
            if (reminder[key]?.sent) {
                count += 1
            }
        }
        return count
    }

    const countModeratorInvitationDeadlineMissed = () => {
        let count = 0
        const submission = state?.timeline?.moderatorSubmissionDeadline
        for (const key in submission) {
            if (!submission[key]?.sent) {
                count += 1
            }
        }
        return count
    }
    // End Moderator Count Methods

    // Start Candidates Count Methods
    const countCandidatesSubmissionsAccepted = () => {
        let totalCount = 0
        Object.values(state?.candidates || {}).forEach(candidate => {
            totalCount = Object.values(candidate?.invitations || {}).reduce((count, invitation) => {
                return invitation.status === 'Accepted' ? count + 1 : count
            }, totalCount)
        })
        return totalCount
    }

    const countCandidatesSubmissionsDeclined = () => {
        let totalCount = 0
        Object.values(state?.candidates || {}).forEach(candidate => {
            totalCount = Object.values(candidate?.invitations || {}).reduce((count, invitation) => {
                return invitation.status === 'Declined' ? count + 1 : count
            }, totalCount)
        })
        return totalCount
    }

    const countCandidatesSubmissionsReminderSent = () => {
        let count = 0
        const reminder = state?.timeline?.candidateDeadlineReminderEmails
        for (const key in reminder) {
            if (reminder[key]?.sent) {
                count += 1
            }
        }
        return count
    }

    const countCandidatesSubmissionsDeadlineMissed = () => {
        let count = 0
        const submission = state?.timeline?.candidateSubmissionDeadline
        for (const key in submission) {
            if (!submission[key]?.sent) {
                count += 1
            }
        }
        return count
    }
    // End Candidates Count Methods

    const checkModeratorReminderSent = () =>
        Object.values(state?.timeline?.moderatorDeadlineReminderEmails || {}).some(r => r.sent)

    const areQuestionsLocked = () => {
        const invite = getLatestIota(state?.moderator?.invitations)
        return !!invite?.sentDate
    }

    const getQuestionsStatus = () => {
        const questionsObjs = Object.values(state?.questions || {})
        if (
            state?.doneLocked?.['Questions']?.done &&
            questionsObjs.length &&
            Object.values(questionsObjs).every(q => q.text && q.time)
        )
            return 'completed'
        if (state?.timeline?.moderatorSubmissionDeadline) return countDayLeft() || 'default'
        return 'default'
    }
    const getScriptStatus = () => {
        if (getQuestionsStatus() === 'completed' && !checkObjCompleted(state?.script))
            return countDayLeft() || 'default'
        if (
            state?.doneLocked?.['Script']?.done &&
            getQuestionsStatus() === 'completed' &&
            checkObjCompleted(state?.script)
        )
            return 'completed'
        return 'default'
    }
    const getModeratorRecorderStatus = () => {
        if (isModeratorReadyForCreateRecorder()) {
            if (Object.keys(state?.moderator?.recorders || {}).length) return 'completed'
            else return 'ready'
        } else return 'default'
    }
    const getModeratorInvitationStatus = () => {
        if (getScriptStatus() !== 'completed') return 'default'
        if (recentModeratorInvitationStatus()?.status === 'Accepted') return 'accepted'
        if (recentModeratorInvitationStatus()?.status === 'Declined') return 'declined'
        if (recentModeratorInvitationStatus()?.sentDate) return 'sent'
        return countDayLeft() || 'default'
    }
    const getModeratorSubmissionStatus = () => {
        if (checkModeratorVideoSubmitted()) return 'submitted'
        if (!state?.timeline?.moderatorSubmissionDeadline) return 'default'
        if (getLatestObjByDate(state.timeline.moderatorSubmissionDeadline)?.date < new Date().toISOString())
            return 'missed'
        if (checkModeratorReminderSent()) return 'sent'
        return 'default'
    }
    const countCandidates = () => {
        if (state?.candidates) {
            return Object.keys(state?.candidates)?.length
        }
        return -1
    }
    const getElectionTableStatus = () => {
        if (state?.candidates && Object.keys(state?.candidates)?.length >= 1) return 'filled'
        if (recentModeratorInvitationStatus()?.sentDate) return countDayLeft() || 'default'
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
    const getCandidatesSubmissionsStatus = () => {
        if (recentModeratorInvitationStatus()?.sentDate)
            return {
                accepted: countCandidatesSubmissionsAccepted(),
                declined: countCandidatesSubmissionsDeclined(),
                reminderSent: countCandidatesSubmissionsReminderSent(),
                deadlineMissed: countCandidatesSubmissionsDeadlineMissed(),
            }
        return 'default'
    }
    const getUndebateStatus = () => {
        if (new Date(state?.electionDate).getTime() < new Date().getTime()) return 'archived'
        if (new Date(state?.undebateDate).getTime() < new Date().getTime()) return 'pending'
        return 'isLive'
    }

    const isModeratorReadyForCreateRecorder = () => {
        if (!state?.organizationName) return false
        if (!state?.electionName) return false
        if (!state?.electionDate) return false
        if (getModeratorContactStatus() !== 'completed') return false
        if (getQuestionsStatus() !== 'completed') return false
        if (getScriptStatus() !== 'completed') return false
        return true
    }

    const isModeratorReadyToInvite = () => {
        if (!isModeratorReadyForCreateRecorder()) return false
        if (!getLatestIota(state?.moderator?.recorders)) return false
        return true
    }

    const areCandidatesReadyToInvite = () => {
        // todo
        return false
    }

    const getModeratorContactStatus = () => {
        if (state?.doneLocked?.['Contact']?.done && state?.moderator?.name && state?.moderator?.email)
            return 'completed'
        return 'default'
    }

    const getModeratorStatus = () => {
        if (!checkTimelineCompleted()) {
            return '-'
        }
        const scriptStatus = getScriptStatus()
        const inviteStatus = getModeratorInvitationStatus()
        const submissionStatus = getModeratorSubmissionStatus()
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
        if (!checkTimelineCompleted()) {
            return '-'
        }
        if (getElectionTableStatus() !== 'filled') {
            return 'Election Table Pending...'
        }
        // todo fix this - any candidate doesn't have invitations list?
        if (areCandidatesReadyToInvite() && getCandidatesSubmissionsStatus() === 'default') {
            // todo moderator might not have submitted yet - separate status
            return 'Invite Pending...'
        }
        const candidateCount = countCandidates()
        if (countModeratorInvitationDeadlineMissed() === candidateCount) {
            return `All ${candidateCount} Candidates Missed Deadline`
        }
        if (getCandidatesSubmissionsStatus() !== 'default') {
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

    const getModeratorStatusDaysRemaining = () => {
        const moderatorStatus = getModeratorStatus()
        let secondDate
        if (['Script Pending...', 'Script Sent'].includes(moderatorStatus)) {
            return undefined
        } else if (
            ['Invite Declined', 'Invite Accepted', 'Reminder Sent', 'Deadline Missed'].includes(moderatorStatus)
        ) {
            secondDate = getLatestObjByDate(state?.timeline?.moderatorSubmissionDeadline)?.date
        } else if ('Video Submitted' === moderatorStatus) {
            secondDate = getDateOfLatestIota(state?.moderator?.submissions)
        }

        if (secondDate) {
            secondDate = new Date(secondDate)
            return daysBetweenDates(new Date(), secondDate)
        } else {
            return undefined
        }
    }

    const getCandidateStatusDaysRemaining = () => {
        const candidatesStatus = getCandidatesStatus()
        let secondDate
        if (['-', 'unknown'].includes(candidatesStatus)) {
            return undefined
        } else if (['Election Table Pending...', 'Invite Pending...'].includes(candidatesStatus)) {
            secondDate = getLatestObjByDate(state?.timeline?.moderatorSubmissionDeadline)?.date
        } else if (candidatesStatus.includes('Missed Deadline')) {
            secondDate = getLatestObjByDate(state?.timeline?.candidateSubmissionDeadline)?.date
        } else {
            return countDayLeft()
        }

        if (secondDate) {
            secondDate = new Date(secondDate)
            return daysBetweenDates(new Date(), secondDate)
        } else {
            return undefined
        }
    }

    const getElectionStatusDaysRemaining = () => {
        const electionListStatus = getElectionListStatus()
        let secondDate
        if (electionListStatus === 'Configuring') {
            secondDate = getLatestObjByDate(state?.timeline?.moderatorSubmissionDeadline)?.date
        } else if (electionListStatus === 'In Progress') {
            secondDate = getLatestObjByDate(state?.timeline?.candidateSubmissionDeadline)?.date
        } else if (electionListStatus === 'Live') {
            return countDayLeft()
        }

        if (secondDate) {
            secondDate = new Date(secondDate)
            return daysBetweenDates(new Date(), secondDate)
        } else {
            return undefined
        }
    }

    const getElectionOfficeCount = () => {
        return Object.keys(state?.offices || {}).length
    }

    const isElectionLive = () => {
        return getElectionListStatus() === 'Live'
    }

    const isElectionUrgent = () => {
        let isUrgent = false
        if (urgentModeratorStatuses.includes(getModeratorStatus())) {
            isUrgent = true
        } else if (getCandidatesStatus().includes('Candidates Missed Deadline')) {
            // candidate string is "All X Candidates Missed Deadline"
            isUrgent = true
        } else if (countModeratorInvitationDeadlineMissed() > 10) {
            isUrgent = true
        }
        // todo handle days remaining for Script Pending?
        return isUrgent
    }

    const getCandidatesStatusCounts = () => {
        if (!recentModeratorInvitationStatus()?.sentDate) {
            return 'default'
        }
        const deadline = state?.timeline?.candidateSubmissionDeadline?.[0].date
        const defaultStatusCounts = Object.fromEntries(validStatuses.map(k => [k, 0]))
        const candidateCount = state.candidates ? Object.values(state.candidates).length : 0
        if (candidateCount === 0) {
            return {}
        }
        const statusCounts = Object.values(state.candidates).reduce(
            (prev, v) => ({ ...prev, [getStatus(v, deadline)]: prev[getStatus(v, deadline)] + 1 }),
            defaultStatusCounts
        )
        statusCounts['candidateCount'] = candidateCount
        return statusCounts
        return {}
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
        recentModeratorInvitationStatus,
        getQuestionsStatus,
        getScriptStatus,
        getModeratorRecorderStatus,
        getModeratorInvitationStatus,
        checkModeratorVideoSubmitted,
        checkModeratorSubmissionBeforeDeadline,
        countModeratorInvitationAccepted,
        countModeratorInvitationDeclined,
        countModeratorInvitationReminderSent,
        countModeratorInvitationDeadlineMissed,
        countCandidatesSubmissionsAccepted,
        countCandidatesSubmissionsDeclined,
        countCandidatesSubmissionsReminderSent,
        countCandidatesSubmissionsDeadlineMissed,
        getModeratorSubmissionStatus,
        getElectionTableStatus,
        getCandidatesSubmissionsStatus,
        checkModeratorReminderSent,
        areQuestionsLocked,
        isModeratorReadyForCreateRecorder,
        isModeratorReadyToInvite,
        getModeratorStatus,
        getElectionListStatus,
        getCandidatesStatus,
        areCandidatesReadyForInvites,
        getElectionOfficeCount,
        isElectionLive,
        isElectionUrgent,
        getModeratorContactStatus,
        getModeratorStatusDaysRemaining,
        getCandidateStatusDaysRemaining,
        getElectionStatusDaysRemaining,
        getCandidatesStatusCounts,
    }
}

export default getElectionStatusMethods
