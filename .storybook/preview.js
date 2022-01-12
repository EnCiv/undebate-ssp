import React, { useState } from 'react'
import { ThemeProvider } from 'react-jss'
import '../assets/styles/index.css'
import theme from '../app/theme'
import { merge } from 'lodash'

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
}

export const decorators = [
    Story => {
        const [done, setDone] = useState({ valid: undefined, value: undefined })
        const [electionObj, setElectionObj] = useState({})
        const electionMethods = {
            upsert(obj) {
                setElectionObj(merge({}, electionObj, obj))
            },
            areQuestionsLocked() {
                return electionObj._electionsLocked
            },
            sendInvitation() {
                setElectionObj(merge({}, electionObj, { _sendInvitation: (electionObj._sendInvitation || 0) + 1 }))
            },
        }
        const electionOM = [electionObj, electionMethods]
        return (
            <ThemeProvider theme={theme}>
                <div>
                    <Story onDone={setDone} electionOM={electionOM} />
                </div>
                {typeof done.valid !== 'undefined' && <div>onDone:{JSON.stringify(done, null, 2)}</div>}
                {typeof electionObj._sendInvitation !== 'undefined' && (
                    <div>sendInvitation: {electionObj._sendInvitation}</div>
                )}
            </ThemeProvider>
        )
    },
]
