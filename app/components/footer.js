//https://github.com/EnCiv/undebate-ssp/issues/110
import React from 'react'
import { createUseStyles } from 'react-jss'
import SvgExternalLink from '../svgr/external-link'

export default function Footer() {
    const classes = useStyles()
    return (
        <div className={classes.footer}>
            <div className={classes.linksContainer}>
                {/* for future use
                    <div className={classes.footerUnpoll}>
                        <a href='#' target='_blank' className={classes.aLink}>
                            Unpoll
                            <SvgExternalLink />
                        </a>
                        <p className={classes.pText}>Vestibulum massa id donec gravida purus in tellus aliquam arcu?</p>
                    </div>*/}
                <div className={classes.footerEnCiv}>
                    <a href='https://enciv.org/' target='_blank' className={classes.aLink}>
                        EnCiv
                        <SvgExternalLink />
                    </a>
                    <p className={classes.pText}>Undebate is an online discourse process from EnCiv, Inc.</p>
                </div>
            </div>
            <div className={classes.donateContainer}>
                <div className={classes.donateWrapper}>
                    <p className={classes.pDonate}>For productive online democratic discourse</p>
                    <a
                        href='https://www.paypal.com/donate/?cmd=_s-xclick&hosted_button_id=H7XBVF5U2C9NJ&source=url%22%7D'
                        target='_blank'
                        style={{ textDecoration: 'none' }}
                    >
                        <button className={classes.btn}>Donate</button>
                    </a>
                </div>
                <div className={classes.footerCopyRight}>
                    <a
                        href='https://enciv.org/terms'
                        target='_blank'
                        className={classes.aLink}
                        style={{ fontSize: '1.25em' }}
                    >
                        Terms of service
                    </a>
                    <p className={classes.pText}>Copyright &copy; 2022 EnCiv, Inc a 501(c)(3) nonprofit</p>
                </div>
            </div>
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    footer: {
        fontFamily: theme.defaultFontFamily,
        lineHeight: '0.8em',
        overflow: 'hidden',
        backgroundColor: theme.colorPrimary,
        color: '#FFFFFF',
        padding: '2em',
        display: 'flex',
        fontSize: '.75rem',
    },
    btn: {
        ...theme.button,
        backgroundColor: '#FFFFFF',
        color: theme.colorText,
        display: 'block',
        margin: '0 auto',
        textAlign: 'center',
        fontSize: '1.25em',
        '&:hover': {
            backgroundColor: theme.buttonHoverBackground,
            cursor: 'pointer',
            color: theme.colorPrimary,
        },
    },
    aLink: {
        color: '#FFFFFF',
        fontSize: '2em',
        textDecoration: 'none',
        '&:hover': {
            color: theme.buttonHoverBackground,
            cursor: 'pointer',
            '& svg path': {
                stroke: theme.buttonHoverBackground,
            },
        },
    },
    pText: {
        fontSize: '1em',
        lineHeight: '1em',
    },
    pDonate: {
        fontSize: '3em',
        lineHeight: '1.25em',
        textAlign: 'center',
        marginTop: 0,
    },
    footerUnpoll: {
        marginTop: '1.5em',
    },
    footerEnCiv: {
        marginTop: '-0.05em', // to align top of text
    },
    footerCopyRight: {
        marginTop: '3.5em',
        textAlign: 'center',
    },
    linksContainer: {
        width: '35%',
        height: 'auto',
    },
    donateContainer: {
        width: '65%',
    },
    donateWrapper: {
        marginTop: '-0.25em', // to align top of text
    },
    '@media (orientation: portrait)': {
        footerCopyRight: {
            marginTop: '3em',
        },
        footer: {
            flexDirection: 'column',
        },
        linksContainer: {
            width: '100%',
            marginLeft: 0,
            textAlign: 'center',
            marginBottom: '1em',
        },
        donateContainer: {
            width: '100%',
        },
        btn: {
            width: '40%',
        },
        aLink: {
            fontSize: '1.5em',
        },
        pDonate: {
            fontSize: '2em',
        },
    },
}))
