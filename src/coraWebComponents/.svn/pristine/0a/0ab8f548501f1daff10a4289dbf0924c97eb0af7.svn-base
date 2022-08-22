import React from 'react';
import PropTypes from 'prop-types';
import { MultiSelect } from '@progress/kendo-react-dropdowns';
import './Multiselect.scss';

/**
 * Multiselect Component
 * @module
 * @param {array} data - Data
 * @param {string} textField - Text field
 * @param {array} [value] - Current Value
 * @param {func} onChange - Function invoked on value change
 * @param {bool} [required] - Is field required?
 * @param {string} name - Name
 * @param {string} [validationMessage] - Validation message if field is invalid
 * @param {bool} [disabled] - Is multiselect readonly?
 * @param {number} [tabIndex] - Multiselect tabindex
 * @param {func} [onFilterChange] - Function invoked if filter changes
 * @param {string} [placeholder] - Placeholder
 * @param {string} [filter] - Filter
 */

class MultiselectComponent extends React.Component {
  onBlur = () => {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  }

  onFilterChange = (event) => {
    if (this.props.onFilterChange) {
      this.props.onFilterChange({ filters: [event.filter] });
    }
  }


  render() {
    return (
      <MultiSelect
        data={this.props.data}
        onChange={e => this.props.onChange(this.props.name, e.target.value)}
        value={this.props.value}
        textField={this.props.textField}
        dataItemKey={this.props.textField}
        disabled={this.props.disabled}
        required={this.props.required}
        validationMessage={this.props.validationMessage || 'Povinné'}
        tabIndex={this.props.tabIndex}
        onBlur={this.onBlur}
        filterable={this.props.onFilterChange !== undefined}
        onFilterChange={this.onFilterChange}
        placeholder={this.props.placeholder}
        filter={this.props.filter}
      />
    );
  }
}

MultiselectComponent.propTypes = {
  data: PropTypes.array.isRequired,
  textField: PropTypes.string.isRequired,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
  validationMessage: PropTypes.string,
  disabled: PropTypes.bool,
  tabIndex: PropTypes.number,
  onFilterChange: PropTypes.func,
  placeholder: PropTypes.string,
  filter: PropTypes.string
}

export default MultiselectComponent;