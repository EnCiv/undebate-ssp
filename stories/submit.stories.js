// https://github.com/EnCiv/undebate-ssp/issues/14
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import Submit from '../app/components/submit'

export default {
    title: 'Submit',
    component: Submit,
    argTypes: {},
}

const useStyles = createUseStyles({
    alert: {
        margin: '1rem 0',
        padding: '1rem',
        width: 'fit-content',
    },
    done: {
        color: '#4F8A10',
        backgroundColor: '#DFF2BF',
    },
    unfinished: {
        color: '#9F6000',
        backgroundColor: '#FEEFB3',
    },
})

const Template = args => {
    const [done, setDone] = useState(false)
    const styles = useStyles()
    return (
        <>
            <div className={`${styles.alert} ${done ? styles.done : styles.unfinished}`}>
                {done ? 'Done!' : 'Unfinished'}
            </div>
            <Submit
                {...args}
                onDone={bool => {
                    setDone(bool)
                    // eslint-disable-next-line no-console
                    console.log(done)
                }}
            />
        </>
    )
}

export const SubmitTest = Template.bind({})

SubmitTest.args = {
    name: 'Submit',
    disabled: false,
    disableOnClick: true,
}
