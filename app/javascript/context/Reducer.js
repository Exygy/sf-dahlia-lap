/**
 * Action Definitions below. Actions should be named ACTION_<NAME> where
 * <NAME> is a noun describing an event that happened (past tense).
 */
export const ACTION_TYPE_SELECTED_LISTING_CHANGED = 'SET_CURRENT_LISTING'
export const ACTION_TYPE_SELECTED_APPLICATION_CHANGED = 'SET_CURRENT_APPLICATION'
export const ACTION_TYPE_LEFT_LISTING_SCOPE = 'CLEAR_CURRENT_LISTING'
export const ACTION_TYPE_LEFT_APPLICATION_SCOPE = 'CLEAR_CURRENT_APPLICATION'
export const ACTION_TYPE_APPLICATION_LOADED = 'SUPP_APPLICATION_LOADED'

export const getEmptyListing = () => ({
  id: null,
  name: null,
  buildingAddress: null
})

export const getEmptyApplication = () => ({
  id: null,
  number: null,
  applicantFullName: null
})

const overrideBreadcrumbData = (state, { listing, application }) => ({
  ...state,
  breadcrumbData: {
    ...state.breadcrumbData,
    ...(listing && {
      listing: {
        id: listing.id,
        name: listing.name,
        buildingAddress: listing.buildingAddress
      }
    }),
    ...(application && {
      application: {
        id: application.id,
        number: application.number,
        applicantFullName: application.applicantFullName
      }
    })
  }
})

const Reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPE_SELECTED_LISTING_CHANGED:
      return overrideBreadcrumbData(state, {
        listing: action.data
      })
    case ACTION_TYPE_LEFT_LISTING_SCOPE:
      return overrideBreadcrumbData(state, {
        listing: getEmptyListing()
      })
    case ACTION_TYPE_SELECTED_APPLICATION_CHANGED:
      return overrideBreadcrumbData(state, {
        application: action.data
      })
    case ACTION_TYPE_LEFT_APPLICATION_SCOPE:
      return overrideBreadcrumbData(state, {
        application: getEmptyApplication()
      })
    case ACTION_TYPE_APPLICATION_LOADED:
      return overrideBreadcrumbData(state, {
        application: action.data.application,
        listing: action.data.listing
      })
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

export default Reducer
