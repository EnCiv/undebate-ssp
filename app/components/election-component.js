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
        <div className={cx(className, classes.wrapper)} style={style}>
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
            <Submit
                name='Submit'
                // onDone={}
            />
        </div>
    )
}

const useStyles = createUseStyles({})

export default ElectionComponent
