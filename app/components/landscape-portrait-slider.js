// https://github.com/EnCiv/undebate-ssp/issues/120

import React, { useState, useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

export default function LandscapePortraitSlider(props) {
    const classes = useStyles()
    const [isLandscape, setIsLandscape] = useState(true)

    const handelInput = e => {
        setIsLandscape(!isLandscape)
    }
    return (
        <>
            <iframe
                src='https://cc.enciv.org/country:us/organization:ucla-student-accociation/office:usac-president/2021-05-07'
                className={cx(isLandscape && classes.landscape, !isLandscape && classes.portrait)}
            ></iframe>
        </>
    )
}

//possibly set height to a ratio based on width (w/1920*1080)
const useStyles = createUseStyles(theme => ({
    landscape: {
        width: '100%',
        height: 'auto',
        title: 'Used for testing',
    },
    portrait: {},
}))
