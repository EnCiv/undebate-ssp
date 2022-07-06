import React from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'

export default function StatementComponent(props) {
    const { subject, description, className, style } = props
    const classes = useStyles()
    return (
        <div className={cx(className, classes.wrapper)} style={style}>
            <h1 className={classes.subject}>{subject}</h1>
            <p className={classes.description}>{description}</p>
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    wrapper: { textAlign: 'center' },
    subject: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: '1.875rem',
        lineHeight: '2.1875rem',
        paddingBottom: '2rem',
        width: '100%',
        fontFamily: theme.defaultFontFamily,
    },
    description: {
        display: 'flex',
        color: 'rgba(38, 45, 51, 0.7)',
        fontStyle: 'normal',
        fontSize: '1.25rem',
        lineHeight: '1.875rem',
        fontWeight: 400,
        fontFamily: theme.defaultFontFamily,
    },
}))
