// https://github.com/EnCiv/undebate-ssp/issue/20
import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import Header from './undebates-header-bar'

export default function UndebateHomepage(props) {
    const { className, style, electionOM } = props
    const classes = useStyles(props)

    return (
        <div className={cx(className, classes.wrapper)} style={style}>
            <Header electionOM={electionOM} className={classes.header} />
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    wrapper: {},
    header: {
        height: '100%',
    },
}))
