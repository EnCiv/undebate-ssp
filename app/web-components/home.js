import React from 'react'

export default function Home(props) {
    const { subject, description } = props
    return (
        <div>
            <div style={{ textAlign: 'center' }}>{subject}</div>
            <div style={{ textAlign: 'center' }}>{description}</div>
            <div style={{ textAlign: 'center' }}>Welcome!</div>
        </div>
    )
}
