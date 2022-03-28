// https://github.com/EnCiv/undebate-ssp/issues/120

import React, { useState, useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import SvgDesktop from '../svgr/desktop'
import SvgPortrait from '../svgr/portrait'
import SvgRectangle from '../svgr/rectangle'
import SvgHorizontalRectangle from '../svgr/horizontalrectangle'

export default function LandscapePortraitSlider(props) {
    const classes = useStyles()
    const [isLandscape, setIsLandscape] = useState(true)
    const { className, style, linkObj, portraitStatement } = props
    const handelInputDesktop = () => {
        setIsLandscape(true)
        console.log('i am working')
    }
    const handelInputPortrait = () => {
        setIsLandscape(false)
        console.log('i am working')
    }
    return (
        <>
            <div className={cx(isLandscape && classes.container, !isLandscape && classes.portraitContainer)}>
                <iframe
                    src='https://cc.enciv.org/country:us/organization:ucla-student-accociation/office:usac-president/2021-05-07'
                    className={cx(isLandscape && classes.landscape, !isLandscape && classes.portrait)}
                ></iframe>
            </div>
            <div className={classes.body}>
                <div className={cx(isLandscape && classes.daContainer, !isLandscape && classes.iconContainer)}>
                    <SvgRectangle className={classes.iconda} />
                    <p
                        href='https://cc.enciv.org/country:us/organization:ucla-student-accociation/office:usac-president/2021-05-07'
                        className={classes.iconda}
                    >
                        {' '}
                        District Attorney Election
                    </p>{' '}
                </div>
                <div className={classes.iconContainer}>
                    <i onClick={handelInputDesktop} style={{ cursor: 'pointer' }}>
                        <SvgDesktop className={classes.icon} />{' '}
                    </i>
                    <i onClick={handelInputPortrait} style={{ cursor: 'pointer' }}>
                        <SvgPortrait className={classes.icon} /> <SvgHorizontalRectangle />
                    </i>
                </div>
            </div>
        </>
    )
}

//possibly set height to a ratio based on width (w/1920*1080)
const useStyles = createUseStyles(theme => ({
    body: {
        backgroundColor: 'white',
    },
    childView: {
        width: '100',
        height: '100',
        borderBottomWidth: '5',
        borderBottomColor: '#000',
        backgroundColor: '#00BCD4',
    },
    disabled: {
        display: 'none',
    },
    container: {
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        paddingTop: '56.25%',
    },
    portraitContainer: {
        position: 'relative',
        overflow: 'hidden',
        width: '322 px',
        height: '697.16px',
        justifyContent: 'center',
    },
    icon: {
        height: theme.iconSize,
        width: theme.iconSize,
    },
    iconda: {
        display: 'inline-block',
        fontFamily: theme.defaultFontFamily,
        fontSize: '1rem',
        overflow: 'hidden',
        lineHeight: '30px',
        marginLeft: '0.5rem',
    },
    daContainer: {
        position: 'relative',
    },
    iconContainer: {
        position: 'relative',
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
    portrait: {
        position: 'relative',
        flex: 'auto',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        verticalAlign: 'center',
        width: '322 px',
        height: '697.16px',
    },
}))
