import React from 'react'

import { mount, shallow } from 'enzyme'
import { act } from 'react-dom/test-utils'

import Button from 'components/atoms/Button'
import Checkbox from 'components/atoms/Checkbox'
import LeaseUpApplicationsFilterContainer from 'components/lease_ups/LeaseUpApplicationsFilterContainer'
import LeaseUpApplicationsFilters from 'components/lease_ups/LeaseUpApplicationsFilters'
import ShowHideFiltersButton from 'components/molecules/ShowHideFiltersButton'
import MultiSelectField from 'utils/form/final_form/MultiSelectField'
import SearchField from 'utils/form/final_form/SearchField'

const mockSubmit = jest.fn()
const mockOnClearSelectedApplications = jest.fn()
const mockOnSelectAllApplications = jest.fn()

const getNode = (bulkCheckboxesState = {}) => (
  <LeaseUpApplicationsFilterContainer
    onSubmit={mockSubmit}
    onClearSelectedApplications={mockOnClearSelectedApplications}
    onSelectAllApplications={mockOnSelectAllApplications}
    bulkCheckboxesState={bulkCheckboxesState}
    onBulkLeaseUpStatusChange={() => {}}
    preferences={['pref option 1', 'pref option 2']}
  />
)

const getShallowWrapper = (bulkCheckboxesState = {}) => shallow(getNode(bulkCheckboxesState))

const getWrapper = (bulkCheckboxesState = {}) => mount(getNode(bulkCheckboxesState))

