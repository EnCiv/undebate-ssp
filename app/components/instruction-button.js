'use-strict'

import React from 'react'
import SvgBookOpen from '../svgr/book-open'

const InstructionButton = props => {
    const { className, style } = props
    return <SvgBookOpen className={className} style={style} />
}

export default InstructionButton
