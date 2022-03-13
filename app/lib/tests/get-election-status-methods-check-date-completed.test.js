import getElectionStatusMethods from '../get-election-status-methods'
import useMethods from 'use-methods'

describe('date completed status', () => {
    it('should be completed', () => {
        const moderatorDeadlineReminderEmails = {
            0: {
                date: Date.now().toLocaleString(),
                sent: true,
            },
        }
        const { checkDateCompleted } = getElectionStatusMethods(null, moderatorDeadlineReminderEmails)
        expect(checkDateCompleted()).toBe(true)
    })
    it('should not be completed', () => {
        const moderatorDeadlineReminderEmails = {
            0: {
                date: '',
                sent: false,
            },
        }
        const { checkDateCompleted } = getElectionStatusMethods(null, moderatorDeadlineReminderEmails)
        expect(checkDateCompleted()).toBe(false)
    })
})
