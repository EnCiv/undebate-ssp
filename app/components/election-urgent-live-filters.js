'use-strict'

// https://github.com/EnCiv/undebate-ssp/issues/21

import cx from 'classnames'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'

import SvgElectionUrgentFilter from '../svgr/election-urgent-filter'
import SvgElectionLiveFilter from '../svgr/election-live-filter'
import { useColumnOrder } from 'react-table'

function ElectionUrgentLiveFilters(props) {
    const { onDone, style, className, filterState = '' } = props
    const classes = useStyles()
    const [filter, setFilter] = useState(filterState)

    const handleUrgentFilterSelection = e => {
        const nextFilter = filter === 'urgent' ? '' : 'urgent'
        setFilter(nextFilter)
        onDone({ valid: true, value: nextFilter })
    }
    const handleLiveFilterSelection = e => {
        const nextFilter = filter === 'live' ? '' : 'live'
        setFilter(nextFilter)
        onDone({ valid: true, value: nextFilter })
    }

    return (
        <div className={cx(className, classes.electionUrgentLiveFilter)} style={style}>
            <div className={classes.circleContainer}>
                <div className={classes.tooltip}>
                    <SvgElectionUrgentFilter
                        className={cx(className, classes.circle, filter === 'urgent' && classes.selected)}
                        onClick={handleUrgentFilterSelection}
                    />
                    <span className={classes.tooltiptext}>Urgent</span>
                </div>
            </div>
            <div className={classes.circleContainer}>
                <div className={classes.tooltip}>
                    <SvgElectionLiveFilter
                        className={cx(className, classes.circle, filter === 'live' && classes.selected)}
                        onClick={handleLiveFilterSelection}
                    />
                    <span className={classes.tooltiptext}>Live</span>
                </div>
            </div>
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    electionUrgentLiveFilter: {
        display: 'inline-flex',
        flexDirection: 'column',
        minHeight: '2.25em',
    },
    circle: {
        transition: '0.5s',
        '&:hover': {
            width: '1.3em',
            height: '1.3em',
            cursor: 'pointer',
        },
    },
    selected: {
        width: '1.3em',
        height: '1.3em',
    },
    tooltip: {
        position: 'relative',
        '&:hover $tooltiptext': {
            visibility: 'visible',
        },
    },

    tooltiptext: {
        visibility: 'hidden',
        marginLeft: '5%',
        fontSize: '.75em',
        width: '4.5em',
        backgroundColor: 'black',
        color: '#fff',
        textAlign: 'center',
        borderRadius: '.375em',
        position: 'absolute',
        zIndex: '1',
    },
    circleContainer: {
        display: 'flex',
        justifyContent: 'center',
        height: '1.1em',
    },
}))

export default ElectionUrgentLiveFilters
