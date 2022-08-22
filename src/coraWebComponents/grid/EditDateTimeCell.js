import React from 'react';
import _ from 'lodash';
import { DateTimePicker } from '@progress/kendo-react-dateinputs';
import { GridCell } from '@progress/kendo-react-grid';
import * as Convert from '../../coraWebComponents/utils/convert';
import PropTypes from 'prop-types';

/**
 * Edit boolean cell component
 * @module
 * @param {func} onChange - Function invoked on change
 * @param {string} dataItem - Data item
 * @param {string} field - Field
 * @param {string} className - TD Class name
 * @param {number} colSpan - Number of columns which cell expands to
 * @param {object} style - Style
 * @param {number} columnIndex - Column index
 * @param {number} level - Level
 * @param {func} render - Render function
 */
export function EditDateTimeCell() {
  return class extends GridCell {

    handleChange = (e) => {
      this.props.onChange({
        dataItem: this.props.dataItem,
        field: this.props.field,
        syntheticEvent: e.syntheticEvent,
        value: e.target.value
      });
    }

    render() {
      const { dataItem, field } = this.props;
      const dataValue = _.get(dataItem, field.split('.'))
      const className = dataItem.inEdit ? "k-grid-edit-cell " : "" + this.props.className;

      const td = (
        <td colSpan={this.props.colSpan}
          className={className}
          style={this.props.style}
          role="gridcell"
          aria-colindex={(this.props.columnIndex || 0) - (this.props.level || 0) + 1}
          aria-selected={false}
          tabIndex="0">
          {(dataItem.inEdit === true || dataItem.inEdit === this.props.field) ? (
            <DateTimePicker
              onChange={this.handleChange}
              value={dataValue}
            />
          ) : (
              Convert.dataToLocaleDateStr(dataValue, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
            )}
        </td>
      );
      return this.props.render ? this.props.render.call(undefined, td, this.props) : td;
    }
  }
}

EditDateTimeCell.propTypes = {
  onChange: PropTypes.func,
  dataItem: PropTypes.string,
  field: PropTypes.string,
  className: PropTypes.string,
  colSpan: PropTypes.number,
  style: PropTypes.object,
  columnIndex: PropTypes.number,
  level: PropTypes.number,
  render: PropTypes.func
}