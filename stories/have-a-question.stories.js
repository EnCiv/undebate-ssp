// https://github.com/EnCiv/undebate-ssp/issues/115

import React, { useState, useEffect } from 'react'

import HaveAQuestion from '../app/components/have-a-question'

export default {
    title: 'Have a Question',
    component: HaveAQuestion,
    argTypes: {},
}

const Template = (args, context) => {
    const { onDone } = context
    useEffect(() => {
        if (typeof window.socket === 'undefined') {
            window.socket = {
                emit: (handle, email, fname, lname, subject, message, cb) => {
                    setTimeout(() => {
                        if (email === 'fail@fail.com') cb({ error: 'Sorry, there was an error.' })
                        else cb('success')
                    }, 1000)
                    onDone({ valid: true, value: { handle, email, fname, lname, subject, message } })
                },
            }
        }
    })
    return (
        <div>
            <HaveAQuestion {...args} />
        </div>
    )
}

export const HaveAQuestionTest = Template.bind({})
