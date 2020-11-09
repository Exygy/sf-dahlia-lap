import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { Field } from 'react-final-form'
import classNames from 'classnames'
import { Label, FieldError, HelpText } from './Field'

const SearchField = ({
  blockNote,
  disabled = false,
  fieldName,
  format,
  formatOnBlur = false,
  helpText,
  id,
  isDirty = false,
  label,
  maxLength,
  onClearClick,
  placeholder,
  validation
}) => {
  const inputElement = useRef(null)

  return (
    <Field
      name={fieldName}
      validate={validation}
      format={format}
      formatOnBlur={formatOnBlur && isDirty}
    >
      {({ input, meta }) => {
        const hasValue = !!input.value
        return (
          <>
            <div
              className={classNames('search', {
                'form-group': label,
                error: meta.error && meta.touched
              })}
            >
              <Label
                label={label}
                id={id || `form-${fieldName}`}
                fieldName={fieldName}
                blockNote={blockNote}
              />
              <input
                {...input}
                id={id || `form-${fieldName}`}
                className={classNames({ 'has-value': hasValue, error: meta.error && meta.touched })}
                type='text'
                maxLength={maxLength}
                placeholder={placeholder}
                disabled={disabled}
                ref={inputElement}
              />
              {hasValue && (
                <button
                  className='ui-medium i-aluminum button-link search-icon'
                  onClick={() => {
                    onClearClick()
                    inputElement.current.focus()
                  }}
                  type='button'
                >
                  <svg>
                    <use xlinkHref={`#i-close-round`} />
                  </svg>
                </button>
              )}
              <FieldError meta={meta} />
              {helpText && <HelpText note={helpText} describeId={`describe-${id || fieldName}`} />}
            </div>
          </>
        )
      }}
    </Field>
  )
}

SearchField.propTypes = {
  blockNote: PropTypes.string,
  disabled: PropTypes.bool,
  fieldName: PropTypes.string.isRequired,
  format: PropTypes.func,
  formatOnBlur: PropTypes.bool,
  helpText: PropTypes.string,
  id: PropTypes.string,
  isDirty: PropTypes.bool,
  label: PropTypes.string,
  maxLength: PropTypes.number,
  onClearClick: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  validation: PropTypes.func
}
export default SearchField
