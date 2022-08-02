// https://github.com/EnCiv/undebate-ssp/issue/23
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import NavigationPanel from './navigation-panel'
import ElectionComponent from './election-component'
import Timeline from './timeline'
import Questions from './questions'
import Script from './script'
import Invitation from './invitation'
import ElectionTable from './candidate-table'
import Submissions from './submissions'
import Submission from './submission'
import Undebate from './undebate'
import ModeratorRecorder from './moderator-recorder'

const components = {
    Election: ElectionComponent,
    Timeline: Timeline,
    Questions: Questions,
    Contact: Invitation,
    Script: Script,
    Recorder: ModeratorRecorder,
    Submission: Submission,
    'Election Table': ElectionTable,
    Submissions: Submissions,
    Undebate: Undebate,
}

const keys = Object.keys(components)

export default function ConfigureElection(props) {
    const { className, style, electionOM } = props
    const classes = useStyles(props)
    const [component, setComponent] = useState('Election')
    const Component = components[component] || ElectionComponent
    const next = keys[Math.min(keys.indexOf(component) + 1, keys.length - 1)]

    return (
        <div className={cx(className, classes.wrapper)} style={style}>
            <div className={classes.workArea}>
                <NavigationPanel
                    className={classes.nav}
                    electionOM={electionOM}
                    onDone={({ valid, value }) => {
                        if (components[value]) setComponent(value)
                        else console.error('ConfigureElection got', value, 'expected a valid component name')
                    }}
                    component={component}
                />
                <div className={classes.comp}>
                    <Component
                        className={classes.inner}
                        electionOM={electionOM}
                        key={component}
                        onDone={({ valid, value }) => setComponent(next)}
                    />
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
        width: '25rem',
        borderTop: `1px solid ${theme.thinBorderColor}`,
        borderRight: `1px solid ${theme.thinBorderColor}`,
        paddingTop: '2.5rem',
    },
    comp: {
        width: '100%',
        borderTop: `1px solid ${theme.thinBorderColor}`,
        padding: '2.5rem 1rem 1rem 2.5rem',
    },
    inner: {},
}))
