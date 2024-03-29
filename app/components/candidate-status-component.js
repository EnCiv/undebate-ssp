// refactored to separate component in https://github.com/EnCiv/undebate-ssp/issues/21
// updated to new icons in https://github.com/EnCiv/undebate-ssp/issues/195
import React from 'react'
import CandidateStatusIcon from "./candidate-status-icon";
import {SvgCompleted} from "./lib/svg";

export default function CandidateStatusComponent({className, style, tableArray, statusObj}) {

    if (statusObj && Object.keys(statusObj).length) {
        if (statusObj.videoSubmitted === statusObj.candidateCount) {
            return <span style={{marginRight: '0.2rem'}}>
                <SvgCompleted/>
            </span>
        } else {
            return (
                <div style={{display: 'flex'}} className={className}>
                    <CandidateStatusIcon value={statusObj.deadlineMissed}
                                         themeColorName={'colorDeadlineMissed'}
                                         displayText={'Deadline Missed'}/>
                    <CandidateStatusIcon value={statusObj.videoSubmitted}
                                         themeColorName={'colorSubmitted'}
                                         displayText={'Video Submitted'}/>
                    <CandidateStatusIcon value={statusObj.sent}
                                         themeColorName={'colorSent'}
                                         displayText={'Invite Pending'}/>
                    <CandidateStatusIcon value={statusObj.candidateCount}
                                         themeColorName={'colorSecondary'}
                                         numberColor={'#FFFFFF'}
                                         displayText={'Total Number of Candidates'}/>
                </div>
            )
        }
    } else {
        return ''
    }
}
