import React from 'react'
import UndebateHomepage from '../components/undebate-homepage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// don't load StaticRouter if running on the browser
let StaticRouter
if (typeof window === 'undefined') StaticRouter = require('react-router-dom/server').StaticRouter
const ReactRouter = typeof window === 'undefined' ? StaticRouter : BrowserRouter

// props.path is the path from the iota that brought us here
// in storybook stories props.path should be "/iframe.html" because it is running within an iframe
// but the path/location won't be visible in the address bar of the browser, but browser forward and backward will work
// and setting the searchParams
export default function undebatesHomepage(props) {
    return (
        <ReactRouter location={props.location} basename={props.path}>
            <Routes>
                <Route path='/' element={<UndebateHomepage {...props} />}></Route>
            </Routes>
        </ReactRouter>
    )
}
