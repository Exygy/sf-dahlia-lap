import React from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'

const HEIGHT_NORMAL = 'normal'
const HEIGHT_SMALL = 'small'

const getStyleOverrides = (controlHeight) => {
  let controlHeightPx
  switch (controlHeight) {
    case HEIGHT_SMALL:
      controlHeightPx = '38px'
      break
    case HEIGHT_NORMAL:
    default:
      controlHeightPx = '45px'
      break
  }

  return {
    control: (base, _) => ({
      ...base,
      height: controlHeightPx
    })
  }
}

const MultiSelect = ({
  items = [],
  selectedItems = [],
  height = HEIGHT_NORMAL,
  disabled = false,
  onChangeValues = () => {}
}) => (
  <div className='input-custom-height'>
    <Select
      isDisabled={disabled}
      isClearable
      isSearchable
      isMulti
      styles={getStyleOverrides(height)}
      onChange={(values) => onChangeValues(values)}
      value={selectedItems}
      options={items}
    />
  </div>
)

const SelectItemShape = PropTypes.shape({
  value: PropTypes.string,
  label: PropTypes.string
})

MultiSelect.propTypes = {
  items: PropTypes.arrayOf(SelectItemShape),
  height: PropTypes.oneOf([HEIGHT_NORMAL, HEIGHT_SMALL]),
  disabled: PropTypes.bool,
  selectedItems: PropTypes.arrayOf(SelectItemShape),
  onChange: PropTypes.func
}

export default MultiSelect
