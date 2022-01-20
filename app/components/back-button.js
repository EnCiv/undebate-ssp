'use-strict'

import React from 'react'
import SvgChevronLeft from '../svgr/chevron-left'

function BackButton(props) {
    const { className, style } = props
    return <SvgChevronLeft className={className} style={style} />
}

export default BackButton
