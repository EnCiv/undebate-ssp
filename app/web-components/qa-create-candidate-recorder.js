import React, { useState } from 'react'

export default function QaCreateCandidateRecorder(props) {
    const { user, subject, id, description } = props
    const [results, setResults] = useState({ rowObjs: [], messages: [] })
    const createCandidateRecorder = e => {
        window.socket.emit('create-candidate-recorder', id, r => setResults(r))
    }
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <div style={{ textAlign: 'center' }}>{subject}</div>
            <div style={{ textAlign: 'center' }}>{description}</div>
            <div style={{ textAlign: 'center' }}>Welcome!</div>
            <div>{JSON.stringify(user, null, 2)}</div>
            <button onClick={createCandidateRecorder}>create candidate recorder</button>
            <div style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(results, null, 2)}</div>
        </div>
    )
}
