import React from 'react';
import PropTypes from 'prop-types';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import './DropDownList.scss';

/**
 * Dropdown list
 * @module
 * @param {array} data - All data for options
 * @param {string} textField - Text field
 * @param {object} [value] - Current value
* @param {func} onChange - Function invoked on value change
 * @param {func} [onOpen] - Function invoked on dropdown list open
 * @param {bool} [disabled] - Is input readonly?
 * @param {bool} [required] - Is input required?
 * @param {string} name - Name
 * @param {string} [validationMessage] - Validation message if field is invalid
 * @param {number} [tabIndex] - Tabindex
 * @param {string} [className] - Class name for dropdown list
 * @param {func} [onBlur] - Function invoked on dropdown list blur
 * @param {object} [popupSettings] - Popup settings
 * @param {object} [defaultItem] - Default item
 */
class DropDownListComponent extends React.Component {
  getDefaultValue = () => {
    const { data } = this.props;
    return data.length > 0 ? data[0] : null;
  }

  onOpen = (e) => {
   if(this.props.onOpen){
     this.props.onOpen(this.props.name, e.target.value)
   }
  }

  onBlur = () => {
    if(this.props.onBlur) {
      this.props.onBlur();
    }
  }

  render() {    
    return (
      <DropDownList
        className={`dropdownlist ${this.props.className || ''} ${this.props.disabled ? 'disabled-field' : ''}`}
        data={this.props.data}
        textField={this.props.textField}
        dataItemKey={this.props.dataItemKey || this.props.textField}
        value={this.props.value || this.getDefaultValue()}
        onChange={e => this.props.onChange(this.props.name, e.target.value)}
        required={this.props.required}
        validationMessage={this.props.validationMessage || 'Povinné'}
        disabled={this.props.disabled}
        tabIndex={this.props.tabIndex}
        onOpen={this.onOpen}
        onBlur={this.onBlur}
        popupSettings={this.props.popupSettings}
        defaultItem={this.props.defaultItem}
      />
    );
  }
}

DropDownListComponent.propTypes = {
  data: PropTypes.array.isRequired,
  textField: PropTypes.string.isRequired,
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
  validationMessage: PropTypes.string,
  disabled: PropTypes.bool,
  tabIndex: PropTypes.number,
  className: PropTypes.string,
  onBlur: PropTypes.func,
  popupSettings: PropTypes.object,
  defaultItem: PropTypes.object
}

export default DropDownListComponent;