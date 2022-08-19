import React from 'react'
import { ThemeProvider } from 'react-jss'
import '../assets/styles/index.css'
import theme from '../app/theme'
import { merge } from 'lodash'
import useMethods from 'use-methods'
import getElectionStatusMethods from '../app/lib/get-election-status-methods'
import ObjectID from 'isomorphic-mongo-objectid/src/isomorphic-mongo-objectid'

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
}

export const decorators = [
    Story => {
        const [doneS, doneM] = useMethods(
            (dispatch, state) => ({
                onDone(done) {
                    dispatch({ ...done, _count: state._count + 1 })
                },
            }),
            { _count: 0 }
        )
        const electionOM = useMethods(
            (dispatch, state) => ({
                ...getElectionStatusMethods(dispatch, state),
                upsert(obj) {
                    dispatch(merge({}, state, obj, { _count: state._count + 1 }))
                },
                createModeratorRecorder(cb) {
                    const newId = ObjectID().toString()
                    dispatch(
                        merge(
                            {},
                            state,
                            {
                                moderator: {
                                    recorders: {
                                        '62d5fc793d4af57ff9a9f4af': {
                                            _id: '62d5fc793d4af57ff9a9f4af',
                                            path: '/country:us/org:usfg/office:moderator/2022-11-08-62d5fc793d4af57ff9a9f4af',
                                        },
                                    },
                                    viewers: {
                                        [newId]: {
                                            _id: newId,
                                            path: '/country:us/org:usfg/office:moderator/2022-11-08',
                                        },
                                    },
                                },
                            },
                            { _createModeratorRecorder: (state._createModeratorRecorder || 0) + 1 },
                            { _count: state._count + 1 }
                        )
                    )
                    if (cb) setTimeout(() => cb({ rowObjs: {}, messages: [] }), 1000)
                },
                sendModeratorInvitation(cb) {
                    dispatch(
                        merge(
                            {},
                            state,
                            {
                                moderator: {
                                    invitations: {
                                        '62e85b5b7d67bd62c48a2d61': {
                                            _id: '62e85b5b7d67bd62c48a2d61',
                                            sentDate: new Date().toISOString(),
                                        },
                                    },
                                },
                            },
                            { _sendModeratorInvitation: (state._sendModeratorInvitation || 0) + 1 },
                            { _count: state._count + 1 }
                        )
                    )
                    if (cb) setTimeout(cb, 1000)
                },
                sendCandidateInvitations(filter, cb) {
                    dispatch(
                        merge(
                            {},
                            state,
                            { _sendCandidateInvitations: (state._sendCandidateInvitations || 0) + 1 },
                            { _count: state._count + 1 }
                        )
                    )
                    if (cb) setTimeout(cb, 1000)
                },
            }),
            { _count: 0 }
        )
        const [electionObj, electionMethods] = electionOM
        return (
            <ThemeProvider theme={theme}>
                <div style={{ backgroundColor: theme.backgroundColorApp }}>
                    <Story onDone={doneM.onDone} electionOM={electionOM} />
                </div>
                <div style={{ width: '100%', border: 'solid 1px black', marginTop: '1rem', marginBottom: '1rem' }} />
                {doneS._count > 0 && (
                    <div>
                        onDone:{' '}
                        <span id='onDone' style={{ whiteSpace: 'pre-wrap' }}>
                            {JSON.stringify(doneS, null, 4)}
                        </span>
                    </div>
                )}
                {electionObj._count > 0 && (
                    <div>
                        electionObj:{' '}
                        <span id='electionObj' data-testid='electionObj' style={{ whiteSpace: 'pre-wrap' }}>
                            {JSON.stringify(electionObj, null, 4)}
                        </span>
                    </div>
                )}
            </ThemeProvider>
        )
    },
]
