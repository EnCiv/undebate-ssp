import React from 'react'
import component from '../app/components/candidate-status-icon'
import makeChapter from './make-chapter'
const mC = makeChapter(component);

export default {
    title: 'Candidate Status Icon',
    component,
    argTypes: {},
}

export const WithVisibleText = mC({
    value: 1,
    themeColorName: 'colorDeadlineMissed',
    displayText: 'this is visible text',
    visibleText: true
})

export const WithDifferentNumberColor = mC({
    value: 5,
    themeColorName: 'colorSecondary',
    numberColor: '#FFFFFF',
    displayText: 'Total Number of Candidates',
    visibleText: true,
})

export const WithHoverText = mC({
    value: 3,
    themeColorName: 'colorSubmitted',
    displayText: 'this is hover text',
})
