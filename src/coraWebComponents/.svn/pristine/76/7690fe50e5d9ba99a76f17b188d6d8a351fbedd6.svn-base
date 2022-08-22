import React from 'react';
import PropTypes from 'prop-types';
import Autocomplete from './Autocomplete'
import { filterBy } from '@progress/kendo-data-query';
import './Autocomplete.scss'

/**
 * Autocomplete local input
 * @module
 * @param {string} textField - Text field
 * @param {array} data - All data
 * @param {func} onSelect - Function invoked on item select
 * @param {string} textFilter - Text filter
 * @param {func} onFilter - On filter Function
 * @param {bool} [required] - Field is required
 * @param {bool} [disabled] - Field is disabled
 * @param {string} [validationMessage] - Validation message if field is invalid
 * @param {bool} [autofocus] - Should input be focused?
 * @param {string} [placeholder] - Placeholder for input
 * @param {string} [primaryField] - Primary field
 * @param {number} [tabIndex] - Tabindex for input
 */
class AutocompleteLocalComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data,
      loading: false
    }
  }

  onFilter = filter => {
    this.setState({ loading: true });
    const textFilter = filter.filters[0].value;
    this.props.onFilter(textFilter);
  }

  onSelect = value => {
    this.setState({ loading: false });
    this.props.onSelect(value);
  }

  onChange = filter => {
    this.setState({
      data: filterBy(this.props.data, filter),
      loading: false
    });
  }

  render() {
    return (
      <Autocomplete
        onFilter={this.onFilter}
        data={this.state.data}
        textField={this.props.textField}
        onSelect={this.onSelect}
        onChange={this.onChange}
        isLoading={this.state.loading}
        required={this.props.required}
        disabled={this.props.disabled}
        validationMessage={this.props.validationMessage}
        autofocus={this.props.autofocus}
        placeholder={this.props.placeholder}
        tabIndex={this.props.tabIndex}
        textFilter={this.props.textFilter}
        primaryField={this.props.primaryField}
      />
    );
  }
}

AutocompleteLocalComponent.propTypes = {
  textField: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  textFilter: PropTypes.string.isRequired,
  onFilter: PropTypes.func.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  validationMessage: PropTypes.string,
  autofocus: PropTypes.bool,
  placeholder: PropTypes.string,
  primaryField: PropTypes.string,
  tabIndex: PropTypes.number
}

export default AutocompleteLocalComponent;