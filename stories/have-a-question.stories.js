// https://github.com/EnCiv/undebate-ssp/issues/115

import React, { useState, useEffect } from 'react'

import HaveAQuestion from '../app/components/have-a-question'

export default {
    title: 'Have a Question',
    component: HaveAQuestion,
    argTypes: {},
}

const Template = (args, context) => {
    useEffect(() => {
        if (typeof window.socket === 'undefined') {
            window.socket = {
                emit: (handle, email, fname, lname, subject, message, cb) => {
                    cb('success')
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
