import React from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

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
        lineHeight: '2rem',
        paddingBottom: '.5rem',
        width: '100%',
        fontFamily: theme.defaultFontFamily,
    },
    description: {
        display: 'flex',
        color: 'rgba(38, 45, 51, 0.5)',
        fontStyle: 'normal',
        fontSize: '1.5rem',
        fontWeight: 400,
        fontFamily: theme.defaultFontFamily,
    },
}))
