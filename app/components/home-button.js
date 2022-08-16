'use-strict'

import React from 'react'
import SvgHome from '../svgr/home'
import { useSearchParams } from 'react-router-dom'

function HomeButton(props) {
    const { className, style } = props
    const [searchParams, setSearchParams] = useSearchParams()
    return (
        <button
            style={{ border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }}
            onClick={e => setSearchParams({})}
        >
            <SvgHome className={className} style={style} />
        </button>
    )
}

export default HomeButton
