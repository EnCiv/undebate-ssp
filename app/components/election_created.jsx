// https://github.com/EnCiv/undebate-ssp/issues/17

import { createUseStyles } from 'react-jss'
import React from 'react'
import moment from 'moment'
import ObjectID from 'isomorphic-mongo-objectid'

export const ElectionCreated = ({ electionMetadata }) => {
    const classes = useStyles()

    const formatDate = () => {
        console.log(ObjectID(electionMetadata._id).getDate())
        const date = moment(ObjectID(electionMetadata._id).getDate())
        const formatted = date.format('DD MMMM YYYY, LTS')
        return formatted
    }

    return (
        <div className={classes.electionCreated}>
            <h4 className={classes.header}>Election Created</h4>
            <p className={classes.timestamp}>{formatDate()}</p>
        </div>
    )
}

const useStyles = createUseStyles({
    electionCreated: {
        color: '#262D33',
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
})
