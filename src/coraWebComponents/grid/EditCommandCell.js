
import React from 'react';
import { GridCell } from '@progress/kendo-react-grid';
import PropTypes from 'prop-types';

/**
 * Edit command cell component
 * @module
 * @param {func} edit - Edit function
 * @param {func} update - Update function
 * @param {func} abortChanges - Abort changes function
 * @param {func} editField - Edit field function
 */

export function EditCommandCell({ edit, update, abortChanges, editField }) {
  return class extends GridCell {
    render() {
      const { dataItem, style } = this.props;
      const inEdit = dataItem[editField];
      const className = "k-command-cell " + this.props.className;

      return inEdit ? (
        <td className={className} style={style}>
          <button
            className="k-secondary k-button k-grid-save-command"
            onClick={(e) => { e.preventDefault(); update(dataItem); }}

          >
            Uložiť
          </button>
          <button
            className="k-secondary k-button k-grid-cancel-command"
            onClick={(e) => { e.preventDefault(); abortChanges(dataItem); }}

          >
            Zrušiť
          </button>
        </td>
      ) : (
          <td className={className} style={style}>
            <button
              className="k-primary k-button k-grid-edit-command"
              onClick={(e) => { e.preventDefault(); edit(dataItem); }}
            >
              Upraviť
            </button>
          </td>
        );
    }
  }
};

EditCommandCell.propTypes = {
  dataItem: PropTypes.string,
  style: PropTypes.object,
  onChange: PropTypes.func,
}