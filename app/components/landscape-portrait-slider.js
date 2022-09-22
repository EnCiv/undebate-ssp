// https://github.com/EnCiv/undebate-ssp/issues/120

import React, { useState, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import SvgDesktop from '../svgr/desktop'
import SvgPortrait from '../svgr/portrait'
import SvgRectangle from '../svgr/rectangle'
import SvgExternalLink from '../svgr/external-link'
import StatementComponent from './statement-component'

// need to refresh the iframe after change shape so it recalculates the size and position
function iframeRefresh(ref) {
    if (ref.current) setTimeout(() => (ref.current.src += ''))
}
export default function LandscapePortraitSlider(props) {
    const classes = useStyles()
    const [isLandscape, setIsLandscape] = useState(true)
    const { className, style, linkObj = {}, portraitStatement = {} } = props
    const iframeRef = useRef()
    const handelInputDesktop = () => {
        setIsLandscape(true)
        iframeRefresh(iframeRef)
    }
    const handelInputPortrait = () => {
        setIsLandscape(false)
        iframeRefresh(iframeRef)
    }
    return (
        <div className={cx(className, classes.LandscapePortraitSlider)} style={style}>
            <div className={classes.portraitTailoredContainer}>
                <div
                    className={cx(isLandscape && classes.landscapeContainer, !isLandscape && classes.portraitContainer)}
                >
                    <iframe
                        ref={iframeRef}
                        key='iframe'
                        src={linkObj.url || ''}
                        className={cx(isLandscape && classes.landscape, !isLandscape && classes.portrait)}
                    />
                </div>
                <div className={cx(isLandscape && classes.disabled, !isLandscape && classes.tailoredContainer)}>
                    <StatementComponent key='statement' className={classes.statement} {...portraitStatement} />
                </div>
            </div>
            <div className={classes.daContainer}>
                <SvgRectangle className={classes.iconLine} />
                <div>
                    <p className={classes.iconda}>
                        <a
                            style={{
                                textDecorationLine: 'none',
                                color: 'grey',
                                fontFamily: 'poppins',
                                fontWeight: 600,
                                textAlign: 'left',
                                fontSize: '1.25rem',
                                lineHeight: '1.875rem',
                            }}
                            href={linkObj.url || ''}
                            target='blank'
                        >
                            {linkObj.subject || ''} <SvgExternalLink />
                        </a>
                    </p>
                    <p className={classes.icondaPerson}> {linkObj.subtitle || ''}</p>
                </div>
            </div>
            <div className={classes.iconContainer}>
                <i
                    onClick={handelInputDesktop}
                    className={cx(!isLandscape && classes.noborderBottom, isLandscape && classes.borderBottom)}
                >
                    <SvgDesktop className={classes.icon} />{' '}
                </i>
                <i
                    onClick={handelInputPortrait}
                    className={cx(isLandscape && classes.noborderBottom, !isLandscape && classes.borderBottom)}
                >
                    <SvgPortrait className={classes.icon} />
                </i>
            </div>
        </div>
    )
}

//possibly set height to a ratio based on width (w/1920*1080)
const useStyles = createUseStyles(theme => ({
    LandscapePortraitSlider: {
        maxWidth: '100%',
    },
    noborderBottom: {
        cursor: 'pointer',
    },
    tailoredContainer: {
        width: '50%',
        position: 'relative',
        marginRight: '1rem',
    },
    statement: {
        maxWidth: '22.2rem',
        margin: 'auto',
    },
    portraitContainer: {
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        justifyContent: 'center',
        margin: 'auto',
    },
    portraitTailoredContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    borderBottom: {
        cursor: 'pointer',
        borderBottom: '#7470FF solid 0.3rem',
    },
    disabled: {
        display: 'none',
    },
    landscapeContainer: {
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        paddingTop: '56.25%',
    },
    landscape: {
        position: 'absolute',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        border: '2px solid black',
        borderStyle: 'solid',
        borderRadius: '1.5rem',
    },
    portrait: {
        position: 'relative',
        margin: 'auto',
        flex: 'auto',
        alignSelf: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        verticalAlign: 'center',
        width: '20.2rem',
        height: '40rem',
        boxSizing: 'border-box',
        border: '2px solid black',
        borderStyle: 'solid',
        borderRadius: '1.5rem',
    },
    icon: {
        height: '1.9rem',
        width: '1.6rem',
    },
    iconda: {
        fontSize: '0.85rem',
        margin: 0,
        cursor: 'pointer',
        '& path': { stroke: 'grey' },
    },
    iconLine: {
        width: '0.625rem',
        height: 'inherit',
        marginRight: '1rem',
    },
    icondaPerson: {
        lineHeight: '1.375rem',
        color: 'grey',
        fontFamily: 'poppins',
        fontWeight: 500,
        fontSize: '0.9375rem',
        margin: 0,
    },
    daContainer: {
        display: 'flex',
        marginTop: '1rem',
        width: 'fit-content',
    },
    iconContainer: {
        position: 'relative',
        margin: '0 auto',
        width: '100%',
        textAlign: 'center',
    },
    '@media (orientation: portrait)': {
        daContainer: {
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        iconContainer: {
            position: 'relative',
            bottom: '0%',
            marginTop: '4rem',
        },
        portraitContainer: {
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            justifyContent: 'center',
            margin: 'auto',
            left: '0%',
        },
        portraitTailoredContainer: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
        },
        portrait: {
            position: 'relative',
            margin: 'auto',
            flex: 'auto',
            alignSelf: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            verticalAlign: 'center',
            width: '100%',
        },
        tailoredContainer: {
            width: '100%',
            position: 'relative',
            marginTop: '1rem',
            marginLeft: 'center',
        },
    },
}))
