// https://github.com/EnCiv/undebate-ssp/issue/20
import React, { useState, useMemo } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import ConfigureElection from './configure-election'
import UndebatesList from './undebates-list'
import ElectionHeader from './election-header'
import getElectionStatusMethods from '../lib/get-election-status-methods'
import useMethods from 'use-methods'
import { merge } from 'lodash'

export default function UndebateHomepage(props) {
    const { className, style, electionObjs, user } = props
    const classes = useStyles(props)
    const [selectedId, setSelectedId] = useState('')
    const index = selectedId ? electionObjs.findIndex(eObj => eObj._id === selectedId) : -1
    const electionNames = useMemo(() => electionObjs.map(obj => obj.electionName), [electionObjs])
    return (
        <div className={cx(className, classes.undebateHomePage)} style={style}>
            <ElectionHeader
                elections={selectedId ? electionNames : ['Select One']}
                defaultValue={index}
                className={classes.header}
                user={user}
                onDone={({ valid, value }) =>
                    setSelectedId(electionObjs.find(obj => obj.electionName === electionNames[value])._id)
                }
            />
            {selectedId ? (
                <SelectedElection electionObj={electionObjs[index]} key={index} />
            ) : (
                <UndebatesList
                    electionObjs={electionObjs}
                    onDone={({ value, valid }) => setSelectedId(value)}
                    key='list'
                />
            )}
        </div>
    )
}

function SelectedElection(props) {
    const { electionObj } = props
    const electionOM = useMethods(
        (dispatch, state) => ({
            ...getElectionStatusMethods(dispatch, state),
            upsert(obj) {
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
                        { _sendCandidateInvitations: (state._sendCandidateInvitations || 0) + 1 },
                        { _count: (state._count | 0) + 1 }
                    )
                )
            },
        }),
        electionObj,
        [electionObj]
    )
    return <ConfigureElection electionOM={electionOM} />
}

const useStyles = createUseStyles(theme => ({
    undebateHomePage: {},
    header: {
        height: '100%',
    },
}))
