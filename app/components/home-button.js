'use-strict'

import React from 'react'
import SvgHome from '../svgr/home'

function HomeButton(props) {
    const { className, style } = props
    return <SvgHome className={className} style={style} />
}

export default HomeButton
