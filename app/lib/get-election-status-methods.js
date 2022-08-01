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

function getElectionStatusMethods(dispatch, state) {
    const recentInvitationStatus = () => getLatestIota(state?.moderator?.invitations)
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

    const getDateOfLatestIota = iotas => {
        const _id = getLatestIota(iotas)?._id
        if (!_id) return undefined
        return ObjectID(_id).getDate().toISOString()
    }

    const checkSubmissionBeforeDeadline = () => {
        const submissionDate = getDateOfLatestIota(state?.moderator?.submissions)
        if (!submissionDate) return false
        const deadline = getLatestObjByDate(state?.timeline?.moderatorSubmissionDeadline)?.date
        return submissionDate < deadline
    }

    // Start Moderator Count Methods
    const countSubmissionAccepted = () =>
        Object.values(state?.moderator?.invitations || {}).reduce(
            (count, invitation) => (invitation.status === 'Accepted' ? count + 1 : count),
            0
        )

    const countSubmissionDeclined = () =>
        Object.values(state?.moderator?.invitations || {}).reduce(
            (count, invitation) => (invitation.status === 'Declined' ? count + 1 : count),
            0
        )

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

    const checkReminderSent = () =>
        Object.values(state?.timeline?.moderatorDeadlineReminderEmails || {}).some(r => r.sent)

    const areQuestionsLocked = () => {
        const invite = getLatestIota(state?.moderator?.invitations)
        return !!invite?.sentDate
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
        if (checkVideoSubmitted()) return 'submitted'
        if (!state?.timeline?.moderatorSubmissionDeadline) return 'default'
        if (getLatestObjByDate(state.timeline.moderatorSubmissionDeadline)?.date < new Date().toISOString())
            return 'missed'
        if (checkReminderSent()) return 'sent'
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
        const candidateCount = countCandidates()
        if (countSubmissionDeadlineMissed() === candidateCount) {
            return `All ${candidateCount} Candidates Missed Deadline`
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
        } else if (countSubmissionDeadlineMissed() > 10) {
            isUrgent = true
        }
        // todo handle dates for Script Pending?
        return isUrgent
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
        countCandidatesSubmissionsAccepted,
        countCandidatesSubmissionsDeclined,
        countCandidatesSubmissionsReminderSent,
        countCandidatesSubmissionsDeadlineMissed,
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
        areCandidatesReadyForInvites,
        isElectionLive,
        isElectionUrgent,
    }
}

export default getElectionStatusMethods
