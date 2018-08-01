import React from 'react'

import ApplicationDetails from './application_details/ApplicationDetails'
import CardLayout from '../layouts/CardLayout'
import appPaths from '~/utils/appPaths'
import mapProps from '~/utils/mapProps'
import { mapApplication } from '~/components/mappers/soqlToDomain'
import labelMapperFields from './application_details/applicationDetailsFieldsDesc'

const buildActionLinkIfNecessary = (application) => {
  if (!application.is_lottery_complete && application.application_submission_type === 'Paper') {
    return { title: 'Edit Application', link: appPaths.toApplicationEdit(application.id) }
  } else {
    return undefined
  }
}

const ApplicationPage = (props) => {
  const { application } = props
  const pageHeader = {
    title: `Application ${application.name}`,
    content: (<span>Name of Listing: <a href={appPaths.toListing(application.listing.id)}>{application.listing.name}</a></span>),
    action: buildActionLinkIfNecessary(application)
  }

  return (
    <CardLayout pageHeader={pageHeader} >
      <ApplicationDetails {...props} />
    </CardLayout>
  )
}

const mapProperties = ({ application, file_base_url }) => {
  return {
    application: mapApplication(application),
    fields: labelMapperFields,
    fileBaseUrl: file_base_url
  }
}

export default mapProps(mapProperties)(ApplicationPage)
