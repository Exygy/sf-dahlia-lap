import React from 'react'
import { shallow } from 'enzyme'
import MultiSelect from '~/components/molecules/MultiSelect'
import Select from 'react-select'

const mockItems = [
  {
    value: 'item1',
    label: 'Item1'
  },
  {
    value: 'item2',
    label: 'Item2'
  },
  {
    value: 'item3',
    label: 'Item3'
  }
]

describe('MultiSelect', () => {
  describe('when items is null', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<MultiSelect />)
    })

    test('should render no items or selectedItems', () => {
      expect(wrapper.find(Select).props().value).toEqual([])
      expect(wrapper.find(Select).props().options).toEqual([])
    })
  })

  describe('with multiple items', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<MultiSelect items={mockItems} />)
    })

    test('renders no selected items', () => {
      expect(wrapper.find(Select).props().value).toEqual([])
    })

    test('renders the items', () => {
      expect(wrapper.find(Select).props().options).toEqual(mockItems)
    })

    test('is not disabled', () => {
      expect(wrapper.find(Select).props().isDisabled).toBeFalsy()
    })
  })

  describe('when disabled', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<MultiSelect items={mockItems} disabled />)
    })

    test('renders as disabled', () => {
      expect(wrapper.find(Select).props().isDisabled).toBeTruthy()
    })
  })

  describe('when one item is selected', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<MultiSelect items={mockItems} selectedItems={[mockItems[0]]} disabled />)
    })

    test('should pass that item to react-select', () => {
      expect(wrapper.find(Select).props().value).toEqual([mockItems[0]])
    })
  })

  describe('with default height', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<MultiSelect items={mockItems} />)
    })

    test('sets height to 45px', () => {
      expect(wrapper.find(Select).props().styles.control().height).toEqual('45px')
    })
  })

  describe('with small height', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<MultiSelect items={mockItems} height='small' />)
    })

    test('sets height to 38px', () => {
      expect(wrapper.find(Select).props().styles.control().height).toEqual('38px')
    })
  })
})
