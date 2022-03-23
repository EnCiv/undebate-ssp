// https://github.com/EnCiv/undebate-ssp/issues/120

import React, { useState, useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import SvgDesktop from '../svgr/desktop'
import SvgPortrait from '../svgr/portrait'

export default function LandscapePortraitSlider(props) {
    const classes = useStyles()
    const [isLandscape, setIsLandscape] = useState(true)

    const handelInput = e => {
        setIsLandscape(!isLandscape)
    }
    return (
        <>
            <div className={classes.container}>
                <iframe
                    src='https://cc.enciv.org/country:us/organization:ucla-student-accociation/office:usac-president/2021-05-07'
                    className={cx(isLandscape && classes.landscape, !isLandscape && classes.portrait)}
                ></iframe>
            </div>
            <div>
                <SvgDesktop className={classes.icon} /> <SvgPortrait className={classes.icon} />{' '}
            </div>
        </>
    )
}

//possibly set height to a ratio based on width (w/1920*1080)
const useStyles = createUseStyles(theme => ({
    container: {
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        paddingTop: '56.25%',
    },
    icon: {
        height: theme.iconSize,
        width: theme.iconSize,
        left: '50%',
    },
    landscape: {
        position: 'absolute',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
        width: '100%',
        height: '100%',
    },
    portrait: {},
}))
