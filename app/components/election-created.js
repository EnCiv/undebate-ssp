// https://github.com/EnCiv/undebate-ssp/issues/17

import { createUseStyles } from 'react-jss'
import React, { forwardRef } from 'react'
import moment from 'moment'
import ObjectID from 'isomorphic-mongo-objectid'
import cx from 'classnames'

const ElectionCreate = forwardRef((props, ref) => {
    const { electionOM, className, style } = props
    const [electionObj, electionMethods] = electionOM
    const classes = useStyles()
    const formatDate = () => {
        const date = moment(ObjectID(electionObj._id).getDate())
        const formatted = date.format('DD MMMM YYYY, LTS')
        return formatted
    }

    return (
        <div ref={ref} className={cx(className, classes.electionCreated)} styls={style}>
            <h4 className={classes.header}>Election Created</h4>
            <p className={classes.timestamp}>{formatDate()}</p>
        </div>
    )
})
export default ElectionCreate

const useStyles = createUseStyles(theme => ({
    electionCreated: {
        color: theme.colorSecondary,
    },
    header: {
        lineHeight: '1.5rem',
        fontWeight: 600,
        margin: '0.313rem 0rem',
    },
    timestamp: {
        fontSize: '0.875rem',
        lineHeight: '1.313rem',
        margin: '0.313rem 0rem',
        opacity: '70%',
    },
}))
