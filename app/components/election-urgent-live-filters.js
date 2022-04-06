'use-strict'

// https://github.com/EnCiv/undebate-ssp/issues/21

import cx from 'classnames'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'

import SvgElectionUrgentFilter from '../svgr/election-urgent-filter'
import SvgElectionLiveFilter from '../svgr/election-live-filter'

function ElectionUrgentLiveFilters(props) {
    const { onDone, name = 'election-urgent-live-filters', style, className } = props
    const classes = useStyles()

    const filterType = e => {
        onDone({ value: e.currentTarget.id, valid: true })
    }

    return (
        <div>
            <div className={classes.circleContainer}>
                <SvgElectionUrgentFilter id='urgentFilter' className={classes.circle} onClick={filterType} />
            </div>
            <div className={classes.circleContainer}>
                <SvgElectionLiveFilter id='liveFilter' className={classes.circle} onClick={filterType} />
            </div>
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    circle: {
        margin: 'auto',
        width: '1rem',
        height: '1rem',
        transition: '0.5s',
        '&:hover': {
            width: '1.5rem',
            height: '1.5rem',
            cursor: 'pointer',
        },
    },
    circleContainer: {
        display: 'flex',
        alignItems: 'center',
        height: '1.5rem',
        width: '1.5rem',
    },
}))

export default ElectionUrgentLiveFilters
