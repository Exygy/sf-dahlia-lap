import React from 'react'
import { shallow } from 'enzyme'
import Button from '~/components/atoms/Button'

describe('Button', () => {
  test('it renders a button with the correct default properties', () => {
    const wrapper = shallow(<Button text='This is a button' />)
    const selector = 'button'
    expect(wrapper.find(selector)).toHaveLength(1)
    expect(wrapper.find(selector).props().type).toEqual('button')
    expect(wrapper.find(selector).hasClass('margin-bottom-none')).toBeFalsy()
  })

  test('it renders a button with the correct properties', () => {
    const selector = 'button'
    const wrapper = shallow(
      <Button
        type='submit'
        text='This is a button'
        small
        tiny
        tertiary
        noBottomMargin
        classes={['additional-class-one', 'additional-class-two']}
        data-other-prop='abc'
      />
    )
    const buttonWrapper = wrapper.find(selector)
    const buttonProps = buttonWrapper.props()
    expect(buttonWrapper).toHaveLength(1)
    expect(buttonProps.type).toEqual('submit')
    expect(buttonWrapper.text()).toEqual('This is a button')
    expect(buttonWrapper.hasClass('small')).toBeTruthy()
    expect(buttonWrapper.hasClass('tiny')).toBeTruthy()
    expect(buttonWrapper.hasClass('tertiary')).toBeTruthy()
    expect(buttonWrapper.hasClass('margin-bottom-none')).toBeTruthy()
    expect(buttonWrapper.hasClass('additional-class-one')).toBeTruthy()
    expect(buttonWrapper.hasClass('additional-class-two')).toBeTruthy()
    expect(buttonProps['data-other-prop']).toEqual('abc')
  })
})
