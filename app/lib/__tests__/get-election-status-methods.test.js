import getElectionStatusMethods, {getDaysText} from '../get-election-status-methods'
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
            const { checkTimelineCompleted } = getElectionStatusMethods(null, {
                timeline,
                undebateDate: '2022-01-06T22:09:32.952Z',
                electionDate: '2022-01-08T22:09:32.952Z',
            })
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
                        date: '',
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
                organizationUrl: 'some url',
                email: 'someEmail',
                doneLocked: { Election: { done: true } },
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
                undebateDate: '2022-01-06T22:09:32.952Z',
                electionDate: '2022-01-08T22:09:32.952Z',
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
                doneLocked: { Timeline: { done: true } },
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
                            date: '',
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
    describe('recent moderator invitation status', () => {
        it('should get the latest invitation which is declined', () => {
            const expected = {
                _id: '62e5ffa31a471334904bae62',
                responseDate: '2022-07-31T04:08:05.940Z',
                status: 'Declined',
            }
            const state = {
                moderator: {
                    invitations: {
                        '62e5ffa31a471334904bae62': {
                            _id: '62e5ffa31a471334904bae62',
                            responseDate: '2022-07-31T04:08:05.940Z',
                            status: 'Declined',
                        },
                        expected,
                    },
                },
            }
            const { recentModeratorInvitationStatus } = getElectionStatusMethods(null, state)
            expect(recentModeratorInvitationStatus()).toStrictEqual(expected)
        })
    })

    describe('check moderator video submitted', () => {
        it('should return true', () => {
            const state = {
                moderator: {
                    submissions: {
                        '62e03e0a816fe43084a26775': { _id: '62e03e0a816fe43084a26775', url: 'link', date: '' },
                    },
                },
            }
            const { checkModeratorVideoSubmitted } = getElectionStatusMethods(null, state)
            expect(checkModeratorVideoSubmitted())
        })
        it('should return false', () => {
            const state = {
                moderator: {},
            }
            const { checkModeratorVideoSubmitted } = getElectionStatusMethods(null, state)
            expect(checkModeratorVideoSubmitted()).toBe(false)
        })
    })

    describe('check moderator submission before deadline', () => {
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
            const { checkModeratorSubmissionBeforeDeadline } = getElectionStatusMethods(null, state)
            expect(checkModeratorSubmissionBeforeDeadline())
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
            const { checkModeratorSubmissionBeforeDeadline } = getElectionStatusMethods(null, state)
            expect(checkModeratorSubmissionBeforeDeadline()).toBe(false)
        })
    })

    describe('count moderator invitation accepted', () => {
        it('should be 2 accepted', () => {
            const state = {
                moderator: {
                    invitations: {
                        '62e602be60ee8944086c42b7': {
                            _id: '62e602be60ee8944086c42b7',
                            responseDate: new Date(Date.now() - 2000),
                            status: 'Accepted',
                        },
                        '62e602f73d79581224b85edf': {
                            _id: '62e602f73d79581224b85edf',
                            responseDate: new Date(Date.now() - 2000),
                            status: 'Accepted',
                        },
                    },
                },
            }
            const { countModeratorInvitationAccepted } = getElectionStatusMethods(null, state)
            expect(countModeratorInvitationAccepted()).toBe(2)
        })
        it('should be 0 accepted', () => {
            const state = {
                moderator: {
                    invitations: {
                        '62e602be60ee8944086c42b7': {
                            _id: '62e602be60ee8944086c42b7',
                            responseDate: new Date(Date.now() - 2000),
                            status: 'Declined',
                        },
                        '62e602f73d79581224b85edf': {
                            _id: '62e602f73d79581224b85edf',
                            responseDate: new Date(Date.now() - 2000),
                            status: 'Declined',
                        },
                    },
                },
            }
            const { countModeratorInvitationAccepted } = getElectionStatusMethods(null, state)
            expect(countModeratorInvitationAccepted()).toBe(0)
        })
    })

    describe('count moderator invitation declined', () => {
        it('should be 2 declined', () => {
            const state = {
                moderator: {
                    invitations: {
                        '62e602be60ee8944086c42b7': {
                            _id: '62e602be60ee8944086c42b7',
                            responseDate: new Date(Date.now() - 2000),
                            status: 'Declined',
                        },
                        '62e602f73d79581224b85edf': {
                            _id: '62e602f73d79581224b85edf',
                            responseDate: new Date(Date.now() - 2000),
                            status: 'Declined',
                        },
                    },
                },
            }
            const { countModeratorInvitationDeclined } = getElectionStatusMethods(null, state)
            expect(countModeratorInvitationDeclined()).toBe(2)
        })
        it('should be 0 declined', () => {
            const state = {
                moderator: {
                    invitations: {
                        '62e602be60ee8944086c42b7': {
                            _id: '62e602be60ee8944086c42b7',
                            responseDate: new Date(Date.now() - 2000),
                            status: 'Accepted',
                        },
                        '62e602f73d79581224b85edf': {
                            _id: '62e602f73d79581224b85edf',
                            responseDate: new Date(Date.now() - 2000),
                            status: 'Accepted',
                        },
                    },
                },
            }
            const { countModeratorInvitationDeclined } = getElectionStatusMethods(null, state)
            expect(countModeratorInvitationDeclined()).toBe(0)
        })
    })

    describe('count moderator invitation reminder set', () => {
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
            const { countModeratorInvitationReminderSent } = getElectionStatusMethods(null, state)
            expect(countModeratorInvitationReminderSent()).toBe(2)
        })
    })

    describe('count moderator invitation deadline set', () => {
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
            const { countModeratorInvitationDeadlineMissed } = getElectionStatusMethods(null, state)
            expect(countModeratorInvitationDeadlineMissed()).toBe(1)
        })
    })

    describe('count candidates submissions accepted', () => {
        it('should be 2 accepted', () => {
            const state = {
                candidates: {
                    '62e757299283218b0f61dfc4': {
                        _id: '62e757299283218b0f61dfc4',
                        invitations: {
                            '62e602be60ee8944086c42b7': {
                                _id: '62e602be60ee8944086c42b7',
                                responseDate: new Date(Date.now() - 2000),
                                status: 'Accepted',
                            },
                        },
                    },
                    '62e75729d3ac2a8b2356add1': {
                        _id: '62e75729d3ac2a8b2356add1',
                        invitations: {
                            '62e602f73d79581224b85edf': {
                                _id: '62e602f73d79581224b85edf',
                                responseDate: new Date(Date.now() - 2000),
                                status: 'Accepted',
                            },
                        },
                    },
                },
            }
            const { countCandidatesSubmissionsAccepted } = getElectionStatusMethods(null, state)
            expect(countCandidatesSubmissionsAccepted()).toBe(2)
        })
        it('should be 0 accepted', () => {
            const state = {
                candidates: {
                    '62e757299283218b0f61dfc4': {
                        _id: '62e757299283218b0f61dfc4',
                        invitations: {
                            '62e602be60ee8944086c42b7': {
                                _id: '62e602be60ee8944086c42b7',
                                responseDate: new Date(Date.now() - 2000),
                                status: 'Declined',
                            },
                        },
                    },
                    '62e75729d3ac2a8b2356add1': {
                        _id: '62e75729d3ac2a8b2356add1',
                        invitations: {
                            '62e602f73d79581224b85edf': {
                                _id: '62e602f73d79581224b85edf',
                                responseDate: new Date(Date.now() - 2000),
                                status: 'Declined',
                            },
                        },
                    },
                },
            }
            const { countCandidatesSubmissionsAccepted } = getElectionStatusMethods(null, state)
            expect(countCandidatesSubmissionsAccepted()).toBe(0)
        })
    })

    describe('count candidates submissions declined', () => {
        it('should be 2 declined', () => {
            const state = {
                candidates: {
                    '62e757299283218b0f61dfc4': {
                        _id: '62e757299283218b0f61dfc4',
                        invitations: {
                            '62e602be60ee8944086c42b7': {
                                _id: '62e602be60ee8944086c42b7',
                                responseDate: new Date(Date.now() - 2000),
                                status: 'Declined',
                            },
                        },
                    },
                    '62e75729d3ac2a8b2356add1': {
                        _id: '62e75729d3ac2a8b2356add1',
                        invitations: {
                            '62e602f73d79581224b85edf': {
                                _id: '62e602f73d79581224b85edf',
                                responseDate: new Date(Date.now() - 2000),
                                status: 'Declined',
                            },
                        },
                    },
                },
            }
            const { countCandidatesSubmissionsDeclined } = getElectionStatusMethods(null, state)
            expect(countCandidatesSubmissionsDeclined()).toBe(2)
        })
        it('should be 0 declined', () => {
            const state = {
                candidates: {
                    '62e757299283218b0f61dfc4': {
                        _id: '62e757299283218b0f61dfc4',
                        invitations: {
                            '62e602be60ee8944086c42b7': {
                                _id: '62e602be60ee8944086c42b7',
                                responseDate: new Date(Date.now() - 2000),
                                status: 'Accepted',
                            },
                        },
                    },
                    '62e75729d3ac2a8b2356add1': {
                        _id: '62e75729d3ac2a8b2356add1',
                        invitations: {
                            '62e602f73d79581224b85edf': {
                                _id: '62e602f73d79581224b85edf',
                                responseDate: new Date(Date.now() - 2000),
                                status: 'Accepted',
                            },
                        },
                    },
                },
            }
            const { countCandidatesSubmissionsDeclined } = getElectionStatusMethods(null, state)
            expect(countCandidatesSubmissionsDeclined()).toBe(0)
        })
    })

    describe('count candidates submissions reminder set', () => {
        it('should be 2 sent reminders', () => {
            const state = {
                timeline: {
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
                },
            }
            const { countCandidatesSubmissionsReminderSent } = getElectionStatusMethods(null, state)
            expect(countCandidatesSubmissionsReminderSent()).toBe(2)
        })
    })

    describe('count candidates submissions deadline missed', () => {
        it('should be missed 1 deadline', () => {
            const state = {
                timeline: {
                    candidateSubmissionDeadline: {
                        0: {
                            date: '2022-01-07T22:09:32.952Z',
                            sent: false,
                        },
                    },
                },
            }
            const { countCandidatesSubmissionsDeadlineMissed } = getElectionStatusMethods(null, state)
            expect(countCandidatesSubmissionsDeadlineMissed()).toBe(1)
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
                doneLocked: { Questions: { done: true } },
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
                doneLocked: { Questions: { done: true } },
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
                doneLocked: {
                    Script: { done: true },
                    Questions: { done: true },
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

    describe('get moderator invitation status', () => {
        it('returns default when script is not complete', () => {
            const state = {
                electionName: 'name',
                organizationName: 'name',
                electionDate: new Date(Date.now() + 3600 * 1000 * 24),
                questions: {},
                script: {},
                moderator: {
                    invitations: {
                        // derived data, list may be empty or not present
                        '62e35a8a55ee3c575821f594': {
                            _id: '62e35a8a55ee3c575821f594',
                            sentDate: new Date(Date.now() - 3600 * 1000 * 24),
                            responseDate: new Date(Date.now() - 3600 * 1000),
                            status: 'Accepted',
                        },
                    },
                },
                timeline: {},
            }
            const { getModeratorInvitationStatus } = getElectionStatusMethods(null, state)
            expect(getModeratorInvitationStatus()).toBe('default')
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
                    invitations: {
                        // derived data, list may be empty or not present
                        '62e35a8a55ee3c575821f594': {
                            _id: '62e35a8a55ee3c575821f594',
                            sentDate: new Date(Date.now() - 3600 * 1000 * 24),
                            responseDate: new Date(Date.now() - 3600 * 1000),
                            status: 'Accepted',
                        },
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
                doneLocked: {
                    Questions: { done: true },
                    Script: { done: true },
                },
            }
            const { getModeratorInvitationStatus } = getElectionStatusMethods(null, state)
            expect(getModeratorInvitationStatus()).toBe('accepted')
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
                    invitations: {
                        // derived data, list may be empty or not present
                        '62e35a8a55ee3c575821f594': {
                            _id: '62e35a8a55ee3c575821f594',
                            sentDate: new Date(Date.now() - 3600 * 1000 * 24),
                            responseDate: new Date(Date.now() - 3600 * 1000),
                            status: 'Declined',
                        },
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
                doneLocked: {
                    Questions: { done: true },
                    Script: { done: true },
                },
            }
            const { getModeratorInvitationStatus } = getElectionStatusMethods(null, state)
            expect(getModeratorInvitationStatus()).toBe('declined')
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
                    invitations: {
                        // derived data, list may be empty or not present
                        '62e35a8a55ee3c575821f594': {
                            _id: '62e35a8a55ee3c575821f594',
                            sentDate: new Date(Date.now() - 3600 * 1000 * 24),
                        },
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
                doneLocked: {
                    Questions: { done: true },
                    Script: { done: true },
                },
            }
            const { getModeratorInvitationStatus } = getElectionStatusMethods(null, state)
            expect(getModeratorInvitationStatus()).toBe('sent')
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
                doneLocked: {
                    Script: { done: true },
                    Questions: { done: true },
                },
            }
            const { getModeratorInvitationStatus } = getElectionStatusMethods(null, state)
            expect(getModeratorInvitationStatus()).toBe('1')
        })
    })

    describe('check moderator reminder sent', () => {
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
            const { checkModeratorReminderSent } = getElectionStatusMethods(null, state)
            expect(checkModeratorReminderSent())
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
            const { checkModeratorReminderSent } = getElectionStatusMethods(null, state)
            expect(checkModeratorReminderSent()).toBe(false)
        })
    })

    describe('get moderator submission status', () => {
        it('is empty', () => {
            const state = {}
            const { getModeratorSubmissionStatus } = getElectionStatusMethods(null, state)
            expect(getModeratorSubmissionStatus()).toBe('default')
        })
        it('has no deadling', () => {
            const state = {
                timeline: {},
            }
            const { getModeratorSubmissionStatus } = getElectionStatusMethods(null, state)
            expect(getModeratorSubmissionStatus()).toBe('default')
        })
        it('has an empty deadline', () => {
            const state = {
                timeline: {
                    moderatorSubmissionDeadline: {},
                },
            }
            const { getModeratorSubmissionStatus } = getElectionStatusMethods(null, state)
            expect(getModeratorSubmissionStatus()).toBe('default')
        })
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
            const { getModeratorSubmissionStatus } = getElectionStatusMethods(null, state)
            expect(getModeratorSubmissionStatus()).toBe('missed')
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
            const { getModeratorSubmissionStatus } = getElectionStatusMethods(null, state)
            expect(getModeratorSubmissionStatus()).toBe('submitted')
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
            const { getModeratorSubmissionStatus } = getElectionStatusMethods(null, state)
            expect(getModeratorSubmissionStatus()).toBe('sent')
        })
        it('returns default', () => {
            const state = {
                timeline: {},
            }
            const { getModeratorSubmissionStatus } = getElectionStatusMethods(null, state)
            expect(getModeratorSubmissionStatus()).toBe('default')
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
                    invitations: {
                        // derived data, list may be empty or not present
                        '62e35a8a55ee3c575821f594': {
                            _id: '62e35a8a55ee3c575821f594',
                            sentDate: new Date(Date.now() - 3600 * 1000 * 24),
                        },
                    },
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
                    invitations: {},
                },
            }
            const { getElectionTableStatus } = getElectionStatusMethods(null, state)
            expect(getElectionTableStatus()).toBe('default')
        })
    })

    describe('get candidates submissions status', () => {
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
                    invitations: {
                        // derived data, list may be empty or not present
                        '62e35a8a55ee3c575821f594': {
                            _id: '62e35a8a55ee3c575821f594',
                            sentDate: new Date(Date.now() - 2000),
                        },
                        '62e607a9c1592e09b44fd1e1': {
                            _id: '62e607a9c1592e09b44fd1e1',
                            sentDate: new Date(Date.now() - 2000),
                            responseDate: new Date(Date.now() - 4000),
                            status: 'Declined',
                        },
                        '62e607d4c40ef115f4e47c17': {
                            _id: '62e607d4c40ef115f4e47c17',
                            sentDate: new Date(Date.now() - 2000),
                            responseDate: new Date(Date.now() - 4000),
                            status: 'Accepted',
                        },
                        '62e607f6fc3ef52410c64bd5': {
                            _id: '62e607f6fc3ef52410c64bd5',
                            sentDate: new Date(Date.now() - 2000),
                            responseDate: new Date(Date.now() - 4000),
                            status: 'Accepted',
                        },
                    },
                },
                candidates: {
                    '62e757299283218b0f61dfc4': {
                        _id: '62e757299283218b0f61dfc4',
                        invitations: {
                            '62e602be60ee8944086c42b7': {
                                _id: '62e602be60ee8944086c42b7',
                                responseDate: new Date(Date.now() - 2000),
                                status: 'Accepted',
                            },
                        },
                    },
                    '62e75729d3ac2a8b2356add1': {
                        _id: '62e75729d3ac2a8b2356add1',
                        invitations: {
                            '62e602f73d79581224b85edf': {
                                _id: '62e602f73d79581224b85edf',
                                responseDate: new Date(Date.now() - 2000),
                                status: 'Accepted',
                            },
                        },
                    },
                    '62e75bc2aeefba9f6a4b2fe8': {
                        _id: '62e75bc2aeefba9f6a4b2fe8',
                        invitations: {
                            '62e602f73d79581224b85edg': {
                                _id: '62e602f73d79581224b85edg',
                                responseDate: new Date(Date.now() - 2000),
                                status: 'Declined',
                            },
                        },
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
                            sent: false,
                        },
                    },
                },
            }
            const { getCandidatesSubmissionsStatus } = getElectionStatusMethods(null, state)
            expect(getCandidatesSubmissionsStatus()).toEqual({
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
                    invitations: {
                        // derived data, list may be empty or not present
                        '62e607a9c1592e09b44fd1e1': {
                            _id: '62e607a9c1592e09b44fd1e1',
                        },
                        '62e607d4c40ef115f4e47c17': {
                            _id: '62e607d4c40ef115f4e47c17',
                        },
                        '62e607f6fc3ef52410c64bd5': {
                            _id: '62e607f6fc3ef52410c64bd5',
                        },
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
            const { getCandidatesSubmissionsStatus } = getElectionStatusMethods(null, state)
            expect(getCandidatesSubmissionsStatus()).toBe('default')
        })
    })
    describe('are questions locked', () => {
        it('should be locked since invite sent', () => {
            const state = {
                moderator: {
                    invitations: {
                        // derived data, list may be empty or not present
                        '62e35a8a55ee3c575821f594': {
                            _id: '62e35a8a55ee3c575821f594',
                            sentDate: new Date(Date.now() - 3600 * 1000 * 24),
                            responseDate: new Date(Date.now() - 3600 * 1000),
                            status: 'Accepted',
                        },
                    },
                },
            }
            const { areQuestionsLocked } = getElectionStatusMethods(null, state)
            expect(areQuestionsLocked()).toBe(true)
        })
        it('should not be locked since no invites', () => {
            let state = {
                moderator: {
                    invitations: {},
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
    describe('get days text', () => {
        it('should be blank', () => {
            expect(getDaysText()).toBe('');
            expect(getDaysText(undefined)).toBe('');
            expect(getDaysText(null)).toBe('');
            expect(getDaysText('')).toBe('');
        })
        it('should show today', () => {
            expect(getDaysText(0)).toBe('Today');
            expect(getDaysText(-0)).toBe('Today');
        })
        it('should show days ago', () => {
            expect(getDaysText(-1)).toBe('1 days ago');
            expect(getDaysText(-100)).toBe('100 days ago');
        })
        it('should show days left', () => {
            expect(getDaysText(1)).toBe('1 days left');
            expect(getDaysText(100)).toBe('100 days left');
        })
    })
})
