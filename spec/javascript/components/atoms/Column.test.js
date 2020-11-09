import React from 'react'
import { shallow } from 'enzyme'
import Column from '~/components/atoms/Column'

describe('Column', () => {
  test('it should render a column with the correct properties', () => {
    const wrapper = shallow(
      <Column span='span-test' end form>
        <div className='some-div' />
      </Column>
    )
    const columnWrapper = wrapper.find('.columns')
    expect(columnWrapper).toHaveLength(1)
    expect(columnWrapper.hasClass('small-span-test')).toBeTruthy()
    expect(columnWrapper.hasClass('end')).toBeTruthy()
    expect(columnWrapper.hasClass('form-grid_item')).toBeTruthy()
    expect(columnWrapper.find('.some-div').exists()).toBeTruthy()
  })
})
