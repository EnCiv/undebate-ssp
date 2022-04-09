import React, { useEffect } from 'react'

export default function makeChapter(Component) {
    return args => {
        const test = (args, context) => {
            // logger is used on the browser by civil-client apis - dummy it out
            if (typeof global.logger === 'undefined') global.logger = console

            // simulate socket for useAuth
            useEffect(() => {
                window.socket = {
                    emit: (handle, email, href, cb) => {
                        if (handle !== 'send-password') console.error('emit expected send-password, got:', handle)
                        if (email === 'success@email.com') setTimeout(() => cb({ error: '' }), 1000)
                        else setTimeout(() => cb({ error: 'User not found' }), 1000)
                    },
                    // when user authenticates socket io needs to close and then connect to authenticate the user
                    // so we simulate that here
                    onHandlers: {},
                    on: (handle, handler) => {
                        window.socket.onHandlers[handle] = handler
                    },
                    close: () => {
                        if (window.socket.onHandlers.connect) setTimeout(window.socket.onHandlers.connect, 1000)
                        else console.error('No connect handler registered')
                    },
                    removeListener: () => {},
                }
            }, [])

            // simulate electionOM and onDone
            const { onDone, electionOM } = context
            const [electionObj, electionMethods] = electionOM
            const { defaultElectionObj, customMethods = {}, ...otherArgs } = args
            Object.assign(electionMethods, customMethods)
            useEffect(() => electionMethods.upsert(defaultElectionObj), [defaultElectionObj])

            return <Component onDone={onDone} electionOM={electionOM} {...args} />
        }
        test.args = args
        return test
    }
}
