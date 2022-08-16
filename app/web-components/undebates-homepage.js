import React, { useCallback } from 'react'
import UndebateHomepage from '../components/undebate-homepage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// don't load StaticRouter if running on the browser
let StaticRouter
if (typeof window === 'undefined') StaticRouter = require('react-router-dom/server').StaticRouter
const ReactRouter = typeof window === 'undefined' ? StaticRouter : BrowserRouter

// props.path is the path from the iota that brought us here
export default function undebatesHomepage(props) {
    return (
        <ReactRouter location={props.location} basename={props.path}>
            <Routes>
                <Route path='/' element={<UndebateHomepage {...props} />}></Route>
            </Routes>
        </ReactRouter>
    )
}
