// https://github.com/EnCiv/undebate-ssp/issues/50

import React, { useState, useEffect } from 'react'
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
    const [validInputs, setValidInputs] = useState({ name: false, email: false, greeting: false })

    /*
    //const [moderatorName, setModeratorName] = useState(electionObj?.moderator?.name || '')
    const moderatorName = electionObj?.moderator?.name || ''
    //const [moderatorEmail, setModeratorEmail] = useState(electionObj?.moderator?.email || '')
    const moderatorEmail = electionObj?.moderator?.email || ''
    const [greeting, setGreeting] = useState(
        "Thank you for being the moderator in our election. The next step is to click on the link below, and you will be taken to the web app for recording. The page will give you a script to start with, and the questions to ask, and you will be able to review and redo as you like. We aren't able to invite are candidates to record their answers until you ask the questions, so please try to do this soon."
    )

    const checkValid = () => validGreeting() && moderatorName.length > 0 && moderatorEmail.length > 0



    const [isValid, setIsValid] = useState(checkValid())

    useEffect(() => {
        setIsValid(checkValid())
    }, [moderatorName, moderatorEmail, greeting])

    const handleUpsert = () => {
        if (checkValid()) {
            electionMethods.upsert({ moderator: { email: moderatorEmail, name: moderatorName } })
        }
    }
    */

    return (
        <div className={cx(className, classes.container)} style={style}>
            <div className={classes.send}>
                <span>An invitation will be emailed to the moderator along with the script and a recording link</span>
                <Submit
                    name='Send Invitation'
                    disabled={Object.values(validInputs).some(i => i === false)}
                    disableOnClick
                    onDone={({ valid, value }) => {
                        if (valid) electionMethods.sendInvitation()
                    }}
                />
            </div>
            <div className={classes.form}>
                <div className={classes.inputs}>
                    <ElectionTextInput
                        name='Moderation Name'
                        defaultValue={name}
                        onDone={({ valid, value }) => {
                            setValidInputs({ ...validInputs, name: valid })
                            electionMethods.upsert({ moderator: { name: value } })
                        }}
                    />
                    <ElectionTextInput
                        name='Email Address'
                        defaultValue={email}
                        checkIsEmail
                        onDone={({ valid, value }) => {
                            setValidInputs({ ...validInputs, email: valid })
                            electionMethods.upsert({ moderator: { email: value } })
                        }}
                    />
                </div>
                <div className={classes.greeting}>
                    <ElectionArea
                        name='greeting'
                        defaultValue={greeting}
                        maxWords={400}
                        onDone={({ valid, value }) => {
                            setValidInputs({ ...validInputs, greeting: valid })
                            electionMethods.upsert({ moderator: { greeting: value } })
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
