import React from 'react'
import { createUseStyles, ThemeProvider } from 'react-jss'
import IconBox from './icon-box'
import Statement from './statement-component'
import FAQ from './frequently-asked-questions'
import HaveAQuestion from './have-a-question'
import LandingTimeline from './landing-timeline'
import theme from '../theme'

export default function UndebatesLandingPage(props) {
    const classes = useStyles()
    return (
        <div style={{ backgroundColor: '#e9eaeb' }}>
            <h1 style={{ textAlign: 'center', padding: '2% 0', fontFamily: theme.defaultFontFamily }}>
                Undebates Landing Page (Component)
            </h1>
            <div className={classes.iconbox}>
                <h2>Landscape Portrait Slider (Component)</h2>
            </div>
            <div className={classes.undebates}>
                <h2>What are Undebates? (Component)</h2>
            </div>
            <LandingTimeline />
            <div className={classes.iconbox}>
                <div className={classes.iconDiv}>
                    <IconBox {...props.iconBox[0]} className={classes.iconBox} />
                </div>
                <div className={classes.iconDiv}>
                    <IconBox {...props.iconBox1[0]} className={classes.iconBox} />
                </div>
                <div className={classes.iconDivLast}>
                    <IconBox {...props.iconBox2[0]} className={classes.iconBox} />
                </div>
            </div>
            <Statement {...props.statement[0]} className={classes.statement} />
            <FAQ faqs={props.faqs} className={classes.faqCom} />
            <HaveAQuestion />
        </div>
    )
}

const useStyles = createUseStyles({
    undebates: {
        width: '100%',
        height: '15.625rem',
        textAlign: 'center',
        marginBottom: '2%',
        fontFamily: theme.defaultFontFamily,
    },
    iconbox: {
        width: '100%',
        height: 'auto',
        textAlign: 'center',
        marginBottom: '2%',
        display: 'flex',
        justifyContent: 'center',
        padding: '3% 0',
        fontFamily: theme.defaultFontFamily,
    },
    iconDiv: {
        width: '20rem',
        height: 'auto',
        paddingTop: '3%',
        fontSize: '1.5rem',
        color: 'purple',
        marginRight: '5%',
    },
    iconDivLast: {
        width: '20rem',
        height: 'auto',
        paddingTop: '3%',
        fontSize: '1.5rem',
        color: 'purple',
        marginRight: 'none',
    },
    statement: {
        width: '48rem',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    faqCom: {
        width: '48rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: theme.defaultFontFamily,
    },
    '@media (orientation: portrait)': {
        iconbox: {
            flexDirection: 'column',
            width: '100%',
            margin: '0 auto',
        },
        iconDiv: {
            textAlign: 'center',
            width: '80%',
            height: '30.625rem',
            display: 'flex-box',
            margin: '0 auto',
            marginBottom: '6%',
        },
        iconDivLast: {
            textAlign: 'center',
            width: '80%',
            height: '30.625rem',
            display: 'flex-box',
            margin: '0 auto',
            marginBottom: '6%',
        },
    },
})
