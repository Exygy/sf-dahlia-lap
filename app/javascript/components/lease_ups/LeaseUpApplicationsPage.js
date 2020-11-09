/* global SALESFORCE_BASE_URL */

import React, { useState } from 'react'
import { map, each, set, clone } from 'lodash'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { getApplications, getListing } from './leaseUpActions'

import { createFieldUpdateComment } from '../supplemental_application/actions'
import LeaseUpApplicationsTableContainer from './LeaseUpApplicationsTableContainer'
import TableLayout from '../layouts/TableLayout'
import appPaths from '~/utils/appPaths'
import { EagerPagination, SERVER_PAGE_SIZE } from '~/utils/EagerPagination'
import Context from './context'
import { SALESFORCE_DATE_FORMAT } from '~/utils/utils'

const ROWS_PER_PAGE = 20

const getPageHeaderData = (listing) => {
  const baseUrl = typeof SALESFORCE_BASE_URL !== 'undefined' ? SALESFORCE_BASE_URL : ''
  const exportButtonAction = listing?.report_id
    ? {
        title: 'Export',
        link: `${baseUrl}/${listing?.report_id}?csv=1`
      }
    : null

  const levelAboveBreadcrumb = {
    title: 'Lease Ups',
    link: appPaths.toLeaseUps(),
    renderAsRouterLink: true
  }

  const emptyBreadCrumb = {
    title: '',
    link: '#'
  }

  const breadcrumbs = listing
    ? [
        levelAboveBreadcrumb,
        {
          title: listing?.name,
          link: appPaths.toLeaseUpApplications(listing.id),
          renderAsRouterLink: true
        }
      ]
    : [levelAboveBreadcrumb, emptyBreadCrumb]

  return {
    title: listing?.name || '',
    content: listing?.building_street_address || '',
    action: exportButtonAction,
    breadcrumbs
  }
}

const getPreferences = (listing) => {
  if (!listing) return []
  return map(listing.listing_lottery_preferences, (pref) => pref.lottery_preference.name)
}

const LeaseUpApplicationsPage = () => {
  const [state, overrideEntireState] = useState({
    loading: false,
    applications: [],
    filters: {},
    page: 0,
    pages: 0,
    atMaxPages: false,
    statusModal: {
      isOpen: false,
      status: null,
      subStatus: null,
      applicationId: null,
      showAlert: null,
      loading: false
    },
    listing: null,
    eagerPagination: new EagerPagination(ROWS_PER_PAGE, SERVER_PAGE_SIZE)
  })

  // grab the listing id from the url: /lease-ups/listings/:listingId
  const { listingId } = useParams()

  const performAsyncRequest = ({
    initialState = {},
    promiseFunc = async () => {},
    stateFromResponse = {}
  }) => {
    setState({
      ...initialState,
      loading: true
    })

    promiseFunc()
      .then((r) => setState({ ...stateFromResponse(r) }))
      .finally(() => setState({ loading: false }))
  }

  const setState = (newState) =>
    overrideEntireState((prevState) => ({
      ...prevState,
      ...newState
    }))

  const setStateWithPrev = (newState) =>
    overrideEntireState((prevState) => ({
      ...prevState,
      ...newState(prevState)
    }))

  const loadPage = async (page, filters) => {
    const { listing: listingFromState } = state

    const getStateOrFetchListing = () =>
      listingFromState ? Promise.resolve(listingFromState) : getListing(listingId)

    const fetcher = (p) => getApplications(listingId, p, filters)

    performAsyncRequest({
      initialState: { page },
      promiseFunc: () =>
        Promise.all([getStateOrFetchListing(), state.eagerPagination.getPage(page, fetcher)]),
      stateFromResponse: ([listing, { records, pages }]) => ({
        listing,
        applications: records,
        pages: pages,
        atMaxPages: false
      })
    })
  }

  const handleOnFetchData = ({ filters, page }, _) => {
    if (state.eagerPagination.isOverLimit(page)) {
      setState({
        applications: [],
        loading: false,
        atMaxPages: true
      })
    } else {
      loadPage(page, filters)
    }
  }

  const handleOnFilter = (filters) => {
    setState({ filters })
    state.eagerPagination.reset()
    loadPage(0, filters)
  }

  const handleCreateStatusUpdate = async ({ applicationId, comment, status, subStatus }) => {
    const { applications } = state

    createFieldUpdateComment(applicationId, status, comment, subStatus)
      .then((response) => {
        each(applications, (app, index) => {
          if (app.application_id === applicationId) {
            updateResults(`[${index}]['lease_up_status']`, status)
            updateResults(
              `[${index}]['status_last_updated']`,
              moment().format(SALESFORCE_DATE_FORMAT)
            )
            updateResults(`[${index}]['sub_status']`, subStatus)
          }
        })

        updateStatusModal({
          applicationId: null,
          isOpen: false,
          loading: false,
          showAlert: false,
          status: null
        })
      })
      .catch(() => {
        updateStatusModal({
          loading: false,
          showAlert: true,
          alertMsg: 'We were unable to make the update, please try again.',
          onAlertCloseClick: () => updateStatusModal({ showAlert: false })
        })
      })
  }

  const updateStatusModal = (values) => {
    setStateWithPrev((prevState) => ({
      statusModal: {
        ...clone(prevState.statusModal),
        ...values
      }
    }))
  }

  const updateResults = (path, value) => {
    setStateWithPrev((prevState) => ({
      applications: set(clone(prevState.applications), path, value)
    }))
  }

  const context = {
    applications: state.applications,
    listingId: listingId,
    preferences: getPreferences(state.listing),
    handleOnFetchData: handleOnFetchData,
    handleCreateStatusUpdate: handleCreateStatusUpdate,
    handleOnFilter: handleOnFilter,
    loading: state.loading,
    pages: state.pages,
    rowsPerPage: ROWS_PER_PAGE,
    updateStatusModal: updateStatusModal,
    statusModal: state.statusModal,
    atMaxPages: state.atMaxPages
  }

  return (
    <Context.Provider value={context}>
      <TableLayout pageHeader={getPageHeaderData(state.listing)}>
        <LeaseUpApplicationsTableContainer />
      </TableLayout>
    </Context.Provider>
  )
}

export default LeaseUpApplicationsPage
