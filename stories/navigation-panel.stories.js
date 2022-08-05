// https://github.com/EnCiv/undebate-ssp/issues/16
import React, { useEffect } from 'react'
import NavigationPanel from '../app/components/navigation-panel'

export default {
    title: 'Navigation Panel',
    component: NavigationPanel,
    argTypes: {},
}

const Template = (args, context) => {
    const { onDone, electionOM } = context
    const { defaultElectionObj, ...otherArgs } = args
    const [electionObj, electionMethods] = electionOM
    useEffect(() => electionMethods.upsert(defaultElectionObj), [defaultElectionObj])

    return (
        <div>
            {/* {console.log('NavigationPanel')} */}
            <NavigationPanel electionOM={electionOM} onDone={onDone} {...otherArgs} />
        </div>
    )
}

const defaultElectionObject = {
    id: 'mongoobjid',
    electionName: 'U.S Presidential Election',
    organizationName: 'United States Federal Government',
    electionDate: '2023-11-07T23:59:59.999Z',
    questions: {
        0: {
            text: 'What is your favorite color?',
            time: '30',
        },
        1: {
            text: 'Do you have a pet?',
            time: '60',
        },
        2: {
            text: 'Should we try to fix income inequality?',
            time: '90',
        },
    },
    script: {
        0: {
            text: 'Welcome everyone. Our first question is: What is your favorite color?',
        },
        1: {
            text: 'Thank you. Our next Question is: Do you have a pet?',
        },
        2: {
            text: 'Great. And our last question is: Should we try to fix income inequality?',
        },
        3: {
            text: 'Thanks everyone for watching this!',
        },
    },
    moderator: {
        name: 'Bill Smith',
        email: 'billsmith@gmail.com',
        message: 'Please be a moderator',
        invitations: {
            // derived data, list may be empty or not present
            123: {
                _id: '123',
                sentDate: '2022-01-07T22:09:32.952Z',
                responseDate: '2022-01-07T22:09:32.952Z',
                status: 'Accepted',
            },
        },
        submissions: {
            // derived data, list may be empty or not present
            1: { _id: '1', url: '', date: '' },
        },
    },
    candidates: {
        '61e76bbefeaa4a25840d85d0': {
            uniqueId: '61e76bbefeaa4a25840d85d0',
            name: 'Sarah Jones',
            email: 'sarahjones@mail.com',
            office: 'President of the U.S.',
            region: 'United States',
            invitations: {
                // derived data - list may be empty or not present
                '62e75e03b5d24f21ae523733': {
                    _id: '62e75e03b5d24f21ae523733',
                    sentDate: '2022-01-07T22:09:32.952Z',
                    responseDate: '2022-01-07T22:09:32.952Z',
                    status: 'Declined',
                    parentId: '',
                },
                '62e75e17b22ea02235d683a6': {
                    _id: '62e75e17b22ea02235d683a6',
                    sentDate: '2022-01-07T22:09:32.952Z',
                    responseDate: '2022-01-07T22:09:32.952Z',
                    status: 'Accepted',
                    parentId: '',
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
                sent: false,
            },
        },
        candidateSubmissionDeadline: {
            0: {
                date: '2022-01-07T22:09:32.952Z',
                sent: true,
            },
        },
        moderatorInviteDeadline: {
            0: {
                date: '2022-01-07T22:09:32.952Z',
                sent: true,
            },
            1: {
                date: '2022-01-07T22:09:32.952Z',
                sent: false,
            },
        },
    },
    undebateDate: '2022-01-07T22:09:32.952Z',
}

export const ElectionDefault = Template.bind({})
ElectionDefault.args = {
    defaultElectionObj: {
        ...defaultElectionObject,
        electionName: null,
        organizationName: null,
        electionDate: null,
        questions: null,
        script: null,
        moderator: null,
        candidates: null,
        timeline: null,
        undebateDate: null,
    },
}

export const ElectionComplete = Template.bind({})
ElectionComplete.args = {
    defaultElectionObj: {
        ...defaultElectionObject,
        electionDate: null,
        questions: null,
        script: null,
        moderator: null,
        candidates: null,
        timeline: null,
    },
}

export const QuestionsAfterTimelineAreCompleted = Template.bind({})
QuestionsAfterTimelineAreCompleted.args = {
    defaultElectionObj: {
        ...defaultElectionObject,
        questions: null,
        script: null,
        moderator: null,
        candidates: null,
    },
}

export const ScriptAterQuestionsAreCompleted = Template.bind({})
ScriptAterQuestionsAreCompleted.args = {
    defaultElectionObj: {
        ...defaultElectionObject,
        script: null,
        moderator: null,
        candidates: null,
    },
}

export const ScriptIsCompleted = Template.bind({})
ScriptIsCompleted.args = {
    defaultElectionObj: {
        ...defaultElectionObject,
        moderator: null,
        candidates: null,
        undebateDate: null,
    },
}

export const InvitationAfterInviteIsSent = Template.bind({})
InvitationAfterInviteIsSent.args = {
    defaultElectionObj: {
        ...defaultElectionObject,
        moderator: {
            ...defaultElectionObject.moderator,
            invitations: {
                // derived data, list may be empty or not present
                123: {
                    _id: '123',
                    sentDate: '2020-11-07T23:59:59.999Z',
                    responseDate: '',
                    status: '',
                },
                // derived data, list may be empty or not present
                124: {
                    _id: '124',
                    sentDate: '2020-12-07T23:59:59.999Z',
                    responseDate: '',
                    status: '',
                },
            },
        },
    },
}

export const InvitationIsAccepted = Template.bind({})
InvitationIsAccepted.args = {
    defaultElectionObj: {
        ...defaultElectionObject,
        moderator: {
            ...defaultElectionObject.moderator,
            invitations: {
                // derived data, list may be empty or not present
                123: {
                    _id: '123',
                    sentDate: '2020-12-07T23:59:59.999Z',
                    responseDate: '2021-2-07T23:59:59.999Z',
                    status: 'Accepted',
                },
                // derived data, list may be empty or not present
                124: {
                    _id: '124',
                    sentDate: '2020-11-07T23:59:59.999Z',
                    responseDate: '',
                    status: '',
                },
            },
        },
    },
}

export const InvitationIsDeclined = Template.bind({})
InvitationIsDeclined.args = {
    defaultElectionObj: {
        ...defaultElectionObject,
        moderator: {
            ...defaultElectionObject.moderator,
            invitations: {
                // derived data, list may be empty or not present
                123: {
                    _id: '123',
                    sentDate: '2020-12-07T23:59:59.999Z',
                    responseDate: '2021-2-07T23:59:59.999Z',
                    status: 'Declined',
                },
                // derived data, list may be empty or not present
                124: {
                    _id: '124',
                    sentDate: '2020-11-07T23:59:59.999Z',
                    responseDate: '',
                    status: '',
                },
            },
        },
    },
}

export const SubmissionWhenReminderIsSent = Template.bind({})
SubmissionWhenReminderIsSent.args = {
    defaultElectionObj: {
        ...defaultElectionObject,
        timeline: {
            ...defaultElectionObject.timeline,
            moderatorDeadlineReminderEmails: {
                0: {
                    date: '2022-01-07T22:09:32.952Z',
                    sent: true,
                },
                1: {
                    date: '2022-01-01T22:09:32.952Z',
                    sent: false,
                },
            },
        },
    },
}

export const SubmissionWhenVideoIsSubmitted = Template.bind({})
SubmissionWhenVideoIsSubmitted.args = {
    defaultElectionObj: {
        ...defaultElectionObject,
        moderator: {
            ...defaultElectionObject.moderator,
            submissions: {
                1:
                    // derived data, list may be empty or not present
                    { _id: '1', url: 'www.youtube.com/123', date: '2022-01-07T22:09:32.952Z' },
            },
        },
    },
}

export const SubmissionWhenDeadlineIsMissedByModerator = Template.bind({})
SubmissionWhenDeadlineIsMissedByModerator.args = {
    defaultElectionObj: {
        ...defaultElectionObject,
        timeline: {
            ...defaultElectionObject.timeline,
            moderatorSubmissionDeadline: {
                0: {
                    date: '2020-01-07T22:09:32.952Z',
                    sent: false,
                },
            },
        },
    },
}

export const ElectionTableIsFilled = Template.bind({})
ElectionTableIsFilled.args = {
    defaultElectionObj: {
        ...defaultElectionObject,
    },
}

export const UnderbateIsLive = Template.bind({})
UnderbateIsLive.args = {
    defaultElectionObj: {
        ...defaultElectionObject,
        undebateDate: new Date().toISOString,
    },
}

export const UnderbateArchieved = Template.bind({})
UnderbateArchieved.args = {
    defaultElectionObj: {
        ...defaultElectionObject,
        electionDate: '2020-11-07T23:59:59.999Z',
        undebateDate: '2020-01-07T22:09:32.952Z',
    },
}
