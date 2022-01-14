// https://github.com/EnCiv/undebate-ssp/issues/50

import React, { useState, useEffect, useReducer } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import TextareaAutosize from 'react-textarea-autosize'
import ElectionTextInput from './election-text-input'
import Submit from './submit'
import SvgSpeaker from '../svgr/speaker'

export function Invitation(props) {
    const classes = useStyles()
    const { className, style, electionOM } = props
    const [electionObj, electionMethods] = electionOM
    //const {email, name, invitations, submissions}=moderator
    const { moderator = {} } = electionObj
    const {
        email = '',
        name = '',
        greeting = "Thank you for being the moderator in our election. The next step is to click on the link below, and you will be taken to the web app for recording. The page will give you a script to start with, and the questions to ask, and you will be able to review and redo as you like. We aren't able to invite are candidates to record their answers until you ask the questions, so please try to do this soon.",
        invitations = [],
    } = moderator
    const [validInputs, setValidInputs] = useReducer((state, action) => ({ ...state, ...action }), {
        name: null,
        email: null,
        greeting: null,
    }) // null->[false||true] to prevent a loop of the initial values above that will get rendered first, and then the electionObj data which may get updated right after the initial render
    // a reducer becasue if useState  setValidInputs({...validInputs,email}) would overwrite the value of name with what might not be the current value if setValidInputs({...validInputs,name}) were both called in event handlers before the next rerender that updates ...validInputs
    // not using the usual action {type: "SET_EMAIL", value: true} format because it's too long and wordy for this simple case of updating values of an object

    const inputsInvalid = Object.values(validInputs).some(i => !i)
    // side effects to do after the component rerenders from a state change
    const [sideEffects] = useState([]) // never set sideEffects
    useEffect(() => {
        while (sideEffects.length) sideEffects.shift()()
    })
    return (
        <div className={cx(className, classes.container)} style={style}>
            <div className={classes.send}>
                <span>An invitation will be emailed to the moderator along with the script and a recording link</span>
                <Submit
                    name='Send Invitation'
                    disabled={inputsInvalid}
                    disableOnClick
                    onDone={({ valid, value }) => {
                        if (valid) electionMethods.sendInvitation(value)
                    }}
                />
            </div>
            <div className={classes.form}>
                <div className={classes.inputs}>
                    <ElectionTextInput
                        name='Moderation Name'
                        defaultValue={name}
                        onDone={({ valid, value }) => {
                            if (validInputs.name !== null)
                                sideEffects.push(() => electionMethods.upsert({ moderator: { name: value } })) // side effect because we don't want the upsert to cause a rerender before setValidInputs does
                            setValidInputs({ name: valid })
                        }}
                    />
                    <ElectionTextInput
                        name='Email Address'
                        defaultValue={email}
                        checkIsEmail
                        onDone={({ valid, value }) => {
                            if (validInputs.email !== null)
                                sideEffects.push(() => electionMethods.upsert({ moderator: { email: value } }))
                            setValidInputs({ email: valid })
                        }}
                    />
                </div>
                <div className={classes.greeting}>
                    <ElectionArea
                        name='greeting'
                        defaultValue={greeting}
                        maxWords={400}
                        onDone={({ valid, value }) => {
                            if (validInputs.greeting !== null)
                                sideEffects.push(() => electionMethods.upsert({ moderator: { greeting: value } }))
                            setValidInputs({ greeting: valid })
                        }}
                    />
                </div>
            </div>
            <SvgSpeaker className={classes.speaker} />
        </div>
    )
}

const validGreeting = (greeting, max = 400) =>
    greeting
        .trim()
        .split(' ')
        .filter(word => word !== '' && word !== '\n').length <= max

function ElectionArea(props) {
    const { name, onDone, defaultValue, maxWords } = props
    const classes = useStyles()
    useEffect(() => {
        if (onDone) onDone({ valid: validGreeting(defaultValue, maxWords), defaultValue })
    }, []) // initiall report if default value is valid or not
    return (
        <label className={classes.label}>
            Invitation greeting
            <div className={classes.instruction}>
                <span className={classes.desc}>
                    This would be included in the invite email for the moderator. Not more than 400 words.
                </span>
            </div>
            <TextareaAutosize
                onBlur={e => {
                    const { value } = e.target
                    if (onDone) onDone({ valid: validGreeting(value, maxWords), value })
                }}
                className={classes.textarea}
                name={name}
                minRows={12}
                defaultValue={defaultValue}
            />
        </label>
    )
}

const useStyles = createUseStyles({
    container: {
        position: 'relative',
    },
    send: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1rem',
    },
    form: {
        maxWidth: '38rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    },
    inputs: {
        width: '20rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    },
    speaker: {
        height: '18.75rem',
        position: 'absolute',
        bottom: '0rem',
        right: '1rem',
        fontSize: '16rem',
    },
    label: {
        margin: '0 0.625rem',
        fontWeight: '600',
    },
    instruction: {
        marginBottom: '2rem',
    },
    desc: {
        margin: '.3rem 0rem 0.625rem 0rem',
        fontSize: '.875rem',
        color: '#9da0a2',
    },
    greeting: {
        display: 'flex',
        flexDirection: 'column',
    },
    textarea: {
        boxSizing: 'border-box',
        width: '100%',
        borderRadius: '0.625rem',
        backgroundColor: '#d4d5d6',
        padding: '1rem 1.25rem',
        border: 'none',
        fontSize: '1.125rem',
        fontFamily: 'sans-serif',
    },
})

export default Invitation
