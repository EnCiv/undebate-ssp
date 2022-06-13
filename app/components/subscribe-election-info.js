// https://github.com/EnCiv/undebate-ssp/issue/20
import React, { useEffect } from 'react'
import ConfigureElection from './configure-election'
import getElectionStatusMethods from '../lib/get-election-status-methods'
import useMethods from 'use-methods'
import { merge } from 'lodash'
import socketApiSubscribe from './lib/socket-api-subscribe'

export default function SubscribeElectionInfo(props) {
    const { id } = props
    const electionOM = useMethods(
        (dispatch, state) => ({
            ...getElectionStatusMethods(dispatch, state),
            upsert(obj) {
                console.info('upsert called with', obj)
                dispatch(merge({}, state, obj, { _count: (state?._count || 0) + 1 }))
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
                        {
                            _sendCandidateInvitations: (state._sendCandidateInvitations || 0) + 1,
                        },
                        { _count: (state._count | 0) + 1 }
                    )
                )
            },
        }),
        {}, // empty because the data won't come until later, but react won't let us call new hooks later
        []
    )
    useEffect(() => {
        const unsubscribe = socketApiSubscribe(
            'subscribe-election-info',
            id,
            electionOM[1].upsert,
            electionOM[1].upsert
        )
        return unsubscribe
    }, [id])
    return <ConfigureElection electionOM={electionOM} />
}
