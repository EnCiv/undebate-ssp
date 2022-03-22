import React, { useState } from 'react'

export default function QaCreateModeratorRecorder(props) {
    const { user, subject, id, description } = props
    const [results, setResults] = useState({ rowObjs: [], messages: [] })
    const createModeratorRecorder = e => {
        window.socket.emit('create-moderator-recorder', id, r => setResults(r))
    }
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <div style={{ textAlign: 'center' }}>{subject}</div>
            <div style={{ textAlign: 'center' }}>{description}</div>
            <div style={{ textAlign: 'center' }}>Welcome!</div>
            <div>{JSON.stringify(user, null, 2)}</div>
            <button onClick={createModeratorRecorder}>create moderator recorder</button>
            <div style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(results, null, 2)}</div>
        </div>
    )
}