describe('LeaseUpApplicationsFilterContainer', () => {
  test('it matches the expected snapshot with default preferences', () => {
    const wrapper = getShallowWrapper()
    expect(wrapper.find('ReactFinalForm').dive()).toMatchSnapshot()
  })

  describe('status checkbox', () => {
    let wrapper
    describe('when the list of applications is empty', () => {
      beforeEach(() => {
        wrapper = getWrapper({})
      })

      test('should render the checkbox as unchecked', () => {
        expect(wrapper.find(Checkbox).props().checked).toBeFalsy()
      })

      test('should render the checkbox as not indeterminate', () => {
        expect(wrapper.find(Checkbox).props().indeterminate).toBeFalsy()
      })

      test('should call select all on click', () => {
        expect(mockOnClearSelectedApplications.mock.calls).toHaveLength(0)
        expect(mockOnSelectAllApplications.mock.calls).toHaveLength(0)
        wrapper.find(Checkbox).simulate('click')
        expect(mockOnClearSelectedApplications.mock.calls).toHaveLength(0)
        expect(mockOnSelectAllApplications.mock.calls).toHaveLength(1)
      })
    })

    describe('when the list of applications is all unchecked', () => {
      beforeEach(() => {
        wrapper = getWrapper({ appId1: false, appId2: false })
      })

      test('should render the checkbox as unchecked', () => {
        expect(wrapper.find(Checkbox).props().checked).toBeFalsy()
      })

      test('should render the checkbox as not indeterminate', () => {
        expect(wrapper.find(Checkbox).props().indeterminate).toBeFalsy()
      })

      test('should call select all on click', () => {
        expect(mockOnClearSelectedApplications.mock.calls).toHaveLength(0)
        expect(mockOnSelectAllApplications.mock.calls).toHaveLength(0)
        wrapper.find(Checkbox).simulate('click')
        expect(mockOnClearSelectedApplications.mock.calls).toHaveLength(0)
        expect(mockOnSelectAllApplications.mock.calls).toHaveLength(1)
      })
    })
    describe('when the list of applications has some checked and some unchecked', () => {
      beforeEach(() => {
        wrapper = getWrapper({ appId1: false, appId2: true })
      })

      test('should render the checkbox as checked=false', () => {
        expect(wrapper.find(Checkbox).props().checked).toBeFalsy()
      })

      test('should render the checkbox with indeterminate=true', () => {
        expect(wrapper.find(Checkbox).props().indeterminate).toBeTruthy()
      })

      test('should call clear all on click', () => {
        expect(mockOnClearSelectedApplications.mock.calls).toHaveLength(0)
        expect(mockOnSelectAllApplications.mock.calls).toHaveLength(0)
        wrapper.find(Checkbox).simulate('click')
        expect(mockOnClearSelectedApplications.mock.calls).toHaveLength(1)
        expect(mockOnSelectAllApplications.mock.calls).toHaveLength(0)
      })
    })
    describe('when the list of applications is all checked', () => {
      beforeEach(() => {
        wrapper = getWrapper({ appId1: true, appId2: true })
      })

      test('should render the checkbox as checked=false', () => {
        expect(wrapper.find(Checkbox).props().checked).toBeTruthy()
      })

      test('should render the checkbox with indeterminate=false', () => {
        expect(wrapper.find(Checkbox).props().indeterminate).toBeFalsy()
      })

      test('should call clear all on click', () => {
        expect(mockOnClearSelectedApplications.mock.calls).toHaveLength(0)
        expect(mockOnSelectAllApplications.mock.calls).toHaveLength(0)
        wrapper.find(Checkbox).simulate('click')
        expect(mockOnClearSelectedApplications.mock.calls).toHaveLength(1)
        expect(mockOnSelectAllApplications.mock.calls).toHaveLength(0)
      })
    })
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
    test('the search field is tertiary-inverse unless the field has been modified', () => {
      const wrapper = getWrapper()
      const graySearchButtonWrapper = (wrapper) =>
        wrapper.find(Button).find({ text: 'Search' }).find('button.tertiary-inverse')

      // search button is disabled on first render
      expect(graySearchButtonWrapper(wrapper)).toHaveLength(1)

      // search button should be enabled after we modify the field
      wrapper
        .find('.search')
        .find('input')
        .simulate('change', { target: { value: 'my search query' } })
      wrapper.update()
      expect(graySearchButtonWrapper(wrapper)).toHaveLength(0)

      // search button should be disabled after we submit
      wrapper.find(Button).find({ text: 'Search' }).find('button').simulate('submit')
      expect(graySearchButtonWrapper(wrapper)).toHaveLength(1)

      // search button should be re-enabled if we modify after submit
      wrapper
        .find('.search')
        .find('input')
        .simulate('change', { target: { value: 'my other search query' } })
      wrapper.update()
      expect(graySearchButtonWrapper(wrapper)).toHaveLength(0)
    })

    describe('filters button and panel', () => {
      let wrapper
      beforeEach(() => {
        wrapper = getWrapper()
      })

      test('should default to hiding the filters', () => {
        expect(wrapper.find(ShowHideFiltersButton).props().isShowingFilters).toBeFalsy()
        expect(wrapper.find(LeaseUpApplicationsFilters)).toHaveLength(0)
      })

      describe('when the show/hide filters button is clicked', () => {
        beforeEach(async () => {
          await act(async () => wrapper.find(ShowHideFiltersButton).simulate('click'))
          wrapper.update()
        })

        test('should show the filters panel', () => {
          expect(wrapper.find(ShowHideFiltersButton).props().isShowingFilters).toBeTruthy()
          expect(wrapper.find(LeaseUpApplicationsFilters)).toHaveLength(1)
        })

        test('should should set hasChangedFilters = false', () => {
          expect(wrapper.find(LeaseUpApplicationsFilters).props().hasChangedFilters).toBeFalsy()
        })

        describe('when filters are cleared', () => {
          beforeEach(async () => {
            await act(async () => wrapper.find(LeaseUpApplicationsFilters).props().onClearFilters())
            wrapper.update()
          })

          test('should not should set hasChangedFilters = true if filters were already cleared', () => {
            expect(wrapper.find(LeaseUpApplicationsFilters).props().hasChangedFilters).toBeFalsy()
          })
        })

        describe('when a filter is changed', () => {
          beforeEach(async () => {
            await act(async () => wrapper.find(MultiSelectField).at(0).invoke('onChange')())
            wrapper.update()
          })

          test('should should set hasChangedFilters = true', () => {
            expect(wrapper.find(LeaseUpApplicationsFilters).props().hasChangedFilters).toBeTruthy()
          })

          describe('when filters are cleared', () => {
            beforeEach(async () => {
              await act(async () =>
                wrapper.find(LeaseUpApplicationsFilters).props().onClearFilters()
              )
              wrapper.update()
            })

            test('should keep hasChangedFilters = true', () => {
              expect(
                wrapper.find(LeaseUpApplicationsFilters).props().hasChangedFilters
              ).toBeTruthy()
            })
          })
        })
      })
    })
  })
})
