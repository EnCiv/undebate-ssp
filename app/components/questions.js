// https://github.com/EnCiv/undebate-ssp/issues/48
import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import CountLimitedTextInput from './count-limited-text-input'
import Submit from './submit'

export default function Questions({ electionOM, onDone }) {
    const classes = useStyles()
    const { electionMethods } = electionOM
    const [questions, setQuestions] = useState([''])
    const [error, setError] = useState('')
    const [isValid, setIsValid] = useState(false)

    const checkValid = () =>
        !electionMethods.areQuestionsLocked() &&
        (questions.length > 1 || (questions.length === 1 && !questions.includes('')))

    useEffect(() => {
        setIsValid(checkValid())
    }, [isValid, electionMethods, questions])

    const addQuestion = () => {
        if (!questions.includes('')) {
            setError('')
            setQuestions([...questions, ''])
        } else {
            setError('All questions must not be empty!')
        }
    }

    const generateKey = pre => {
        return `${pre}_${new Date().getTime()}`
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
                            value: questions.filter(question => question !== ''),
                            valid: checkValid(),
                        })
                    }}
                />
            </div>
            {questions.map((question, index) => (
                <CountLimitedTextInput
                    key={generateKey(index)}
                    name={`Question ${index + 1}`}
                    maxCount={250}
                    defaultValue={question}
                    onDone={({ valid, value }) => {
                        if (valid) {
                            setQuestions([...questions.slice(0, index), value, ...questions.slice(index + 1)])
                        }
                    }}
                />
            ))}
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
