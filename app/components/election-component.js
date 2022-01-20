// https://github.com/EnCiv/undebate-ssp/issues/44
'use-strict'

import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import ElectionTextInput from './election-text-input'
import Submit from './submit'

export function ElectionComponent(props) {
    const { className, style, onSubmit = () => {} } = props
    const classes = useStyles()

    return (
        <div className={cx(className, classes.container)} style={style}>
            <div className={classes.inputs}>
                <ElectionTextInput
                    name='Election Name'
                    defaultValue={'Input'}
                    // onDone={}
                />
                <ElectionTextInput
                    name='Organization Name'
                    defaultValue={'Input'}
                    // onDone={}
                />
            </div>
            <div>
                <Submit
                    name='Submit'
                    // onDone={}
                />
            </div>
        </div>
    )
}

const useStyles = createUseStyles({
    container: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    inputs: {
        width: '20rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    },
})

export default ElectionComponent
