'use-strict'

import React from 'react'
import SvgChevronLeft from '../svgr/chevron-left'
import { useNavigate } from 'react-router-dom'

function BackButton(props) {
    const { className, style } = props
    const navigate = useNavigate()
    return (
        <button
            style={{ border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }}
            onClick={() => navigate(-1)}
        >
            <SvgChevronLeft className={className} style={style} />
        </button>
    )
}

export default BackButton
