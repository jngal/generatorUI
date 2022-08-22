import React from 'react';
import PropTypes from 'prop-types';
import { DateTimePicker } from '@progress/kendo-react-dateinputs';
import './DateTimePicker.scss';

/**
 * Date time picker
 * @module
 * @param {string} name - Name
 * @param {func} onChange - Function invoked on value change
 * @param {Date} [value] - Value
 * @param {bool} [disabled] - Is input readonly?
 * @param {bool} [required] - Is input required?
 * @param {string} [validationMessage] - Validation message if field is invalid
 * @param {Date | number} [min] - Minimum date
 * @param {Date | number} [max] - Maximum date
 * @param {number} [tabIndex] - Tabindex of datepicker
 * @param {string | object} [format] - Date format
 * @param {func} [onBlur] - Function invoked on input blur
 */
class DateTimePickerComponent extends React.Component {

  handleReset = async () => {
    await this.props.onChange(this.props.name, null);
    this.onBlur();
  }

  handleToday = async () => {
    await this.props.onChange(this.props.name, new Date());
    this.onBlur();
  }

  onBlur = () => {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  }

  render() {
    let { value, min, max } = this.props;

    min = min && (typeof min === 'number' || min instanceof Number) ? new Date(min) : undefined;
    max = max && (typeof max === 'number' || max instanceof Number) ? new Date(max) : undefined;

    return (
      <React.Fragment>
        <DateTimePicker
          className={`datetimepicker ${this.props.disabled ? 'disabled-field' : ''} `}
          onChange={e => this.props.onChange(this.props.name, e.target.value)}
          value={value}
          required={this.props.required}
          disabled={this.props.disabled}
          validationMessage={this.props.validationMessage || 'Povinné'}
          min={min}
          max={max}
          tabIndex={this.props.tabIndex}
          format={this.props.format}
          onBlur={this.onBlur}
        />
        <div
          className={`k-icon k-i-close datetimepicker-reset${this.props.disabled ? '-disabled' : ''}`}
          onClick={this.handleReset}
        >
        </div>
        <div
          className={`k-icon k-i-calendar-date datetimepicker-today${this.props.disabled ? '-disabled' : ''}`}
          onClick={this.handleToday}
        >
        </div>
      </ React.Fragment>
    );
  }
}

DateTimePickerComponent.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string
  ]),
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  validationMessage: PropTypes.string,
  min: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.number
  ]),
  max: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.number
  ]),
  tabIndex: PropTypes.number,
  format: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  onBlur: PropTypes.func
}

export default DateTimePickerComponent;