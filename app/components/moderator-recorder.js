// https://github.com/EnCiv/undebate-ssp/issues/51

import React, { useState, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import SvgCheck from '../svgr/check'
import SvgSolidClock from '../svgr/clock-solid'
import { getLatestIota } from '../lib/get-election-status-methods'
import ObjectID from 'isomorphic-mongo-objectid'
import Submit from './submit'
import scheme from '../lib/scheme'
import SvgExternalLink from '../svgr/external-link'
import SvgRedo from '../svgr/redo-arrow'
import Spinner from './spinner'

export function getModeratorRecorderStatus(electionObj) {
    const moderator = electionObj?.moderator
    const recorderDate = electionObj?.doneLocked?.Recorder?.done
    const invitationDate = getLatestIota(moderator?.invitations)?.sentDate
    const submission = getLatestIota(moderator?.submissions)
    const submissionDate = submission?._id && ObjectID(submission._id).getDate().toISOString()

    if (submissionDate) return 'completed'
    let allDoneDate
    const dd = Object.entries(electionObj?.doneLocked || {}).reduce((dd, [key, obj]) => ((dd[key] = obj.done), dd), {}) // dd for done dates
    if (
        dd.Election &&
        dd.Timeline &&
        dd.Questions &&
        dd.Contact &&
        dd.Script &&
        dd.Script > dd.Questions &&
        dd.Script > dd.Contact
    )
        allDoneDate = ['Election', 'Timeline', 'Questions', 'Contact', 'Script'].reduce(
            (largest, k) => (dd[k] > largest ? dd[k] : largest),
            ''
        )
    if (allDoneDate > recorderDate) return 'recreate'
    if (invitationDate > recorderDate) return 'sent'
    if (recorderDate) return 'created'
    if (allDoneDate) return 'ready'
    return 'waiting'
}

export default function ModeratorRecorder(props) {
    const { className, style, electionOM, onDone = () => {} } = props
    const [electionObj, electionMethods] = electionOM
    const classes = useStyles(props)
    const { moderator = {} } = electionObj
    const viewer = getLatestIota(moderator.viewers)
    const submission = getLatestIota(moderator.submissions)

    const [submitted, setSubmitted] = useState(false)
    const iframeRef = useRef()

    const deadline = electionObj?.timeline?.moderatorSubmissionDeadline?.[0]?.date

    const recorderStatus = getModeratorRecorderStatus(electionObj)

    const submissionDaysLeft = deadline ? Math.round((new Date(deadline) - new Date()) / 86400000) : 'unknown'
    const missed = deadline && submissionDaysLeft < 0

    const getSubmissionDaysAgo = () => {
        const sentDate = ObjectID(submission?._id).getDate()
        const currDate = Date.now()
        return Math.round((currDate - sentDate) / 86400000)
    }

    let statusTitle
    let statusDesc = submissionDaysLeft + ' days left for moderator to submit recording.'
    let prevIcon = <SvgSolidClock />
    let cornerPic
    switch (recorderStatus) {
        case 'sent':
            statusTitle = 'Invitation Sent'
            break
        case 'recreate':
            statusTitle = 'Needs Regeneration'
            break
        case 'created':
            statusTitle = 'Recorder Created!'
            break
        case 'completed':
            statusTitle = "The moderator's recording has been complete!"
            statusDesc = getSubmissionDaysAgo() + ' days ago'
            prevIcon = <SvgCheck />
            break
        case 'ready':
            statusTitle = 'Ready to Generate Recorder'
            break
        case 'waiting':
            statusTitle = 'Need to complete previous panels'
            break
    }
    const src = viewer?.path ? scheme() + process.env.HOSTNAME + viewer?.path : ''

    const CreateRecorderButton = () => (
        <Submit
            name={recorderStatus === 'recreate' ? 'Regenerate Recorder' : 'Generate Recorder'}
            disabled={submitted || !(recorderStatus === 'ready' || recorderStatus === 'recreate')}
            disableOnClick
            onDone={() => {
                setSubmitted(true) // disable the button
                electionMethods.createModeratorRecorder(result => {
                    setSubmitted(false)
                    if (result)
                        electionMethods.upsert({
                            doneLocked: { Recorder: { done: new Date().toISOString() } },
                        })
                    // to do show error messages if failure
                })
            }}
            className={classes.submitButton}
        />
    )

    return (
        <div className={cx(className, classes.moderatorRecorder)} style={style}>
            <div className={classes.innerLeft}>
                <h2>
                    This is what the moderator will see when recording. Review it before sending the invitation to
                    record.
                </h2>
                <div className={cx(classes.card, { [classes.backgroundRed]: missed })}>
                    <div className={classes.preview}>
                        {viewer?.path ? (
                            <iframe ref={iframeRef} width={'100%'} height={'100%'} src={src} frameBorder='0' />
                        ) : (
                            <div className={classes.placeholder}>
                                <CreateRecorderButton />
                            </div>
                        )}
                    </div>
                    <div className={classes.meta}>
                        <div className={classes.metaText}>
                            <p className={cx(classes.title, { [classes.colorWhite]: missed })}>{statusTitle}</p>
                            <p className={cx(classes.desc, { [classes.colorLightRed]: missed })}>{statusDesc}</p>
                        </div>
                        <div className={classes.metaButtons}>
                            <button
                                className={cx(classes.redo, !src && classes.iconDisabled)}
                                onClick={e => (iframeRef.current.src += '')}
                                title='Restart'
                                disabled={!src}
                            >
                                <SvgRedo />
                            </button>{' '}
                            {src ? (
                                <a href={src} target='_blank' title='Open in new tab'>
                                    <SvgExternalLink className={classes.link} />
                                </a>
                            ) : (
                                <button className={classes.disabledlink} title='Open in new tab' disabled>
                                    <SvgExternalLink />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className={classes.cornerPic}>{cornerPic}</div>
            </div>
            <div className={classes.buttonPanel}>
                <div className={classes.buttonRow}>
                    <CreateRecorderButton />
                </div>
                <div className={classes.buttonRow}>
                    <div className={classes.buttonRowText}>
                        An invitation will be emailed to the moderator along with the script and a recording link
                    </div>
                    <Submit
                        name={recorderStatus === 'sent' ? ' Resend Invitation' : 'Send Invitation'}
                        disabled={!(recorderStatus === 'created' || recorderStatus === 'sent')}
                        onDone={({ valid, value }) => {
                            setSubmitted(true)
                            electionMethods.sendModeratorInvitation(result => {
                                setSubmitted(false)
                                //to do show error message if failure
                                onDone({ valid: true })
                            })
                        }}
                        className={classes.submitButton}
                    />
                    {submitted && <Spinner style={{ marginTop: '6rem' }} />}
                </div>
            </div>
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    moderatorRecorder: {
        backgroundColor: theme.backgroundColorApp,
        width: 'auto',
        display: 'flex',
    },
    innerLeft: {
        maxWidth: '60rem',
        float: 'left',
    },
    card: {
        width: '100%',
        backgroundColor: theme.colorLightGray,
        padding: '.5rem',
        borderRadius: '0.625rem',
        boxSizing: 'border-box',
    },
    preview: {
        backgroundColor: 'white',
        height: '40rem',
    },
    title: {
        paddingTop: '.5rem',
        paddingLeft: '.5rem',
        margin: '0',
        fontWeight: '500',
    },
    desc: {
        padding: '0',
        margin: '0',
        color: theme.colorGray,
        fontSize: '0.875rem',
        paddingLeft: '.5rem',
        paddingBottom: '.5rem',
    },
    cornerPic: {
        display: 'flex',
        fontSize: '14rem',
        justifyContent: 'right',
        marginBottom: '0',
    },
    placeholder: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundRed: {
        backgroundColor: theme.colorWarning,
    },
    colorWhite: {
        color: 'white',
    },
    colorLightRed: {
        color: theme.colorLightRed,
    },
    buttonPanel: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '1rem',
    },
    buttonRow: {},
    buttonRowText: {
        marginTop: '2rem',
        marginBottom: '1rem',
        textAlign: 'right',
    },
    submitButton: {
        float: 'right',
    },
    meta: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    metaText: {},
    metaButtons: {
        fontSize: '2.5rem',
        marginTop: '.5rem',
        verticalAlign: 'middle',
    },
    redo: {
        fontSize: '2.2rem',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
    },
    link: {
        '& path': {
            stroke: 'black',
            strokeWidth: 3,
        },
    },
    disabledlink: {
        padding: 0,
        border: 'none',
        fontSize: '2.5rem',
        cursor: 'pointer',
        '& path': {
            stroke: 'gray',
            strokeWidth: 3,
        },
        backgroundColor: 'transparent',
    },
    iconDisabled: {
        '& path': {
            fill: 'gray',
        },
        '& g path': {
            stroke: 'gray',
            fill: 'none',
        },
    },
}))
