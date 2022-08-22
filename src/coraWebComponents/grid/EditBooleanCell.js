import React from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';
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

export class EditBooleanCell extends React.Component {
  localizedData = [
    { text: 'áno', value: true },
    { text: 'nie', value: false },
  ];

  handleChange = (e) => {
    this.props.onChange({
      dataItem: this.props.dataItem,
      field: this.props.field,
      syntheticEvent: e.syntheticEvent,
      value: e.target.value.value
    });
  }

  render() {
    const { dataItem, field } = this.props;
    const dataValue = dataItem[field] === null ? '' : dataItem[field];
    const className = dataItem.inEdit ? "k-grid-edit-cell " : "" + this.props.className;

    const td = (
      <td colSpan={this.props.colSpan}
          className={className} 
          style={this.props.style} 
          role="gridcell"
          aria-colindex={(this.props.columnIndex || 0) - (this.props.level || 0) + 1} 
          aria-selected={false}
          tabIndex="0"
      >
        {(dataItem.inEdit === true || dataItem.inEdit === field)  ? (
          <DropDownList
            style={{ width: "100px" }}
            onChange={this.handleChange}
            value={this.localizedData.find(c => c.value === dataValue)}
            data={this.localizedData}
            textField="text"
          />
        ) : (
            dataItem[field] ? 'áno' : 'nie'
          )}
      </td>
    );

    return this.props.render ? this.props.render.call(undefined, td, this.props): td;
  }
}

EditBooleanCell.propTypes = {
  onChange: PropTypes.func,
  dataItem: PropTypes.object,
  field: PropTypes.string,
  className: PropTypes.string,
  colSpan: PropTypes.number,
  style: PropTypes.object,
  columnIndex: PropTypes.number,
  level: PropTypes.number,
  render: PropTypes.func
}