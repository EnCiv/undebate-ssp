import React from 'react'
import { createUseStyles } from 'react-jss'
import './footer.css'

const useStyles = createUseStyles({
    footer: {
        position: 'absolute',
        width: '100vw',
        left: 0,
        //top: "calc(100vh - 1.1em)", // not bottom because on smartphones the bottom doesn't move when the screensize gets bigger  .1 because of the underline in an href
        bottom: 0,
        lineHeight: '0.8em',
        overflow: 'hidden',
        boxStyle: 'border-box',
        '& a': {
            padding: '0 0 0 0.5em',
            fontSize: '0.8em',
        },
    },
})

export default function Footer() {
    const classes = useStyles()
    return (
        <div className={classes.footer} id='footer-container'>
            <div id='unpoll-container'>
                <a href='#'>Unpoll</a>
                <p>Text for Unpoll goes here!</p>
            </div>

            <div id='enciv-container'>
                <a href='https://enciv.org/terms' target='_blank' rel='noreferrer'>
                    EnCiv
                </a>
                <p>Text for EnCiv goes here!</p>
            </div>

            <div id='button-container'>
                <p>amet elementtum euismod molestie facilisie varius</p>
                <button>Donate</button>
            </div>

            <p>Copyright &copy; 2022 EnCiv, Inc</p>
        </div>
    )
}
