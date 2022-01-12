// https://github.com/EnCiv/undebate-ssp/issues/48
import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import CountLimitedTextInput from './count-limited-text-input'
import Submit from './submit'

export default function Questions({ electionOM, onDone }) {
    const classes = useStyles()
    const [electionObj, electionMethods] = electionOM
    const [questions, setQuestions] = useState(electionObj.questions || { 0: { text: '' } })
    const [error, setError] = useState('')
    const [isValid, setIsValid] = useState(false)

    const checkEmptyQuestion = () => {
        for (const key in questions) {
            if (questions[key].text === '') {
                return false
            }
        }
        return true
    }

    const checkValid = () => !electionMethods.areQuestionsLocked()

    useEffect(() => {
        setIsValid(checkValid())
    }, [isValid, electionOM, questions])

    useEffect(() => {
        if (checkEmptyQuestion()) {
            setError('')
        }
    }, [questions, error])

    const addQuestion = () => {
        if (checkEmptyQuestion()) {
            setError('')
            setQuestions({ ...questions, [Object.keys(questions).length]: { text: '' } })
        } else {
            setError('All questions must not be empty!')
        }
    }

    return (
        <div className={classes.container}>
            <div className={classes.send}>
                <span>What questions would you like to ask the candidates?</span>
                <Submit
                    disabled={!isValid}
                    disableOnClick
                    onDone={() => {
                        onDone({
                            value: questions,
                            valid: checkValid(),
                        })
                    }}
                />
            </div>
            <div className={classes.questionBox}>
                {Object.entries(questions).map((key, question) => (
                    <CountLimitedTextInput
                        key={key}
                        name={`Question ${question + 1}`}
                        maxCount={250}
                        defaultValue={questions[question].text}
                        onDone={props => {
                            electionMethods.upsert({ questions: { [key]: props.value } })
                            setQuestions({ ...questions, [question]: { ...questions[question], text: props.value } })
                        }}
                    />
                ))}
            </div>
            <button className={classes.addQuestionBtn} onClick={addQuestion} type='button'>
                Add question
            </button>
            <p className={classes.err}>{error}</p>
        </div>
    )
}

const useStyles = createUseStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Poppins',
        color: '#262D33',
    },
    send: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1rem',
    },
    questionBox: {
        width: '70%',
    },
    addQuestionBtn: {
        color: '#262D33',
        background: 'white',
        border: '1px solid #262D33',
        alignSelf: 'flex-start',
        padding: '.9rem 1.3rem',
        borderRadius: '1.875rem',
        fontWeight: 600,
        '&:hover': {
            cursor: 'pointer',
        },
        marginTop: '1.5625rem',
    },
    err: {
        color: 'red',
    },
})
