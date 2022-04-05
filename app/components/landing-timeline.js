// https://github.com/EnCiv/undebate-ssp/issues/111

import React from 'react'
import { createUseStyles } from 'react-jss'
import {
    SolidTriangleArrow as SvgSolidTriangleArrow,
    ElectionCreated as SvgElectionCreated,
    ElectionPaper as SvgElectionPaper,
    Accepted as SvgAccepted,
    VideoSubmitted as SvgVideoSubmitted,
    ReminderSent as SvgReminderSent,
    XCircle as SvgXCircle,
    ElectionGrid as SvgElectionGrid,
    ElectionLive as SvgElectionLive,
    Container as SvgContainer,
} from '../../dist/svgr/index'

import cx from 'classnames'
import { useCss } from 'react-use'

const templateItemTextWidth = '10.75rem'

// TODO: Use when implementing issue #19
function TemplateElectionTimeLine({
    className,
    style,
    positions, // [ {svg, text, percent} ]
    Meter, // component
}) {
    const classes = useStyles()
    const minWidth = `calc(${positions.reduce(
        (prev, { text }) => prev + (text != null ? 1 : 0),
        0
    )} * ${templateItemTextWidth} * 1.625)`
    return (
        <div className={cx(className, classes.templateBar)} style={style}>
            <Meter minWidth={minWidth}>
                {positions.map(({ svg, text, percent }, i) => {
                    // used instead of useStyles to prevent jss from "collapsing"
                    // all the itemPosition classes into one
                    const itemPosition = useCss({
                        display: 'block',
                        position: 'relative',
                        '@media (orientation: landscape)': {
                            width: 0,
                            height: 0,
                            left: `${percent}%`,
                        },
                        '@media (orientation: portrait)': {
                            width: 0,
                            height: 0,
                            top: `${percent}%`,
                        },
                    })
                    return (
                        <span className={itemPosition}>
                            <div className={classes.templateItem}>
                                <div className={classes.templateIcon}>{svg}</div>
                                {text ? <SvgSolidTriangleArrow className={classes.arrow} /> : ''}
                                <div className={classes.templateText}>{text}</div>
                            </div>
                        </span>
                    )
                })}
            </Meter>
        </div>
    )
}
// align: "right" | "left" | "center"
function TimelineText({ className, primaryText, secondaryText, position, align = 'center' }) {
    const classes = timelineTextUseStyles({ position, align })
    const alignmentTransform = useCss({
        '@media (orientation: landscape)': {
            transform: { right: 'translateX(-90%)', left: 'initial', center: 'translateX(-45%)' }[align],
            textAlign: align,
        },
        '@media (orientation: portrait)': {
            transform: 'translate(30%, -100%)',
            textAlign: 'center',
        },
    })
    return (
        <>
            <div className={cx(className, alignmentTransform, classes.timelineTextContainer)}>
                <div className={classes.timelineText}>
                    <p className={classes.primaryTimelineText}>{primaryText}</p>
                    <p className={classes.secondaryTimelineText}>{secondaryText}</p>
                </div>
            </div>
        </>
    )
}

function LandingTimelineBar({ children, minWidth }) {
    const classes = landingbarUseStyles({ minWidth })
    return <div className={classes.landingBar}> {children} </div>
}

export default function LandingTimeline({ className, style }) {
    return (
        <TemplateElectionTimeLine
            className={className}
            style={style}
            Meter={LandingTimelineBar}
            positions={[
                {
                    svg: <SvgElectionCreated />,
                    text: <TimelineText primaryText='Election Created' align='left' />,
                    percent: 0,
                },
                { svg: <SvgElectionPaper />, percent: 6 },
                { svg: <SvgAccepted />, percent: 12 },
                {
                    svg: <SvgVideoSubmitted />,
                    text: (
                        <TimelineText
                            primaryText='Moderator Records and Submits Video'
                            secondaryText='Link is provided in the invite email'
                        />
                    ),
                    percent: 18,
                },
                { svg: <SvgReminderSent />, percent: 24 },
                {
                    svg: <SvgXCircle />,
                    text: (
                        <TimelineText
                            primaryText='Moderator Submission Deadline'
                            secondaryText='Last date for the moderator to make'
                        />
                    ),
                    percent: 30,
                },
                { svg: <SvgVideoSubmitted />, percent: 36 },
                { svg: <SvgElectionGrid />, percent: 50 },
                { svg: <SvgReminderSent />, percent: 53 },
                {
                    svg: <SvgXCircle />,
                    text: (
                        <TimelineText
                            primaryText='Candidate Submission Deadline'
                            secondaryText='Last date for candidates to submit their video answers'
                        />
                    ),
                    percent: 59,
                },
                {
                    svg: <SvgElectionLive />,
                    text: (
                        <TimelineText
                            primaryText='Candidate Submission Deadline'
                            secondaryText='Last date for candidates to submit their video answers'
                        />
                    ),
                    percent: 70,
                },
                {
                    svg: <SvgContainer />,
                    percent: 100,
                    text: (
                        <TimelineText
                            primaryText='Candidate Submission Deadline'
                            secondaryText='Last date for candidates to submit their video answers'
                            align='right'
                        />
                    ),
                },
            ]}
        />
    )
}

const useStyles = createUseStyles(theme => ({
    templateBar: {
        margin: '1rem',
        height: '11rem',
    },

    templateIcon: {
        display: 'flex',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',

        '@media (orientation: landscape)': {
            transform: 'translateX(-30%)',
        },
        '@media (orientation: portrait)': {
            transform: 'translateX(-20%)',
        },

        borderRadius: '1rem',
        backgroundColor: 'white',
        width: '2.5rem',
        height: '2.5rem',
        padding: '0.2rem',
    },
    templateText: { position: 'absolute', width: templateItemTextWidth, marginTop: '1rem' },
    templateItem: {
        position: 'absolute',
        transform: 'translateY(-20%)',
    },
    arrow: {
        position: 'absolute',
        '@media (orientation: portrait)': {
            transform: 'rotate(90deg)',
            left: '80%',
            bottom: '25%',
        },
    },
}))

const landingbarUseStyles = createUseStyles(theme => ({
    landingBar: ({ minWidth }) => ({
        '@media (orientation: landscape)': {
            height: '1.875rem',
            minWidth: minWidth,
        },
        '@media (orientation: portrait)': {
            width: '1.875rem',
            height: '100rem',
        },
        backgroundColor: theme.colorPrimary,
    }),
}))

const timelineTextUseStyles = createUseStyles(theme => ({
    timelineTextContainer: {
        display: 'flex',
        flexDirection: 'column',
    },

    primaryTimelineText: {
        fontWeight: 600,
        margin: '0px',
        minHeight: '1rem',
    },
    secondaryTimelineText: {
        minHeight: '2rem',
        fontWeight: 500,
        fontSize: theme.secondaryTextFontSize,
        opacity: theme.secondaryTextOpacity,
        margin: '0px',
    },
}))
