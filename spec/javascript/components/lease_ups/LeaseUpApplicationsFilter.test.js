import React from 'react'
import { mount, shallow } from 'enzyme'

import LeaseUpApplicationsFilter from '~/components/lease_ups/LeaseUpApplicationsFilter'
import SearchField from '~/utils/form/final_form/SearchField'
import Button from '~/components/atoms/Button'

const mockSubmit = jest.fn()

const getShallowWrapper = () =>
  shallow(
    <LeaseUpApplicationsFilter
      onSubmit={mockSubmit}
      preferences={['pref option 1', 'pref option 2']}
    />
  )

const getWrapper = () =>
  mount(
    <LeaseUpApplicationsFilter
      onSubmit={mockSubmit}
      preferences={['pref option 1', 'pref option 2']}
    />
  )

describe('LeaseUpApplicationsFilter', () => {
  test('it matches the expected snapshot with default preferences', () => {
    const wrapper = getShallowWrapper()
    expect(wrapper.find('ReactFinalForm').dive()).toMatchSnapshot()
  })

  describe('search field', () => {
    test('it does not show the clear button when there is no text in the field', () => {
      const wrapper = getWrapper()
      expect(wrapper.exists('.search-icon')).toBe(false)
    })
    test('it renders a clear input icon when there is text in the search input', () => {
      const wrapper = getWrapper()
      wrapper
        .find('.search')
        .find('input')
        .simulate('change', { target: { value: 'my search query' } })
      wrapper.update()
      expect(wrapper.exists('.search-icon')).toBe(true)
    })
    test('the clear input button clears the input', () => {
      const wrapper = getWrapper()
      wrapper
        .find('.search')
        .find('input')
        .simulate('change', { target: { value: 'my search query' } })
      wrapper.update()
      expect(wrapper.find(SearchField).find('input').props().value).toEqual('my search query')

      wrapper.find('.search-icon').simulate('click')
      expect(wrapper.find(SearchField).find('input').props().value).toEqual('')
    })
    test('the search field is disabled unless the field has been modified', () => {
      const wrapper = getWrapper()
      const searchButtonIsDisabled = (wrapper) =>
        wrapper.find(Button).find({ text: 'Search' }).find('button').props().disabled
      // search button is disabled on first render
      expect(searchButtonIsDisabled(wrapper)).toBe(true)

      // search button should be enabled after we modify the field
      wrapper
        .find('.search')
        .find('input')
        .simulate('change', { target: { value: 'my search query' } })
      wrapper.update()
      expect(searchButtonIsDisabled(wrapper)).toBe(false)

      // search button should be disabled after we submit
      console.log('clicking submit')
      wrapper.find(Button).find({ text: 'Search' }).find('button').simulate('submit')
      expect(searchButtonIsDisabled(wrapper)).toBe(true)

      // search button should be re-enabled if we modify after submit
      wrapper
        .find('.search')
        .find('input')
        .simulate('change', { target: { value: 'my other search query' } })
      wrapper.update()
      expect(searchButtonIsDisabled(wrapper)).toBe(false)
    })
  })
})
