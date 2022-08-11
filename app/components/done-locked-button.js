'use-strict'

import cx from 'classnames'
import React from 'react'
import { createUseStyles } from 'react-jss'
import Submit from './submit'
import { kebabCase } from 'lodash'

export default function DoneLockedButton({
    onDone,
    electionOM,
    panelName,
    isValid,
    isLocked,
    dependents = [],
    style,
    className,
}) {
    const classes = useStyles()
    const [electionObj = {}, electionMethods] = electionOM
    const doneDate = electionObj?.doneLocked?.[panelName]?.done
    const needsReview = doneDate && dependents.some(key => electionObj?.doneLocked?.[key]?.done > doneDate)
    const name = isLocked ? 'Locked' : needsReview ? 'Needs Review' : doneDate ? 'Edit' : 'Done'

    return (
        <Submit
            className={cx(className, classes[kebabCase(name)])}
            style={style}
            name={name}
            disabled={name === 'Locked' || (name === 'Done' && !isValid)}
            onDone={() => {
                if (name === 'Done')
                    electionMethods.upsert({ doneLocked: { [panelName]: { done: new Date().toISOString() } } })
                else if (name === 'Edit') electionMethods.upsert({ doneLocked: { [panelName]: { done: '' } } })
                else if (name === 'Needs Review') electionMethods.upsert({ doneLocked: { [panelName]: { done: '' } } })
                onDone({ valid: name === 'Done' })
            }}
        />
    )
}

const useStyles = createUseStyles(theme => ({
    done: {},
    edit: {
        backgroundColor: 'darkgray',
        opacity: 1,
    },
    locked: {
        backgroundColor: '#000000FF',
        opacity: 1,
    },
    'needs-review': {
        backgroundColor: 'red',
        opacity: 1,
    },
}))
