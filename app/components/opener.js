import React, { useRef } from 'react'

export default function Opener(props) {
    const { classes, answer, active } = props
    const pRef = useRef()
    return (
        <div
            style={{
                overflow: 'hidden',
                maxHeight: active ? (pRef.current.getBoundingClientRect().height || 0) + 'px' : '0px',
                transition: 'all 0.5s linear',
            }}
        >
            <p ref={pRef} className={classes.answerStyle}>
                {answer}
            </p>
        </div>
    )
}
