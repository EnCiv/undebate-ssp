// https://github.com/EnCiv/undebate-ssp/issues/21
import React from 'react'
import ElectionUrgentLiveFilters from '../app/components/election-urgent-live-filters'

export default {
    title: 'Election Urgent Live Filters',
    component: ElectionUrgentLiveFilters,
    argTypes: {},
}

const Template = (args, context) => {
    const { onDone } = context
    return <ElectionUrgentLiveFilters onDone={onDone} {...args} />
}

export const ElectionFilterDefault = Template.bind({})
ElectionFilterDefault.args = {}

export const ElectionFilterLargeFontSize = Template.bind({})
ElectionFilterLargeFontSize.args = {
    style: { fontSize: '300%' },
}
