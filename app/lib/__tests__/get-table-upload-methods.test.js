import { handleTableData } from '../get-table-upload-methods'
import { merge } from 'lodash'

describe('table upload methods', () => {
    describe('empty table', () => {
        let state
        let electionOM

        beforeEach(() => {
            state = { _count: 0 }
            electionOM = [
                state,
                {
                    upsert(obj) {
                        state = merge({}, state, obj, { _count: state._count + 1 })
                    },
                },
            ]
        })

        it('empty tableData list passed in', () => {
            handleTableData([], electionOM)
            expect(state.candidates).toBeUndefined()
        })
        it('with tableData, no uniqueIds', () => {
            const tableData = [
                {
                    name: 'Elize Vance',
                    email: 'elize.vance@example.com',
                    office: 'New Office',
                },
            ]
            handleTableData(tableData, electionOM)
            expect(Object.values(state.candidates).length).toBe(1)
        })
        it('with tableData, with uniqueIds', () => {
            const tableData = [
                {
                    uniqueId: '61e34ba4dd28d45f2c6c66be',
                    name: 'Elijah Cote',
                    email: 'elijah.cote@example.com',
                    office: 'New Office',
                },
            ]
            handleTableData(tableData, electionOM)
            expect(state.candidates).toEqual({
                '61e34ba4dd28d45f2c6c66be': {
                    uniqueId: '61e34ba4dd28d45f2c6c66be',
                    name: 'Elijah Cote',
                    email: 'elijah.cote@example.com',
                    office: 'New Office',
                },
            })
        })
    })

    describe('with candidates in table', () => {
        let state
        let electionOM

        beforeEach(() => {
            state = {
                _count: 0,
                candidates: {
                    '61e34ba4dd28d45f2c6c66be': {
                        name: 'Diana Russell',
                        email: 'felicia.reid@example.com',
                        office: 'Posuere sed',
                        region: 'Fermentum massa',
                        status: 'Send 12 days ago',
                        uniqueId: '61e34ba4dd28d45f2c6c66be',
                    },
                    '61e34bb17ad05c2b9003f600': {
                        name: 'Jacob Jones',
                        email: 'nevaeh.simmons@example.com',
                        office: 'Eu at',
                        region: 'Amet sodales',
                        status: 'Send 12 days ago',
                        uniqueId: '61e34bb17ad05c2b9003f600',
                    },
                },
            }
            electionOM = [
                state,
                {
                    upsert(obj) {
                        state = merge({}, state, obj, { _count: state._count + 1 })
                    },
                },
            ]
        })

        it('empty tableData list passed in', () => {
            handleTableData([], electionOM)
            expect(state.candidates).toEqual({
                '61e34ba4dd28d45f2c6c66be': {
                    name: 'Diana Russell',
                    email: 'felicia.reid@example.com',
                    office: 'Posuere sed',
                    region: 'Fermentum massa',
                    status: 'Send 12 days ago',
                    uniqueId: '61e34ba4dd28d45f2c6c66be',
                },
                '61e34bb17ad05c2b9003f600': {
                    name: 'Jacob Jones',
                    email: 'nevaeh.simmons@example.com',
                    office: 'Eu at',
                    region: 'Amet sodales',
                    status: 'Send 12 days ago',
                    uniqueId: '61e34bb17ad05c2b9003f600',
                },
            })
        })
        describe('with tableData, no uniqueIds', () => {
            it('no match', () => {
                const tableData = [
                    {
                        name: 'Elijah Cote',
                        email: 'elijah.cote@example.com',
                        office: 'New Office',
                    },
                ]
                handleTableData(tableData, electionOM)
                expect(Object.values(state.candidates).length).toBe(3)
            })
            it('match on email', () => {
                const tableData = [
                    {
                        name: 'Diana Johnson',
                        email: 'felicia.reid@example.com',
                        office: 'Posuere sed',
                    },
                ]
                handleTableData(tableData, electionOM)
                expect(state.candidates).toEqual({
                    '61e34ba4dd28d45f2c6c66be': {
                        name: 'Diana Johnson',
                        email: 'felicia.reid@example.com',
                        office: 'Posuere sed',
                        region: 'Fermentum massa',
                        status: 'Send 12 days ago',
                        uniqueId: '61e34ba4dd28d45f2c6c66be',
                    },
                    '61e34bb17ad05c2b9003f600': {
                        name: 'Jacob Jones',
                        email: 'nevaeh.simmons@example.com',
                        office: 'Eu at',
                        region: 'Amet sodales',
                        status: 'Send 12 days ago',
                        uniqueId: '61e34bb17ad05c2b9003f600',
                    },
                })
            })
            it('match on name and office', () => {
                const tableData = [
                    {
                        name: 'Diana Russell',
                        email: 'my.new.email@example.com',
                        office: 'Posuere sed',
                    },
                ]
                handleTableData(tableData, electionOM)
                expect(state.candidates).toEqual({
                    '61e34ba4dd28d45f2c6c66be': {
                        name: 'Diana Russell',
                        email: 'my.new.email@example.com',
                        office: 'Posuere sed',
                        region: 'Fermentum massa',
                        status: 'Send 12 days ago',
                        uniqueId: '61e34ba4dd28d45f2c6c66be',
                    },
                    '61e34bb17ad05c2b9003f600': {
                        name: 'Jacob Jones',
                        email: 'nevaeh.simmons@example.com',
                        office: 'Eu at',
                        region: 'Amet sodales',
                        status: 'Send 12 days ago',
                        uniqueId: '61e34bb17ad05c2b9003f600',
                    },
                })
            })
        })
        describe('with tableData, with uniqueIds', () => {
            it('no match', () => {
                const tableData = [
                    {
                        uniqueId: '61e34bb17ad05c2b9003f601',
                        name: 'Elijah Cote',
                        email: 'elijah.cote@example.com',
                        office: 'New Office',
                    },
                ]
                handleTableData(tableData, electionOM)
                expect(state.candidates).toEqual({
                    '61e34ba4dd28d45f2c6c66be': {
                        name: 'Diana Russell',
                        email: 'felicia.reid@example.com',
                        office: 'Posuere sed',
                        region: 'Fermentum massa',
                        status: 'Send 12 days ago',
                        uniqueId: '61e34ba4dd28d45f2c6c66be',
                    },
                    '61e34bb17ad05c2b9003f600': {
                        name: 'Jacob Jones',
                        email: 'nevaeh.simmons@example.com',
                        office: 'Eu at',
                        region: 'Amet sodales',
                        status: 'Send 12 days ago',
                        uniqueId: '61e34bb17ad05c2b9003f600',
                    },
                    '61e34bb17ad05c2b9003f601': {
                        uniqueId: '61e34bb17ad05c2b9003f601',
                        name: 'Elijah Cote',
                        email: 'elijah.cote@example.com',
                        office: 'New Office',
                    },
                })
            })
            it('match on uniqueId', () => {
                const tableData = [
                    {
                        uniqueId: '61e34bb17ad05c2b9003f600',
                        name: 'New Name',
                        email: 'new.email@example.com',
                        office: 'New Office',
                    },
                ]
                handleTableData(tableData, electionOM)
                expect(state.candidates).toEqual({
                    '61e34ba4dd28d45f2c6c66be': {
                        name: 'Diana Russell',
                        email: 'felicia.reid@example.com',
                        office: 'Posuere sed',
                        region: 'Fermentum massa',
                        status: 'Send 12 days ago',
                        uniqueId: '61e34ba4dd28d45f2c6c66be',
                    },
                    '61e34bb17ad05c2b9003f600': {
                        name: 'New Name',
                        email: 'new.email@example.com',
                        office: 'New Office',
                        region: 'Amet sodales',
                        status: 'Send 12 days ago',
                        uniqueId: '61e34bb17ad05c2b9003f600',
                    },
                })
            })
        })
    })
})
