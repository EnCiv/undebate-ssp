import React from 'react'
import UndebateHomepage from '../components/undebate-homepage'

export default function undebatesHomepage(props) {
    const { user } = props
    return (
        <div style={{ width: '100vw', minHeight: '100vh' }}>
            <UndebateHomepage user={user} />
        </div>
    )
}
