import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from '@progress/kendo-react-inputs';
import './Switch.scss';


/**
 * Switch component
 * @module
 * @param {string} name - Specifies the name property of the input DOM element
 * @param {func} onChange - Function invoked on value change
 * @param {bool} [value] - Current value
 * @param {bool} [disabled] - Is switch readonly?
 * @param {string} [onLabel] - On label (true)
 * @param {string} [offLabel] - Off label (false)
 * @param {number} [tabIndex] - Switch tab index 
 */
class SwitchComponent extends React.Component {
  render() {
    return (
      <Switch 
        className={`switch ${this.props.disabled ? 'disabled-field' : ''} `}
        name={this.props.name} 
        onChange={e => this.props.onChange(this.props.name, e.target.value)} 
        checked={this.props.value || false}
        disabled={this.props.disabled}
        onLabel={this.props.onLabel || "a"}
        offLabel={this.props.offLabel || "n"}
        tabIndex={this.props.tabIndex}
      />
    );
  }
}

SwitchComponent.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool,
  disabled: PropTypes.bool,
  onLabel: PropTypes.string,
  offLabel: PropTypes.string,
  tabIndex: PropTypes.number
}

export default SwitchComponent;