/* eslint-disable no-shadow */
// https://github.com/EnCiv/undebate-ssp/issues/49
import React, { useState, useEffect, useReducer } from 'react'
import { createUseStyles } from 'react-jss'
import Submit from './submit'
import ElectionCategory from './election-category'
import ScriptTextInput from './script-text-input'

const defaults = {
    description: `Below is an auto-generated script that will be emailed to the moderator. The moderator will record a
                  segment based on each section of the script. If you wish to make any changes, go ahead!`,
    noQuestions:
        'After the questions are created, you will be able to create the script for the moderator to use when recording.',
    firstAnswer: 'Our first question is "{question}", ...',
    middleAnswer: 'Our next question is "{question}", ...',
    lastAnswer: 'Consectetur adipiscing elit',
    firstQuestion: '{moderator} welcomes the viewers and asks the candidates: "{question}"',
    middleQuestion: '{moderator} thanks the candidates and asks: "{question}" ',
    lastQuestion:
        '{moderator} thanks candidates for answering the previous question and thanks the viewer for watching',
    lockedScript: 'You cannot change the script once the invitation to the moderator has been sent',
    errorText: 'Please correct {errorCount} errors in order to submit.',
    maxWordCount: 600,
    wordsPerMin: 120,
}

const processTemplate = (template, substitutions) =>
    Object.entries(substitutions).reduce((filledTemplate, [key, value]) => {
        return filledTemplate.replace(`{${key}}`, value == null ? '' : value)
    }, template)

// First  question: template_1, given question, given answer
// Middle question: template_2, given question, given answer
// Last   question: template_3, default question, given answer
export default function Script({ className = '', style = {}, onDone = () => {}, electionOM }) {
    const [electionObj, electionMethods] = electionOM
    const { questions = {}, script = {} } = electionObj
    const [validInputs, setValidInputs] = useReducer((state, action) => ({ ...state, ...action }), {})
    const errorCount = Object.values(validInputs).reduce((count, valid) => (valid === false ? count + 1 : count), 0)
    const valid = Object.values(validInputs).length > 0 && !Object.values(validInputs).some(v => !v)
    const [submitted, setSubmitted] = useState(electionObj?.script?.length > 0)
    const classes = useStyles({ electionOM, valid })

    const substitutions = {
        moderator: electionObj?.moderator?.name || '',
        question: questions[0]?.text || '',
        maxWordCount: defaults.maxWordCount,
    }
    // side effects to do after the component rerenders from a state change
    const [sideEffects] = useState([]) // never set sideEffects
    useEffect(() => {
        while (sideEffects.length) sideEffects.shift()()
    })

    const questionsLength = Object.keys(questions).length

    return (
        <div className={`${className} ${classes.page}`} style={style}>
            <span className={classes.submitContainer}>
                {electionMethods.areQuestionsLocked() ? (
                    <ElectionCategory
                        className={classes.lockedCard}
                        statusObjs={{ locked: true }}
                        categoryName={
                            <>
                                <h2 className={classes.cardHeader}>Locked</h2>
                                <p>{defaults.lockedScript}</p>
                            </>
                        }
                    />
                ) : (
                    <div>
                        <div>
                            <Submit
                                name={submitted ? 'Edit' : 'Submit'}
                                onDone={() => {
                                    setSubmitted(true)
                                    electionMethods.upsert({ script })
                                    onDone({ valid, script })
                                }}
                                className={classes.submitButton}
                            />
                        </div>
                        <div className={classes.errorArea}>
                            <p className={classes.errorText}>
                                {processTemplate(questionsLength ? defaults.errorText : defaults.noQuestions, {
                                    ...substitutions,
                                    errorCount,
                                })}{' '}
                            </p>
                        </div>
                    </div>
                )}
            </span>
            <div className={classes.scripts}>
                <p>{questionsLength ? defaults.description : defaults.noQuestions}</p>
                {questionsLength
                    ? Object.entries(questions)
                          .concat([[questionsLength, '']])
                          .map(([qId, qTxt], i) => {
                              const subs = { ...substitutions, question: qTxt.text || '' }
                              const sourceOf = i === 0 ? 'first' : i < questionsLength ? 'middle' : 'last'
                              return (
                                  <ScriptTextInput
                                      key={qId}
                                      questionNumber={i + 1}
                                      questionName={processTemplate(defaults[`${sourceOf}Question`], subs)}
                                      maxWordCount={defaults.maxWordCount}
                                      wordsPerMinute={defaults.wordsPerMin}
                                      defaultValue={
                                          script[i]?.text || processTemplate(defaults[`${sourceOf}Answer`], subs)
                                      }
                                      onDone={({ valid, value }) => {
                                          if (
                                              ((typeof validInputs[i] === 'undefined' && valid) ||
                                                  validInputs[i] !== null ||
                                                  valid) &&
                                              electionObj?.script?.[i]?.text !== value
                                          ) {
                                              sideEffects.push(() =>
                                                  electionMethods.upsert({ script: { [i]: { text: value } } })
                                              )
                                          }
                                          setValidInputs({ [i]: valid })
                                      }}
                                  />
                              )
                          })
                    : null}
            </div>
        </div>
    )
}

const useStyles = createUseStyles({
    scripts: {
        display: 'flex',
        flexDirection: 'column',
        '& p:first-child': {
            paddingTop: 0,
            marginTop: 0,
        },
    },
    submitContainer: { display: 'absolute', float: 'right', width: '35%', padding: 0 },
    scriptTextInput: { margin: '0.5rem 0rem' },
    lockedCard: { width: '85%', background: '#262D33', color: '#838789', float: 'right' },
    submitButton: ({ valid }) => ({ float: 'right', border: valid ? 'unset' : '.15rem solid red' }),
    cardHeader: { color: 'white', fontSize: '1.1rem', lineHeight: '.5rem' },
    errorArea: { clear: 'both', padding: '2rem', paddingRight: 0, color: 'red' },
    errorText: ({ valid }) => ({
        display: valid ? 'none' : 'unset',
    }),
    page: {},
})
