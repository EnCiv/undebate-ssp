import React from 'react'
import SignUpCom from './signup'
import { Container } from 'react-bootstrap'
// import { AuthProvider } from './AuthContext'
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

const signinAndsignup = () => {
    return (
        <Container className='d-flex align-items-center justify-content-center' style={{ minHeight: '100vh' }}>
            <div className='w-100' style={{ maxWidth: '25rem' }}>
                {/* <Router>
                    <AuthProvider>
                        <Switch>
                            <Route path='/signup' component={SignUpCom} />
                        </Switch>
                    </AuthProvider>
                </Router> */}
                <SignUpCom />
            </div>
        </Container>
    )
}

export default signinAndsignup
