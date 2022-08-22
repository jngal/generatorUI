import * as React from 'react';
import PropTypes from 'prop-types';
import { Sortable } from '@progress/kendo-react-sortable';

/**
 * Sortable component
 * @module
 * @param {array} data - Data
 * @param {string} idField - Id field name
 * @param {string} disabledField - Disabled field name
 * @param {React.Component} SortableItemUI - Sortable item ui 
 * @param {func} onDragOver - On drag over
 * @param {func} onNavigate - On navigate
 */
class SortableComponent extends React.Component {
  render() {
    return (
      <Sortable
        idField={this.props.idField}
        disabledField={this.props.disabledField}
        data={this.props.data}
        itemUI={this.props.SortableItemUI}
        onDragOver={this.props.onDragOver}
        onNavigate={this.props.onNavigate}
      />
    );
  }
}

SortableComponent.propTypes = {
  data: PropTypes.array.isRequired,
  idField: PropTypes.string,
  disabledField: PropTypes.string,
  SortableItemUI: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired
}

export default SortableComponent;