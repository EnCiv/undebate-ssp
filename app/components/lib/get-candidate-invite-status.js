// TODO: Move functions in navigation-panel.js to here and remove duplicate functionality

export const validStatuses = ['declined', 'accepted', 'deadlineMissed', 'videoSubmitted', 'sent']

// declined and accepted functions not currently implemented

export const getStatus = (candidate, deadline) => {
    const today = new Date()
    const dateDeadline = typeof deadline === 'string' ? new Date(deadline) : deadline
    if (candidate.submissions && Object.keys(candidate.submissions).length) return 'videoSubmitted'
    if (dateDeadline && today.getTime() > dateDeadline.getTime()) return 'deadlineMissed'
    if (candidate.invitations && Object.keys(candidate.invitations).length) return 'sent'
    return ''
}
