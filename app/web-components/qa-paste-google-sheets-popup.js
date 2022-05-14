import React, { useState } from 'react'
import { ThemeProvider } from 'react-jss'
import useMethods from 'use-methods'
import theme from '../theme'
import { merge } from 'lodash'
import PasteGoogleSheetsPopup from '../components/paste-google-sheets-popup'
import getElectionStatusMethods from '../lib/get-election-status-methods'

export default function QaPasteGoogleSheetsPopup(props) {
    const { user, subject, id, description } = props
    const electionOM = useMethods(
        (dispatch, state) => ({
            ...getElectionStatusMethods(dispatch, state),
            upsert(obj) {
                dispatch(merge({}, state, obj, { _count: state._count + 1 }))
            },
        }),
        { _count: 0 }
    )
    const [electionObj, electionMethods] = electionOM

    return (
        <ThemeProvider theme={theme}>
            <div>
                <div style={{ textAlign: 'center' }}>{subject}</div>
                <div style={{ textAlign: 'center' }}>{description}</div>
                <div style={{ textAlign: 'center' }}>Welcome!</div>
                <div>Current user: {JSON.stringify(user, null, 2)}</div>
                <PasteGoogleSheetsPopup
                    electionOM={electionOM}
                    visible={true}
                    closePopup={() => console.log('close popup called')}
                />
            </div>
            {electionObj._count > 0 && (
                <div>
                    electionObj:{' '}
                    <span id='electionObj' data-testid='electionObj' style={{ whitespace: 'pre-wrap' }}>
                        {JSON.stringify(electionObj, null, 4)}
                    </span>
                </div>
            )}
        </ThemeProvider>
    )
}
