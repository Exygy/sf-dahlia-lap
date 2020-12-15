import React, { useContext } from 'react'

import { uniqBy, cloneDeep, some, findIndex } from 'lodash'
import { useHistory } from 'react-router-dom'

import apiService from 'apiService'
import Alerts from 'components/Alerts'
import Loading from 'components/molecules/Loading'
import LeaveConfirmationModal from 'components/organisms/LeaveConfirmationModal'
import { getPageHeaderData } from 'components/supplemental_application/leaseUpApplicationBreadcrumbs'
import { AppContext } from 'context/Provider'
import appPaths from 'utils/appPaths'
import { useAsyncOnMount, useStateObject } from 'utils/customHooks'
import formUtils from 'utils/formUtils'
import { doesApplicationHaveLease } from 'utils/leaseUtils'

import CardLayout from '../layouts/CardLayout'
import {
  deleteLease,
  getSupplementalPageData,
  saveLeaseAndAssistances,
  updateApplicationAndAddComment,
  updateApplication,
  updatePreference,
  updateTotalHouseholdRent
} from './actions'
import Context from './context'
import SupplementalApplicationContainer from './SupplementalApplicationContainer'

export const SHOW_LEASE_STATE = 'show_lease'
export const NO_LEASE_STATE = 'no_lease'
export const EDIT_LEASE_STATE = 'edit_lease'

const getInitialLeaseState = (application) =>
  doesApplicationHaveLease(application) ? SHOW_LEASE_STATE : NO_LEASE_STATE

const shouldSaveLeaseOnApplicationSave = (leaseState) => leaseState === EDIT_LEASE_STATE

const getApplicationWithEmptyLease = (application) => ({
  ...application,
  lease: {},
  rental_assistances: []
})

const getListingAmiCharts = (units) =>
  uniqBy(units, (u) => [u.ami_chart_type, u.ami_chart_year].join())

const setApplicationsDefaults = (application) => {
  const applicationWithDefaults = cloneDeep(application)
  // Logic in Lease Section in order to show 'Select One' placeholder on Preference Used if a selection was never made
  if (
    applicationWithDefaults.lease &&
    !applicationWithDefaults.lease.no_preference_used &&
    applicationWithDefaults.lease.preference_used == null
  ) {
    delete applicationWithDefaults.lease.preference_used
  }
  return applicationWithDefaults
}

