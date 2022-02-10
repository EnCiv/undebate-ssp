import React, { createUseStyles } from 'react-jss'
import SentLogo from '../svgr/sent'
import AcceptLogo from '../svgr/accepted'
import DeclineLogo from '../svgr/declined'
import VideoLogo from '../svgr/video-submitted'

function CandidateLine(props) {
    const classes = useStyles()
    const { name, office, inviteStatus, submissionStatus, reminders } = props

    return (
        <div className={classes.line}>
            <div className={classes.biggerBlock}>
                <div className={classes.text}>
                    <div> {name || ' - '}</div>
                </div>
            </div>
            <div className={classes.biggerBlock}>
                <div className={classes.text}>
                    <div> {office || ' - '}</div>
                </div>
            </div>
            <div className={classes.block}>
                <div className={classes.text}>
                    <div className={classes.holder}>
                        {inviteStatus === 'accepted' && (
                            <>
                                <AcceptLogo className={classes.icon} />{' '}
                                <span className={classes.logoText}>Accepted</span>{' '}
                            </>
                        )}
                        {inviteStatus === 'declined' && (
                            <>
                                <DeclineLogo className={classes.icon} />
                                {'   '}
                                <span className={classes.logoText}>Declined</span>{' '}
                            </>
                        )}
                        {inviteStatus === 'sent' && (
                            <>
                                <SentLogo className={classes.icon} /> {'      '}
                                <span className={classes.logoText}>Sent</span>{' '}
                            </>
                        )}
                        {!inviteStatus && ' - '}
                    </div>
                </div>
            </div>
            <div className={classes.block}>
                <div className={classes.text}>
                    <div className={classes.holder}>
                        {submissionStatus === 'submitted' ? (
                            <>
                                <VideoLogo className={classes.icon} />{' '}
                                <span className={classes.logoText}>Video Submitted</span>{' '}
                            </>
                        ) : (
                            ' - '
                        )}
                    </div>
                </div>
            </div>
            <div className={classes.block}>
                <div className={classes.text}>
                    <div> {reminders || ' - '}</div>
                </div>
            </div>
        </div>
    )
}

export default CandidateLine

const useStyles = createUseStyles(theme => ({
    line: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.9rem 1.25rem',
    },
    block: {
        width: '16rem',
        background: '#7470FF80',
        display: 'table',
        padding: theme.inputFieldPadding,
        flex: 'none',
        margin: 'auto -0.2rem',
    },
    text: {
        display: 'table-cell',
        verticalAlign: 'middle',
        color: '#262D33',
    },
    biggerBlock: {
        width: '22rem',
        background: '#7470FF80',
        display: 'table',
        padding: theme.inputFieldPadding,
        flex: 'none',
        margin: 'auto -0.2rem',
    },
    holder: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    logoText: {
        marginLeft: '0.7rem',
    },
    icon: {
        height: theme.iconSize,
        width: theme.iconSize,
    },
}))
