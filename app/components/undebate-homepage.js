// https://github.com/EnCiv/undebate-ssp/issue/20
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import Header from './undebates-header-bar'
import NavigationPanel from './navigation-panel'
import ElectionComponent from './election-component'
import Timeline from './timeline'
import Questions from './questions'
import Script from './script'
import Invitation from './invitation'
import ElectionTable from './candidate-table'
import Submissions from './submission'
import Submission from './submission'

const components = {
    Election: ElectionComponent,
    Timeline: Timeline,
    Questions: Questions,
    Script: Script,
    Invitation: Invitation,
    Submission: Submission,
    'Election Table': ElectionTable,
    Submissions: Submissions,
}

export default function UndebateHomepage(props) {
    const { className, style, electionOM } = props
    const classes = useStyles(props)
    const [component, setComponent] = useState('Election')
    const Component = components[component] || ElectionComponent

    return (
        <div className={cx(className, classes.wrapper)} style={style}>
            <Header electionOM={electionOM} className={classes.header} />
            <div className={classes.workArea}>
                <NavigationPanel
                    className={classes.nav}
                    electionOM={electionOM}
                    onDone={({ valid, value }) => {
                        if (components[value]) setComponent(value)
                        else console.error('UndebateHomepage got', value, 'expected a valid component name')
                    }}
                />
                <div className={classes.comp}>
                    <Component className={classes.inner} electionOM={electionOM} key={component} />
                </div>
            </div>
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    wrapper: {},
    header: {
        height: '100%',
    },
    workArea: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    nav: {
        width: '25em',
    },
    comp: {
        width: '100%',
        padding: '0 1em 1em 1em',
    },
    inner: {},
}))
