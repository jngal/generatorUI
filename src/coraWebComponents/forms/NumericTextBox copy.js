/* eslint-disable no-unused-expressions */
import React from 'react';
import PropTypes from 'prop-types';
import { NumericTextBox } from '@progress/kendo-react-inputs';
import './NumericTextBox.scss';

/**
 * Numeric text box component
 * @module
 * @param {string} name - Name
 * @param {func} onChange - Function invoked on value change
 * @param {number} [value] - Current value
 * @param {bool} [required] - Is input required?
 * @param {bool} [disabled] - Is input readonly?
 * @param {string} [validationMessage] - Validation message if field is invalid
 * @param {number} [min] - Minimum number
 * @param {number} [max] - Maximum number
 * @param {number} [step] - Step
 * @param {(string | object)} [format] - Format
 * @param {bool} [autofocus] - Should input be focused?
 * @param {func} [onBlur] - Function invoked on input blur
 * @param {number} [tabIndex] - NumericTextBox Tabindex
 */
class NumericTextBoxComponent extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
  }

  componentDidMount = async () => {
    if (this.props.autofocus) {
      this.ref.current?.select();
    }
  }

  onBlur = () => {
    if(this.props.onBlur) {
      this.props.onBlur(this.props.name, this.props.value);
    }
  }

  render() {
    return (
      <div className={`numerictextbox ${this.props.disabled ? 'disabled-field' : ''}`}>
        <NumericTextBox
          onChange={e => this.props.onChange(this.props.name, e.target.value)}
          value={this.props.value}
          required={this.props.required}
          validationMessage={this.props.validationMessage || 'Povinné'}
          disabled={this.props.disabled}
          min={this.props.min === null ? undefined : this.props.min}
          max={this.props.max === null ? undefined : this.props.max}
          step={this.props.step}
          format={this.props.format || undefined}
          ref="numerictextbox"
          tabIndex={this.props.tabIndex}
          onBlur={this.onBlur}
          placeholder={this.props.placeholder}
          spinners={this.props.spinners}
        />
      </div>
    );
  }
}

NumericTextBoxComponent.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  validationMessage: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  format: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  autofocus: PropTypes.bool,
  onBlur: PropTypes.func,
  tabIndex: PropTypes.number,
  spinners: PropTypes.bool
}

export default NumericTextBoxComponent;