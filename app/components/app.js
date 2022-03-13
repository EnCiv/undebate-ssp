/* eslint-disable react/jsx-props-no-spreading */

import React from 'react'
import { hot } from 'react-hot-loader'
import { ErrorBoundary } from 'civil-client'
import WebComponents from '../web-components'
import Footer from './footer'
import 'bootstrap/dist/css/bootstrap.min.css'

//import '../../assets/styles/index.css'

// eslint-disable-next-line react/prefer-stateless-function
class App extends React.Component {
    render() {
        // eslint-disable-next-line react/destructuring-assignment
        if (this.props.iota) {
            // eslint-disable-next-line prefer-const
            let { iota, ...newProps } = this.props
            Object.assign(newProps, iota)
            return (
                <ErrorBoundary>
                    <div style={{ position: 'relative' }}>
                        <WebComponents key='web-component' webComponent={iota.webComponent} {...newProps} />
                        <Footer key='footer' />
                    </div>
                </ErrorBoundary>
            )
        } else
            return (
                <ErrorBoundary>
                    <div style={{ position: 'relative' }}>
                        <div>Nothing Here</div>
                        <Footer />
                    </div>
                </ErrorBoundary>
            )
    }
}

export default hot(module)(App)
