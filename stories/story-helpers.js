export const getElectionCandidates = canvas => {
    // gets the electionObj from the global story decorator, converts it to an object, and returns the candidates object
    // this is needed for testing that the electionObj contains the correct data, as stories themselves do not have access to the electionObj (components do but not the story object)
    return JSON.parse(canvas.getByTestId('electionObj').textContent).candidates
}
