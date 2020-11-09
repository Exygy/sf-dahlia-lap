import React from 'react'
import { Field } from 'react-final-form'
import formOptions from '~/components/applications/application_form/formOptions'
import classNames from 'classnames'
import formUtils from '~/utils/formUtils'

const { labelize } = formOptions

// Make react-final-form does include empty values on submit.
// Source: https://github.com/final-form/react-final-form/issues/130#issuecomment-425482365
const identity = (value, name, isFloat) => {
  if (value && isFloat) {
    // Here we remove anything that is not a numeric digit
    // or a decimal place while editing the field
    return value.toString().replace(/[^\d|.]/g, '')
  }

  return value
}

export const BlockNote = ({ value }) => (
  <span className='checkbox-block_note no-margin padding-left--half'>{value}</span>
)

export const Input = ({
  input,
  id,
  meta,
  type,
  maxLength,
  placeholder,
  ariaLabelledby,
  fieldName,
  disabled
}) => (
  <input
    {...input}
    id={id || `form-${fieldName}`}
    className={classNames({ error: meta.error && meta.touched })}
    type={type}
    maxLength={maxLength}
    aria-labelledby={ariaLabelledby}
    placeholder={placeholder}
    disabled={disabled}
  />
)

export const Label = ({ label, fieldName, blockNote, id, labelId }) => {
  return label ? (
    <label
      htmlFor={id || `form-${fieldName}`}
      id={(labelId || `label-${fieldName}`).replace('.', '-')}
      className='form-label'
    >
      {label}
      {blockNote && <BlockNote value={blockNote} />}
    </label>
  ) : null
}

export const HelpText = ({ describeId, note }) => (
  <span className='form-note shift-up' id={describeId}>
    {note}
  </span>
)

export const FieldError = ({ meta }) =>
  meta.error && meta.touched ? <span className='form-note error'>{meta.error}</span> : null

export const InputField = ({
  fieldName,
  label,
  blockNote,
  validation,
  placeholder,
  maxLength,
  id,
  type,
  helpText,
  parse,
  format,
  disabled,
  formatOnBlur = false,
  isDirty = false
}) => (
  <Field
    name={fieldName}
    validate={validation}
    parse={parse || identity}
    format={format}
    formatOnBlur={formatOnBlur && isDirty}
  >
    {({ input, meta }) => (
      <>
        <div className={classNames({ 'form-group': label, error: meta.error && meta.touched })}>
          <Label
            label={label}
            id={id || `form-${fieldName}`}
            fieldName={fieldName}
            blockNote={blockNote}
          />
          <Input
            input={input}
            meta={meta}
            id={id || `form-${fieldName}`}
            type={type || 'text'}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled}
          />
          <FieldError meta={meta} />
          {helpText && <HelpText note={helpText} describeId={`describe-${id || fieldName}`} />}
        </div>
      </>
    )}
  </Field>
)

export const CurrencyField = ({
  fieldName,
  validation,
  id,
  label,
  maxLength,
  disabled,
  isDirty = true,
  helpText,
  placeholder = null
}) => (
  <InputField
    fieldName={fieldName}
    label={label}
    validation={validation}
    placeholder={placeholder ?? 'Enter Amount'}
    maxLength={maxLength}
    id={id}
    type='text'
    helpText={helpText}
    formatOnBlur
    isDirty={isDirty}
    format={formUtils.formatPrice}
    disabled={disabled}
    parse={(value, name) => identity(value, name, true)}
  />
)

/**
 * Field that allows only whole integer percent values.
 */
export const PercentField = ({
  fieldName,
  validation,
  id,
  label,
  maxLength,
  disabled,
  isDirty = true,
  helpText
}) => (
  <InputField
    fieldName={fieldName}
    label={label}
    validation={validation}
    placeholder='Enter Percentage'
    maxLength={maxLength}
    id={id}
    type='text'
    helpText={helpText}
    formatOnBlur
    isDirty={isDirty}
    format={formUtils.formatPercent}
    parse={(value, name) => identity(value, name, true)}
  />
)

export const SelectField = ({
  fieldName,
  label,
  blockNote,
  validation,
  id,
  options,
  onChange,
  className,
  disabled = false,
  disabledOptions,
  selectValue,
  noPlaceholder,
  format,
  isDirty = true,
  helpText
}) => (
  <Field
    name={fieldName}
    validate={validation}
    component='select'
    parse={identity}
    format={format}
    formatOnBlur={isDirty}
  >
    {({ input, meta }) => {
      const selectOptions =
        disabled && disabledOptions ? disabledOptions : labelize(options, {}, noPlaceholder)
      return (
        <>
          <div className={classNames('form-group', { error: meta.error && meta.touched })}>
            <Label
              label={label}
              id={id || `form-${fieldName}`}
              fieldName={fieldName}
              blockNote={blockNote}
            />
            <select
              {...input}
              onChange={(event) => {
                input.onChange(event)
                onChange && onChange(event)
              }}
              id={id || `form-${fieldName}`}
              name={input.name}
              className={classNames(className, { error: meta.error && meta.touched })}
              {...(selectValue && { value: selectValue })}
              {...(disabled && { disabled })}
            >
              {selectOptions.map(({ value, label, disabled }) => (
                <option key={value} value={value} disabled={disabled}>
                  {label}
                </option>
              ))}
            </select>
            <FieldError meta={meta} />
            {helpText && <HelpText note={helpText} describeId={`describe-${id || fieldName}`} />}
          </div>
        </>
      )
    }}
  </Field>
)

