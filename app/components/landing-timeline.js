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
} from '../svgr'

import cx from 'classnames'
import { useCss } from 'react-use'

const portraitWidth = '45rem'
const smallScreenWidth = '102rem'

// TODO: Use when implementing issue #19
function TemplateElectionTimeLine({
    className,
    style,
    positions, // [ {svg, text, percent} ]
    Meter, // component
}) {
    const classes = useStyles()

    const onSecondRow = []
    const percentTextPosition = positions.filter(({ text }) => text).map(({ percent }) => percent)
    const getIncTextPercent = (percent, inc) =>
        percentTextPosition[percentTextPosition.findIndex(v => v === percent) + inc]

    return (
        <div className={cx(className, classes.templateBar)} style={style}>
            <Meter>
                {positions.map(({ svg, text, percent }, i) => {
                    const textTooClose =
                        text &&
                        (Math.abs(getIncTextPercent(percent, -1) - percent) < 32 ||
                            Math.abs(getIncTextPercent(percent, 1) - percent) < 32)
                    const secondRow = i != 0 && textTooClose && !onSecondRow.includes(getIncTextPercent(percent, -1))
                    if (secondRow && percent != null) {
                        onSecondRow.push(percent)
                    }
                    // used instead of useStyles to prevent jss from "collapsing"
                    // all the itemPosition classes into one
                    const itemPosition = useCss({
                        display: 'block',
                        position: 'relative',
                        width: 0,
                        height: 0,
                        [`@media (min-width: ${portraitWidth})`]: {
                            left: `${percent}%`,
                        },
                        [`@media (max-width: ${portraitWidth})`]: {
                            top: `${percent}%`,
                        },
                    })
                    const templateTextMargin = useCss({
                        marginTop: '1rem',
                        [`@media (min-width: ${portraitWidth}) and (max-width: ${smallScreenWidth})`]: {
                            marginTop: secondRow ? '8rem' : '1rem',
                        },
                    })
                    return (
                        <span className={itemPosition}>
                            <div className={classes.templateItem}>
                                <div className={classes.templateIcon}>{svg}</div>
                                {text ? <SvgSolidTriangleArrow className={classes.arrow} /> : ''}
                                <div className={cx(templateTextMargin, classes.templateText)}>{text}</div>
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
        [`@media (min-width: ${portraitWidth})`]: {
            transform: { right: 'translateX(-90%)', left: 'initial', center: 'translateX(-45%)' }[align],
            textAlign: align,
        },
        [`@media (max-width: ${portraitWidth})`]: {
            transform: 'translate(35%, -80%)',
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

function LandingTimelineBar({ children }) {
    const classes = landingbarUseStyles()
    return <div className={classes.landingBar}> {children} </div>
}
export default function LandingTimeline({ className, style }) {
    return (
        <div>
            <h1>LandingTimeLine Component</h1>
        </div>
    )
}
// export default function LandingTimeline({ className, style }) {
//     return (
//         <TemplateElectionTimeLine
//             className={className}
//             style={style}
//             Meter={LandingTimelineBar}
//             positions={[
//                 {
//                     svg: <SvgElectionCreated />,
//                     text: <TimelineText primaryText='Election Created' align='left' />,
//                     percent: 0,
//                 },
//                 { svg: <SvgElectionPaper />, percent: 6 },
//                 { svg: <SvgAccepted />, percent: 12 },
//                 {
//                     svg: <SvgVideoSubmitted />,
//                     text: (
//                         <TimelineText
//                             primaryText='Moderator Records and Submits Video'
//                             secondaryText='Link is provided in the invite email'
//                         />
//                     ),
//                     percent: 18,
//                 },
//                 { svg: <SvgReminderSent />, percent: 24 },
//                 {
//                     svg: <SvgXCircle />,
//                     text: (
//                         <TimelineText
//                             primaryText='Moderator Submission Deadline'
//                             secondaryText='Last date for the moderator to make'
//                         />
//                     ),
//                     percent: 30,
//                 },
//                 { svg: <SvgVideoSubmitted />, percent: 36 },
//                 { svg: <SvgElectionGrid />, percent: 46 },
//                 { svg: <SvgReminderSent />, percent: 53 },
//                 {
//                     svg: <SvgXCircle />,
//                     text: (
//                         <TimelineText
//                             primaryText='Candidate Submission Deadline'
//                             secondaryText='Last date for candidates to submit their video answers'
//                         />
//                     ),
//                     percent: 59,
//                 },
//                 {
//                     svg: <SvgElectionLive />,
//                     text: (
//                         <TimelineText
//                             primaryText='Candidate Submission Deadline'
//                             secondaryText='Last date for candidates to submit their video answers'
//                         />
//                     ),
//                     percent: 70,
//                 },
//                 {
//                     svg: <SvgContainer />,
//                     percent: 100,
//                     text: (
//                         <TimelineText
//                             primaryText='Candidate Submission Deadline'
//                             secondaryText='Last date for candidates to submit their video answers'
//                             align='right'
//                         />
//                     ),
//                 },
//             ]}
//         />
//     )
// }

const useStyles = createUseStyles(theme => ({
    templateBar: {
        margin: '1rem',
        height: '11rem',
        [`@media (min-width: ${portraitWidth}) and (max-width: ${smallScreenWidth})`]: {
            height: '18rem',
        },
        [`@media (max-width: ${portraitWidth})`]: {
            height: '100rem',
        },
    },

    templateIcon: {
        display: 'flex',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',

        '& svg': {
            width: '3rem',
            height: 'auto',
        },

        [`@media (min-width: ${portraitWidth})`]: {
            transform: 'translateX(-30%)',
        },
        [`@media (max-width: ${portraitWidth})`]: {
            transform: 'translateX(-20%)',
        },

        borderRadius: '1rem',
        backgroundColor: 'white',
        width: '2.5rem',
        height: '2.5rem',
        padding: '0.25rem',
    },
    templateText: { position: 'absolute', width: '10.75rem' },
    templateItem: {
        position: 'absolute',
        transform: 'translateY(-20%)',
    },
    arrow: {
        position: 'absolute',
        [`@media (max-width: ${portraitWidth})`]: {
            transform: 'rotate(90deg)',
            left: '80%',
            bottom: '25%',
        },
    },
}))

const landingbarUseStyles = createUseStyles(theme => ({
    landingBar: {
        height: '1.875rem',
        [`@media (max-width: ${portraitWidth})`]: {
            height: '100rem',
            width: '1.875rem',
        },
        width: '100%',
        backgroundColor: theme.colorPrimary,
    },
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
