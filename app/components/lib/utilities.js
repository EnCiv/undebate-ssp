// TODO: Move functions in navigation-panel.js to here and remove duplicate functionality

export const recentInvitation = invitations => {
    if (invitations == null || invitations.length === 0) {
        return null
    }
    let recent = invitations[0]
    invitations.forEach(invitation => {
        if (new Date(invitation?.responseDate).getTime() > new Date(recent?.responseDate).getTime()) {
            recent = invitation
        }
    })
    return recent
}

const properStatus = {
    videosubmitted: 'videoSubmitted',
    deadlinemissed: 'deadlineMissed',
    submitted: 'videoSubmitted',
}

export const validStatuses = ['declined', 'accepted', 'deadlineMissed', 'videoSubmitted', 'sent']

export const getStatus = (candidate, deadline) => {
    const today = new Date()
    const dateDeadline = typeof deadline === 'string' ? new Date(deadline) : deadline

    if (candidate?.submissions != null && candidate?.submissions.length !== 0) {
        return 'videoSubmitted'
    }
    const status = recentInvitation(candidate.invitations)?.status
    const normalStatus = properStatus[status.toLowerCase()] ?? status.toLowerCase()
    if (today.getTime() > dateDeadline.getTime() && normalStatus === 'accepted') {
        return 'deadlineMissed'
    }
    return validStatuses.includes(normalStatus) ? normalStatus : status
}
