import { createActions } from 'context/leaseUpActionCreators'
import {
  ACTION_TYPE_APPLICATION_LOADED,
  ACTION_TYPE_LEFT_APPLICATION_SCOPE,
  ACTION_TYPE_LEFT_LISTING_SCOPE,
  ACTION_TYPE_SELECTED_APPLICATION_CHANGED,
  ACTION_TYPE_SELECTED_LISTING_CHANGED
} from 'context/Reducer'

const mockDispatch = jest.fn()

const mockApplication = {
  id: 'mockId1',
  name: 'APP 1',
  applicant: {
    first_name: 'firstName1',
    last_name: 'lastName1'
  }
}

const mockFormattedApplication = {
  id: mockApplication.id,
  number: mockApplication.name,
  applicantFullName: `${mockApplication.applicant.first_name} ${mockApplication.applicant.last_name}`
}

const mockListingWithoutAddress = {
  id: 'listingId1',
  name: 'listingName1'
}

const mockListing = {
  ...mockListingWithoutAddress,
  building_street_address: 'listingAddress1'
}

const mockFormattedListingWithoutAddress = {
  id: mockListing.id,
  name: mockListing.name,
  buildingAddress: undefined
}

const mockFormattedListing = {
  ...mockFormattedListingWithoutAddress,
  buildingAddress: mockListing.building_street_address
}

describe('leaseUpActionCreators', () => {
  let actions
  beforeEach(() => {
    actions = createActions(mockDispatch)
  })

  const getDispatchedAction = () => mockDispatch.mock.calls[0][0]

  describe('supplementalPageLoadComplete', () => {
    test('dispatches correct action', () => {
      actions.supplementalPageLoadComplete(mockApplication, mockListing)

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTION_TYPE_APPLICATION_LOADED)
      expect(dispatchedAction.data).toEqual({
        application: mockFormattedApplication,
        listing: mockFormattedListing
      })
    })

    test('dispatches correct action with null input', () => {
      actions.supplementalPageLoadComplete(null, null)

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTION_TYPE_APPLICATION_LOADED)
      expect(dispatchedAction.data).toEqual({
        application: {
          id: undefined,
          number: undefined,
          applicantFullName: undefined
        },
        listing: {
          id: undefined,
          name: undefined,
          buildingAddress: undefined
        }
      })
    })
  })

  describe('applicationPageLoadComplete', () => {
    test('dispatches correct action', () => {
      const mockApplicationFromShortformPage = {
        ...mockApplication,
        applicant: {
          name: 'firstName1 middlename1 lastname1'
        }
      }

      const expectedApplication = {
        ...mockFormattedApplication,
        applicantFullName: 'firstName1 middlename1 lastname1'
      }

      actions.applicationPageLoadComplete(mockApplicationFromShortformPage, mockListing)

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTION_TYPE_APPLICATION_LOADED)
      expect(dispatchedAction.data).toEqual({
        application: expectedApplication,
        listing: mockFormattedListing
      })
    })

    test('dispatches correct action with null input', () => {
      actions.applicationPageLoadComplete(null, null)

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTION_TYPE_APPLICATION_LOADED)
      expect(dispatchedAction.data).toEqual({
        application: {
          id: undefined,
          number: undefined,
          applicantFullName: undefined
        },
        listing: {
          id: undefined,
          name: undefined,
          buildingAddress: undefined
        }
      })
    })
  })

  describe('applicationsPageMounted', () => {
    test('dispatches correct action', () => {
      actions.applicationsPageMounted()

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTION_TYPE_LEFT_APPLICATION_SCOPE)
      expect(dispatchedAction.data).toBeUndefined()
    })
  })

  describe('listingsPageMounted', () => {
    test('dispatches correct action', () => {
      actions.listingsPageMounted()

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTION_TYPE_LEFT_LISTING_SCOPE)
      expect(dispatchedAction.data).toBeUndefined()
    })
  })

  describe('applicationsPageLoadComplete', () => {
    test('dispatches correct action', () => {
      actions.applicationsPageLoadComplete(mockListing)

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTION_TYPE_SELECTED_LISTING_CHANGED)
      expect(dispatchedAction.data).toEqual(mockFormattedListing)
    })

    test('dispatches correct action with null input', () => {
      actions.applicationsPageLoadComplete(null)

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTION_TYPE_SELECTED_LISTING_CHANGED)
      expect(dispatchedAction.data).toEqual({
        id: undefined,
        name: undefined,
        buildingAddress: undefined
      })
    })
  })

  describe('listingRowClicked', () => {
    test('dispatches correct action', () => {
      actions.listingRowClicked(mockListingWithoutAddress)

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTION_TYPE_SELECTED_LISTING_CHANGED)
      expect(dispatchedAction.data).toEqual(mockFormattedListingWithoutAddress)
    })

    test('dispatches correct action with null input', () => {
      actions.listingRowClicked(null)

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTION_TYPE_SELECTED_LISTING_CHANGED)
      expect(dispatchedAction.data).toEqual({
        id: undefined,
        name: undefined,
        buildingAddress: undefined
      })
    })
  })

  describe('applicationRowClicked', () => {
    test('dispatches correct action', () => {
      const mockApplicationFromApplicationsPage = {
        application_id: mockApplication.id,
        application_number: mockApplication.name,
        first_name: mockApplication.applicant.first_name,
        last_name: mockApplication.applicant.last_name
      }

      actions.applicationRowClicked(mockApplicationFromApplicationsPage)

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTION_TYPE_SELECTED_APPLICATION_CHANGED)
      expect(dispatchedAction.data).toEqual(mockFormattedApplication)
    })

    test('dispatches correct action with null input', () => {
      actions.applicationRowClicked(null)

      const dispatchedAction = getDispatchedAction()

      expect(dispatchedAction.type).toEqual(ACTION_TYPE_SELECTED_APPLICATION_CHANGED)
      expect(dispatchedAction.data).toEqual({
        id: undefined,
        number: undefined,
        applicantFullName: undefined
      })
    })
  })
})
