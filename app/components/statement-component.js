import React from 'react'
export default function StatementComponent(props) {
    const { subject, description } = props
    return (
        <div style={{ textAlign: 'center' }}>
            <h1>{subject}</h1>
            <p>{description}</p>
        </div>
    )
}
