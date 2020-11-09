import React from 'react'
import { shallow } from 'enzyme'
import FormGroupCheckboxGroup from '~/components/atoms/FormGroupCheckboxGroup'

describe('FormGroupCheckboxGroup', () => {
  test('it should render a form group checkbox group with the correct label and checkbox properties', () => {
    const wrapper = shallow(
      <FormGroupCheckboxGroup
        label='form label'
        id='checkbox-id'
        name='checkbox-name'
        value='checkbox-value'
      />
    )
    const labels = wrapper.find('label')
    const checkbox = wrapper.find('input[type="checkbox"]')
    expect(labels).toHaveLength(2)
    expect(labels.first().props().htmlFor).toEqual('checkbox-name')
    expect(labels.first().text()).toEqual('form label')
    expect(checkbox.props().name).toEqual('checkbox-name')
    expect(checkbox.props().value).toEqual('checkbox-value')
    expect(checkbox.props().id).toEqual('checkbox-id')
    expect(labels.last().props().htmlFor).toEqual('checkbox-id')
    expect(labels.last().text()).toEqual('checkbox-value')
  })
})
