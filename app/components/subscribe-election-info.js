// https://github.com/EnCiv/undebate-ssp/issue/20
import React, { useEffect } from 'react'
import ConfigureElection from './configure-election'
import getElectionStatusMethods from '../lib/get-election-status-methods'
import useMethods from 'use-methods'
import socketApiSubscribe from './lib/socket-api-subscribe'

export function applyUnsetAsUndefined(obj, unset) {
    if (typeof unset !== 'object' || !unset) return // might be undefined or null
    Object.keys(unset).forEach(key => {
        if (typeof unset[key] === 'object') {
            if (typeof obj[key] !== 'object') {
                obj[key] = {}
            }
            applyUnsetAsUndefined(obj[key], unset[key])
        } else {
            obj[key] = undefined
        }
    })
}

export default function SubscribeElectionInfo(props) {
    const { id, defaultValue = {}, onUnmount = () => {} } = props
    const electionOM = useMethods(
        (dispatch, state) => ({
            ...getElectionStatusMethods(dispatch, state),
            merge(obj = {}, unset) {
                console.info('merge called with', obj)
                const update = { ...obj, _count: (state?._count || 0) + 1 }
                applyUnsetAsUndefined(update, unset)
                dispatch(update)
            },
            upsert(obj) {
                if (typeof obj !== 'object') return
                if (state.webComponent) {
                    console.info('upsert called with', obj)
                    window.socket.emit('find-and-set-election-doc', { _id: id }, obj)
                    dispatch({ ...obj, _count: (state?._count || 0) + 1 })
                } else {
                    logger.info('upsert: no updates until state has been populated')
                }
            },
            unset(obj) {
                if (typeof obj !== 'object') return
                if (state.webComponent) {
                    console.info('unset called with', obj)
                    window.socket.emit('find-and-unset-election-doc', { _id: id }, obj)
                    const update = { _count: (state._count || 0) + 1 }
                    applyUnsetAsUndefined(update, obj)
                    dispatch(update)
                } else {
                    logger.info('upsert: no updates until state has been populated')
                }
            },
            createModeratorRecorder(cb) {
                window.socket.emit('create-moderator-recorder', id, cb)
            },
            sendModeratorInvitation(cb) {
                window.socket.emit('send-moderator-invite', id, cb)
            },
            sendCandidateInvitations(filter, cb) {
                window.socket.emit('create-send-candidate-invites', id, filter, cb)
            },
        }),
        defaultValue,
        []
    )
    useEffect(() => {
        const unsubscribe = socketApiSubscribe(
            'subscribe-election-info',
            id,
            electionOM[1].merge, // callback
            electionOM[1].merge // update handler
        )
        return () => {
            unsubscribe()
            onUnmount(electionOM[0]) // update parent with latest electionObj
        }
    }, [])
    return <ConfigureElection electionOM={electionOM} />
}
