import {
  ACTION_TYPE_LEFT_APPLICATION_SCOPE,
  ACTION_TYPE_LEFT_LISTING_SCOPE,
  ACTION_TYPE_APPLICATION_LOADED,
  ACTION_TYPE_SELECTED_APPLICATION_CHANGED,
  ACTION_TYPE_SELECTED_LISTING_CHANGED
} from 'context/Reducer'

const formatListingStateData = (listing) => ({
  id: listing?.id,
  name: listing?.name,
  buildingAddress: listing?.building_street_address
})

const formatApplicationStateData = (id, number, applicantFullName) => ({
  id,
  number,
  applicantFullName
})

const getListingChangedAction = (listing) => ({
  type: ACTION_TYPE_SELECTED_LISTING_CHANGED,
  data: formatListingStateData(listing)
})

const getFullName = (first, middle, last) => [first, middle, last].filter((x) => !!x).join(' ')

const getFullNameFromApplicant = (applicant) => {
  if (!applicant) return undefined

  const { name, first_name, middle_name, last_name } = applicant

  if (name) return name

  return getFullName(first_name, middle_name, last_name)
}

const getFullNameFromApplication = (application) => {
  if (!application) return undefined

  const { first_name, middle_name, last_name } = application

  return getFullName(first_name, middle_name, last_name)
}

const getApplicationLoadedAction = (application, listing) => ({
  type: ACTION_TYPE_APPLICATION_LOADED,
  data: {
    application: formatApplicationStateData(
      application?.id,
      application?.name,
      getFullNameFromApplicant(application?.applicant)
    ),
    listing: formatListingStateData(listing)
  }
})

export const createActions = (dispatch) => ({
  supplementalPageLoadComplete: (application, listing) =>
    dispatch(getApplicationLoadedAction(application, listing)),
  applicationPageLoadComplete: (application, listing) =>
    dispatch(getApplicationLoadedAction(application, listing)),
  applicationsPageMounted: () => dispatch({ type: ACTION_TYPE_LEFT_APPLICATION_SCOPE }),
  listingsPageMounted: () => dispatch({ type: ACTION_TYPE_LEFT_LISTING_SCOPE }),
  applicationsPageLoadComplete: (listing) => dispatch(getListingChangedAction(listing)),
  listingRowClicked: (listing) => dispatch(getListingChangedAction(listing)),
  applicationRowClicked: (application) =>
    dispatch({
      type: ACTION_TYPE_SELECTED_APPLICATION_CHANGED,
      data: formatApplicationStateData(
        application?.application_id,
        application?.application_number,
        getFullNameFromApplication(application)
      )
    })
})
