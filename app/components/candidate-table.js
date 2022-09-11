// https://github.com/EnCiv/undebate-ssp/issues/50

import React, { useState, useEffect, useReducer } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import Submit from './submit'
import CandidateTableInput from './candidate-table-input'
import UploadCSV from './upload-csv'
import PasteGoogleSheetsLink from './paste-google-sheets-link'
import { isEqual } from 'lodash'
import IsEmail from 'isemail'
import {candidateFilters} from '../lib/get-election-status-methods'
import InviteSentComponent from "./invite-sent-component";

function isCandidateValid(candidate) {
    return candidate.name && IsEmail.validate(candidate?.email || '', { minDomainAtoms: 2 }) && candidate.office
}

function isCandidateReadyForInvite(candidate, filter = 'NOT_YET_INVITED') {
    return candidateFilters[filter](candidate) && isCandidateValid(candidate)
}

function countCandidatesReadyForInvites(candidates, filter = 'NOT_YET_INVITED') {
    return Object.values(candidates).reduce(
        (count, candidate) => (isCandidateReadyForInvite(candidate, filter) ? count + 1 : count),
        0
    )
}

function blankCandidate(candidate) {
    return candidate && !candidate.name && !candidate.email && !candidate.office && !candidate.region
}

export default function CandidateTable(props) {
    const classes = useStyles()
    const { className, style, electionOM, onDone = () => {} } = props
    const [electionObj, electionMethods] = electionOM
    const { candidates = {} } = electionObj
    const candidatesArray = Object.values(candidates)
    const [editable, setEditable] = useState(false)

    const [validInputs, setValidInputs] = useReducer((state, action) => ({ ...state, ...action }), {}) // undefined->[false||true] to prevent a loop of the initial values above that will get rendered first, and then the electionObj data which may get updated right after the initial render
    // a reducer becasue if useState  setValidInputs({...validInputs,email}) would overwrite the value of name with what might not be the current value if setValidInputs({...validInputs,name}) were both called in event handlers before the next rerender that updates ...validInputs
    // not using the usual action {type: "SET_EMAIL", value: true} format because it's too long and wordy for this simple case of updating values of an object

    const inputsInvalid = Object.values(candidates).some(
        candidate => !blankCandidate(candidate) && !isCandidateValid(candidate)
    )
    // side effects to do after the component rerenders from a state change
    const [sideEffects] = useState([]) // never set sideEffects
    useEffect(() => {
        while (sideEffects.length) sideEffects.shift()()
    })
    const getInvites = (candidate) => {
        return candidate?.invitations;
    }
    const columns = [
        {
            Header: 'Candidate Name',
            accessor: 'name',
        },
        {
            Header: 'Email Address',
            accessor: 'email',
        },
        {
            Header: 'Office',
            accessor: 'office',
        },
        {
            Header: 'Region',
            accessor: 'region',
        },
        {
            Header: 'Invite Send Dates',
            accessor: getInvites,
            Cell: (data) => <InviteSentComponent invites={data.value}/>,
        },
        /*  {
                Header: 'Unique Id',
                accessor: 'uniqueId',
            },*/
    ]
    return (
        <div className={cx(className, classes.container)} style={style}>
            <div className={classes.intro}>
                <div className={classes.description}>
                    <p>
                        Once filled in, invitations can be emailed to the candidates automatically with the the
                        recording link.
                    </p>
                    <p>Choose one of these formats to porivide the Candidate Table:</p>
                    <div className={classes.actionButtons}>
                        <UploadCSV electionOM={electionOM} />
                        <PasteGoogleSheetsLink electionOM={electionOM} />
                        <Submit
                            name='Edit Manually'
                            className={cx(classes.opButton, editable && classes.editable)}
                            onDone={({ valid, value }) => valid && setEditable(!editable)}
                        />
                    </div>
                </div>
                <div className={classes.ops}>
                    <div className={classes.op}>
                        <Submit
                            className={classes.submit}
                            name={`Send Invites (${countCandidatesReadyForInvites(candidates, 'NOT_YET_INVITED')})`}
                            disabled={
                                inputsInvalid || countCandidatesReadyForInvites(candidates, 'NOT_YET_INVITED') === 0
                            }
                            disableOnClick
                            onDone={({ valid, value }) => {
                                if (valid)
                                    electionMethods.sendCandidateInvitations('NOT_YET_INVITED', result => {
                                        onDone({ valid: true, value: 'sent' })
                                        //to do - if error show error messages
                                    })
                            }}
                        />
                    </div>
                    <div className={classes.op}>
                        <Submit
                            className={classes.submit}
                            name={`Send Reminders (${countCandidatesReadyForInvites(candidates, 'NOT_YET_SUBMITTED')})`}
                            disabled={
                                inputsInvalid || countCandidatesReadyForInvites(candidates, 'NOT_YET_SUBMITTED') === 0
                            }
                            disableOnClick
                            onDone={({ valid, value }) => {
                                if (valid)
                                    electionMethods.sendCandidateInvitations('NOT_YET_SUBMITTED', result => {
                                        onDone({ valid: true, value: 'sent' })
                                        //to do - if error show error messages
                                    })
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className={classes.form}>
                <CandidateTableInput
                    onDone={({ valid, value }) => {
                        if (
                            (typeof validInputs[value.uniqueId] !== 'undefined' || valid) &&
                            !isEqual(candidates[value.uniqueId], value)
                        )
                            sideEffects.push(() => electionMethods.upsert({ candidates: { [value.uniqueId]: value } }))
                        setValidInputs({ [value.uniqueId]: valid })
                    }}
                    defaultValue={candidatesArray}
                    editable={editable}
                    columnNames={columns}
                />
            </div>
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    container: {
        position: 'relative',
        padding: theme.gap,
    },
    intro: {
        display: 'flex',
        flexDirection: 'row',
    },
    description: {
        flex: 'auto',
        fontSize: '1.125rem',
        lineHeight: '1.5rem',
    },
    ops: {
        display: 'flex',
        flexDirection: 'column',
    },
    op: {
        flex: 'auto',
    },
    opButton: {
        ...theme.button,
        color: theme.colorSecondary,
        backgroundColor: 'transparent',
        border: `2px solid ${theme.button.borderColor}`,
    },
    submit: {
        width: '100%',
    },
    form: {
        marginTop: `calc( 2 * ${theme.gap})`,
        //       maxWidth: '38rem',
        flexDirection: 'column',
        gap: '2rem',
    },
    editable: {
        backgroundColor: theme.inputFieldBackgroundColor,
    },
    actionButtons: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        '& > div': {
            paddingRight: '0.625rem',
        },
    },
}))
