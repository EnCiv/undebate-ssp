import React from "react";
import {daysBetweenDates, getDaysText} from "../lib/get-election-status-methods";
import SentLogo from "../svgr/sent";
import {createUseStyles} from "react-jss";

export default function InviteSentComponent({invites}) {
    const classes = useStyles()
    console.log('invites', invites);
    if (invites && invites.length) {
        const sortedInvites = invites.slice().sort((a, b) => a.sentDate?.localeCompare(b.sentDate)).reverse();
        // todo add hover functionality
        let i = 0;
        return <div>
            <div key={i++} className={classes.container}>
                <SentLogo className={classes.icon}/>
                <span className={classes.textSpan}>
                    Last Sent {getDaysText(daysBetweenDates(new Date(), new Date(sortedInvites[0].sentDate)))}
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
    },
    icon: {
        height: theme.iconSize,
        width: theme.iconSize,
    },
}))
