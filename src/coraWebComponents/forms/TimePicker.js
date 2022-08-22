import React from 'react';
import PropTypes from 'prop-types';
import { TimePicker } from '@progress/kendo-react-dateinputs';
import './TimePicker.scss';

/**
 * Time picker
 * @module
 * @param {string} name - Name
 * @param {func} onChange - Function invoked on value change
 * @param {Date | string} [value] - Current value
 * @param {bool} [required] - Is input required?
 * @param {bool} [disabled] - Is input readonly?
 * @param {bool} [autofocus] - Should input be focused?
 * @param {string} [validationMessage] - Validation message if field is invalid
 * @param {object} [steps] - Time steps
 * @param {func} [onBlur] - Function invoked on input blur
 * @param {number} [tabIndex] - Timepicker tab index
 */
class TimePickerComponent extends React.Component {

  componentDidMount = async () => {
    if(this.props.autofocus){
      this.refs.timepicker._dateInput._element.select();
    }
  }

  onBlur = () => {
    if(this.props.onBlur) {
      this.props.onBlur(this.props.name, this.props.value);
    }
  }

  render() {
    let { value } = this.props;

    return (
      <TimePicker
        className={`timepicker ${this.props.disabled ? 'disabled-field' : ''}`}
        format="HH:mm"
        steps={this.props.steps ? this.props.steps : {hour: 1, minute: 5}}
        onChange={e => this.props.onChange(this.props.name, e.target.value)}
        value={value}
        disabled={this.props.disabled}
        required={this.props.required}
        validationMessage={this.props.validationMessage || 'Povinné'}
        ref="timepicker"
        onBlur={this.onBlur}
        tabIndex={this.props.tabIndex}
      />
    );
  }
}

TimePickerComponent.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string
  ]),
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  autofocus: PropTypes.bool,
  validationMessage: PropTypes.string,
  steps: PropTypes.object,
  onBlur: PropTypes.func,
  tabIndex: PropTypes.number,
}

export default TimePickerComponent;