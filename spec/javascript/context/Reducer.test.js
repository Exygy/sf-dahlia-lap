import Reducer, {
  ACTION_TYPE_APPLICATION_LOADED,
  ACTION_TYPE_LEFT_APPLICATION_SCOPE,
  ACTION_TYPE_LEFT_LISTING_SCOPE,
  ACTION_TYPE_SELECTED_APPLICATION_CHANGED,
  ACTION_TYPE_SELECTED_LISTING_CHANGED
} from 'context/Reducer'

const mockState = {
  breadcrumbData: {
    listing: {
      id: 'listingId',
      name: 'listingName',
      buildingAddress: 'listingAddress'
    },
    application: {
      id: 'listingId',
      number: 'listingName',
      applicantFullName: 'jeremy beremy'
    }
  },
  someOtherStateData: {
    someOtherStateKey: 'someOtherStateValue'
  }
}

const mockNewListing = {
  id: 'listingId2',
  name: 'listingName2',
  buildingAddress: 'listingAddress2'
}

const mockNewApplication = {
  id: 'listingId2',
  number: 'listingName2',
  applicantFullName: 'jeremy2 beremy2'
}

const getMockAction = (type, data = null) => ({
  type,
  ...(data && { data })
})

describe('Reducer', () => {
  describe('ACTION_TYPE_SELECTED_LISTING_CHANGED', () => {
    test('should only override the listing data', () => {
      const newState = Reducer(
        mockState,
        getMockAction(ACTION_TYPE_SELECTED_LISTING_CHANGED, mockNewListing)
      )

      expect(newState).toEqual({
        ...mockState,
        breadcrumbData: {
          ...mockState.breadcrumbData,
          listing: mockNewListing
        }
      })
    })

    test('clears out existing address when no address is provided', () => {
      const listingWithoutAddress = {
        id: mockNewListing.id,
        name: mockNewListing.name
      }

      const newState = Reducer(
        mockState,
        getMockAction(ACTION_TYPE_SELECTED_LISTING_CHANGED, listingWithoutAddress)
      )

      expect(newState).toEqual({
        ...mockState,
        breadcrumbData: {
          ...mockState.breadcrumbData,
          listing: listingWithoutAddress
        }
      })
    })
  })

  describe('ACTION_TYPE_LEFT_LISTING_SCOPE', () => {
    test('should only delete listing data', () => {
      const newState = Reducer(mockState, getMockAction(ACTION_TYPE_LEFT_LISTING_SCOPE))

      expect(newState).toEqual({
        ...mockState,
        breadcrumbData: {
          ...mockState.breadcrumbData,
          listing: {
            id: null,
            name: null,
            buildingAddress: null
          }
        }
      })
    })
  })

  describe('ACTION_TYPE_SELECTED_APPLICATION_CHANGED', () => {
    test('should only update application data', () => {
      const newState = Reducer(
        mockState,
        getMockAction(ACTION_TYPE_SELECTED_APPLICATION_CHANGED, mockNewApplication)
      )

      expect(newState).toEqual({
        ...mockState,
        breadcrumbData: {
          ...mockState.breadcrumbData,
          application: mockNewApplication
        }
      })
    })
  })

  describe('ACTION_TYPE_LEFT_APPLICATION_SCOPE', () => {
    test('should only delete application data', () => {
      const newState = Reducer(mockState, getMockAction(ACTION_TYPE_LEFT_APPLICATION_SCOPE))

      expect(newState).toEqual({
        ...mockState,
        breadcrumbData: {
          ...mockState.breadcrumbData,
          application: {
            id: null,
            number: null,
            applicantFullName: null
          }
        }
      })
    })
  })

  describe('ACTION_TYPE_APPLICATION_LOADED', () => {
    test('should override listing and application data', () => {
      const newState = Reducer(
        mockState,
        getMockAction(ACTION_TYPE_APPLICATION_LOADED, {
          application: mockNewApplication,
          listing: mockNewListing
        })
      )

      expect(newState).toEqual({
        ...mockState,
        breadcrumbData: {
          ...mockState.breadcrumbData,
          application: mockNewApplication,
          listing: mockNewListing
        }
      })
    })
  })
})
