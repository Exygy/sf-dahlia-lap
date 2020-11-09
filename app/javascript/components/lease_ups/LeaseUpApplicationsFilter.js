import React from 'react'
import { Form } from 'react-final-form'
import { SelectField } from '~/utils/form/final_form/Field'
import SearchField from '~/utils/form/final_form/SearchField'
import formUtils from '~/utils/formUtils'
import LEASE_UP_STATUS_OPTIONS, { LEASE_UP_ACCESSIBILITY_OPTIONS } from '~/utils/statusUtils'
import Loading from '~/components/molecules/Loading'
import Button from '~/components/atoms/Button'
import { clone } from 'lodash'

const statusFilterOptions = [
  formUtils.toEmptyOption('Any Status'),
  formUtils.toOption('No Status'),
  ...clone(LEASE_UP_STATUS_OPTIONS)
]

const accessibilityFilterOptions = [
  formUtils.toEmptyOption('Any Accessibility Request'),
  ...clone(LEASE_UP_ACCESSIBILITY_OPTIONS)
]

const StatusOptions = formUtils.toOptions(statusFilterOptions)

const LeaseUpApplicationsFilter = ({ onSubmit, preferences = [], loading = false }) => {
  const preferenceOptions = formUtils.toOptions([
    formUtils.toEmptyOption('Any Preference'),
    ...preferences,
    ['general', 'General']
  ])

  const householdSizeOptions = formUtils.toOptions([
    formUtils.toEmptyOption('Any HH Members'),
    '1',
    '2',
    '3',
    '4',
    '5+'
  ])

  return (
    <Loading isLoading={loading}>
      <Form
        onSubmit={(filters, form) => {
          onSubmit(formUtils.scrubEmptyValues(filters, true))
          form.resetFieldState('search')
        }}
        render={({ form, handleSubmit }) => (
          <form onSubmit={handleSubmit} noValidate>
            <div className='filter-row'>
              <div className='filter-group'>
                <div className='filter-group_item'>
                  <SearchField
                    onClearClick={() => form.change('search', '')}
                    fieldName='search'
                    id='test-search'
                    placeholder='Application, First Name, Last Name...'
                  />
                </div>
                <div className='filter-group_action'>
                  <Button
                    className='small primary'
                    disabled={!form.getFieldState('search')?.modified}
                    text='Search'
                    type='submit'
                  />
                </div>
                <div className='filter-group_item'>
                  <SelectField
                    fieldName='preference'
                    options={preferenceOptions}
                    placeholder='Preference'
                  />
                </div>
                <div className='filter-group_item'>
                  <SelectField fieldName='total_household_size' options={householdSizeOptions} />
                </div>
                <div className='filter-group_item'>
                  <SelectField fieldName='status' options={StatusOptions} placeholder='Status' />
                </div>
                <div className='filter-group_item'>
                  <SelectField
                    fieldName='accessibility'
                    options={accessibilityFilterOptions}
                    placeholder='Accessibility Requests'
                  />
                </div>
                <div className='filter-group_action'>
                  <button className='small'>Filter</button>
                </div>
              </div>
            </div>
          </form>
        )}
      />
    </Loading>
  )
}

export default LeaseUpApplicationsFilter
