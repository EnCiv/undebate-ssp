// https://github.com/EnCiv/undebate-ssp/issues/50

import React, { useState, useEffect, useReducer } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import Submit from './submit'
import CandidateTableInput from './candidate-table-input'
import UploadCSV from './upload-csv'

export default function CandidateTable(props) {
    const classes = useStyles()
    const { className, style, electionOM } = props
    const [electionObj, electionMethods] = electionOM
    const { candidates = {} } = electionObj
    const candidatesArray = Object.values(candidates)
    const [editable, setEditable] = useState(false)

    const [validInputs, setValidInputs] = useReducer((state, action) => ({ ...state, ...action }), {}) // undefined->[false||true] to prevent a loop of the initial values above that will get rendered first, and then the electionObj data which may get updated right after the initial render
    // a reducer becasue if useState  setValidInputs({...validInputs,email}) would overwrite the value of name with what might not be the current value if setValidInputs({...validInputs,name}) were both called in event handlers before the next rerender that updates ...validInputs
    // not using the usual action {type: "SET_EMAIL", value: true} format because it's too long and wordy for this simple case of updating values of an object

    const inputsInvalid = Object.values(validInputs).some(i => !i)
    // side effects to do after the component rerenders from a state change
    const [sideEffects] = useState([]) // never set sideEffects
    useEffect(() => {
        while (sideEffects.length) sideEffects.shift()()
    })
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
            Header: 'Invite Status',
            accessor: 'status',
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
                        Once filled in, invitations can be emaild to the candidates automatically with the the recording
                        link.
                    </p>
                    <p>Choose one of these formats to porivide the Candidate Table:</p>
                    <div className={classes.actionButtons}>
                        <UploadCSV electionOM={electionOM} />
                        <Submit
                            name='Edit Manually'
                            className={cx(classes.opButton, editable && classes.editable)}
                            onDone={({ valid, value }) => valid && setEditable(!editable)}
                        />
                    </div>
                </div>
                <div className={classes.op}>
                    <Submit
                        name={`Send Invites (${candidatesArray.length})`}
                        disabled={inputsInvalid}
                        disableOnClick
                        onDone={({ valid, value }) => {
                            if (valid) electionMethods.sendCandidateInvitations(value)
                        }}
                    />
                </div>
            </div>
            <div className={classes.form}>
                <CandidateTableInput
                    onDone={({ valid, value }) => {
                        if (typeof validInputs[value.uniqueId] !== 'undefined' || valid)
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
    op: {
        flex: 'auto',
    },
    opButton: {
        ...theme.button,
        color: theme.colorSecondary,
        backgroundColor: 'transparent',
        border: `2px solid ${theme.button.borderColor}`,
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
