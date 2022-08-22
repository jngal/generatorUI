import React from 'react';
import PropTypes from 'prop-types';
import MultiSelect from './MultiSelect';
import { Button } from '@progress/kendo-react-buttons';
import Dialog from '../dialogs/Dialog';
import Grid from '../grid/Grid';
import flags from '../utils/flags';
import './MultiPicker.scss';

const SORT = [];
const PAGE = {
  skip: 0,
  take: 10,
};
const FILTER = { filters: [] }

/**
 * Multi picker component
 * @module
 * @param {array} data - Data
 * @param {string} textField - Text field
 * @param {array} [selected] - Current selected value
 * @param {func} onChange - Function invoked on filter change
 * @param {func} onSelect - Function invoked on value change
 * @param {bool} [required] - Is field required?
 * @param {string} name - Name
 * @param {string} [validationMessage] - Validation message if field is invalid
 * @param {bool} [disabled] - Is multiselect readonly?
 * @param {number} [tabIndex] - Multiselect tabindex
 * @param {string} [placeholder] - Placeholder
 * @param {string} title - Picker title
 * @param {bool} isLoading - Loading
 * @param {number} total - Total number of items
 * @param {array} schema - Schema for picker
 */
class MultiPickerComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      filter: FILTER,
      selected: null
    }
  }

  handleOpen = (event) => {
    event.preventDefault();
    this.setState({ isOpen: true, selected: this.props.selected });
  }

  handleClose = () => {
    this.setState({ isOpen: false });
  }

  handleFilter = (filter) => {
    this.setState({ filter });
  }

  handleSelect = (selected, isCopy, selectedAll) => {
    this.setState({ selected: [...selected, ...selectedAll] });
  }

  handleConfirm = () => {
    const { selected } = this.state;
    this.setState({ isOpen: false, filter: FILTER });
    this.props.onSelect(this.props.name, selected);
  }

  onChange = (filter, sort, page) => {
    this.setState({ filter });
    this.props.onChange(filter, sort || SORT, page || PAGE, this.props.primaryField);
  }

  getFilter = () => {
    const filter = this.state.filter.filters.filter(el => el.field === this.props.textField)[0];
    return (filter && filter.value) || null;
  }

  render() {
    return (
      <div className="multipicker">
        <MultiSelect
          name={this.props.name}
          data={this.props.data}
          onChange={this.props.onSelect}
          value={this.props.selected}
          textField={this.props.textField}
          dataItemKey={this.props.textField}
          disabled={this.props.disabled}
          required={this.props.required}
          validationMessage={this.props.validationMessage}
          tabIndex={this.props.tabIndex}
          onBlur={this.props.onBlur}
          onFilterChange={this.onChange}
          placeholder={this.props.placeholder}
          filter={this.getFilter()}
        />
        <Button
          type="button"
          onClick={this.handleOpen}
          icon="more-vertical"
          disabled={this.props.disabled}
        />
        <Dialog
          isOpen={this.props.isOpen || this.state.isOpen}
          title={this.props.title}
          onClose={this.handleClose}
          onConfirm={this.handleConfirm}
          confirmDisabled={!this.state.selected}
        >
          <Grid
            total={this.props.total}
            data={this.props.data}
            isLoading={this.props.isLoading}
            onChange={this.onChange}
            schema={this.props.schema}
            multiple={true}
            toolbarHidden={true}
            filter={this.state.filter}
            onFilter={this.handleFilter}
            onSelect={this.handleSelect}
            selected={this.props.selected}
            primaryField={this.props.primaryField}
            isPicker
            currentDataItem={this.props.currentDataItem}
            hidden={flags.PRINT | flags.RESET | flags.LEFT_TOOLBAR | flags.EDITCELL}
            rememberSelection={true}
          />
        </Dialog>
      </div>
    );
  }
}

MultiPickerComponent.propTypes = {
  data: PropTypes.array.isRequired,
  textField: PropTypes.string.isRequired,
  selected: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
  validationMessage: PropTypes.string,
  disabled: PropTypes.bool,
  tabIndex: PropTypes.number,
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  total: PropTypes.number.isRequired,
  schema: PropTypes.array.isRequired,
}

export default MultiPickerComponent;