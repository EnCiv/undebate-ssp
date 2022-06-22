/* eslint-disable no-unused-vars */
// https://github.com/EnCiv/undebate-ssp/issues/48

import React, { useState, useEffect } from 'react'

import component from '../app/components/questions'
import makeChapter from './make-chapter'
const mC = makeChapter(component)
export default {
    title: 'Questions',
    component,
    argTypes: {},
}

export const QuestionsTest = mC({
    defaultElectionObj: {
        id: '123',
        questions: {
            0: {
                text: '',
            },
        },
    },
})

export const WithData = mC({
    defaultElectionObj: {
        id: '2349099238402',
        questions: {
            0: {
                text: 'What is your favorite color?',
                time: '30',
            },
            1: {
                text: 'Do you have a pet?',
                time: '60',
            },
            2: {
                text: 'Should we try to fix income inequality?',
                time: '90',
            },
        },
    },
})

export const Empty = mC({})
