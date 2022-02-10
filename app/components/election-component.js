// https://github.com/EnCiv/undebate-ssp/issues/44
'use-strict'

import React, { useState, useEffect, useReducer } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import ElectionTextInput from './election-text-input'
import Submit from './submit'
const items = [
    { name: 'Election Name', key: 'electionName' },
    { name: 'Organization Name', key: 'organizationName' },
]

export default function ElectionComponent(props) {
    const { className, style, electionOM, onDone } = props
    const [electionObj, electionMethods] = electionOM
    const [validInputs, setValidInputs] = useReducer((state, action) => ({ ...state, ...action }), {})
    const allValid = Object.values(validInputs).length > 0 && !Object.values(validInputs).some(v => !v)
    const classes = useStyles({ allValid })

    // side effects to do after the component rerenders from a state change
    const [sideEffects] = useState([]) // never set sideEffects
    useEffect(() => {
        while (sideEffects.length) sideEffects.shift()()
    })

    return (
        <div className={cx(className, classes.page)} style={style}>
            <div className={cx(className, classes.wrapper)} style={style}>
                {items.map(({ name, key }) => (
                    <ElectionTextInput
                        key={key}
                        name={name}
                        className={classes.input}
                        defaultValue={electionObj[key] || ''}
                        onDone={({ valid, value }) => {
                            sideEffects.push(() => electionMethods.upsert({ [key]: value }))
                            setValidInputs({ [key]: valid })
                        }}
                    />
                ))}
            </div>
            <span className={classes.submitContainer}>
                <Submit
                    className={classes.submitButton}
                    name='Submit'
                    disabled={!allValid}
                    onDone={() => onDone({ valid: allValid })}
                />
            </span>
        </div>
    )
}

const useStyles = createUseStyles({
    page: {
        position: 'relative',
    },
    wrapper: {
        width: '38em',
    },
    input: {
        marginTop: '2rem',
        '&:first-child': {
            marginTop: 0,
        },
    },

    submitContainer: { position: 'absolute', width: '35%', padding: 0, top: 0, right: 0 },
    submitButton: { float: 'right' },
})
