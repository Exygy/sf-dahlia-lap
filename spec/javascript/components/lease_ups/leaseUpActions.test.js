import {
  convertToCommaSeparatedList,
  getApplications,
  sanitizeAndFormatSearch
} from '~/components/lease_ups/leaseUpActions'

const mockFetchLeaseUpApplications = jest.fn()

jest.mock('apiService', () => {
  return {
    fetchLeaseUpApplications: async (listingId, page, { filters }) => {
      mockFetchLeaseUpApplications(listingId, page, { filters })
      const sampleRowResponse = {
        application: {
          name: 'APP-00548121',
          id: 'a0o0P00000JlWi9QAF',
          general_lottery: false,
          general_lottery_rank: null,
          applicant: {
            first_name: 'Vincent',
            last_name: 'Rogers',
            email: 'christopher60@example.org',
            phone: '(845)136-8280',
            residence_address: '',
            mailing_address: '',
            name: 'Vincent Rogers'
          },
          has_ada_priorities_selected: null,
          processing_status: 'Disqualified',
          demographics: {},
          status_last_updated: '2020-05-28T21:23:06.000+0000'
        },
        preference_order: 3,
        receives_preference: true,
        preference_all_lottery_rank: 1,
        post_lottery_validation: 'Confirmed',
        preference_lottery_rank: 1,
        record_type_for_app_preferences: 'L_W',
        preference_name: 'Live or Work in San Francisco Preference'
      }
      return { pages: 10, records: [sampleRowResponse] }
    }
  }
})

const fakeListingId = 'listing_id'

describe('leaseUpActions', () => {
  describe('convertToCommaSeparatedList', () => {
    test('it returns a single word if provided', () => {
      expect(convertToCommaSeparatedList('test')).toEqual('test')
    })
    test('it turns phrases separated with spaces into a comma separated string list', () => {
      expect(convertToCommaSeparatedList('test1 test2 test3')).toEqual('test1,test2,test3')
    })
    test('it strips out excess spaces as expected', () => {
      expect(convertToCommaSeparatedList('test ')).toEqual('test')
      expect(convertToCommaSeparatedList(' test ')).toEqual('test')
      expect(convertToCommaSeparatedList('test  ')).toEqual('test')
      expect(convertToCommaSeparatedList('test  test2')).toEqual('test,test2')
    })
    test("it returns as expected when there's a nullish input", () => {
      expect(convertToCommaSeparatedList('')).toBeFalsy()
      expect(convertToCommaSeparatedList(null)).toBeFalsy()
    })
  })
  describe('sanitizeAndFormatSearch', () => {
    test('it removes double quotes from search strings', () => {
      expect(sanitizeAndFormatSearch('"John"')).toEqual('John')
      expect(sanitizeAndFormatSearch('"John Doe"')).toEqual('John,Doe')
    })
    test('it removes single quotes from search strings', () => {
      expect(sanitizeAndFormatSearch("'John'")).toEqual('John')
      expect(sanitizeAndFormatSearch("'John Doe'")).toEqual('John,Doe')
    })
  })
  describe('getApplications', () => {
    test('it makes the expected apiService request when no filters are provided', () => {
      getApplications(fakeListingId, 0)
      expect(mockFetchLeaseUpApplications).toHaveBeenCalledWith(fakeListingId, 0, {
        filters: undefined
      })
    })
    test('it formats returned data as expected', async () => {
      const expectedRowData = {
        application_id: 'a0o0P00000JlWi9QAF',
        application_number: 'APP-00548121',
        application_preference_id: undefined,
        email: 'christopher60@example.org',
        first_name: 'Vincent',
        has_ada_priorities_selected: null,
        last_name: 'Rogers',
        lease_up_status: 'Disqualified',
        mailing_address: '',
        phone: '(845)136-8280',
        post_lottery_validation: 'Confirmed',
        preference_lottery_rank: 1,
        preference_order: 3,
        preference_record_type: 'L_W',
        residence_address: '',
        status_last_updated: '2020-05-28T21:23:06.000+0000'
      }

      const expectedResults = { records: [expectedRowData], pages: 10 }
      expect(await getApplications(fakeListingId, 0)).toEqual(expectedResults)
    })

    test('it passes filters to the apiService as expected', () => {
      const fakeFilters = { filter1: 'something', filter2: 'something else' }
      getApplications(fakeListingId, 0, fakeFilters)
      expect(mockFetchLeaseUpApplications).toHaveBeenCalledWith(fakeListingId, 0, {
        filters: fakeFilters
      })
    })
    test('it reformats search strings as expected', () => {
      const fakeFilters = { filter1: 'something', search: 'word1 word2' }
      const expectedFilters = {
        filter1: 'something',
        search: convertToCommaSeparatedList('word1 word2')
      }
      getApplications(fakeListingId, 0, fakeFilters)
      expect(mockFetchLeaseUpApplications).toHaveBeenCalledWith(fakeListingId, 0, {
        filters: expectedFilters
      })
    })
  })
})
