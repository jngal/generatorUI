import * as React from 'react';
import PropTypes from 'prop-types';
import Dialog from '../dialogs/Dialog';
import DropDownList from '../forms/DropDownList';
import Sortable from "../sortable/Sortable";
import Button from "../buttons/Button";
import './DialogSort.scss';
import { buildUrl } from '../utils/helper';

const SortableItemUI = (props) => {
  const { attributes, dataItem, forwardRef } = props;

  return (
    <div
      ref={forwardRef}
      {...attributes}
      className="col-12"
    >
      <div className="k-form-field" key={dataItem.field}>
        <div className="reorder"></div>
        <span className="title">{dataItem.title}</span>
        <div>
          <DropDownList
            name={dataItem.field}
            textField="textDir"
            dataItemKey="dir"
            data={_dirData}
            onChange={props.handleChange}
            value={dataItem}
          />
        </div>
        <div>
          <Button
            onClick={() => props.removeSort(dataItem)}
            icon="close"
          />
        </div>
      </div>
    </div>
  );
};

const _initState = {
  sort: [],
  columns: [],
  isNewSort: false,
  newSort: {}
}
const _dirData = [{ dir: "asc", textDir: "vzostupne" }, { dir: "desc", textDir: "zostupne" }];

/**
 * Sort in dialog
 * @module
 * @param {bool} isOpen - Is dialog open?
 * @param {func} handleCloseSort - Functions to close dialog
 * @param {func} handleCloseSort - Functions to confirm dialog
 * @param {array} sort - Sort
 * @param {array} schema - Schema
 */
class DialogSort extends React.Component {
  constructor(props) {
    super(props);

    this.state = _initState;
  }

  onDragOver = (event) => {
    this.setState({ sort: event.newState });
  }

  onNavigate = (event) => {
    this.setState({ sort: event.newState });
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.prerareData();
    }
  }

  prerareData = () => {
    let columns = this.props.schema.map(col => ({ field: col.field + (col.textField ? "." + col.textField : ""), title: col.title }));
    const sort = this.props.sort.map(item => ({
      ...item,
      title: columns.find(col => col.field === item.field).title,
      textDir: _dirData.find(el => el.dir === item.dir).textDir
    }));
    columns = columns.filter(col => !sort.some(el => el.field === col.field));
    this.setState({ ..._initState, sort, columns });
  }

  handleConfirmSort = () => {
    const sort = this.state.sort.map(({ title, textDir, ...item }) => item);
    this.props.handleConfirmSort(sort);
  }

  removeSort = (item) => {
    const columns = [...this.state.columns, { field: item.field, title: item.title }]
    const sort = this.state.sort.filter(el => el !== item);
    this.setState({ sort, columns });
  }

  handleChange = (name, value) => {
    const sort = this.state.sort.map(item => item.field === name ? { ...item, ...value } : item);
    this.setState({ sort });
  }

  handleAddNewSort = () => {
    this.setState({ isNewSort: true, newSort: { ...this.state.columns[0], ..._dirData[0] } });
  }

  handleCloseNewSort = () => {
    this.setState({ isNewSort: false });
  }

  handleChangeNewSort = (name, value) => {
    this.setState(state => ({ newSort: { ...state.newSort, ...value } }));
  }

  addNewSort = () => {
    const columns = this.state.columns.filter(el => el.field !== this.state.newSort.field)
    this.setState(state => ({
      sort: [...state.sort, this.state.newSort],
      columns
    }));
    this.handleCloseNewSort();
  }

  render() {
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.handleCloseSort}
        onConfirm={this.handleConfirmSort}
        title="Zoradenie"
        className="dialog-sort"
      >
        <div>
          <div className="sort-toolbar">
            <div className="left">
              <Button
                onClick={this.handleAddNewSort}
                title="Pridať zoradenie"
                imageUrl={buildUrl('assets/toolbar_cg_new.svg')}
                disabled={this.state.columns.length === 0}
              />
            </div>
          </div>

          <div className="k-form-inline">
            {this.state.sort.length > 0 &&
              <Sortable
                idField="field"
                SortableItemUI={(e) => SortableItemUI(
                  {
                    ...e,
                    handleChange: this.handleChange,
                    removeSort: this.removeSort
                  }
                )}
                data={this.state.sort}
                onDragOver={this.onDragOver}
                onNavigate={this.onNavigate}
              />
            }
            {this.state.isNewSort &&
              <div className="k-form-field col-12 newSort">
                <div className="title">
                  <DropDownList
                    name="title"
                    data={this.state.columns}
                    onChange={this.handleChangeNewSort}
                    value={this.state.newSort}
                    textField="title"
                  />
                </div>
                <div>
                  <DropDownList
                    name="dir"
                    textField="textDir"
                    dataItemKey="dir"
                    data={_dirData}
                    onChange={this.handleChangeNewSort}
                    value={this.state.newSort}
                  />
                </div>
                <Button
                  onClick={this.addNewSort}
                  icon="check"
                />
                <Button
                  onClick={this.handleCloseNewSort}
                  icon="close"
                />
              </div>
            }
          </div>
        </div>
      </Dialog>
    );
  }
}

DialogSort.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleCloseSort: PropTypes.func.isRequired,
  handleConfirmSort: PropTypes.func.isRequired,
  sort: PropTypes.array.isRequired,
  schema: PropTypes.array,
}

export default DialogSort;