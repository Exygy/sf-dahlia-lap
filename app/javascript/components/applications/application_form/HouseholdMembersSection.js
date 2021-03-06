import React from 'react'

import { FieldArray } from 'react-final-form-arrays'

import validate from 'utils/form/validations'

import HouseholdMemberForm from './HouseholdMemberForm'

const memberValidate = (values) => {
  if (!values || !values.length) return
  const membersErrors = []
  values.forEach((value) => {
    const memberError = { date_of_birth: {} }
    validate.isValidDate(value.date_of_birth, memberError.date_of_birth, {
      errorMessage: 'Please enter a Date of Birth'
    })
    membersErrors.push(memberError)
  })

  return membersErrors
}

const HouseholdMembersSection = ({ form }) => {
  return (
    <div className='border-bottom margin-bottom--2x'>
      <div className='row'>
        <h3>Household Members</h3>
      </div>
      <FieldArray name='household_members' validate={memberValidate}>
        {({ fields }) => (
          <>
            {fields.map((name, i) => {
              return (
                <div key={name}>
                  <HouseholdMemberForm form={form} i={i} />
                  <button
                    onClick={() => fields.remove(i)}
                    type='button'
                    className='mb-4 btn btn-danger'
                  >
                    Remove
                  </button>
                </div>
              )
            })}
            <div className='row'>
              <div className='form-group'>
                <div className='small-4 columns'>
                  <button
                    onClick={() => form.mutators.push('household_members', {})}
                    type='button'
                    className='mb-4 mr-4 btn btn-success'
                    id='add-additional-member'
                  >
                    + Additional Member
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </FieldArray>
    </div>
  )
}

export default HouseholdMembersSection
