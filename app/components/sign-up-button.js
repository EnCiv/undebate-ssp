'use strict'

import React from 'react'
import LinkButton from './link-button'

const SignUpButton = props => {
    const { className, style } = props
    return (
        <LinkButton className={className} style={style} href='/join'>
            Sign Up
        </LinkButton>
    )
}

export default SignUpButton
