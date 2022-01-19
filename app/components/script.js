import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import Submit from './submit'
import ElectionCategory from './election-category'

import ScriptTextInput from './script-text-input'

// https://github.com/EnCiv/undebate-ssp/issues/49

const defaults = {
    description: `Below is an auto-generated script that will be emailed to the moderator. The moderator will record a
                  segment based on each section of the script. If you wish to make any changes, go ahead!`,
    firstAnswer: 'Our first question is "{question}", ...',
    middleAnswer: 'Our next question is "{question}", ...',
    lastAnswer: 'Consectetur adipiscing elit',
    firstQuestion: '{moderator} welcomes the viewers and asks the candidates: "{question}"',
    middleQuestion: '{moderator} thanks the candidates and asks: "{question}" ',
    lastQuestion:
        '{moderator} thanks candidates for answering the previous question and thanks the viewer for watching',
    lockedScript: 'You cannot change the script once the invitation to the moderator has been sent',
    errorText: 'The length of some of the scripts are longer than the limit of {maxWordCount} words or are empty',
    maxWordCount: 600,
    wordsPerMin: 120,
}

const processTemplate = (template, substitutions) =>
    Object.entries(substitutions).reduce((filledTemplate, [key, value]) => {
        return filledTemplate.replace(`{${key}}`, value == null ? '' : value)
    }, template)

const numberedToArray = numObj =>
    Object.entries(numObj).reduce((array, [k, v]) => {
        const tempArray = array
        tempArray[k] = v.text
        return array
    }, [])

// First  question: template_1, given question, given answer
// Middle question: template_2, given question, given answer
// Last   question: template_3, default question, given answer
export default function Script({ className = '', style = {}, onDone = () => {}, electionOM }) {
    const [electionObj, electionMethods] = electionOM
    const [script, setScript] = useState(numberedToArray(electionObj.script))
    const [valid, setValid] = useState(true)
    const [submitted, setSubmitted] = useState(electionObj.script.length !== 0)
    const questions = numberedToArray(electionObj.questions)
    const classes = useStyles({ electionOM, valid })
    const substitutions = {
        moderator: electionObj.moderator.name,
        question: questions[0],
        maxWordCount: defaults.maxWordCount,
    }
    const createHandleTextInputOnDone =
        questionNumber =>
        ({ valid: handleValid, value }) => {
            setValid(handleValid)
            const tempScript = script
            tempScript[questionNumber] = value
            setScript(tempScript)
            if (valid) {
                electionMethods.upsert({ script })
            }
        }
    return questions.length === 0 ? null : (
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
                    <>
                        <Submit
                            name={submitted ? 'Edit' : 'Submit'}
                            onDone={() => {
                                setSubmitted(true)
                                electionMethods.upsert({ script })
                                onDone(valid, { script })
                            }}
                            className={classes.submitButton}
                        />
                        <p className={classes.errorText}> {processTemplate(defaults.errorText, substitutions)} </p>
                    </>
                )}
            </span>
            <div className={classes.scripts}>
                <p>{defaults.description}</p>
                <ScriptTextInput
                    questionNumber={1}
                    questionName={processTemplate(defaults.firstQuestion, substitutions)}
                    maxWordCount={defaults.maxWordCount}
                    wordsPerMinute={defaults.wordsPerMin}
                    defaultValue={script[0] || processTemplate(defaults.firstAnswer, substitutions)}
                    onDone={createHandleTextInputOnDone(0)}
                />
                {questions.slice(1).map((q, i) => {
                    const middleSub = { ...substitutions, question: q }
                    return (
                        <span className={classes.scriptTextInput}>
                            <ScriptTextInput
                                questionNumber={i + 2}
                                questionName={processTemplate(defaults.middleQuestion, middleSub)}
                                maxWordCount={defaults.maxWordCount}
                                wordsPerMinute={defaults.wordsPerMin}
                                defaultValue={script[i + 1] || processTemplate(defaults.middleAnswer, middleSub)}
                                onDone={createHandleTextInputOnDone(i + 1)}
                            />
                        </span>
                    )
                })}
                <ScriptTextInput
                    questionNumber={questions.length + 1}
                    questionName={processTemplate(defaults.lastQuestion, substitutions)}
                    maxWordCount={defaults.maxWordCount}
                    wordsPerMinute={defaults.wordsPerMin}
                    defaultValue={script[questions.length] || processTemplate(defaults.lastAnswer, substitutions)}
                    onDone={createHandleTextInputOnDone(questions.length)}
                />
            </div>
        </div>
    )
}

const useStyles = createUseStyles({
    scripts: { display: 'flex', flexDirection: 'column' },
    submitContainer: { display: 'absolute', float: 'right', width: '35%', padding: '1rem' },
    scriptTextInput: { margin: '0.5rem 0rem' },
    lockedCard: { width: '85%', background: '#262D33', color: '#838789', float: 'right' },
    submitButton: ({ valid }) => ({ float: 'right', border: valid ? 'unset' : '.15rem solid red' }),
    cardHeader: { color: 'white', fontSize: '1.1rem', lineHeight: '.5rem' },
    errorText: ({ valid }) => ({
        display: valid ? 'none' : 'unset',
    }),
    page: {},
})
