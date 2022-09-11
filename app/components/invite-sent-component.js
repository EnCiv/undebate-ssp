import React from "react";
import {daysBetweenDates, getDaysText} from "../lib/get-election-status-methods";
import SentLogo from "../svgr/sent";
import {createUseStyles} from "react-jss";

const getSentText = (sentDate) => {
    return `Sent ${getDaysText(daysBetweenDates(new Date(), new Date(sentDate)))}`
}

export default function InviteSentComponent({invites}) {
    const classes = useStyles()
    if (invites && invites.length) {
        const sortedInvites = invites.slice().sort((a, b) => a.sentDate?.localeCompare(b.sentDate)).reverse();
        let i = 0;
        return <div>
            <div className={classes.container}>
                <SentLogo className={classes.icon}/>
                <span className={classes.textSpan}>
                    Last {getSentText(sortedInvites[0].sentDate)}
                    {sortedInvites.length > 1 ?
                        <div className={classes.tooltip}>
                            <div>
                                Previous Invites:
                            </div>
                            {sortedInvites.slice(1).map(invite => {
                                return <div key={i++}>
                                    {getSentText(invite.sentDate)}
                                </div>
                            })}
                        </div> : ''
                    }
                </span>
            </div>
        </div>
    } else {
        return <div>No Invites Sent Yet</div>
    }
}

const useStyles = createUseStyles(theme => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        padding: '1rem 1.25rem'
    },
    textSpan: {
        marginLeft: '0.7rem',
        fontWeight: '400',
        '&:hover $tooltip': {
            visibility: 'visible'
        }
    },
    tooltip: {
        visibility: 'hidden',
        position: 'absolute',
        zIndex: 1,
        backgroundColor: theme.colorSecondary,
        color: theme.colorLightGray,
        padding: '1rem',
        borderRadius: theme.defaultBorderRadius,
    },
    icon: {
        height: theme.iconSize,
        width: theme.iconSize,
    },
}))
