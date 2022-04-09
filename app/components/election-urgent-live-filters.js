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
    const [urgentFilter, setUrgentFilter] = useState(false)
    const [liveFilter, setLiveFilter] = useState(false)

    const handleUrgentFilterSelection = e => {
        // if Urgent filter already on then clicking it again will toggle it off
        if (urgentFilter) {
            setUrgentFilter(!urgentFilter)
            return onDone({ valid: true, value: '' })
        }
        // If live filter on then toggle it off and toggle on urgent filter
        if (liveFilter) {
            setLiveFilter(!liveFilter)
            setUrgentFilter(true)
            return onDone({ valid: true, value: 'urgent' })
        }
        setUrgentFilter(!urgentFilter)
        return onDone({ valid: true, value: 'urgent' })
    }
    const handleLiveFilterSelection = e => {
        // if Live filter already on then clicking it again will toggle it off
        if (liveFilter) {
            setLiveFilter(!liveFilter)
            return onDone({ valid: true, value: '' })
        }
        // If urgent filter on then toggle it off and toggle on live  filter
        if (urgentFilter) {
            setUrgentFilter(!urgentFilter)
            setLiveFilter(!liveFilter)
            return onDone({ valid: true, value: 'live' })
        }
        // if neither live or urgent filter on toggle on live filter
        setLiveFilter(!liveFilter)
        return onDone({ valid: true, value: 'live' })
    }

    return (
        <div className={classes.electionUrgentLiveFilter}>
            <div className={classes.circleContainer}>
                <div className={classes.tooltip}>
                    <SvgElectionUrgentFilter
                        className={cx(className, classes.circle, urgentFilter && classes.selected)}
                        onClick={handleUrgentFilterSelection}
                    />

                    <span className={classes.tooltiptext}>Urgent</span>
                </div>
            </div>
            <div className={classes.circleContainer}>
                <div className={classes.tooltip}>
                    <SvgElectionLiveFilter
                        className={cx(className, classes.circle, liveFilter && classes.selected)}
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
        width: '2em',
    },
    circle: {
        margin: 'auto',
        width: '1em',
        height: '1em',
        transition: '0.5s',
        '&:hover': {
            width: '1.5em',
            height: '1.5em',
            cursor: 'pointer',
        },
    },
    selected: {
        width: '1.5em',
        height: '1.5em',
    },
    tooltip: {
        position: 'relative',
        display: 'inline-block',
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
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '2em',
        width: '2em',
    },
}))

export default ElectionUrgentLiveFilters
