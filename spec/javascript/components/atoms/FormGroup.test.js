import React from 'react'
import { shallow } from 'enzyme'
import FormGroup from '~/components/atoms/FormGroup'

describe('FormGroup', () => {
  test('it should render a form group with the correct children', () => {
    const wrapper = shallow(
      <FormGroup>
        <div className='form-group-child' />
      </FormGroup>
    )
    expect(wrapper.find('.form-group-child').exists()).toBeTruthy()
  })
})
