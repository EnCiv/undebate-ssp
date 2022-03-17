import React, { useState, useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import TextareaAutosize from 'react-textarea-autosize'
import cx from 'classnames'

const defaultValue = 'Have a question? Ask away....'
const buttonMessage = 'Submit'
const emailMessage = 'Want a reply? Leave your email.'
export default function HaveAQuestion(props) {
    const [message, setMessage] = useState(emailMessage)

    const classes = useStyles()
    const [askEmail, setAskEmail] = useState(false)
    const [response, setResponse] = useState(null)
    const [subject, setSubject] = useState(defaultValue)
    // const [submitButton, setSubmitButton] = useState(false)
    const { className, style } = props

    useEffect(() => {}, [subject], [message])

    const handleKeyPress = e => {
        if (e.key === 'Enter') {
            setAskEmail(true)
            e.preventDefault()
        }
    }
    const handelInput = e => {
        setAskEmail(true)
    }

    const handleKeyPress2 = e => {
        if (e.key === 'Enter') {
            e.preventDefault()
        }
    }
    const handelInput2 = e => {
        setAskEmail(true)
    }

    const contactUs = e => {
        let fname = ''
        let lname = ''
        let email = ''

        window.socket.emit('send-contact-us', email, fname, lname, subject, message, response => {
            if (response && response.error) {
                let { error } = response
                setResponse(error)
            } else {
                setResponse('Your question was sucessfully submitted!')
                setTimeout(() => 1000)
            }

            console.log('subject is,', subject)
            console.log('message is,', message)
        })
    }
    console.log('response is,', response)
    return (
        <div className={classes.container}>
            <div className={classes.scriptInfo}></div>

            <TextareaAutosize
                className={classes.input}
                placeholder={defaultValue}
                style={style}
                onBlur={handelInput}
                onKeyPress={handleKeyPress}
                onChange={e => setSubject(e.target.value)}
            />
            <TextareaAutosize
                onBlur={handelInput2}
                onKeyPress={handleKeyPress2}
                className={cx(!askEmail && classes.disabled, askEmail && classes.input)}
                placeholder={emailMessage}
                onChange={e => setMessage(e.target.value)}
            ></TextareaAutosize>
            <button
                type='button'
                className={cx(!askEmail && classes.disabled, askEmail && classes.button)}
                onClick={contactUs}
            >
                {buttonMessage}
            </button>
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
    },

    input: {
        backgroundColor: theme.askQuestionColor,
        padding: theme.button.padding,
        fontFamily: theme.defaultFontFamily,
        fontSize: '1.25rem',
        resize: 'none',
        border: 'none',
        borderRadius: theme.defaultBorderRadius,
        height: '90px',
        width: '880px',
        left: '0px',
        top: '737px',
        marginBottom: '2px',
        marginTop: '2px',
    },
    emailMessage: {
        placeholder: 'block',
    },
    disabled: {
        display: 'none',
    },
    button: {
        display: 'flex',
        width: 'fit-content',
        justifyContent: 'space-between',
        alignItems: 'center',
        textDecoration: 'none',
        color: '#FFFFFF',
        gap: '0.5rem',
        background: theme.colorPrimary,
        borderRadius: theme.buttonBorderRadius,
        padding: theme.buttonPadding,
    },
    buttonMessage: {
        display: 'block',
    },
}))
