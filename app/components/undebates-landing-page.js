import React from 'react'
import { createUseStyles, ThemeProvider } from 'react-jss'
import HaveAQuestion from './have-a-question'
import Statement from './statement-component'
import theme from '../theme'

export default function UndebatesLandingPage(props) {
    const classes = useStyles()
    return (
        <div>
            <h1 style={{ textAlign: 'center', padding: '2% 0', fontFamily: theme.defaultFontFamily }}>
                Debates Landing Page (Component)
            </h1>
            <div className={classes.iconbox}>
                <h2>Landscape Portrait Slider (Component)</h2>
            </div>
            <div className={classes.undebates}>
                <h2>What are Undebates? (Component)</h2>
            </div>
            <div className={classes.iconbox}>
                <div className={classes.iconDiv}>Icon 1</div>
                <div className={classes.iconDiv}>Icon 2</div>
                <div className={classes.iconDivLast}>Icon 3</div>
            </div>
            <Statement {...props.statement[0]} />
            <HaveAQuestion />
        </div>
    )
}

const useStyles = createUseStyles({
    undebates: {
        width: '100%',
        height: '15.625rem',
        backgroundColor: 'pink',
        textAlign: 'center',
        color: 'purple',
        marginBottom: '2%',
        fontFamily: theme.defaultFontFamily,
    },
    iconbox: {
        width: '100%',
        height: 'auto',
        backgroundColor: 'purple',
        textAlign: 'center',
        color: '#FFFFFF',
        marginBottom: '2%',
        display: 'flex',
        justifyContent: 'center',
        padding: '3% 0',
        fontFamily: theme.defaultFontFamily,
    },
    iconDiv: {
        width: '18.75rem',
        height: '30.625rem',
        backgroundColor: 'pink',
        borderRadius: '1.25rem',
        paddingTop: '3%',
        fontSize: '1.5rem',
        color: 'purple',
        marginRight: '5%',
    },
    iconDivLast: {
        width: '18.75rem',
        height: '30.625rem',
        backgroundColor: 'pink',
        borderRadius: '1.25rem',
        paddingTop: '3%',
        fontSize: '1.5rem',
        color: 'purple',
        marginRight: 'none',
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
