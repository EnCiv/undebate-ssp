import React from 'react'
import { createUseStyles } from 'react-jss'
import IconBox from './icon-box'
import Statement from './statement-component'
import FAQ from './frequently-asked-questions'
import HaveAQuestion from './have-a-question'
import LandingTimeline from './landing-timeline'
import LandscapePortraitSlider from './landscape-portrait-slider'
import UndebatesHeaderBar from './undebates-header-bar'
import SignInButton from './sign-in-button'
import cx from 'classnames'

const verticalGap = '8rem'
const destination = '/undebates' // after the user logs in, go to this destination

export default function UndebatesLandingPage(props) {
    const {
        line1 = '',
        line2 = '',
        statements = [],
        topIframe = {},
        iconBoxes = [],
        faqs = [],
        secondarySignupButton = 'Create your own Undebate',
    } = props
    const classes = useStyles()
    return (
        <div style={{ backgroundColor: '#e9eaeb' }}>
            <UndebatesHeaderBar className={classes.borders} destination={destination} />
            <div className={cx(classes.title, classes.borders)}>
                <h1 className={classes.mainTitle}>{line1}</h1>
                <h2 className={classes.subtitle}>{line2}</h2>
            </div>
            <LandscapePortraitSlider className={cx(classes.slider, classes.borders)} {...topIframe} />
            <Statement {...statements[0]} className={cx(classes.statement, classes.borders)} />
            <SignInButton
                className={cx(classes.createYourOwn, classes.borders)}
                name={secondarySignupButton}
                destination={destination}
            />
            <div className={cx(classes.iconbox, classes.borders)}>
                <div className={classes.iconDiv}>
                    <IconBox {...iconBoxes[0]} className={classes.iconBox} />
                </div>
                <div className={classes.iconDiv}>
                    <IconBox {...iconBoxes[1]} className={classes.iconBox} />
                </div>
                <div className={classes.iconDiv}>
                    <IconBox {...iconBoxes[2]} className={classes.iconBox} />
                </div>
            </div>
            <Statement {...statements[1]} className={cx(classes.statement, classes.borders)} />
            <LandingTimeline className={cx(classes.borders, classes.landingTimeline)} />
            <SignInButton
                className={cx(classes.createYourOwn, classes.borders)}
                name={secondarySignupButton}
                destination={destination}
            />
            <div className={classes.borders}>
                <FAQ faqs={faqs} className={classes.faqCom} />
                <HaveAQuestion className={cx(classes.haveAQuestion)} />
            </div>
            <SignInButton
                className={cx(classes.createYourOwn, classes.borders)}
                name={secondarySignupButton}
                style={{ paddingBottom: verticalGap, marginBottom: 0 }}
                destination={destination}
            />
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    borders: { marginBottom: verticalGap },
    title: {
        textAlign: 'center',
        marginLeft: '6rem',
        marginRight: '6rem',
        fontFamily: theme.defaultFontFamily,
    },
    mainTitle: {
        fontSize: '2.5rem',
        fontWeight: '600',
        lineHeight: '110%',
        color: theme.colorPrimary,
        margin: 0,
        marginBottom: '1rem',
    },
    subtitle: {
        fontSize: '1.5rem',
        fontWeight: '600',
        lineHeight: '110%',
        color: theme.colorSecondary,
        margin: 0,
    },
    undebates: {
        width: '100%',
        height: '15.625rem',
        textAlign: 'center',
        fontFamily: theme.defaultFontFamily,
    },
    slider: {
        marginLeft: '5rem',
        marginRight: '5rem',
    },
    iconbox: {
        maxWidth: theme.landscapeMaxWidth,
        display: 'flex',
        justifyContent: 'center',
        fontFamily: theme.defaultFontFamily,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    iconDiv: {
        width: '33%',
        fontSize: '1.5rem',
        color: 'purple',
        marginLeft: '1rem',
        marginRight: '1rem',
    },
    statement: {
        maxWidth: theme.landscapeMaxWidth,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    faqCom: {
        maxWidth: theme.landscapeMaxWidth,
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: theme.defaultFontFamily,
    },
    haveAQuestion: {
        maxWidth: theme.landscapeMaxWidth,
    },
    landingTimeline: {
        marginLeft: '2rem',
        marginRight: '2rem',
    },
    createYourOwn: {
        textAlign: 'center',
    },
    '@media (orientation: portrait)': {
        borders: {
            marginBottom: '2rem',
            marginLeft: '1rem',
            marginRight: '1rem',
        },
        title: {
            margin: '6rem 1rem 6rem 1rem',
        },
        slider: {
            marginLeft: '1rem',
            marginRight: '1rem',
        },
        iconbox: {
            flexDirection: 'column',
            width: 'auto',
            display: 'inline-flex',
        },
        iconDiv: {
            width: 'auto',
            margin: '4rem',
            marginBottom: 0,
        },
        landingTimeline: {
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        faqCom: {
            width: 'auto',
            marginLeft: '1rem',
            marginRight: '1rem',
        },
        haveAQuestion: {
            width: 'auto',
        },
    },
}))
