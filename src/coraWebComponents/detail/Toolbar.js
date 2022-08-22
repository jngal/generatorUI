import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '../buttons/Button';
import '../Toolbar.scss';
import { buildUrl } from '../utils/helper';

/**
 * Detail toolbar component
 * @module
 * @param {bool} disabled - Is toolbar disabled?
 * @param {element} children - Children
 * @param {string} primaryField - Primary field
 * @param {func} next - Switches to the next entry function
 * @param {func} previous - Switches to the previous entry function
 * @param {bool} disabledNext - Is next entry disabled? 
 * @param {bool} disabledPrevious - Is previous entry disabled? 
 * @param {element} currentEl - Current element
 * @param {func} onBack - Function invoked after click on back arrow
 * @param {bool} hiddenBack - Hidden back arrow in detail toolbar
 * @param {bool} hiddenSave - Hidden save button in detail toolbar 
 */
class ToolbarComponent extends React.Component {
  render() {
    return (
      <div id="detail-toolbar">
        <span>
          {!this.props.hiddenBack &&
          <Button
            onClick={this.props.onBack}
            icon="arrow-left"
            title="Späť"
            className="button-back"
          />
          }
          {!this.props.hiddenSave &&
            <Button
              onClick={this.props.onSubmit}
              primary={true}
              disabled={this.props.disabled}
              title="Uložiť"
              imageUrl={buildUrl('assets/toolbar_cg_save.svg')}
            />
          }
          {this.props.children}
        </span>

        <span className="right" >
          {this.props.currentEl}
          <Button
            onClick={this.props.previous}
            icon="arrow-left"
            title="Predchádzajúci záznam"
            disabled={this.props.disabledPrevious}
          />
          <Button
            onClick={this.props.next}
            icon="arrow-right"
            title="Ďalší záznam"
            disabled={this.props.disabledNext}
          />
        </span>
      </div>
    );
  }
}

ToolbarComponent.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.element,
  primaryField: PropTypes.string.isRequired,
  next: PropTypes.func.isRequired,
  previous: PropTypes.func.isRequired,
  disabledPrevious: PropTypes.bool,
  disabledNext: PropTypes.bool,
  currentEl: PropTypes.element,
  onBack: PropTypes.func.isRequired,
  hiddenBack: PropTypes.bool,
  hiddenSave: PropTypes.bool,
}

export default ToolbarComponent;