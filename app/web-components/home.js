'use strict'

import React from 'react'

const Home = props => {
    const { subject, description } = props
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <div style={{ textAlign: 'center' }}>{subject}</div>
            <div style={{ textAlign: 'center' }}>{description}</div>
            <div style={{ textAlign: 'center' }}>Welcome!</div>
        </div>
    )
}

export default Home
