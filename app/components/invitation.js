// https://github.com/EnCiv/undebate-ssp/issues/50

import React, { useState, useEffect, useReducer } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import ElectionTextInput from './election-text-input'
import Submit from './submit'
import SvgSpeaker from '../svgr/speaker'
import ElectionTextArea from './election-text-area'

export function Invitation(props) {
    const classes = useStyles()
    const { className, style, electionOM } = props
    const [electionObj, electionMethods] = electionOM
    //const {email, name, invitations, submissions}=moderator
    const { moderator = {} } = electionObj
    const {
        email = '',
        name = '',
        message = "Thank you for being the moderator in our election. The next step is to click on the link below, and you will be taken to the web app for recording. The page will give you a script to start with, and the questions to ask, and you will be able to review and redo as you like. We aren't able to invite are candidates to record their answers until you ask the questions, so please try to do this soon.",
        // eslint-disable-next-line no-unused-vars
        invitations = [],
    } = moderator
    const [validInputs, setValidInputs] = useReducer((state, action) => ({ ...state, ...action }), {
        name: null,
        email: null,
        message: null,
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
                            if ((validInputs.name !== null || valid) && name !== value)
                                sideEffects.push(() => electionMethods.upsert({ moderator: { name: value } })) // side effect because we don't want the upsert to cause a rerender before setValidInputs does
                            setValidInputs({ name: valid })
                        }}
                    />
                    <ElectionTextInput
                        name='Email Address'
                        defaultValue={email}
                        checkIsEmail
                        onDone={({ valid, value }) => {
                            if ((validInputs.email !== null || valid) && email !== value)
                                sideEffects.push(() => electionMethods.upsert({ moderator: { email: value } }))
                            setValidInputs({ email: valid })
                        }}
                    />
                </div>
                <div className={classes.message}>
                    <ElectionTextArea
                        name='Invitation greeting'
                        description='This would be included in the invite email for the moderator. Not more than 400 words.'
                        defaultValue={message}
                        maxWords={400}
                        onDone={({ valid, value }) => {
                            if ((validInputs.message !== null || valid) && message !== value)
                                sideEffects.push(() => electionMethods.upsert({ moderator: { message: value } }))
                            setValidInputs({ message: valid })
                        }}
                    />
                </div>
            </div>
            <SvgSpeaker className={classes.speaker} />
        </div>
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
    message: {
        display: 'flex',
        flexDirection: 'column',
    },
})

export default Invitation
