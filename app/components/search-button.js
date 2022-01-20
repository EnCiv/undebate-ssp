import React from 'react'
import MagnifyingGlassSVG from '../svgr/magnifying-glass'

function SearchButton(props) {
    const { className, style } = props
    return <MagnifyingGlassSVG className={className} style={style} />
}

export default SearchButton
