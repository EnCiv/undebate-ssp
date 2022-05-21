// https://github.com/EnCiv/undebate-ssp/issues/54
// https://github.com/EnCiv/undebate-ssp/issues/55
import ObjectID from 'isomorphic-mongo-objectid'

const REQUIRED_COLUMNS = ['name', 'email', 'office']

// helper methods used for upload csv and paste google sheets components
const isEmptyTable = electionObj => {
    return !(electionObj && electionObj.candidates !== undefined && Object.keys(electionObj.candidates).length > 0)
}

const handleEmptyElectionTable = (tableData, electionMethods) => {
    tableData.forEach(rowObj => {
        if (!Object.keys(rowObj).includes('uniqueId')) {
            rowObj.uniqueId = ObjectID().toString()
        }

        electionMethods.upsert({ candidates: { [rowObj.uniqueId]: rowObj } })
    })
}

const handleExistingTable = (tableData, electionObj, electionMethods) => {
    // at this point assume electionObj and candidates exist
    tableData.forEach(rowObj => {
        if (!Object.keys(rowObj).includes('uniqueId')) {
            let matchingCandidateId = null
            Object.values(electionObj.candidates).every(cand => {
                if (cand.email === rowObj.email) {
                    matchingCandidateId = cand.uniqueId
                    return false
                }
                return true
            })
            if (!matchingCandidateId) {
                // have to do this as a separate loop so that we don't incorrectly merge two candidates with the same name
                Object.values(electionObj.candidates).every(cand => {
                    if (cand.name === rowObj.name && cand.office === rowObj.office) {
                        // note that this could produce unexpected behavior if two people with the same name are running for office and one of them changes their email
                        matchingCandidateId = cand.uniqueId
                        return false
                    }
                    return true
                })
            }
            if (matchingCandidateId) {
                rowObj.uniqueId = matchingCandidateId
            } else {
                rowObj.uniqueId = ObjectID().toString()
            }
        }

        electionMethods.upsert({ candidates: { [rowObj.uniqueId]: rowObj } })
    })
}

export const handleTableData = (tableData, electionOM) => {
    const [electionObj, electionMethods] = electionOM

    if (isEmptyTable(electionObj)) {
        handleEmptyElectionTable(tableData, electionMethods)
    } else {
        handleExistingTable(tableData, electionObj, electionMethods)
    }
}

export const validateHeaders = headers => {
    return REQUIRED_COLUMNS.every(reqCol => headers.includes(reqCol))
}

export const mapRowsToObjects = (headers, rows) => {
    const data = []
    rows.forEach(row => {
        data.push(
            row.reduce((rowObj, item, idx) => {
                rowObj[headers[idx]] = item
                return rowObj
            }, {})
        )
    })
    return data
}
