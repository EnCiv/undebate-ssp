'use-strict'

import React from 'react'
import SvgBookOpen from '../svgr/book-open'

function InstructionButton(props) {
    const { className, style } = props
    return <SvgBookOpen className={className} style={style} />
}

export default InstructionButton
