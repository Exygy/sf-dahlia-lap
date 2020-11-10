import React from 'react'

import CardLayout from '../layouts/CardLayout'
import { saveApplication } from './actions'
import PaperApplicationForm from './application_form/PaperApplicationForm'

const ApplicationNewForm = ({ listing, lendingInstitutions }) => {
  const saveNewApplication = async (submitType, submittedValues, listing, editPage) => {
    submittedValues.listing_id = listing.id
    return saveApplication(submitType, submittedValues, listing, editPage)
  }

  return (
    <PaperApplicationForm
      listing={listing}
      lendingInstitutions={lendingInstitutions}
      onSubmit={saveNewApplication}
    />
  )
}

const ApplicationNewPage = ({ listing, lendingInstitutions }) => {
  const pageHeader = {
    title: `New Application: ${listing.name}`
  }
  return (
    <CardLayout pageHeader={pageHeader}>
      <ApplicationNewForm listing={listing} lendingInstitutions={lendingInstitutions} />
    </CardLayout>
  )
}

export default ApplicationNewPage
