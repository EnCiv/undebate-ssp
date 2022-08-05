// https://github.com/EnCiv/undebate-ssp/issues/14
import React from 'react'
import component from '../app/components/done-locked-button'
import makeChapter from './make-chapter'
const mC = makeChapter(component)

export default {
    title: 'DoneLockedButton',
    component,
    argTypes: {},
}

export const Default = mC({})
export const NotDone = mC({
    panelName: 'election',
    isDone: () => false,
    isLocked: () => false,
    defaultElectionObj: {},
})

export const Done = mC({
    panelName: 'election',
    isDone: () => true,
    isLocked: () => false,
    defaultElectionObj: {
        doneLocked: {},
    },
})

export const Edit = mC({
    panelName: 'Election',
    isDone: () => true,
    isLocked: () => false,
    defaultElectionObj: {
        doneLocked: {
            Election: { done: new Date(Date.now() - 3600 * 1000 * 24 * 3).toISOString() },
        },
    },
})

export const Locked = mC({
    panelName: 'Election',
    isDone: () => true,
    isLocked: () => true,
    defaultElectionObj: {
        doneLocked: {
            Election: { done: new Date(Date.now() - 3600 * 1000 * 24 * 3).toISOString() },
        },
    },
})

export const needsReview = mC({
    panelName: 'Timeline',
    isDone: () => true,
    isLocked: () => false,
    dependents: ['Election'],
    defaultElectionObj: {
        doneLocked: {
            Election: { done: new Date(Date.now()).toISOString() },
            Timeline: { done: new Date(Date.now() - 3600 * 1000 * 24 * 3).toISOString() },
        },
    },
})
