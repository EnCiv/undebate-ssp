// https://github.com/EnCiv/undebate-ssp/issues/120

import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import SvgDesktop from '../svgr/desktop'
import SvgPortrait from '../svgr/portrait'
import SvgRectangle from '../svgr/rectangle'
import SvgExternalLink from '../svgr/external-link'

const daLink = (
    <a
        style={{
            textDecorationLine: 'none',
            color: 'grey',
            fontFamily: 'poppins',
            textAlign: 'center',
            fontSize: '1.5rem',
        }}
        href={'https://cc.enciv.org/country:us/organization:ucla-student-accociation/office:usac-president/2021-05-07'}
    >
        District Attorney Election
        <SvgExternalLink />
    </a>
)
const portraitHeader = 'Tailored for every device and every layout'
const portraitParagraph =
    'Dolor adipiscing augue diam nulla ornare dictum tortor id ut. Eu etiam sed fermentum egestas nisl nulla porttitor non justo. Dolor commodo id justo, pretium. Magna et arcu fringilla in nisi, mauris tincidunt. Penatibus turpis eget sapien non at phasellus lacus. Pellentesque consectetur nunc mi amet curabitur cras fames amet cursus.'
export default function LandscapePortraitSlider(props) {
    const classes = useStyles()
    const [isLandscape, setIsLandscape] = useState(true)
    const { className, style, linkObj, portraitStatement } = props
    const handelInputDesktop = () => {
        setIsLandscape(true)
    }
    const handelInputPortrait = () => {
        setIsLandscape(false)
    }
    return (
        <>
            <div className={classes.body}>
                <div className={classes.portraitTailoredContainer}>
                    <div
                        className={cx(
                            isLandscape && classes.landscapeContainer,
                            !isLandscape && classes.portraitContainer
                        )}
                    >
                        <iframe
                            src='https://cc.enciv.org/country:us/organization:ucla-student-accociation/office:usac-president/2021-05-07'
                            className={cx(isLandscape && classes.landscape, !isLandscape && classes.portrait)}
                        ></iframe>
                    </div>

                    <div className={cx(isLandscape && classes.disabled, !isLandscape && classes.tailoredContainer)}>
                        <h2 className={classes.tailoredHeader}>{portraitHeader}</h2>
                        <p className={classes.tailoredParagraph}>{portraitParagraph}</p>
                    </div>
                </div>

                <div className={classes.daContainer}>
                    <SvgRectangle className={classes.iconda} />
                    <p className={classes.iconda}> {daLink}</p>
                    <p className={classes.icondaPerson}> Windspotter, Rabiechel</p>
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
        </>
    )
}

//possibly set height to a ratio based on width (w/1920*1080)
const useStyles = createUseStyles(theme => ({
    body: {
        backgroundColor: 'white',
        maxWidth: '100%',
    },
    noborderBottom: {
        cursor: 'pointer',
    },
    tailoredHeader: {
        fontSize: '1.4rem',
    },
    tailoredParagraph: {
        fontSize: '1rem',
    },
    tailoredContainer: {
        width: '50%',
        position: 'relative',
        marginLeft: '1rem',
        marginTop: '20%',
    },
    portraitContainer: {
        width: '50%',
        position: 'relative',
        overflow: 'hidden',
        justifyContent: 'center',
        margin: 'auto',
        left: '0%',
    },
    portraitTailoredContainer: {
        display: 'flex',
        flexDirection: 'row',
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
        width: '20.2 rem',
        height: '40rem',
    },

    icon: {
        height: '1.9rem',
        width: '1.6rem',
    },
    iconda: {
        display: 'inline-block',
        position: 'relative',
        fontSize: '0.85rem',
        overflow: 'hidden',
        lineHeight: '2.4rem',
        marginLeft: '0.5rem',
        cursor: 'pointer',
        '& path': { stroke: 'grey' },
    },
    icondaPerson: {
        display: 'block',
        position: 'relative',
        verticalAlign: 'top',
        fontSize: '1rem',
        overflow: 'hidden',
        lineHeight: '1rem',
        marginLeft: '1.2rem',
        marginTop: '-2rem',
        color: 'grey',
        fontFamily: 'poppins',
        fontSize: '0.7rem',
        align: 'left',
    },
    daContainer: {
        position: 'relative',
    },
    iconContainer: {
        position: 'relative',
        bottom: '0%',
        left: '50%',
    },
    '@media (orientation: portrait)': {
        daContainer: {
            position: 'relative',
            bottom: '0%',
            left: '30%',
            marginTop: '0.5rem',
        },
        iconContainer: {
            position: 'relative',
            bottom: '0%',
            left: '50%',
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
            width: '50%',
            position: 'relative',
            marginTop: '3%',
            marginLeft: 'center',
        },
        tailoredHeader: {
            fontSize: '1rem',
            left: '50%',
            position: 'relative',
        },
        tailoredParagraph: {
            fontSize: '0.7rem',
            left: '50%',
            position: 'relative',
        },
    },
}))
