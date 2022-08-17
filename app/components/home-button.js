'use-strict'

import React from 'react'
import SvgHome from '../svgr/home'
import { useSearchParams } from 'react-router-dom'

// don't setSearchParams({}) because other things, like storybook may be setting search params too

function HomeButton(props) {
    const { className, style } = props
    const [searchParams, setSearchParams] = useSearchParams()
    return (
        <button
            style={{ border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }}
            onClick={e => setSearchParams((searchParams.delete('eid'), searchParams.delete('tab'), searchParams))}
        >
            <SvgHome className={className} style={style} />
        </button>
    )
}

export default HomeButton
