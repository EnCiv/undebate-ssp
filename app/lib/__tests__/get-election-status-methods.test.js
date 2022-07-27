import getElectionStatusMethods from '../get-election-status-methods'
Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + parseInt(days))
    return this
}
describe('election status methods', () => {
    describe('date completed status', () => {
        it('should be completed', () => {
            const state = {
                0: {
                    date: Date.now().toLocaleString(),
                    sent: true,
                },
            }
            const { checkDateCompleted } = getElectionStatusMethods()
            expect(checkDateCompleted(state)).toBe(true)
        })
        it('should not be completed', () => {
            const state = {
                0: {
                    date: '',
                    sent: false,
                },
            }
            const { checkDateCompleted } = getElectionStatusMethods()
            expect(checkDateCompleted(state)).toBe(false)
        })
    })
    describe('check timeline completed', () => {
        it('should be completed', () => {
            const timeline = {
                moderatorDeadlineReminderEmails: {
                    0: {
                        date: '2022-01-07T22:09:32.952Z',
                        sent: true,
                    },
                    1: {
                        date: '2022-01-07T22:09:32.952Z',
                        sent: true,
                    },
                },
                moderatorSubmissionDeadline: {
                    0: {
                        date: '2022-01-07T22:09:32.952Z',
                        sent: true,
                    },
                },
                candidateDeadlineReminderEmails: {
                    0: {
                        date: '2022-01-07T22:09:32.952Z',
                        sent: true,
                    },
                    1: {
                        date: '2022-01-07T22:09:32.952Z',
                        sent: true,
                    },
                },
                candidateSubmissionDeadline: {
                    0: {
                        date: '2022-01-07T22:09:32.952Z',
                        sent: true,
                    },
                },
            }
            const { checkTimelineCompleted } = getElectionStatusMethods(null, { timeline })
            expect(checkTimelineCompleted()).toBe(true)
        })
        it('should not be completed', () => {
            const timeline = {
                moderatorDeadlineReminderEmails: {
                    0: {
                        date: '',
                        sent: false,
                    },
                },
                moderatorSubmissionDeadline: {
                    0: {
                        date: '2022-01-07T22:09:32.952Z',
                        sent: true,
                    },
                },
                candidateDeadlineReminderEmails: {
                    0: {
                        date: '2022-01-07T22:09:32.952Z',
                        sent: true,
                    },
                    1: {
                        date: '2022-01-07T22:09:32.952Z',
                        sent: true,
                    },
                },
                candidateSubmissionDeadline: {
                    0: {
                        date: '2022-01-07T22:09:32.952Z',
                        sent: true,
                    },
                },
            }
            const { checkTimelineCompleted } = getElectionStatusMethods(null, { timeline })
            expect(checkTimelineCompleted()).toBe(false)
        })
    })
    describe('get undebate status', () => {
        it('it should be archived', () => {
            const state = {
                undebateDate: new Date(Date.now() + 3600 * 1000 * 24),
                electionDate: new Date(Date.now() - 3600 * 1000 * 24),
            }
            const { getUndebateStatus } = getElectionStatusMethods(null, state)
            expect(getUndebateStatus()).toBe('archived')
        })
        it('it should be pending', () => {
            const state = {
                undebateDate: new Date(Date.now() - 3600 * 1000 * 24),
                electionDate: new Date(Date.now() + 3600 * 1000 * 24),
            }
            const { getUndebateStatus } = getElectionStatusMethods(null, state)
            expect(getUndebateStatus()).toBe('pending')
        })
        it('it should be live', () => {
            const state = {
                undebateDate: new Date(Date.now() + 3600 * 1000 * 24),
                electionDate: new Date(Date.now() + 3600 * 1000 * 24),
            }
            const { getUndebateStatus } = getElectionStatusMethods(null, state)
            expect(getUndebateStatus()).toBe('isLive')
        })
    })
    describe('get general election status', () => {
        it('should be completed', () => {
            const election = {
                electionName: 'some name',
                organizationName: 'some name',
            }
            const { getElectionStatus } = getElectionStatusMethods(null, election)
            expect(getElectionStatus()).toBe('completed')
        })
        it('should be default', () => {
            const election = {}
            const { getElectionStatus } = getElectionStatusMethods(null, election)
            expect(getElectionStatus()).toBe('default')
        })
    })
    describe('get timeline status', () => {
        it('should be completed', () => {
            const state = {
                electionName: 'some name',
                organizationName: 'some name',
                timeline: {
                    moderatorDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    moderatorSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    candidateDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    candidateSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                },
            }
            const { getTimelineStatus } = getElectionStatusMethods(null, state)
            expect(getTimelineStatus()).toBe('completed')
        })
        it('should be pending', () => {
            const state = {
                electionName: 'some name',
                organizationName: 'some name',
                timeline: {
                    moderatorDeadlineReminderEmails: {
                        0: {
                            date: '',
                            sent: false,
                        },
                    },
                    moderatorSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    candidateDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    candidateSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                },
            }
            const { getTimelineStatus } = getElectionStatusMethods(null, state)
            expect(getTimelineStatus()).toBe('pending')
        })

        it('should be pending', () => {
            const state = {
                electionName: '',
                organizationName: '',
                timeline: {},
            }
            const { getTimelineStatus } = getElectionStatusMethods(null, state)
            expect(getTimelineStatus()).toBe('default')
        })
    })
    describe('check object completed', () => {
        it('should all be complete', () => {
            const obj = {
                0: { text: 'hello' },
            }
            const { checkObjCompleted } = getElectionStatusMethods()
            expect(checkObjCompleted(obj))
        })
        it('should not be complete', () => {
            const obj = {
                0: { text: '' },
            }
            const { checkObjCompleted } = getElectionStatusMethods()
            expect(checkObjCompleted(obj)).toBe(false)
        })
    })
    describe('count day left', () => {
        it('should be 3 days left', () => {
            const state = { electionDate: new Date(Date.now() + 3600 * 1000 * 24 * 3) }
            const { countDayLeft } = getElectionStatusMethods(null, state)
            expect(countDayLeft()).toBe('3')
        })
        it('should be -3 days left', () => {
            const state = { electionDate: new Date(Date.now() - 3600 * 1000 * 24 * 3) }
            const { countDayLeft } = getElectionStatusMethods(null, state)
            expect(countDayLeft()).toBe('-3')
        })
    })
    describe('recent invitation status', () => {
        it('should get the latest invitation which is declined', () => {
            const expected = { _id: 'id', responseDate: new Date(Date.now() - 1000), status: 'Declined' }
            const state = {
                moderator: {
                    invitations: [
                        { _id: 'id', responseDate: new Date(Date.now() - 2000), status: 'Accepted' },
                        expected,
                    ],
                },
            }
            const { recentInvitationStatus } = getElectionStatusMethods(null, state)
            expect(recentInvitationStatus()).toBe(expected)
        })
    })

    describe('check video submitted', () => {
        it('should return true', () => {
            const state = {
                moderator: {
                    submissions: {
                        '62e03e0a816fe43084a26775': { _id: '62e03e0a816fe43084a26775', url: 'link', date: '' },
                    },
                },
            }
            const { checkVideoSubmitted } = getElectionStatusMethods(null, state)
            expect(checkVideoSubmitted())
        })
        it('should return false', () => {
            const state = {
                moderator: {},
            }
            const { checkVideoSubmitted } = getElectionStatusMethods(null, state)
            expect(checkVideoSubmitted()).toBe(false)
        })
    })

    describe('check submission before deadline', () => {
        it('should be submitted on time', () => {
            const state = {
                timeline: {
                    moderatorSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                },
            }
            const { checkSubmissionBeforeDeadline } = getElectionStatusMethods(null, state)
            expect(checkSubmissionBeforeDeadline())
        })
        it('should not be submitted on time', () => {
            const state = {
                timeline: {
                    moderatorSubmissionDeadline: {
                        0: {
                            date: '',
                            sent: false,
                        },
                    },
                },
            }
            const { checkSubmissionBeforeDeadline } = getElectionStatusMethods(null, state)
            expect(checkSubmissionBeforeDeadline()).toBe(false)
        })
    })

    describe('count submission accepted', () => {
        it('should be 2 accepted', () => {
            const state = {
                moderator: {
                    invitations: [
                        { _id: 'id', responseDate: new Date(Date.now() - 2000), status: 'Accepted' },
                        { _id: 'id', responseDate: new Date(Date.now() - 2000), status: 'Accepted' },
                    ],
                },
            }
            const { countSubmissionAccepted } = getElectionStatusMethods(null, state)
            expect(countSubmissionAccepted()).toBe(2)
        })
        it('should be 0 accepted', () => {
            const state = {
                moderator: {
                    invitations: [
                        { _id: 'id', responseDate: new Date(Date.now() - 2000), status: 'Declined' },
                        { _id: 'id', responseDate: new Date(Date.now() - 2000), status: 'Declined' },
                    ],
                },
            }
            const { countSubmissionAccepted } = getElectionStatusMethods(null, state)
            expect(countSubmissionAccepted()).toBe(0)
        })
    })

    describe('count submission declined', () => {
        it('should be 2 declined', () => {
            const state = {
                moderator: {
                    invitations: [
                        { _id: 'id', responseDate: new Date(Date.now() - 2000), status: 'Declined' },
                        { _id: 'id', responseDate: new Date(Date.now() - 2000), status: 'Declined' },
                    ],
                },
            }
            const { countSubmissionDeclined } = getElectionStatusMethods(null, state)
            expect(countSubmissionDeclined()).toBe(2)
        })
        it('should be 0 declined', () => {
            const state = {
                moderator: {
                    invitations: [
                        { _id: 'id', responseDate: new Date(Date.now() - 2000), status: 'Accepted' },
                        { _id: 'id', responseDate: new Date(Date.now() - 2000), status: 'Accepted' },
                    ],
                },
            }
            const { countSubmissionDeclined } = getElectionStatusMethods(null, state)
            expect(countSubmissionDeclined()).toBe(0)
        })
    })

    describe('count submission reminder set', () => {
        it('should be 2 sent reminders', () => {
            const state = {
                timeline: {
                    moderatorDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                },
            }
            const { countSubmissionReminderSet } = getElectionStatusMethods(null, state)
            expect(countSubmissionReminderSet()).toBe(2)
        })
    })

    describe('count submission deadline set', () => {
        it('should be missed 1 deadline', () => {
            const state = {
                timeline: {
                    moderatorSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: false,
                        },
                    },
                },
            }
            const { countSubmissionDeadlineMissed } = getElectionStatusMethods(null, state)
            expect(countSubmissionDeadlineMissed()).toBe(1)
        })
    })

    describe('get questions status', () => {
        it('should retrieve 1 day left', () => {
            const state = {
                electionName: 'name',
                organizationName: 'name',
                electionDate: new Date(Date.now() + 3600 * 1000 * 24),
                questions: {},
                timeline: {
                    moderatorDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    moderatorSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    candidateDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    candidateSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                },
            }
            const { getQuestionsStatus } = getElectionStatusMethods(null, state)
            expect(getQuestionsStatus()).toBe('1')
        })
        it('should be completed', () => {
            const state = {
                electionName: 'name',
                organizationName: 'name',
                electionDate: new Date(Date.now() + 3600 * 1000 * 24),
                questions: {
                    0: {
                        text: 'What is your favorite color?',
                        time: '30',
                    },
                },
                timeline: {
                    moderatorDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    moderatorSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    candidateDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    candidateSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                },
            }
            const { getQuestionsStatus } = getElectionStatusMethods(null, state)
            expect(getQuestionsStatus()).toBe('completed')
        })
        it('should be default', () => {
            const state = {
                electionName: 'name',
                organizationName: 'name',
                electionDate: new Date(Date.now() + 3600 * 1000 * 24),
                questions: {},
                timeline: {},
            }
            const { getQuestionsStatus } = getElectionStatusMethods(null, state)
            expect(getQuestionsStatus()).toBe('default')
        })
    })
    describe('get script status', () => {
        it('should retrieve 1 day left', () => {
            const state = {
                electionName: 'name',
                organizationName: 'name',
                electionDate: new Date(Date.now() + 3600 * 1000 * 24),
                questions: {
                    0: {
                        text: 'What is your favorite color?',
                        time: '30',
                    },
                },
                script: {},
                timeline: {
                    moderatorDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    moderatorSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    candidateDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    candidateSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                },
            }
            const { getScriptStatus } = getElectionStatusMethods(null, state)
            expect(getScriptStatus()).toBe('1')
        })
        it('should be completed', () => {
            const state = {
                electionName: 'name',
                organizationName: 'name',
                electionDate: new Date(Date.now() + 3600 * 1000 * 24),
                questions: {
                    0: {
                        text: 'What is your favorite color?',
                        time: '30',
                    },
                },
                script: {
                    0: {
                        text: 'Welcome everyone. Our first question is: What is your favorite color?',
                    },
                },
                timeline: {
                    moderatorDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    moderatorSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    candidateDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    candidateSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                },
            }
            const { getScriptStatus } = getElectionStatusMethods(null, state)
            expect(getScriptStatus()).toBe('completed')
        })
        it('should be default', () => {
            const state = {
                electionName: 'name',
                organizationName: 'name',
                electionDate: new Date(Date.now() + 3600 * 1000 * 24),
                questions: {},
                script: {},
                timeline: {},
            }
            const { getScriptStatus } = getElectionStatusMethods(null, state)
            expect(getScriptStatus()).toBe('default')
        })
    })

    describe('get invitation status', () => {
        it('returns default when script is not complete', () => {
            const state = {
                electionName: 'name',
                organizationName: 'name',
                electionDate: new Date(Date.now() + 3600 * 1000 * 24),
                questions: {},
                script: {},
                moderator: {
                    invitations: [{ _id: 'id', responseDate: new Date(Date.now() - 2000), status: 'Accepted' }],
                },
                timeline: {},
            }
            const { getInvitationStatus } = getElectionStatusMethods(null, state)
            expect(getInvitationStatus()).toBe('default')
        })
        it('returns accepted', () => {
            const state = {
                electionName: 'name',
                organizationName: 'name',
                electionDate: new Date(Date.now() + 3600 * 1000 * 24),
                questions: {
                    0: {
                        text: 'What is your favorite color?',
                        time: '30',
                    },
                },
                script: {
                    0: {
                        text: 'Welcome everyone. Our first question is: What is your favorite color?',
                    },
                },
                moderator: {
                    invitations: [{ _id: 'id', responseDate: new Date(Date.now() - 2000), status: 'Accepted' }],
                },
                timeline: {
                    moderatorDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    moderatorSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    candidateDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    candidateSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                },
            }
            const { getInvitationStatus } = getElectionStatusMethods(null, state)
            expect(getInvitationStatus()).toBe('accepted')
        })
        it('returns declined', () => {
            const state = {
                electionName: 'name',
                organizationName: 'name',
                electionDate: new Date(Date.now() + 3600 * 1000 * 24),
                questions: {
                    0: {
                        text: 'What is your favorite color?',
                        time: '30',
                    },
                },
                script: {
                    0: {
                        text: 'Welcome everyone. Our first question is: What is your favorite color?',
                    },
                },
                moderator: {
                    invitations: [{ _id: 'id', responseDate: new Date(Date.now() - 2000), status: 'Declined' }],
                },
                timeline: {
                    moderatorDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    moderatorSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    candidateDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    candidateSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                },
            }
            const { getInvitationStatus } = getElectionStatusMethods(null, state)
            expect(getInvitationStatus()).toBe('declined')
        })
        it('returns sent when no response date', () => {
            const state = {
                electionName: 'name',
                organizationName: 'name',
                electionDate: new Date(Date.now() + 3600 * 1000 * 24),
                questions: {
                    0: {
                        text: 'What is your favorite color?',
                        time: '30',
                    },
                },
                script: {
                    0: {
                        text: 'Welcome everyone. Our first question is: What is your favorite color?',
                    },
                },
                moderator: {
                    invitations: [{ _id: 'id', sentDate: new Date(Date.now() - 3600 * 1000 * 24) }],
                },
                timeline: {
                    moderatorDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    moderatorSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    candidateDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    candidateSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                },
            }
            const { getInvitationStatus } = getElectionStatusMethods(null, state)
            expect(getInvitationStatus()).toBe('sent')
        })

        it('returns days left when until script is only complete', () => {
            const state = {
                electionName: 'name',
                organizationName: 'name',
                electionDate: new Date(Date.now() + 3600 * 1000 * 24),
                questions: {
                    0: {
                        text: 'What is your favorite color?',
                        time: '30',
                    },
                },
                script: {
                    0: {
                        text: 'Welcome everyone. Our first question is: What is your favorite color?',
                    },
                },
                timeline: {
                    moderatorDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    moderatorSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    candidateDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    candidateSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                },
            }
            const { getInvitationStatus } = getElectionStatusMethods(null, state)
            expect(getInvitationStatus()).toBe('1')
        })
    })

    describe('check reminder sent', () => {
        it('sent the reminder', () => {
            const state = {
                timeline: {
                    moderatorDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                },
            }
            const { checkReminderSent } = getElectionStatusMethods(null, state)
            expect(checkReminderSent())
        })
        it("hasn't sent the reminder yet", () => {
            const state = {
                timeline: {
                    moderatorDeadlineReminderEmails: {
                        0: {
                            date: '',
                            sent: false,
                        },
                    },
                },
            }
            const { checkReminderSent } = getElectionStatusMethods(null, state)
            expect(checkReminderSent()).toBe(false)
        })
    })

    describe('get submission status', () => {
        it('missed a deadline', () => {
            const state = {
                timeline: {
                    moderatorSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: false,
                        },
                    },
                },
            }
            const { getSubmissionStatus } = getElectionStatusMethods(null, state)
            expect(getSubmissionStatus()).toBe('missed')
        })
        it('returns submitted', () => {
            const state = {
                moderator: {
                    submissions: {
                        '62e03e0a816fe43084a26775': { _id: '62e03e0a816fe43084a26775', url: 'link', date: '' },
                    },
                },
                timeline: {
                    moderatorSubmissionDeadline: {
                        0: {
                            date: '2022-09-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                },
            }
            const { getSubmissionStatus } = getElectionStatusMethods(null, state)
            expect(getSubmissionStatus()).toBe('submitted')
        })
        it('returns reminder is sent', () => {
            const state = {
                timeline: {
                    moderatorSubmissionDeadline: {
                        0: {
                            date: new Date().addDays(1).toISOString(),
                            sent: true,
                        },
                    },
                    moderatorDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                },
            }
            const { getSubmissionStatus } = getElectionStatusMethods(null, state)
            expect(getSubmissionStatus()).toBe('sent')
        })
        it('returns default', () => {
            const state = {
                timeline: {},
            }
            const { getSubmissionStatus } = getElectionStatusMethods(null, state)
            expect(getSubmissionStatus()).toBe('default')
        })
    })

    describe('get election table status', () => {
        it('is filled', () => {
            const state = {
                candidates: {
                    '61e76bbefeaa4a25840d85d0': {},
                    '61e76bfc8a82733d08f0cf12': {},
                },
            }
            const { getElectionTableStatus } = getElectionStatusMethods(null, state)
            expect(getElectionTableStatus()).toBe('filled')
        })
        it('gets days left', () => {
            const state = {
                electionDate: new Date(Date.now() + 3600 * 1000 * 24),
                candidates: {},
                moderator: {
                    invitations: [
                        {
                            _id: 'id',
                            sentDate: new Date(Date.now() - 3600 * 1000 * 24),
                        },
                    ],
                },
            }
            const { getElectionTableStatus } = getElectionStatusMethods(null, state)
            expect(getElectionTableStatus()).toBe('1')
        })
        it('returns default', () => {
            const state = {
                electionDate: new Date(Date.now() + 3600 * 1000 * 24),
                candidates: {},
                moderator: {
                    invitations: [],
                },
            }
            const { getElectionTableStatus } = getElectionStatusMethods(null, state)
            expect(getElectionTableStatus()).toBe('default')
        })
    })

    describe('get submissions status', () => {
        it('fetches counts when sentDate exists', () => {
            const state = {
                electionName: 'name',
                organizationName: 'name',
                electionDate: new Date(Date.now() + 3600 * 1000 * 24),
                questions: {
                    0: {
                        text: 'What is your favorite color?',
                        time: '30',
                    },
                },
                script: {
                    0: {
                        text: 'Welcome everyone. Our first question is: What is your favorite color?',
                    },
                },
                moderator: {
                    invitations: [
                        { _id: 'id', sentDate: new Date(Date.now() - 2000) },
                        { _id: 'id', responseDate: new Date(Date.now() - 4000), status: 'Declined' },
                        { _id: 'id', responseDate: new Date(Date.now() - 4000), status: 'Accepted' },
                        { _id: 'id', responseDate: new Date(Date.now() - 4000), status: 'Accepted' },
                    ],
                },
                timeline: {
                    moderatorDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    moderatorSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: false,
                        },
                    },
                    candidateDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    candidateSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                },
            }
            const { getSubmissionsStatus } = getElectionStatusMethods(null, state)
            expect(getSubmissionsStatus()).toEqual({
                accepted: 2,
                declined: 1,
                reminderSent: 2,
                deadlineMissed: 1,
            })
        })
        it('returns default if no sent date', () => {
            const state = {
                electionName: 'name',
                organizationName: 'name',
                electionDate: new Date(Date.now() + 3600 * 1000 * 24),
                questions: {
                    0: {
                        text: 'What is your favorite color?',
                        time: '30',
                    },
                },
                script: {
                    0: {
                        text: 'Welcome everyone. Our first question is: What is your favorite color?',
                    },
                },
                moderator: {
                    invitations: [
                        { _id: 'id', responseDate: new Date(Date.now() - 4000), status: 'Declined' },
                        { _id: 'id', responseDate: new Date(Date.now() - 4000), status: 'Accepted' },
                        { _id: 'id', responseDate: new Date(Date.now() - 4000), status: 'Accepted' },
                    ],
                },
                timeline: {
                    moderatorDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    moderatorSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: false,
                        },
                    },
                    candidateDeadlineReminderEmails: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                        1: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                    candidateSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: true,
                        },
                    },
                },
            }
            const { getSubmissionsStatus } = getElectionStatusMethods(null, state)
            expect(getSubmissionsStatus()).toBe('default')
        })
    })
    describe('are questions locked', () => {
        it('should be locked since invite sent', () => {
            const state = {
                moderator: {
                    invitations: [
                        // derived data, list may be empty or not present
                        {
                            _id: '21934788293',
                            sentDate: new Date(Date.now() - 3600 * 1000 * 24),
                            responseDate: new Date(Date.now() - 3600 * 1000),
                            status: 'Accepted',
                        },
                    ],
                },
            }
            const { areQuestionsLocked } = getElectionStatusMethods(null, state)
            expect(areQuestionsLocked()).toBe(true)
        })
        it('should not be locked since no invites', () => {
            let state = {
                moderator: {
                    invitations: [{ _id: '', sentDate: null }],
                },
            }
            const { areQuestionsLocked } = getElectionStatusMethods(null, state)
            expect(areQuestionsLocked()).toBe(false)
            state = {}
            expect(areQuestionsLocked()).toBe(false)
        })
        it('should not be locked since empty obj', () => {
            let state = {}
            const { areQuestionsLocked } = getElectionStatusMethods(null, state)
            expect(areQuestionsLocked()).toBe(false)
        })
    })
})
