// https://github.com/EnCiv/undebate-ssp/issues/105

const checkDateCompleted = obj => {
    for (const key in obj) {
        if (obj[key].date !== '') {
            return true
        }
    }
    return false
}

const getElectionStatusMethods = (dispatch, state) => ({
    checkDateCompleted: checkDateCompleted,
    checkTimelineCompleted: () => {
        return (
            checkDateCompleted(state?.timeline?.moderatorDeadlineReminderEmails) &&
            checkDateCompleted(state?.timeline?.moderatorSubmissionDeadline) &&
            checkDateCompleted(state?.timeline?.candidateDeadlineReminderEmails) &&
            checkDateCompleted(state?.timeline?.candidateSubmissionDeadline)
        )
    },
})

export default getElectionStatusMethods
