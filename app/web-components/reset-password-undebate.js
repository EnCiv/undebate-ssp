import React, {useEffect, useState} from 'react'
import { createUseStyles } from "react-jss";
import ClientResetPassword from '../components/reset-password'

export default function ResetPasswordUndebate() {
    const classes = useStyles()
    const [params, setParams] = useState(null)

    useEffect(() => {
        setParams(new URLSearchParams(document.location.search))
    }, [])

    return (
        <div className={classes.wrapper}>
            <div className={classes.centeredWrapper}>
                <ClientResetPassword activationToken={params?.get('t') || ''} returnTo={params?.get('p') || ''} />
            </div>
        </div>
    )
}

const useStyles = createUseStyles({
    wrapper: {
        width: '100vw',
        minHeight: '100vh',
        textAlign: 'center',
        verticalAlign: 'middle',
    },
    centeredWrapper: {
        top: '50%',
        left: '50%',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
    },
})
