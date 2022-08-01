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
            merge(obj) {
                console.info('merge called with', obj)
                dispatch(merge({}, state, obj, { _count: (state?._count || 0) + 1 }))
            },
            upsert(obj) {
                if (state.webComponent) {
                    console.info('upsert called with', obj)
                    window.socket.emit('find-and-set-election-doc', { _id: id }, obj)
                    dispatch(merge({}, state, obj, { _count: (state?._count || 0) + 1 }))
                } else {
                    logger.info('upsert: no updates until state has been populated')
                }
            },
            createModeratorRecorder() {
                window.socket.emit('create-moderator-recorder', id)
            },
            sendModeratorInvitation() {
                window.socket.emit('send-moderator-invite', id)
            },
            sendCandidateInvitations() {
                window.socket.emit('create-send-candidate-invites', id)
            },
        }),
        {}, // empty because the data won't come until later, but react won't let us call new hooks later
        []
    )
    useEffect(() => {
        const unsubscribe = socketApiSubscribe(
            'subscribe-election-info',
            id,
            electionOM[1].merge, // callback
            electionOM[1].merge // update handler
        )
        return unsubscribe
    }, [])
    return <ConfigureElection electionOM={electionOM} />
}
