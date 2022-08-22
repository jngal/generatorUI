import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@progress/kendo-react-buttons';
import AutoComplete from './Autocomplete';
import Grid from '../grid/Grid';
import Dialog from '../dialogs/Dialog';
import _ from 'lodash';
import Tabs from '../TabsWrapper';
import Tab from '../Tab';
import eventEmitter from '../utils/eventEmitter';
import flags from '../utils/flags';
import './Picker.scss';

const buildFilter = (selected, textField) => {
  if(!selected) {
    return {
      filters: []
    };
  }

  return {
    logic: 'and',
    filters: [
      { 
        field: textField, 
        operator: "contains", 
        value: _.get(selected, textField.split('.'))
      }
    ]
  }
}

let _flag;

/**
 * Picker component
 * @module
 * @param {string} name - Name
 * @param {string} title - Picker title
 * @param {string} textField - Text field
 * @param {func} onChange - Function invoked on value change
 * @param {func} [onSubmit] - Function invoked on sumbit
 * @param {array} data - All data for picker
 * @param {bool} isLoading - Loading
 * @param {func} onSelect - Function invoked on item select
 * @param {object} [selected] - Current selected item
 * @param {number} total - Total number of items
 * @param {array} schema - Schema for picker
 * @param {bool} [required] - Is picker required?
 * @param {bool} [disabled] - Is picker readonly?
 * @param {string} [validationMessage] - Validation message if field is invalid
 * @param {string} [primaryField] - Primary field
 * @param {func} [onOpened] - Function invoked on picker open
 * @param {object} [initFilter] - Filter, can be canceled
 * @param {object} [fixedFilter] - Filter, can't be canceled
 * @param {bool} [autofocus] - Should picker be focused?
 * @param {string} [placeholder] - Picker placeholder
 * @param {any} [detail] - Detail, create new record (null = without this function)
 * @param {func} [onAdd] - Function invoked on add entry
 * @param {number} [tabIndex] - Picker tab index
 * @param {bool} [isOpen] - Is picker open?
 * @param {func} [openPicker] - Function invoked on picker open
 * @param {func} [closePicker] - Function invoked on picker close
 */

class PickerComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      filter: props.initFilter || {filters:[]},
      selected: null
    }
  }

  handleOpen = (event) => {
    event.preventDefault();
    this.setState({isOpen: true});
    if(this.props.openPicker !== undefined) {
      this.props.openPicker();
    }

    if(this.props.onOpened)
      this.props.onOpened();
  }

  handleClose = () => {
    _flag = false;
    if(this.props.closePicker !== undefined) {
      this.props.closePicker();
    }
    this.setState({isOpen: false});
  }

  handleFilter = (filter) => {
    this.setState({filter});
  }

  handleSelect = selected => {
    _flag = true;
    this.setState({selected: selected[0]});
  }

  handleConfirm = async () => {
    _flag = false
    const { selected } = this.state;
    const filter = buildFilter(selected, this.props.textField);
    this.setState({isOpen: false, filter});
    await this.props.onSelect(this.props.name, selected);
    this.handleBlur();
  }

  handleSelectAndConfirm = async selected => {
    this.setState({selected});
    await this.props.onSelect(this.props.name, selected);
    this.dataCheck();
    this.handleBlur();
  }

  processFilter = (filter) => {
    let processedFilter = filter;
    if(this.props.fixedFilter) {
      processedFilter = {filters: [...filter.filters, ...this.props.fixedFilter.filters]};
    }
    return processedFilter;
  }

  applyFilter = (id) => {
    this.props.onChange({filters: [{field: this.props.primaryField, operator: "eq", value: id}]}, [], {skip:0, take:1});
    this.handleFilter({filters: [{field: this.props.primaryField, operator: "eq", value: id}]});
    if(this.props.onSubmit){
      this.props.onSubmit();
    }
    eventEmitter.changeTab(this.props.primaryField, 0);
  }

  onChange = (filter, sort, page) => {
    if(filter){
      this.props.onChange(this.processFilter(filter), sort, page, this.props.primaryField);
    }
    else {
      let page = sessionStorage.Page ? JSON.parse(sessionStorage.Page) : [0,5];
      this.props.onChange(this.processFilter(this.state.filter), "", page, this.props.primaryField);
      eventEmitter.changeTab(this.props.primaryField, 0);
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { selected } = props;
    
    if(_flag || selected === state.selected) {
      return null;
    }

    const filter = buildFilter(selected, props.textField);
    return { filter, selected };
  }

  handleBlur = () => {
    this.dataCheck();
    if(this.props.onBlur) {
      this.props.onBlur();
    }
  }

  dataCheck = () => {
    if(!this.props.selected || Object.keys(this.props.selected).length === 0){
      this.setState({ selected: null })
    }
  }

  onAdd = async () => {
    if(this.props.onAdd){
      await this.props.onAdd();
    }
    eventEmitter.changeTab(this.props.primaryField, 1);
  }

  render() {
    return (
      <div className="picker">
        <AutoComplete
          textField={this.props.textField}
          valueField={this.props.valueField}
          primaryField={this.props.primaryField}
          selected={this.props.selected}
          onChange={this.onChange}
          data={this.props.data}
          isLoading={this.props.isLoading}
          onSelect={this.handleSelectAndConfirm}
          onBlur={this.handleBlur}
          filter={this.state.filter}
          onFilter={this.handleFilter}
          required={this.props.required}
          disabled={this.props.disabled}
          validationMessage={this.props.validationMessage}
          autofocus={this.props.autofocus}
          placeholder={this.props.placeholder}
          tabIndex={this.props.tabIndex}
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
          {this.props.detail ?
          <Tabs name={this.props.primaryField}>
            <Tab title="Zoznam">
              <Grid 
                total={this.props.total}
                data={this.props.data}
                isLoading={this.props.isLoading}
                onChange={this.onChange}
                schema={this.props.schema}
                toolbarHidden={false}
                filter={this.state.filter}
                onFilter={this.handleFilter}
                onSelect={this.handleSelect}
                primaryField={this.props.primaryField}
                onConfirm={this.handleConfirm}
                onAdd={this.onAdd}
                isPicker
                currentDataItem={this.props.currentDataItem}
                hidden={flags.PRINT | flags.RESET | flags.EDITCELL}
              />
            </Tab>
            <Tab title="Detail">
              {React.cloneElement(this.props.detail, { isPicker: true, onSubmit: () => { return null; }, applyFilter: this.applyFilter })}
            </Tab>
          </Tabs> 
          :
          <Grid 
            total={this.props.total}
            data={this.props.data}
            isLoading={this.props.isLoading}
            onChange={this.onChange}
            schema={this.props.schema}
            toolbarHidden={true}
            filter={this.state.filter}
            onFilter={this.handleFilter}
            onSelect={this.handleSelect}
            primaryField={this.props.primaryField}
            onConfirm={this.handleConfirm}
            isPicker
            currentDataItem={this.props.currentDataItem} 
            hidden={flags.PRINT | flags.RESET | flags.LEFT_TOOLBAR | flags.EDITCELL}
          />
          }
        </Dialog>
      </div>
    );
  }
}

PickerComponent.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  textField: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.object,
  total: PropTypes.number.isRequired,
  schema: PropTypes.array.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  validationMessage: PropTypes.string,
  primaryField: PropTypes.string,
  onOpened: PropTypes.func,
  //initFilter - filter, ktorý je clear-nuteľný
  initFilter: PropTypes.object,
  //fixedFilter - filter, ktorý nie je možné odstrániť
  fixedFilter: PropTypes.object,
  autofocus: PropTypes.bool,
  placeholder: PropTypes.string,
  
  //Vytvorenie nového záznamu v pickeri (null = bez tejto možnosti)
  detail: PropTypes.any,
  onAdd: PropTypes.func,
  tabIndex: PropTypes.number,
  isOpen: PropTypes.bool,
  openPicker: PropTypes.func,
  closePicker: PropTypes.func
}

export default PickerComponent;