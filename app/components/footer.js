import React from 'react'
import { createUseStyles, ThemeProvider } from 'react-jss'
import theme from '../theme'

const useStyles = createUseStyles({
    footer: {
        ...theme.footer,
        fontFamily: theme.defaultFontFamily,
        position: 'absolute',
        width: '95%',
        left: 0,
        bottom: 0,
        lineHeight: '0.8em',
        overflow: 'hidden',
        backgroundColor: theme.colorPrimary,
        color: '#FFFFFF',
        padding: '2.5%',
        display: 'flex',
    },
    btn: {
        ...theme.button,
        backgroundColor: '#FFFFFF',
        color: '#262D33',
        display: 'block',
        margin: '0 auto',
        width: '25%',
        textAlign: 'center',
        fontSize: '1.25em',
        '&:hover': {
            backgroundColor: '#fec215',
            cursor: 'pointer',
            color: theme.colorPrimary,
        },
    },
    aLink: {
        color: '#FFFFFF',
        fontSize: '2em',
        textDecoration: 'none',
        '&:hover': {
            color: '#fec215',
            cursor: 'pointer',
        },
    },
    pText: {
        fontSize: '1em',
        lineHeight: '0.3em',
    },
    pDonate: {
        fontSize: '3em',
        lineHeight: '1.25em',
        textAlign: 'center',
    },
    footerUnpoll: {
        marginTop: '1.5em',
    },
    footerEnCiv: {
        marginTop: '3.5em',
    },
    footerCopyRight: {
        marginTop: '3.5em',
        textAlign: 'center',
    },
    linksContainer: {
        width: '35%',
        height: 'auto',
        marginLeft: '4%',
    },
    donateContainer: {
        width: '65%',
        marginTop: '-3%',
    },
    '@media screen and (max-width: 1000px)': {
        footer: {
            flexDirection: 'column',
        },
        linksContainer: {
            width: '100%',
            marginTop: '3%',
        },
        donateContainer: {
            width: '100%',
        },
        btn: {
            width: '50%',
        },
        footerCopyRight: {
            marginBottom: '6%',
        },
        aLink: {
            fontSize: '1.5em',
        },
        pDonate: {
            fontSize: '2em',
        },
    },
})

export default function Footer() {
    const classes = useStyles()
    return (
        <div className={classes.footer}>
            <div className={classes.linksContainer}>
                <div className={classes.footerUnpoll}>
                    <a href='#' target='_blank' className={classes.aLink}>
                        Unpoll
                    </a>
                    <p className={classes.pText}>Text for Unpoll goes here!</p>
                </div>
                <div className={classes.footerEnCiv}>
                    <a href='https://enciv.org/terms' target='_blank' className={classes.aLink}>
                        EnCiv
                    </a>
                    <p className={classes.pText}>Text for EnCiv goes here!</p>
                </div>
            </div>
            <div className={classes.donateContainer}>
                <div>
                    <p className={classes.pDonate}>amet elementtum euismod molestie facilisie varius</p>
                    <button className={classes.btn}> Donate</button>
                </div>
                <div className={classes.footerCopyRight}>
                    <p className={classes.pText}>Copyright &copy; 2022 EnCiv, Inc</p>
                </div>
            </div>
        </div>
    )
}
