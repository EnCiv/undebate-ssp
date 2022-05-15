'use-strict'

// https://github.com/EnCiv/undebate-ssp/issues/21

import cx from 'classnames'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'

import SvgElectionUrgentFilter from '../svgr/election-urgent-filter'
import SvgElectionLiveFilter from '../svgr/election-live-filter'

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
                <SvgElectionUrgentFilter
                    className={cx(className, classes.circle, filter === 'urgent' && classes.selected)}
                    onClick={handleUrgentFilterSelection}
                />
                <span className={classes.tooltiptext}>Urgent</span>
            </div>
            <div className={classes.circleContainer} title='live'>
                <SvgElectionLiveFilter
                    className={cx(className, classes.circle, filter === 'live' && classes.selected)}
                    onClick={handleLiveFilterSelection}
                />
                <span className={classes.tooltiptext}>Live</span>
            </div>
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    electionUrgentLiveFilter: {
        display: 'inline-flex',
        flexDirection: 'column',
        padding: 0,
        margin: 0,
    },
    circle: {
        transition: '0.5s',
        padding: '.15em',
        '&:hover': {
            padding: 0,
            width: '1.3em',
            height: '1.3em',
            cursor: 'pointer',
        },
    },
    selected: {
        padding: 0,
        width: '1.3em',
        height: '1.3em',
    },
    tooltiptext: {
        fontSize: '.75em',
        marginTop: '.125em',
        paddingLeft: '.5em',
        paddingRight: '.5em',
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
        position: 'relative',
        '& span': {
            display: 'none',
        },
        '&:hover span': {
            display: 'block',
            left: '1.75em',
        },
    },
}))

export default ElectionUrgentLiveFilters
