import React from 'react';
import PropTypes from 'prop-types';

/**
 * Cell component
 * @module
 * @param {func} render - Render function
 * @param {object} style - Style
 * @param {string} className - TD class name
 * @param {number} colSpan - Number of columns which cell expands to
 * @param {object} dataItem - Data item
 * @param {object} column - Column
 */
export class Cell extends React.Component {
    render() {
      const { dataItem, column, colSpan, style } = this.props;
      const className = dataItem.inEdit ? "k-grid-edit-cell text" : "" + this.props.className;
      const td = 
      (
        <td 
        colSpan={colSpan}
        className={className}  
        style={style} 
        > 
          {column.cell(this.props)}
        </td>
      );
      
      return this.props.render ? this.props.render.call(undefined, td, this.props): td;    
  }
}

Cell.propTypes = {
  render: PropTypes.func,
  column: PropTypes.object,
  className: PropTypes.string,
  colSpan: PropTypes.number,
  style: PropTypes.object,
  dataItem: PropTypes.object
}
