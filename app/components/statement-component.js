import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

export default function StatementComponent(props) {
    const { className, style, subject, description } = props
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
        fontFamily: 'Gilroy-Bold',
    },
    description: {
        display: 'flex',
        color: 'rgba(38, 45, 51, 0.5)',
        fontFamily: 'Poppins',
        fontStyle: 'normal',
        fontWeight: 400,
    },
}))
