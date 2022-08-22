import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '@progress/kendo-react-inputs';
import './Checkbox.scss';

/**
 * Checkbox
 * @module
 * @param {string} name - Specifies the name property of the input DOM element
 * @param {func} onChange - Function invoked on checkbox change
 * @param {bool} [value] - Current checkbox value
 * @param {bool} [disabled] - Readonly checkbox
 * @param {string} [label] - Label text
 * @param {number} [tabIndex] - Checkbox tabindex
 */

class CheckboxComponent extends React.Component {
  render() {
    return (
      <Checkbox 
        className={`checkbox ${this.props.disabled ? 'disabled-field' : ''} `}
        name={this.props.name}
        onChange={e => this.props.onChange(this.props.name, e.value)}
        value={this.props.value}
        disabled={this.props.disabled}
        label={this.props.label}
        tabIndex={this.props.tabIndex}
      />
    );
  }
}

CheckboxComponent.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  tabIndex: PropTypes.number
}

export default CheckboxComponent;