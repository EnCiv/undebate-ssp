"use strict"

import React from "react"
import MagnifyingGlassSVG from "../svgr/magnifying-glass"

const SearchButton = props => {
    const { className, style } = props
    return <MagnifyingGlassSVG className={className} style={style} />
}

export default SearchButton
