import React from 'react'
import LinkButton from './link-button'

function SignUpButton(props) {
    const { className, style } = props
    return (
        <LinkButton className={className} style={style} href='/join'>
            Sign Up
        </LinkButton>
    )
}

export default SignUpButton
