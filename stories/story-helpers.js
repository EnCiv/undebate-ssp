export const getElectionCandidates = canvas => {
    // gets the electionObj from the global story decorator, converts it to an object, and returns the candidates object
    return JSON.parse(canvas.getByTestId('electionObj').textContent).candidates
}