const SupplementalApplicationPage = ({ applicationId }) => {
  const [state, setState] = useStateObject({
    application: null,
    confirmedPreferencesFailed: false,
    leaseSectionState: null,
    leaveConfirmationModalOpen: false,
    listing: null,
    listingAmiCharts: null,
    loading: false,
    rentalAssistances: null,
    statusHistory: null,
    supplementalAppTouched: false
  })

  const [statusModalState, setStatusModalState, overrideStatusModalState] = useStateObject({
    loading: false,
    status: null,
    header: null,
    isOpen: false,
    submitButton: null
  })

  const history = useHistory()

  const [{ breadcrumbData }, actions] = useContext(AppContext)

  useAsyncOnMount(() => getSupplementalPageData(applicationId, breadcrumbData?.listing?.id), {
    onSuccess: ({ application, statusHistory, fileBaseUrl, units, listing }) => {
      setState({
        application: setApplicationsDefaults(application),
        units,
        fileBaseUrl,
        // Only show lease section on load if there's a lease on the application.
        leaseSectionState: getInitialLeaseState(application),
        listing: listing,
        listingAmiCharts: getListingAmiCharts(units),
        rentalAssistances: application.rental_assistances,
        statusHistory
      })

      actions.supplementalPageLoadComplete(application, application?.listing)

      setStatusModalState({
        loading: false,
        status: application.processing_status
      })
    },
    onFail: (e) => {
      console.error(e)
      Alerts.error()
    },
    onComplete: () => setState({ loading: false })
  })

  const handleSaveApplication = async (formApplication) => {
    const { application: prevApplication, leaseSectionState } = state

    setState({ loading: true })

    updateApplication(
      formApplication,
      prevApplication,
      shouldSaveLeaseOnApplicationSave(leaseSectionState)
    )
      .then((responseApplication) => {
        updateApplicationStateAfterRequest(responseApplication, {})
      })
      .catch((e) => {
        console.error(e)
        Alerts.error()
        setState({ loading: false })
      })
  }

  const handleSavePreference = async (preferenceIndex, formApplicationValues) => {
    const preference = formApplicationValues.preferences[preferenceIndex]
    const updates = [updatePreference(preference)]
    // If updating a rent burdened preference, we need to independently
    // update the rent on the application.
    if (preference.individual_preference === 'Rent Burdened') {
      updates.push(
        updateTotalHouseholdRent(formApplicationValues.id, formApplicationValues.total_monthly_rent)
      )
    }

    const responses = await Promise.all(updates)
    const failed = some(responses, (response) => response === false)

    if (!failed) {
      setState({
        application: formApplicationValues,
        confirmedPreferencesFailed: false
      })
    } else {
      setState({ confirmedPreferencesFailed: true })
    }

    return !failed
  }

  const handleDismissError = (preferenceIndex) => {
    setState({ confirmedPreferencesFailed: false })
  }

  const openAddStatusCommentModal = () => {
    overrideStatusModalState({
      header: 'Add New Comment',
      isOpen: true,
      status: state.application.processing_status,
      submitButton: 'Save'
    })
  }

  const openUpdateStatusModal = (value) => {
    overrideStatusModalState({
      submitButton: 'Update',
      header: 'Update Status',
      isOpen: true,
      status: value
    })
  }

  const handleStatusModalClose = () => setStatusModalState({ isOpen: false })

  const handleStatusModalStatusChange = (value, key) => {
    setStatusModalState({
      [key || 'status']: value,
      ...(!key ? { subStatus: '' } : {})
    })
  }

  const updateApplicationStateAfterRequest = (
    applicationResponse,
    additionalFieldsToUpdate = {}
  ) => {
    const leaveEditMode = (currentLeaseSectionState) =>
      currentLeaseSectionState === EDIT_LEASE_STATE ? SHOW_LEASE_STATE : currentLeaseSectionState

    setState((prevState) => ({
      application: setApplicationsDefaults(applicationResponse),
      loading: false,
      supplementalAppTouched: false,
      leaseSectionState: leaveEditMode(prevState.leaseSectionState),
      ...additionalFieldsToUpdate
    }))
  }

  const handleStatusModalSubmit = async (submittedValues, formApplication) => {
    const { application: prevApplication, leaseSectionState } = state
    const { status, subStatus, comment } = submittedValues
    setState({ loading: true })
    setStatusModalState({ loading: true })
    formApplication.processing_status = status

    updateApplicationAndAddComment(
      formApplication,
      prevApplication,
      status,
      comment,
      subStatus,
      shouldSaveLeaseOnApplicationSave(leaseSectionState)
    )
      .then(({ application, statusHistory }) => {
        updateApplicationStateAfterRequest(application, { statusHistory })
        setStatusModalState({ loading: false, isOpen: false })
      })
      .catch((_) => {
        setState({ loading: false })
        setStatusModalState({
          loading: false,
          showAlert: true,
          alertMsg: 'We were unable to make the update, please try again.',
          onAlertCloseClick: () => setStatusModalState({ showAlert: false })
        })
      })
  }

  const handleCreateLeaseClick = () => {
    setState({ leaseSectionState: EDIT_LEASE_STATE })
  }

  const handleCancelLeaseClick = (form) => {
    const { application } = state

    setState({ leaseSectionState: getInitialLeaseState(application) })

    form.change('lease', application.lease)
    form.change('rental_assistances', application.rental_assistances)
  }

  const handleEditLeaseClick = () => setState({ leaseSectionState: EDIT_LEASE_STATE })

  const handleSaveLease = (formApplication) => {
    const { application: prevApplication } = state

    setState({ loading: true })
    saveLeaseAndAssistances(formApplication, prevApplication)
      .then((response) => {
        setState((prevState) => ({
          application: {
            ...prevState.application,
            lease: response.lease,
            rental_assistances: response.rentalAssistances
          },
          leaseSectionState: SHOW_LEASE_STATE
        }))
      })
      .catch(() => Alerts.error())
      .finally(() => setState({ loading: false }))
  }

  const handleDeleteLease = () => {
    const { application } = state
    setState({ loading: true })

    deleteLease(application)
      .then((_) => {
        setState((prevState) => ({
          application: getApplicationWithEmptyLease(prevState.application),
          leaseSectionState: NO_LEASE_STATE
        }))
      })
      .catch(() => Alerts.error())
      .finally(() => setState({ loading: false }))
  }

  const handleRentalAssistanceAction = (action) => {
    setState({ loading: true })

    return (...args) => {
      return action(...args)
        .then((response) => {
          if (response) {
            return response
          } else {
            Alerts.error()
            return false
          }
        })
        .finally(() => setState({ loading: false }))
    }
  }

  const handleSaveRentalAssistance = async (
    rentalAssistance,
    formApplicationValues,
    action = 'create'
  ) => {
    let rentalAssistanceAction

    if (action === 'update') {
      rentalAssistanceAction = apiService.updateRentalAssistance
      if (rentalAssistance.type_of_assistance !== 'Other') {
        rentalAssistance.other_assistance_name = null
      }
    } else if (action === 'create') {
      rentalAssistanceAction = apiService.createRentalAssistance
    }

    const response = await handleRentalAssistanceAction(rentalAssistanceAction)(
      rentalAssistance,
      state.application.id
    )
    // show price in right format
    rentalAssistance.assistance_amount = formUtils.formatPrice(rentalAssistance.assistance_amount)

    if (response) {
      setState((prev) => {
        const rentalAssistances = cloneDeep(prev.application.rental_assistances)

        if (action === 'update') {
          const idx = findIndex(rentalAssistances, { id: rentalAssistance.id })
          rentalAssistances[idx] = rentalAssistance
        } else if (action === 'create') {
          rentalAssistance.id = response.id
          rentalAssistances.push(rentalAssistance)
        }

        return {
          application: {
            ...formApplicationValues,
            rental_assistances: rentalAssistances
          }
        }
      })
    }

    return response
  }

  const handleDeleteRentalAssistance = async (rentalAssistance, formApplicationValues) => {
    const response = await handleRentalAssistanceAction(apiService.deleteRentalAssistance)(
      rentalAssistance.id
    )

    if (response) {
      setState((prev) => {
        const rentalAssistances = cloneDeep(prev.application.rental_assistances)
        const idx = findIndex(rentalAssistances, { id: rentalAssistance.id })
        rentalAssistances.splice(idx, 1)
        return {
          application: {
            ...formApplicationValues,
            rental_assistances: rentalAssistances
          }
        }
      })
    }

    return response
  }

  const handleLeaveSuppAppTab = () => {
    const { application, leaseSectionState, supplementalAppTouched } = state

    const hasStartedNewLease =
      leaseSectionState === EDIT_LEASE_STATE && !doesApplicationHaveLease(application)
    if (supplementalAppTouched || hasStartedNewLease) {
      setState({ leaveConfirmationModalOpen: true })
    } else {
      history.push(appPaths.toLeaseUpShortForm(applicationId))
    }
  }

  const assignSupplementalAppTouched = () => setState({ supplementalAppTouched: true })

  const handleLeaveModalClose = () => setState({ leaveConfirmationModalOpen: false })

  const { application, units, fileBaseUrl, leaveConfirmationModalOpen, statusHistory } = state

  const tabSection = {
    items: [
      {
        title: 'Short Form Application',
        onClick: handleLeaveSuppAppTab
      },
      {
        title: 'Supplemental Information',
        url: appPaths.toApplicationSupplementals(applicationId),
        active: true,
        renderAsRouterLink: true
      }
    ]
  }

  const context = {
    ...state,
    statusModal: statusModalState,
    application: application,
    applicationMembers: [application?.applicant, ...(application?.household_members || [])],
    assignSupplementalAppTouched: assignSupplementalAppTouched,
    units: units,
    fileBaseUrl: fileBaseUrl,
    handleCreateLeaseClick: handleCreateLeaseClick,
    handleCancelLeaseClick: handleCancelLeaseClick,
    handleEditLeaseClick: handleEditLeaseClick,
    handleSaveLease: handleSaveLease,
    handleDeleteLease: handleDeleteLease,
    handleDeleteRentalAssistance: handleDeleteRentalAssistance,
    handleSaveRentalAssistance: handleSaveRentalAssistance,
    handleStatusModalClose: handleStatusModalClose,
    handleStatusModalStatusChange: handleStatusModalStatusChange,
    handleStatusModalSubmit: handleStatusModalSubmit,

    // onDismissError doesn't appear to be used anywhere.
    onDismissError: handleDismissError,
    onSavePreference: handleSavePreference,
    onSubmit: handleSaveApplication,
    openAddStatusCommentModal: openAddStatusCommentModal,
    openUpdateStatusModal: openUpdateStatusModal,
    statusHistory: statusHistory
  }

  return (
    <Context.Provider value={context}>
      <CardLayout
        pageHeader={getPageHeaderData(breadcrumbData.application, breadcrumbData.listing)}
        tabSection={tabSection}
      >
        <Loading
          isLoading={!application}
          renderChildrenWhileLoading={false}
          loaderViewHeight='100vh'
        >
          <SupplementalApplicationContainer />
        </Loading>
      </CardLayout>
      <LeaveConfirmationModal
        isOpen={leaveConfirmationModalOpen}
        handleClose={handleLeaveModalClose}
        destination={appPaths.toLeaseUpShortForm(applicationId)}
        routedDestination
      />
    </Context.Provider>
  )
}

export default SupplementalApplicationPage
