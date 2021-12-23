'use strict'

import React from 'react'
import {createUseStyles} from 'react-jss'
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

export function Footer() {
    const  classes  = useStyles()
    return (
      <div className={classes['footer']}>
        <a href="https://enciv.org/terms" target="_blank">
          Terms
        </a>
      </div>
    )
}

export default Footer