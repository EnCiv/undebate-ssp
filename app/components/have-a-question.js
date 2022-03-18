import React, { useState, useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import TextareaAutosize from 'react-textarea-autosize'
import cx from 'classnames'
import Submit from './submit'

const placeHoderMessage = 'Have a question? Ask away....'
const emailMessage = 'Want a reply? Leave your email.'
export default function HaveAQuestion(props) {
    const [message, setMessage] = useState('')
    const classes = useStyles()
    const [askEmail, setAskEmail] = useState(false)
    const [response, setResponse] = useState(null)
    const [email, setEmail] = useState('')
    const { className, style } = props

    // this prevents the last character of the string from being removed
    useEffect(() => {}, [email], [message])

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
        let subject = 'Have A Question'

        window.socket.emit('send-contact-us', email, fname, lname, subject, message, response => {
            if (response && response.error) {
                let { error } = response
                setResponse(error)
            } else {
                setResponse('Your question was sucessfully submitted!')
                setTimeout(() => 1000)
            }
        })
    }

    return (
        <div className={classes.container}>
            <div className={classes.scriptInfo}></div>

            <TextareaAutosize
                className={classes.input}
                placeholder={placeHoderMessage}
                style={style}
                onBlur={handelInput}
                onKeyPress={handleKeyPress}
                onChange={e => setMessage(e.target.value)}
            />
            <TextareaAutosize
                onBlur={handelInput2}
                onKeyPress={handleKeyPress2}
                className={cx(!askEmail && classes.disabled, askEmail && classes.input)}
                placeholder={emailMessage}
                onChange={e => setEmail(e.target.value)}
            ></TextareaAutosize>
            <Submit
                type='button'
                className={cx(!askEmail && classes.disabled, askEmail && classes.button)}
                onDone={contactUs}
            />
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
        marginBottom: '0.3rem',
        marginTop: '0.3rem',
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
