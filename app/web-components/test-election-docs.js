import React from 'react'

export default function TestElectionDocs(props) {
    socket.emit('get-election-docs', docs => {
        console.log(docs)
    })
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <div style={{ textAlign: 'center' }}>Hello World</div>
        </div>
    )
}
