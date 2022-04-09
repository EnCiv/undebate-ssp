// https://github.com/EnCiv/undebate-ssp/issue/13
import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

export default function VerticalTimeline(props) {
    // refs: an array of all the refs of the TimePoint components to get their position and height
    const { className, style, refs } = props
    const classes = useStyles(props)

    return (
        <div className={cx(className, classes.verticalBar)} style={style}>
            {refs.map(ref => {
                const { top, bottom } = ref.getBoundingClientRect()
                return <div className={classes.dot} style={(top, bottom)} />
            })}
        </div>
    )
}

// we want to see the code first, so we put the classes at the bottom
const useStyles = createUseStyles(theme => ({
    verticalBar: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
    },
    line: {
        opacity: '.2',
        border: '1px solid #262D33',
        height: '100%',
        width: '0',
    },
    dot: {
        border: '1px solid rgba(0, 0, 0, 0.25);',
        borderRadius: '50%',
        background: '#fff',
        width: '.92rem',
        height: '.92rem',
        zIndex: '999',
        position: 'absolute',
    },
}))
