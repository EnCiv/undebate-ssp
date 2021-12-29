'use strict'

import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

// A link styled as a button for cases where a button should provide a simple redirect
// Accepts 'href' prop and can take in text/svgs as children

const LinkButton = props => {
    const { className, style, href, children } = props
    const classes = useStyles()
    return (
        <a className={cx(className, classes.a)} style={style} href={href}>
            {children}
        </a>
    )
}

export default LinkButton

const useStyles = createUseStyles({
    a: {
        display: 'flex',
        width: 'fit-content',
        justifyContent: 'space-between',
        alignItems: 'center',
        textDecoration: 'none',
        color: '#FFFFFF',
        gap: '0.5rem',
        background: 'linear-gradient(0deg, #7470FF, #7470FF), #FFFFFF',
        borderRadius: '2rem',
        padding: '1rem 2rem',
    },
})
