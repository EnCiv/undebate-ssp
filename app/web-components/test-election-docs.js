// https://github.com/EnCiv/undebate-ssp/issues/71
import React, { useEffect } from 'react'

export default function TestElectionDoc(props) {
    useEffect(() => {
        socket.emit('get-election-docs', docs => {
            console.log(docs)
        })
    }, [])
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <div style={{ textAlign: 'center' }}>Hello World</div>
        </div>
    )
}