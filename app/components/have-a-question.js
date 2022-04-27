import React, { useState } from 'react'
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
    const [responseMessage, setResponseMessage] = useState(true)
    const [submittedQuestion, setSubmittedQuestion] = useState(true)
    const [email, setEmail] = useState('')

    const { className, style } = props

    const handleKeyPress = e => {
        if (e.key === 'Enter') {
            setAskEmail(true)
            e.preventDefault()
        }
    }
    const handelInput = e => {
        setMessage(e.target.value)
        setAskEmail(true)
    }

    const handleKeyPress2 = e => {
        if (e.key === 'Enter') {
            e.preventDefault()
        }
    }
    const handelInput2 = e => {
        setEmail(e.target.value)
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
            }
            setSubmittedQuestion(false)
            setResponseMessage(false)
            setAskEmail(false)
        })
    }
    return (
        <div className={cx(className, classes.container)} style={style}>
            <div className={classes.scriptInfo}></div>

            <TextareaAutosize
                className={cx(responseMessage && classes.input, !responseMessage && classes.disabled)}
                placeholder={placeHoderMessage}
                onBlur={handelInput}
                onKeyPress={handleKeyPress}
            />
            <TextareaAutosize
                onBlur={handelInput2}
                onKeyPress={handleKeyPress2}
                className={cx(
                    !askEmail && classes.disabled,
                    !responseMessage && classes.disabled,
                    askEmail && classes.input
                )}
                placeholder={emailMessage}
            ></TextareaAutosize>
            <Submit
                type='button'
                className={cx(
                    !askEmail && classes.disabled,
                    !responseMessage && classes.disabled,
                    askEmail && classes.button
                )}
                onDone={contactUs}
            />
            <TextareaAutosize
                className={cx(submittedQuestion && classes.disabled, !submittedQuestion && classes.input)}
                defaultValue={message}
            ></TextareaAutosize>
            <div
                className={cx(
                    responseMessage && classes.disabled,
                    submittedQuestion && classes.disabled,
                    !responseMessage && classes.response
                )}
            >
                {response}
            </div>
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '45%',
        margin: '0 auto',
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
        overflow: 'hidden',
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

    response: {
        fontFamily: theme.defaultFontFamily,
        fontSize: '1.25rem',
        marginTop: '0.3rem',
        padding: '1.25rem',
        border: '0.3rem solid #0088dd',
        alignItems: 'center',
        justifyContent: 'center',
    },
}))
