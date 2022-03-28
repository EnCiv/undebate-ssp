import React from 'react'
import { ThemeProvider } from 'react-jss'
import '../assets/styles/index.css'
import theme from '../app/theme'
import { merge } from 'lodash'
import useMethods from 'use-methods'
import getElectionStatusMethods from '../app/lib/get-election-status-methods'

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
                areQuestionsLocked() {
                    return state._electionsLocked
                },
                sendInvitation() {
                    dispatch(
                        merge(
                            {},
                            state,
                            { _sendInvitation: (state._sendInvitation || 0) + 1 },
                            { _count: state._count + 1 }
                        )
                    )
                },
                sendCandidateInvitations() {
                    dispatch(
                        merge(
                            {},
                            state,
                            { _sendCandidateInvitations: (state._sendCandidateInvitations || 0) + 1 },
                            { _count: state._count + 1 }
                        )
                    )
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
                        <span id='electionObj' style={{ whiteSpace: 'pre-wrap' }}>
                            {JSON.stringify(electionObj, null, 4)}
                        </span>
                    </div>
                )}
            </ThemeProvider>
        )
    },
]
