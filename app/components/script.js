import React from 'react'
import { createUseStyles } from 'react-jss'
import Submit from './submit'
import ElectionCategory from './election-category'

import ScriptTextInput from './script-text-input'

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
    maxWordCount: 600,
    wordsPerMin: 120,
}

const processTemplate = (template, substitutions) =>
    Object.entries(substitutions).reduce((filledTemplate, [key, value]) => {
        return filledTemplate.replace(`{${key}}`, value == null ? '' : value)
    }, template)

const numberedToArray = numObj => {
    const val = []
    numObj?.forEach(v => {
        val[v.number - 1] = v.text
    })
    val.map(v => (v === undefined ? null : v))
    return val
}

// First  question: template_1, given question, given answer
// Middle question: template_2, given question, given answer
// Last   question: template_3, default question, given answer
export default function Script({ className = '', style = {}, onDone = () => {}, electionOM }) {
    const [electionObj, electionMethods] = electionOM
    const script = numberedToArray(electionObj.script)
    const questions = numberedToArray(electionObj.questions)
    const classes = useStyles()
    const substitutions = { moderator: electionObj.moderator.name, question: questions[0] }
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
                    <Submit
                        name={script.length === 0 ? 'Submit' : 'Edit'}
                        onDone={() => onDone(true, { script })}
                        className={classes.submitButton}
                    />
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
    submitButton: { float: 'right' },
    cardHeader: { color: 'white', fontSize: '1.1rem', lineHeight: '.5rem' },
    page: {},
})
