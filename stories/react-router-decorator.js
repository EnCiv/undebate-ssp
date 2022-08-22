// to test components that use react-router-dom this is needed

/* use it like this
...
import ReactRouterDecorator from './react-router-decorator'

export default {
    title: 'StoryName', // This is the Story title that will be displayed in the left column list of stories
    component, // do not change
    decorators: [ReactRouterDecorator],
}
*/
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const ReactRouterDecorator = Story => (
    <BrowserRouter basename={'/iframe.html'}>
        <Routes>
            <Route path='/' element={<Story />}></Route>
        </Routes>
    </BrowserRouter>
)

export default ReactRouterDecorator
