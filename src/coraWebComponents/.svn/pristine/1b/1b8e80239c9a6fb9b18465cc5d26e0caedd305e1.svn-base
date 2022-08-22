import * as React from 'react';
import PropTypes from 'prop-types';
import Dialog from '../dialogs/Dialog';
import Button from '../buttons/Button';
import DropDownList from '../forms/DropDownList';
import DialogFilterForm from './DialogFilterForm';
import SaveFilter from './SaveFilterDialog';
import './DialogFilter.scss';
import { buildFilter, buildUrl } from '../utils/helper';

/**
 * Filter in dialog
 * @module
 * @param {array} schema - Schema
 * @param {object} [parentProps] - Parent props
 * @param {bool} isOpen - Is dialog open?
 * @param {func} handleOpenFilter - Function to open filter
 * @param {func} handleCloseFilter - Functions to close filter
 * @param {object} filter - Filter
 * @param {string} enumDefault - Default value in enum
 * @param {sting} primaryField - Primary field
 * @param {bool} userFilter - User filter
 * @param {array} [userFilterList] - List of user filters
 */
class DialogFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenSaveDialog: false,
      selectFilter: null,
      filter: null
    }
    this.dialogRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.userFilter) {
      this.props.getFilterList();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.userFilter) {
      if (this.props.filter !== prevProps.filter) {
        if ((this.state.filter && this.isFilterChanged(this.state.filter.filters, this.props.filter.filters))) {
          this.setState({
            filter: null,
            selectFilter: null
          })
        }
      }
    }
  }

  isFilterChanged = (oldData, newData) => {
    if (newData.length === oldData.length) {
      for (let i = 0; i < newData.length; i++) {
        if (newData[i].value !== oldData[i].value || newData[i].field !== oldData[i].field || newData[i].operator !== oldData[i].operator) {
          return true;
        }
      }
    } else return true;
    return false;
  }

  handleDeleteFilter = () => {
    if (this.state.selectFilter) {
      this.props.deleteFilter(this.state.selectFilter.id);
      this.setState({
        filter: null,
        selectFilter: null
      })
    }
  }

  handleChangeUserFilter = (name, value) => {
    const newFilter = { filters: value.filters }
    this.setState({
      selectFilter: value,
      filter: newFilter
    });
  }

  handleSaveFilter = (name) => {
    const input = this.dialogRef.current.state.input;
    const newFilter = buildFilter(input, this.props.schema);
    const filter = { name, filters: newFilter.filters };
    this.props.createFilter(filter);
    this.handleChangeUserFilter("selectFilter", filter)
    this.handleCloseSaveDialog();
  }

  handleOpenSaveDialog = () => {
    this.setState({ isOpenSaveDialog: true });
  }

  handleCloseSaveDialog = () => {
    this.setState({ isOpenSaveDialog: false });
  }

  handleConfirmFilter = () => {
    const input = this.dialogRef.current.state.input;
    const newFilter = buildFilter(input, this.props.schema);
    this.props.handleConfirmFilter(newFilter);
  }

  render() {
    return (
      <>
        <Dialog
          isOpen={this.props.isOpen}
          onClose={this.props.handleCloseFilter}
          onConfirm={this.handleConfirmFilter}
          title="Filter"
        >
          <div>
            {this.props.userFilter &&
              <div className="filter-toolbar">
                <div className="left">
                  <Button
                    onClick={this.handleOpenSaveDialog}
                    title="Uložiť filter"
                    imageUrl={buildUrl('assets/toolbar_cg_new.svg')}
                  />
                  <Button
                    onClick={this.handleDeleteFilter}
                    title="Zmazať filter"
                    disabled={!this.state.selectFilter}
                    imageUrl={buildUrl('assets/toolbar_cg_delete.svg')}
                  />
                </div>
                <DropDownList
                  name={'selectFilter'}
                  data={this.props.userFilterList || []}
                  textField="name"
                  onChange={this.handleChangeUserFilter}
                  value={this.state.selectFilter || { name: ' - ', filters: [] }}
                  defaultItem={{ name: ' - ', filters: [] }}
                />
              </div>
            }

            <DialogFilterForm
              ref={this.dialogRef}
              schema={this.props.schema}
              parentProps={this.props.parentProps}
              filter={this.state.filter || this.props.filter}
              enumDefault={this.props.enumDefault}
            />
          </div>
        </Dialog>
        <SaveFilter
          isOpen={this.state.isOpenSaveDialog}
          handleClose={this.handleCloseSaveDialog}
          handleConfirm={this.handleSaveFilter}
        />
      </>
    );
  }
}

DialogFilter.propTypes = {
  schema: PropTypes.array.isRequired,
  parentProps: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  handleOpenFilter: PropTypes.func.isRequired,
  handleCloseFilter: PropTypes.func.isRequired,
  handleConfirmFilter: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired,
  enumDefault: PropTypes.string.isRequired,
  primaryField: PropTypes.string.isRequired,
  userFilter: PropTypes.bool.isRequired,
  userFilterList: PropTypes.array
}

export default DialogFilter;