export const CheckboxField = ({ fieldName, label, blockNote, validation, id, ariaLabelledby }) => (
  <Field name={fieldName} validate={validation} type='checkbox'>
    {({ input, meta }) => (
      <>
        <div className={classNames('form-group', { error: meta.error && meta.touched })}>
          <Input
            input={input}
            type='checkbox'
            meta={meta}
            aria-labelledby={ariaLabelledby}
            id={id || `form-${fieldName}`}
          />
          <Label
            label={label}
            id={id || `form-${fieldName}`}
            fieldName={fieldName}
            blockNote={blockNote}
          />
          <FieldError meta={meta} />
        </div>
      </>
    )}
  </Field>
)

/**
 * Displays similarly to the CheckboxField but is backed by a string with two possible string
 * values instead of a boolean. (ex: has_developental_disability: "Yes"/"No").
 */
export const TextCheckboxField = ({
  fieldName,
  label,
  blockNote,
  validation,
  id,
  ariaLabelledby,
  form,
  trueValue = 'Yes',
  falseValue = 'No',
  initialValue = null
}) => {
  const onChange = (event) => {
    form.change(fieldName, event.target.checked ? trueValue : falseValue)
  }
  return (
    <Field
      name={fieldName}
      validate={validation}
      type='input'
      component='input'
      initialValue={initialValue}
    >
      {({ input, meta }) => (
        <div className={classNames('form-group', { error: meta.error && meta.touched })}>
          <Input
            input={input}
            type='hidden'
            meta={meta}
            aria-labelledby={ariaLabelledby}
            id={id || `form-base-${fieldName}`}
          />
          <input
            id={id || `form-ctrl-${fieldName}`}
            type='checkbox'
            checked={input.value === trueValue}
            onChange={onChange}
          />
          <Label
            label={label}
            id={id || `form-ctrl-${fieldName}`}
            fieldName={fieldName}
            blockNote={blockNote}
          />
          <FieldError meta={meta} />
        </div>
      )}
    </Field>
  )
}

const YesNoRadioField = ({ value, label, type, fieldName, className, uniqId }) => (
  <Field name={fieldName} value={value} type='radio'>
    {({ input }) => (
      <p className='radio-inline'>
        <input
          {...input}
          id={`${fieldName}-${uniqId}-${type}`}
          className={className}
          type='radio'
        />
        <label className='radio-inline_label' htmlFor={`${fieldName}-${uniqId}-${type}`}>
          {label}
        </label>
      </p>
    )}
  </Field>
)

export const YesNoRadioGroup = ({
  fieldName,
  uniqId,
  trueValue = 'true',
  trueLabel = 'Yes',
  falseValue = 'false',
  falseLabel = 'No',
  inputClassName,
  className,
  label
}) => {
  const divClassName = classNames(className, 'radio-group-inline')
  return (
    <div className={divClassName}>
      <>
        <Label label={label} id={`form-${fieldName}`} fieldName={fieldName} />
        <YesNoRadioField
          value={trueValue}
          label={trueLabel}
          type='yes'
          fieldName={fieldName}
          className={inputClassName}
          uniqId={uniqId}
        />
        <YesNoRadioField
          value={falseValue}
          label={falseLabel}
          type='no'
          fieldName={fieldName}
          className={inputClassName}
          uniqId={uniqId}
        />
      </>
    </div>
  )
}

export const TextAreaField = ({
  fieldName,
  label,
  labelId,
  cols,
  rows,
  validation,
  placeholder,
  maxLength,
  id,
  ariaDescribedby,
  blockNote,
  labelClass
}) => (
  <Field name={fieldName} validate={validation} component='textarea' parse={identity}>
    {({ input, meta }) => (
      <>
        <div
          className={classNames(
            label && 'form-group',
            (meta.error && meta.touched && 'error') || ''
          )}
        >
          <Label
            label={label}
            labelId={labelId}
            id={id || `form-${fieldName}`}
            fieldName={fieldName}
            blockNote={blockNote}
            className={labelClass}
          />
          <textarea
            {...input}
            id={id || `form-${fieldName}`}
            className={classNames({ error: meta.error && meta.touched })}
            placeholder={placeholder}
            maxLength={maxLength}
            cols={cols}
            rows={rows}
            aria-describedby={ariaDescribedby}
          />
          <FieldError meta={meta} />
        </div>
      </>
    )}
  </Field>
)
