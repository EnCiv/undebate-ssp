import React, { useContext, useState, useEffect } from 'react'
import { auth } from './firebase'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password)
    }

    useEffect(() => {
        const unsubcribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubcribe
    }, [])

    const value = {
        currentUser,
        signup,
    }

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
