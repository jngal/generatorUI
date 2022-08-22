import React from 'react';
import sk from '../res/sk';
import PropTypes from 'prop-types';
import { DropDownList } from '@progress/kendo-react-dropdowns';

 /**
 * Dropdown filter cell component
 * @module
 * @param {object} data - Data
 * @param {string} defaultItem - Default value for dropdown
 * @param {func} getData - Function to get data
 * @param {string} defaultValue - Default value for filter
 * @param {func} props.onChange - On change function
 * @param {string} props.value - Value
 */
export default function dropdownFilterCell(data, defaultItem = '', getData = null, defaultValue = null) {
  return class extends React.Component {
    hasValue(value) {
      return value && value !== defaultItem;
    }

    componentDidMount() {
      if (defaultValue) {
        setTimeout(() => {
          this.props.onChange({
            value: defaultValue,
            operator: 'eq'
          });
        }, 800);
      }
    }

    render() {
      const newData = getData != null ? getData() : data;

      return (
        <div className="k-filtercell">
          <DropDownList
            data={newData}
            onChange={(event) => {
              const hasValue = this.hasValue(event.target.value);
              this.props.onChange({
                value: hasValue ? event.target.value : defaultItem,
                operator: hasValue ? 'eq' : '',
                syntheticEvent: event.syntheticEvent
              });
            }}
            value={this.props.value || defaultItem}
            defaultItem={defaultItem}
          />
          <button
            style={{ visibility: this.props.value ? 'visible' : 'hidden' }}
            className="k-button k-button-icon k-clear-button-visible"
            title={sk.grid.filterClearButton}
            disabled={!this.hasValue(this.props.value)}
            onClick={(event) => {
              event.preventDefault();
              this.props.onChange({
                value: '',
                operator: '',
                syntheticEvent: event
              });
            }}
          >
            <span className="k-icon k-i-filter-clear" />
          </button>
        </div>
      );
    }
  };
}

dropdownFilterCell.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
}