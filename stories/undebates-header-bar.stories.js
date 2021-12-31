// https://github.com/EnCiv/undebate-ssp/issues/22

import React, { useState } from 'react'
import UndebatesHeaderBar from '../app/components/undebates-header-bar'

export default {
    title: 'Undebates Header Bar',
    component: UndebatesHeaderBar,
}

const Template = args => {
    const [state, setState] = useState('')
    const dummyElectionOM = [
        'electionObj',
        {
            createNew: () => setState('Creating New Election'),
        },
    ]

    return (
        <>
            <div style={{ background: '#E9EAEB', width: '100%' }}>
                <UndebatesHeaderBar electionOM={dummyElectionOM} {...args} />
            </div>
            <span
                style={{
                    background: 'lightgreen',
                    padding: '1rem',
                    display: state ? 'block' : 'none',
                    textAlign: 'center',
                }}
            >
                {state}
            </span>
        </>
    )
}

export const Default = Template.bind({})
Default.args = {
    user: {
        id: 'unique id',
        email: 'someone@gmail.com',
    },
}

export const LoggedOut = Template.bind({})
LoggedOut.args = {}
