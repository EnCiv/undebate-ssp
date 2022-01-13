// https://github.com/EnCiv/undebate-ssp/issues/48
import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import CountLimitedTextInput from './count-limited-text-input'
import Submit from './submit'

export default function Questions({ electionOM, onDone }) {
    const classes = useStyles()
    const [electionObj, electionMethods] = electionOM
    const [questions, setQuestions] = useState(electionObj?.questions || { 0: { text: '' } })
    const [error, setError] = useState('')
    const [lockedMessage, setLockedMessage] = useState('')
    const [isValid, setIsValid] = useState(false)

    const checkEmptyQuestion = () => {
        // eslint-disable-next-line no-restricted-syntax
        for (const key in questions) {
            if (questions[key].text === '') {
                return false
            }
        }
        return true
    }

    const checkValid = () => {
        // check questions are locked or not
        if (electionMethods.areQuestionsLocked()) {
            setLockedMessage('the invitation has been sent, questions cannot be changed')
            return false
        }
        setLockedMessage('')
        return true
    }

    const validSubmit = () => {
        // check valid when all of the empty questions in the bottom
        const arr = Object.entries(questions).map((key, question) => questions[question])
        const firstEmptyIndex = arr.findIndex(q => q.text === '')
        const lastNotEmptyIndex = arr.length - 1 - arr.reverse().findIndex(q => q.text !== '')

        if (firstEmptyIndex !== -1 && firstEmptyIndex < lastNotEmptyIndex) {
            setError('All of the empty questions must be below filled questions')
            return false
        }
        return true
    }

    useEffect(() => {
        setQuestions(electionObj?.questions || { 0: { text: '' } })
    }, [electionOM])

    useEffect(() => {
        setIsValid(checkValid())
    }, [isValid, electionOM])

    useEffect(() => {
        if (checkEmptyQuestion()) {
            setError('')
        }
    }, [electionOM, error, questions])

    const addQuestion = () => {
        if (checkEmptyQuestion()) {
            setError('')
            electionMethods.upsert({ questions: { [Object.keys(questions).length]: { text: '' } } })
            setQuestions({ ...questions, [Object.keys(questions).length]: { text: '' } })
        } else {
            setError('Please fill out empty question before add more')
        }
    }

    return (
        <div className={classes.container}>
            <div className={classes.send}>
                <span>What questions would you like to ask the candidates?</span>
                <Submit
                    disabled={!isValid}
                    onDone={() => {
                        onDone({
                            value: questions,
                            valid: isValid && validSubmit(),
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
                            electionMethods.upsert({ questions: { [question]: { text: props.value } } })
                            setQuestions({ ...questions, [question]: { ...questions[question], text: props.value } })
                        }}
                    />
                ))}
            </div>
            <button className={classes.addQuestionBtn} disabled={!isValid} onClick={addQuestion} type='button'>
                Add question
            </button>
            <p className={classes.err}>{error}</p>
            <p className={classes.err}>{lockedMessage}</p>
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
