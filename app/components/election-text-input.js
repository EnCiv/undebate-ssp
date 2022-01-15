// https://github.com/EnCiv/undebate-ssp/issues/9

import { useRef, useEffect, React } from 'react'
import { createUseStyles } from 'react-jss'
import IsEmail from 'isemail'

function ElectionTextInput(props) {
    const classes = useStyles()
    const { name = '', defaultValue = '', checkIsEmail = false, onDone = () => {} } = props

    useEffect(() => {
        handleDone() // if default value changes, inputRef.value will be set to it by the time useEffect is called - need to update the validity
    }, [defaultValue])

    const inputRef = useRef(null)

    // this allows initial defaultValue to be passed up as input if valid
    useEffect(() => {
        handleDone()
    }, [])

    const handleKeyPress = e => {
        if (e.key === 'Enter') inputRef.current.blur()
    }

    // eslint-disable-next-line no-unused-vars
    const handleDone = e => {
        onDone({ valid: isTextValid(inputRef.current.value), value: inputRef.current.value })
    }

    const checkEmail = email => IsEmail.validate(email, { minDomainAtoms: 2 })

    const isTextValid = txt => {
        // minDomainAtoms opt force requires a two part domain name
        // ex: user@example.com
        // this can be removed to accept a one part domain name if needed
        // ex: user@example
        if (checkIsEmail) return !!txt && checkEmail(txt)
        else return !!txt
    }

    return (
        <div className={classes.electionTextInput}>
            <label htmlFor={name} className={classes.label}>
                {name}
            </label>
            <input
                key={`${name}input`}
                type={checkIsEmail ? 'email' : 'text'}
                className={classes.input}
                defaultValue={defaultValue}
                name={name}
                onBlur={handleDone}
                onKeyPress={handleKeyPress}
                ref={inputRef}
            />
            {checkIsEmail && inputRef.current && !checkEmail(inputRef.current.value) && (
                <span className={classes.validity}>name@example.com format expected</span>
            )}
        </div>
    )
}

export default ElectionTextInput

const useStyles = createUseStyles({
    electionTextInput: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0.75rem',
    },
    label: {
        margin: '0 0.625rem',
        fontWeight: '600',
    },
    input: {
        borderRadius: '0.625rem',
        background: 'linear-gradient(0deg, rgba(38, 45, 51, 0.2), rgba(38, 45, 51, 0.2)), #FFFFFF',
        padding: '1rem 1.25rem',
        border: 'none',
        fontSize: '1.125rem',
        width: '100%',
    },
    validity: {
        margin: '0',
        padding: '0',
        color: 'red',
        fontSize: '.85rem',
    },
})
