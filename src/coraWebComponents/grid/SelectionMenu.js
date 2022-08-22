import React from 'react';
import { Checkbox } from '@progress/kendo-react-inputs';
import { DropDownButton, DropDownButtonItem } from '@progress/kendo-react-buttons';
import Button from '../../coraWebComponents/buttons/Button';
import './SelectionMenu.scss';
import PropTypes from 'prop-types';

/**
 * Selection menu component
 * @module
 * @param {array} [actions] - Array of actions
 * @param {func} onHeaderSelectionChange - Function invoked on header selection change
 * @param {bool} [checked] - Is checkbox checked?
 * @param {func} buttonSelection - Button selection function
 * @param {func} onActionSelect - On action select function
 */

class SelectionMenu extends React.Component {
  render() {
    return (
      <div className="selection-cell">
        <Checkbox label={""} value={this.props.checked} onChange={this.props.onHeaderSelectionChange} />
        <DropDownButton
          icon="arrow-60-down"
          className="selection-dropdown"
          popupSettings={{ popupClass: 'selection-popup' }}>
          <DropDownButtonItem render={props => <Button {...props} label="Všetko" onClick={() => this.props.buttonSelection(0)} />} />
          <DropDownButtonItem render={props => <Button {...props} label="Žiadne" onClick={() => this.props.buttonSelection(1)} />} />
          {this.props.actions && this.props.actions.map((item, idx) =>
            <DropDownButtonItem key={idx} render={props => <Button {...props} label={item.label} onClick={item.action} />} />
          )}
        </DropDownButton>
      </div>
    )
  }
}

SelectionMenu.propTypes = {
  actions: PropTypes.array,
  onHeaderSelectionChange: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  buttonSelection: PropTypes.func.isRequired,
  onActionSelect: PropTypes.func
}

export default SelectionMenu;