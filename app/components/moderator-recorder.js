// https://github.com/EnCiv/undebate-ssp/issues/51

import React, { useState, useRef, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { getLatestIota } from '../lib/get-election-status-methods'
import ObjectID from 'isomorphic-mongo-objectid'
import Submit from './submit'
import scheme from '../lib/scheme'
import Spinner from './spinner'
import ShowUndebate from './show-undebate'

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
                <p>
                    This is what the moderator will see when recording. Review it before sending the invitation to
                    record.
                </p>
                <div className={classes.preview}>
                    <ShowUndebate
                        src={src}
                        dependents={electionOM}
                        missed={missed}
                        title={statusTitle}
                        description={statusDesc}
                        buttons={{ redo: true, link: true }}
                    />
                    {!src ? (
                        <div className={classes.placeholder}>
                            <CreateRecorderButton />
                        </div>
                    ) : null}
                </div>
            </div>
            <div className={classes.cornerPic}>{cornerPic}</div>
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
        '& p': {
            marginBlockStart: 0,
        },
    },
    preview: {
        position: 'relative',
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
        transform: 'translateY(-100%) translateY(-2rem)',
        position: 'absolute',
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
}))
