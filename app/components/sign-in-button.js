import React from 'react'
import LinkButton from './link-button'

function SignInButton(props) {
    const { className, style } = props
    return (
        <LinkButton className={className} style={style} href='/join'>
            Sign In
        </LinkButton>
    )
}

export default SignInButton
