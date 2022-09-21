import React from 'react'
import ScaleLoader from 'react-spinners/ScaleLoader'
import theme from '../theme'

export default function Spinner(props) {
    const { className, style } = props
    return (
        <div
            className={className}
            style={{
                width: '100%',
                height: 'auto%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...style,
            }}
        >
            <ScaleLoader color={theme.colorPrimary} loading={true} height='5em' width='.3em' radius='.3em' />
        </div>
    )
}
