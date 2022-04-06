// https://github.com/EnCiv/undebate-ssp/issues/21
import React from 'react'
import ElectionUrgentLiveFilters from '../app/components/election-urgent-live-filters'

export default {
    title: 'Election Urgent Live Filters',
    component: ElectionUrgentLiveFilters,
    argTypes: {},
}

export const Template = (args, context) => {
    const { onDone } = context
    return <ElectionUrgentLiveFilters onDone={onDone} {...args} />
}

// export const ElectionUrgentFilterAfterClick = Template.bind({})
// ElectionUrgentFilterAfterClick.args = {
//     name: 'Urgent filter selected',
// }

// export const ElectionLiveFilterAfterClick = Template.bind({})
// ElectionLiveFilterAfterClick.args = {
//     name: 'Live filter selected',

// }

// export const ElectionNoFiltersClicked = Template.bind({})
// ElectionNoFiltersClicked.args = {
//     name: 'No filter selected'
// }
