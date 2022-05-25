import React from 'react'
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
                <br />
                <div>Test sheets:</div>
                <div>
                    <a
                        target='_blank'
                        href='https://docs.google.com/spreadsheets/d/1Y2cYAwaleJCcezQNflqG2vN8b9k9kysIxqReGIHNmaQ/edit#gid=0'
                    >
                        Empty Google Sheet
                    </a>
                </div>
                <div>
                    <a
                        target='_blank'
                        href='https://docs.google.com/spreadsheets/d/13nII_UUGznFUA_1kHuT8qXuTGozRlKbphgMdRYO_1os/edit'
                    >
                        Empty List with Headers
                    </a>
                </div>
                <div>
                    <a
                        target='_blank'
                        href='https://docs.google.com/spreadsheets/d/1ARLMmN_5yNgXIUTWH4dNr3nKxquFaProiCu7FTlLHnk/edit#gid=0'
                    >
                        List without Headers
                    </a>
                </div>
                <div>
                    <a
                        target='_blank'
                        href='https://docs.google.com/spreadsheets/d/1K0qt8A25qTVocoVbzVPUEnMRVvEaiq0cE86WmqShRKI/edit#gid=0'
                    >
                        Regular List
                    </a>
                </div>
                <div>
                    <a
                        target='_blank'
                        href='https://docs.google.com/spreadsheets/d/1miEkusFDzkHYAbhgqTkG_ZxEleODLVNHOiuFBGevP1U/edit#gid=0'
                    >
                        List with Unique Ids
                    </a>
                </div>
                <br />
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
