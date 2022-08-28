// https://github.com/EnCiv/undebate-ssp/issues/48
import React, { useState, useEffect, useReducer } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import CountLimitedTextInput from './count-limited-text-input'
import ElectionTextInput from './election-text-input'
import DoneLockedButton from './done-locked-button'

// if you just do Array.prototype.test=... it becomes iterable as in for(const i in array)
if (!Array.prototype.test)
    Object.defineProperty(Array.prototype, 'test', {
        value: function (f) {
            return f(this) ? this : undefined
        },
    })

const panelName = 'Questions'
export default function Questions({ className, style, electionOM, onDone }) {
    const classes = useStyles()
    const [electionObj, electionMethods] = electionOM

    const { questions = {} } = electionObj
    const disabled =
        electionObj?.doneLocked?.[panelName]?.done || electionMethods.getModeratorSubmissionStatus() === 'submitted'

    const qObjs = Object.values(questions)
    const lastQuestionIncomplete = qObjs.length > 0 && (!qObjs[qObjs.length - 1].text || !qObjs[qObjs.length - 1].time)

    // side effects to do after the component rerenders from a state change
    const [sideEffects] = useState([]) // never set sideEffects
    useEffect(() => {
        while (sideEffects.length) sideEffects.shift()()
    })

    const validSubmit = (() => {
        if (!Object.values(questions).every(({ time, text }) => (!time && !text) || (time && text))) return false
        // check valid when all of the empty questions in the bottom
        const arr = Object.values(questions).map(({ text, time }) => text || '') // text may not be set
        if (!arr.length || !arr[0]) return false
        const firstEmptyIndex = arr.findIndex(text => text === '')
        const lastNotEmptyIndex = arr.length - 1 - arr.reverse().findIndex(text => text !== '')

        if (firstEmptyIndex !== -1 && firstEmptyIndex < lastNotEmptyIndex) {
            return false
        }
        return true
    })()

    const addQuestion = () => {
        sideEffects.push(() =>
            electionMethods.upsert({ questions: { [Object.keys(questions).length]: { text: '', time: '' } } })
        )
    }

    const cleanEmptyQuestions = () => {
        const deleteQuestions = {}
        let upsertNeeded = false
        for (const key in Object.keys(questions)) {
            if (!questions[key].text && !questions[key].time) {
                deleteQuestions[key] = undefined
                upsertNeeded = true
            }
        }
        if (upsertNeeded) electionMethods.upsert({ questions: deleteQuestions })
        return true
    }

    return (
        <div className={cx(className, classes.container)} style={style}>
            <div className={classes.questionBox}>
                <div className={classes.heading}>
                    <span>What questions would you like to ask the candidates?</span>
                    <button
                        className={classes.addQuestionBtn}
                        disabled={disabled || lastQuestionIncomplete}
                        onClick={addQuestion}
                        type='button'
                    >
                        Add question
                    </button>
                </div>
                {Object.entries(questions).map((key, qIndex) => (
                    <div className={classes.questionTime}>
                        <CountLimitedTextInput
                            className={classes.questionInput}
                            disabled={disabled}
                            warn={!questions[qIndex].text && questions[qIndex].time}
                            key={key}
                            name={`Question ${qIndex + 1}`}
                            maxCount={250}
                            defaultValue={questions[qIndex].text}
                            onDone={({ valid, value }) => {
                                console.info('onDone', qIndex, valid, value)
                                if (electionObj.questions[qIndex].text !== value) {
                                    console.info('upserting', { questions: { [qIndex]: { text: value } } })
                                    electionMethods.upsert({ questions: { [qIndex]: { text: value } } })
                                    /*
                                    sideEffects.push(() =>
                                        electionMethods.upsert({ questions: { [qIndex]: { text: value } } })
                                    )*/
                                }
                            }}
                        />
                        <ElectionTextInput
                            className={classes.timeInput}
                            warn={questions[qIndex].text && !questions[qIndex].time}
                            disabled={disabled}
                            key={key + 'time'}
                            name='Seconds'
                            type='number'
                            defaultValue={questions[qIndex].time}
                            onDone={({ valid, value }) => {
                                if (electionObj.questions[qIndex].time !== value) {
                                    sideEffects.push(() =>
                                        electionMethods.upsert({ questions: { [qIndex]: { time: value } } })
                                    )
                                }
                            }}
                        />
                    </div>
                ))}
            </div>
            <div className={classes.donePanel}>
                <DoneLockedButton
                    className={classes.submitButton}
                    electionOM={electionOM}
                    panelName={panelName}
                    isValid={validSubmit}
                    isLocked={electionMethods.getModeratorSubmissionStatus() === 'submitted'}
                    onDone={({ valid, value }) => valid && cleanEmptyQuestions() && onDone({ valid: validSubmit })}
                />
            </div>
        </div>
    )
}

const useStyles = createUseStyles(theme => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontFamily: theme.defaultFontFamily,
        color: theme.colorSecondary,
    },
    donePanel: {},
    heading: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
    },
    questionBox: {
        width: '70%',
        fontFamily: theme.defaultFontFamily,
    },
    questionTime: {
        display: 'flex',
        columnGap: '1rem',
        marginTop: '1.5rem',
    },
    questionInput: {
        flexGrow: 1,
    },
    timeInput: {
        width: '6rem',
    },
    addQuestionBtn: {
        color: theme.colorSecondary,
        background: 'white',
        border: `1px solid ${theme.colorSecondary}`,
        alignSelf: 'flex-start',
        padding: theme.buttonPadding,
        borderRadius: theme.buttonBorderRadius,
        fontWeight: 600,
        '&:hover': {
            cursor: 'pointer',
        },
        marginTop: '1.5625rem',
        '&:disabled': {
            color: 'lightgray',
            borderColor: 'lightgray',
            cursor: 'auto',
        },
    },
    warn: {
        backgroundColor: theme.backgroundColorWarning,
    },
}))
