import { handleTableData, validateHeaders, mapRowsToObjects } from '../get-table-upload-methods'
import { merge } from 'lodash'

describe('table upload methods', () => {
    describe('handleTableData empty table', () => {
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

    describe('handleTableData with candidates in table', () => {
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

    describe('validate headers', () => {
        it('empty list', () => {
            expect(validateHeaders([])).toBeFalsy()
        })

        it('missing all headers', () => {
            expect(validateHeaders(['stuff', 'things', 'foo'])).toBeFalsy()
        })

        it('missing one header', () => {
            expect(validateHeaders(['name', 'email'])).toBeFalsy()
        })

        it('none missing', () => {
            expect(validateHeaders(['name', 'email', 'office'])).toBeTruthy()
        })

        it('extra columns', () => {
            expect(validateHeaders(['name', 'stuff', 'email', 'things', 'foo', 'office', 'uniqueId'])).toBeTruthy()
        })
    })

    describe('mapRowsToObjects', () => {
        it('empty lists', () => {
            expect(mapRowsToObjects([], [])).toEqual([])
        })

        it('empty rows', () => {
            expect(mapRowsToObjects(['name', 'email', 'office'], [])).toEqual([])
        })

        it('one row', () => {
            expect(
                mapRowsToObjects(['name', 'email', 'office'], [['John Smith', 'john.smith@example.com', 'Foo bar']])
            ).toEqual([{ name: 'John Smith', email: 'john.smith@example.com', office: 'Foo bar' }])
        })

        it('different order', () => {
            expect(
                mapRowsToObjects(
                    ['office', 'name', 'email'],
                    [['Foo bar office', 'John Smith', 'john.smith@example.com']]
                )
            ).toEqual([{ name: 'John Smith', email: 'john.smith@example.com', office: 'Foo bar office' }])
        })

        it('multiple rows', () => {
            expect(
                mapRowsToObjects(
                    ['name', 'email', 'office'],
                    [
                        ['John Smith', 'john.smith@example.com', 'Foo bar'],
                        ['Carolyn Jefferson', 'carjeff@example.edu', 'Potus'],
                    ]
                )
            ).toEqual([
                { name: 'John Smith', email: 'john.smith@example.com', office: 'Foo bar' },
                { name: 'Carolyn Jefferson', email: 'carjeff@example.edu', office: 'Potus' },
            ])
        })
    })
})
