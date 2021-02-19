'use strict'

import React from 'react'
import { hot } from 'react-hot-loader'
import WebComponent from '../web-components'
import Footer from './footer'
import ErrorBoundary from '../../node_modules/civil-server/dist/components/error-boundary'

export function App(props){
      var { iota, ...newProps } = props
      Object.assign(newProps, iota)
      return (
        <ErrorBoundary>
          <div style={{ position: 'relative' }}>
            {iota? 
            <WebComponent key="web-component" webComponent={iota.webComponent} {...newProps} /> :
            <div>Nothing Here</div>
            }
            <Footer />
          </div>
        </ErrorBoundary>
      )
}

export default hot(module)(App)
