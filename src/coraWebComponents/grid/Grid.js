import './Grid.scss';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import PropTypes from 'prop-types';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import React from 'react';
import ConfirmDialog from '../dialogs/ConfirmDialog';
import ReportDialog from '../dialogs/ReportDialog';
import FileDialog from '../dialogs/FileDialog';
import LoadingPanel from '../LoadingPanel';
import sk from '../res/sk.json';
import withStorage from '../utils/withStorage';
import withMeta from '../utils/withMeta';
import ColumnMenu from './ColumnMenu';
import DialogFilter from './DialogFilter';
import DialogSort from './DialogSort';
import eventEmitter from '../utils/eventEmitter';
import DropdownFilterCell from './DropdownFilterCell';
import SelectionMenu from './SelectionMenu';
import ValidationAlert from '../ValidationAlert';
import Toolbar from './Toolbar';
import flags from '../utils/flags';
import { eachDeep, copyToClipboard, removeAccents } from '../utils/helper';
import moment from 'moment'
import _ from 'lodash';

import { Popup } from '@progress/kendo-react-popup';
import { Menu, MenuItem } from '@progress/kendo-react-layout';

import { Cell } from './Cell'
import { EditCommandCell } from './EditCommandCell'
import { EditBooleanCell } from './EditBooleanCell'
import { EditBooleanCheckCell } from './EditBooleanCheckCell'
import { EditDropdownCell } from './EditDropdownCell'
import { EditPickerCell } from './EditPickerCell'
import { EditDateTimeCell } from './EditDateTimeCell'
import { EditTimeCell } from './EditTimeCell'
import { FileCell } from './FileCell'


const SORT = [];
const PAGE = {
  skip: 0,
  take: 5
};
const FILTER = {
  filters: []
};

const ENUM_DEFAULT = '-';
const DATE_FORMATS = ['DD.MM.YYYY', 'D.M.YYYY', 'YYYYMMDD', 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DDTHH:mm:ssZ'];

const FILTER_OPERATORS = {
  text: [
    { text: 'grid.filterContainsOperator', operator: 'contains' },
    { text: 'grid.filterNotContainsOperator', operator: 'doesnotcontain' },
    { text: 'grid.filterEqOperator', operator: 'eq' },
    { text: 'grid.filterNotEqOperator', operator: 'neq' },
    { text: 'grid.filterStartsWithOperator', operator: 'startswith' },
    { text: 'grid.filterEndsWithOperator', operator: 'endswith' },
    { text: 'grid.filterIsEmptyOperator', operator: 'isempty' },
    { text: 'grid.filterIsNotEmptyOperator', operator: 'isnotempty' }
  ],
  numeric: [
    { text: 'grid.filterEqOperator', operator: 'eq' },
    { text: 'grid.filterNotEqOperator', operator: 'neq' },
    { text: 'grid.filterGteOperator', operator: 'gte' },
    { text: 'grid.filterGtOperator', operator: 'gt' },
    { text: 'grid.filterLteOperator', operator: 'lte' },
    { text: 'grid.filterLtOperator', operator: 'lt' },
    { text: 'grid.filterIsNullOperator', operator: 'isnull' },
    { text: 'grid.filterIsNotNullOperator', operator: 'isnotnull' }
  ],
  date: [
    { text: 'grid.filterEqOperator', operator: 'eq' },
    { text: 'grid.filterNotEqOperator', operator: 'neq' },
    { text: 'grid.filterAfterOrEqualOperator', operator: 'gte' },
    { text: 'grid.filterAfterOperator', operator: 'gt' },
    { text: 'grid.filterBeforeOperator', operator: 'lt' },
    { text: 'grid.filterBeforeOrEqualOperator', operator: 'lte' },
    { text: 'grid.filterIsNullOperator', operator: 'isnull' },
    { text: 'grid.filterIsNotNullOperator', operator: 'isnotnull' }
  ],
  boolean: [
    { text: 'grid.filterBooleanAll', operator: '' },
    { text: 'grid.filterIsTrue', operator: true },
    { text: 'grid.filterIsFalse', operator: false }
  ]
};

let _timer;
let _lastRowClick;
let _lastRowEvent;
let _lastRowIndex = 0;
let _lastCell = null;
let _refresh, _reselect;
let _contextMenuItem;
let _contextMenuBlurTimeoutRef;
let _contextMenuWrapperRef;
let _preventKey = false;
let _column;

/**
 * @typedef {Object} gridSchema
 * @property {string} field - Unique field identifier
 * @property {string} title - Field name
 * @property {(number|string)} width - Field width, "auto" for field expansion
 * @property {(number|string)} compactWidth - Field width in compact mode, "auto" for field expansion
 * @property {string} filter - Filter type - "numeric", "boolean", "date", "text", "enum", "container", "cmd" - unfilterable, unsortable column
 * @property {func} cell - Own custom cell, function
 * @property {number} order - Order of column in grid
 * @property {bool} disabled - Is column hidden?
 * @property {string} tooltip - Tooltip over the column
 * @property {string} textField - Name of shown field, if type is container
 */

/**
 * Grid Component 
 * @module
 * @param {array} [actions] - Types of actions for toolbar selector of items
 * @param {bool} [cellSelect] - is Cell selected? 
 * @param {func} [cellRender] - Cell render function
 * @param {string} [className] - Grid class name
 * @param {array} [contextMenu] - Row context menu
 * @param {array} data - Grid data
 * @param {object} [dataItem] - Data item for context menu item
 * @param {any} [detail] - Specifies a React element that will be cloned and rendered inside the detail rows of the currently expanded items
 * @param {number} [disabled] - Disable for toolbar actions, also needs flags
 * @param {string} [discardText] - Discard text for edited and unsaved entry
 * @param {func} [enterEdit] - Enter cell edit function
 * @param {func} [exitEdit] - Exit cell edit function
 * @param {object} [filter] - Filter
 * @param {string} [format] - Custom date format
 * @param {func} [formatData] - Format data function
 * @param {number} [hidden] - Hiding toolbar buttons, also needs flex
 * @param {bool} isLoading - Is loading
 * @param {string} [imgName] - Img name for export
 * @param {object} [initFilter] - Init filter
 * @param {array} [initSort] - Init sort 
 * @param {func} [isInvalid] - Check if data are invalid, function
 * @param {bool} [isPicker] - Is picker
 * @param {bool} [modified] - Are data modified?
 * @param {bool} [multiple] - Able to select multiple rows at once
 * @param {func} [onAbortChanges] - On abort changes function
 * @param {func} [onAbortChangesAll] - On abort changes all function
 * @param {func} [onAdd] - Function invoked on entry add
 * @param {func} [onActionSelect] - On action select function
 * @param {func} [onCancel] - Function invoked on entry cancel
 * @param {func} onChange - On change function
 * @param {func} [onConfirm] - On confirm function
 * @param {func} [onContextMenuSelect] - On context menu select function
 * @param {func} [onCopy] - Function invoked on entry copy
 * @param {func} [onDelete] - Function invoked on entry delete
 * @param {func} [onExpandChange] - On expand change function
 * @param {func} [onFilter] - On filter function
 * @param {func} [onGetSchema] - On get schema function
 * @param {func} [onRowDoubleClick] - On row double click function
 * @param {func} [onSelect] - On select function
 * @param {func} [onUpdate] - On update function
 * @param {func} [onUpdateAll] - On update all function
 * @param {object} [parentProps] - Parent props
 * @param {func} [parseValue] - Parse value function
 * @param {string} primaryField - Primary field
 * @param {bool} [rememberSelection] - Should entries stay checked after going to the next page?
 * @param {func} [rowProps] - Row props function
 * @param {gridSchema[]} schema - Grid schema
 * @param {array} [selected] - Selected entries
 * @param {object} storage - Storage
 * @param {object} [style] - Styles object
 * @param {bool} [toolbarHidden] - Should toolbar be hidden?
 * @param {number} total - Defines the total number of data items in all pages
 * @param {string} [filterField] - If filter field is different from primary field
 */
class GridComponent extends React.Component {
  EditCommandCell;
  EditPickerCell;
  EditDropdownCell;
  EditDateTimeCell;
  EditTimeCell;
  FileCell;
  alertTimeout;

  constructor(props) {
    super(props);

    this.state = {
      page: PAGE,
      filter: FILTER,
      sort: SORT,
      isOpenDelete: false,
      selected: [],
      selectedAll: [],
      columns: props.schema,
      isOpenDiscard: false,
      isOpenFilter: false,
      isOpenSort: false,
      isOpenReportDialog: false,
      filterable: !(props.disabled & flags.FILTER),
      blob: null,
      fileName: null,
      data: this.props.data || [],
      dataInvalid: false,
      selectedCells: [],
      selectedCellsAll: [],
      contextMenuPopupOpen: false,
      selectedFile: null,
      userFilter: [],
      isSchemaLoading: false
    }

    this.columns = [];
    this.visibleColumns = [];
    this.oldData = [];

    this.setColumns();

    if (!(props.hidden & flags.EDIT) || !(props.hidden & flags.EDITALL) || !(props.hidden & flags.EDITCELL)) {
      this.EditCommandCell = EditCommandCell({
        edit: this.enterEdit,
        update: this.update,
        abortChanges: this.abortChanges,
        editField: "inEdit"
      });

      this.EditPickerCell = EditPickerCell({
        getProps: this.getParentProps,
        itemChange: this.itemChange,
        getColumns: this.getColumns
      })

      this.EditDropdownCell = EditDropdownCell({
        getProps: this.getParentProps,
        itemChange: this.itemChange,
        getColumns: this.getColumns
      })

      this.EditDateTimeCell = EditDateTimeCell()

      this.EditTimeCell = EditTimeCell()
    }

    this.FileCell = FileCell({
      onClick: this.handleFileClick
    })

    this.ref = React.createRef();
    this.selected = [];
    this.selectedCells = [];

    document.addEventListener('paste', this.handlePaste);
  }


  getFilterList = async () => {
    try {
      let res = await this.props.meta.getFilterList(this.props.primaryField);
      this.setState({ userFilter: res });
    }
    catch (error) {
      this.setState({ userFilter: [] });
    }
  }

  createFilter = async (data) => {
    try {
      await this.props.meta.createFilter(this.props.primaryField, data);
      this.getFilterList();
    }
    catch (error) {

    }
  }

  deleteFilter = async (id) => {
    try {
      await this.props.meta.deleteFilter(this.props.primaryField, id);
      this.setState(state => ({
        userFilter: state.userFilter.filter(x => x.id !== id)
      }))
    }
    catch (error) {

    }
  }

  setColumns = () => {
    this.columns = this.getColumns();
    this.visibleColumns = this.getVisibleColumns();
  }

  getParentProps = () => {
    return this.props;
  }

  getColumns = () => {
    let columns = [];
    eachDeep(this.state.columns, null, (item, parent) => {
      if (item.filter !== 'group' && item.field && (!parent || parent.filter !== 'container')) {
        columns.push(item);
      }
    });
    return columns;
  }

  getVisibleColumns = () => {
    return _.sortBy(this.columns
      .filter(x => !x.disabled && !x.hidden)
      .map(col => ({ ...col, field: col.field + (col.textField ? "." + col.textField : "") }))
      , x => { return x.order ? x.order : 0 });
  }

  getColOffset = () => {
    return (this.props.hidden & flags.COLUMN_MENU ? 0 : 1) + (this.props.multiple && (!(this.props.hidden & flags.COLUMN_SELECTED)) ? 1 : 0) + (this.props.detail ? 1 : 0);
  }

  getCurrentCell = () => {
    return this.state.selectedCells[this.state.selectedCells.length - 1];
  }

  getChecked = (selected) => {
    if (!selected.length) {
      return false
    }
    else if (this.props.data.length === selected.length) {
      return true;
    }
    else {
      return null;
    }
  }

  handleOpenSort = () => {
    this.setState({ isOpenSort: true });
  }

  handleCloseSort = () => {
    this.setState({ isOpenSort: false });
  }

  handleConfirmSort = (sort) => {
    this.handleCloseSort();
    this.onSortChange({ sort })
  }

  handleOpenFilter = () => {
    this.setState({ isOpenFilter: true });
  }

  handleCloseFilter = () => {
    this.setState({ isOpenFilter: false });
  }

  handleConfirmFilter = (filter) => {
    this.handleCloseFilter();
    this.onFilterChange({ filter }, false)
  }

  handleOpenDelete = () => {
    this.setState({ isOpenDelete: true });
  }

  handleCloseDelete = () => {
    this.setState({ isOpenDelete: false });
  }

  handleOpenDiscard = () => {
    this.setState({ isOpenDiscard: true });
  }

  handleCloseDiscard = () => {
    this.setState({ isOpenDiscard: false });
  }

  handleCloseFile = () => {
    this.setState({ selectedFile: null });
  }

  handleConfirmDiscard = () => {
    this.rowClick(_lastRowEvent);
    this.handleCloseDiscard();
  }

  handleFileClick = (field, dataItem) => {
    _column = this.state.columns.find(x => x.field === field);
    this.setState({ selectedFile: dataItem });
  }

  handleCloseReportDialog = () => {
    this.setState({ isOpenReportDialog: false });
  }

  handleConfirmDelete = () => {
    this.props.onDelete({ ...this.state.selected[0] });
    this.setState({ selected: [], selectedCells: [], selectedAll: [], selectedCellsAll: [] })
    this.handleCloseDelete();
  }

  handleClickDetail = (item) => {
    this.setState({ isDetailOpen: true });
  }

  handleDetailClose = () => {
    this.setState({ isDetailOpen: false });
  }

  handleChangePage = (page) => {
    this.setState({ page });
    const filter = this.props.filter || this.state.filter;
    this.props.onChange(filter, this.state.sort, page);
  }

  handleChangeFilterable = (filterable) => {
    if (!(this.props.disabled & flags.FILTER) && filterable.filterable !== null) {
      this.setState({ filterable: filterable.filterable });
    }
  }

  processFilter = (filter) => {
    if (filter === null) {
      return FILTER;
    }
    return filter;
  }

  clearSelected = () => {
    this.setState({ selected: [], selectedCells: [], selectedAll: [], selectedCellsAll: [] });
    this.props.onSelect([], false, this.state.selectedAll, []);
  }

  onFilterChange = (event, timeout = true) => {
    let filter = this.processFilter(event.filter);
    const page = { ...this.state.page, skip: 0 };
    this.prepareRememberSelection();
    this.setState({ filter, page });
    if (this.props.onFilter) {
      this.props.onFilter(filter);
    }

    if (timeout) {
      if (_timer) {
        clearTimeout(_timer);
      }
      _timer = setTimeout(() => {
        this.props.onChange(filter, this.state.sort, page);
      }, 500);
    }
    else {
      this.props.onChange(filter, this.state.sort, page);
    }
  }

  onSortChange = (event) => {
    const sort = event.sort;
    const filter = this.props.filter || this.state.filter;
    this.prepareRememberSelection();
    this.props.onChange(filter, sort, this.state.page);
    this.setState({ sort });
    this.applyGlobalization();
    this.updateSort(sort);
  }

  onPageChange = (event) => {
    const page = event.page;
    const filter = this.props.filter || this.state.filter;
    this.prepareRememberSelection();
    this.setState({ page });
    if (_timer) {
      clearTimeout(_timer);
    }
    _timer = setTimeout(() => {
      this.props.onChange(filter, this.state.sort, page);
    }, 200);
    this.props.storage.setPage(page);
  }

  prepareRememberSelection = () => {
    if (this.props.rememberSelection) {
      let currentPageIds = this.props.data.map(item => item[this.props.primaryField]);
      let selectedAll = this.state.selectedAll.filter(item => currentPageIds.indexOf(item[this.props.primaryField]) === -1);
      let selectedCellsAll = this.state.selectedCellsAll.filter(item => currentPageIds.indexOf(item[this.props.primaryField]) === -1);
      selectedAll = _.unionBy(this.state.selected, this.state.selectedAll, this.props.primaryField);
      selectedCellsAll = _.unionWith(this.state.selectedCells, this.state.selectedCellsAll, _.isEqual);
      this.setState({ selected: [], selectedCells: [], selectedAll, selectedCellsAll });
      this.props.onSelect([], false, selectedAll, []);
      _reselect = true;
    }
    else {
      this.setState({ selected: [], selectedCells: [] });
      this.props.onSelect([], false, [], []);
    }
  }

  onAdd = (event) => {
    this.clearSelected();
    this.props.onAdd(event);
  }

  onClear = () => {
    this.onFilterChange({ filter: FILTER }, false);
  }

  selectionChange = (event) => {
    const field = this.getField();
    const select = !event.dataItem.selected;
    const selectedCells = this.getSelectedCells([event.dataItem], select, this.state.selectedCells);
    const selected = select ? [...this.state.selected, event.dataItem] : this.state.selected.filter(x => x[field] !== event.dataItem[field]);

    this.setState((state) => {
      this.props.onSelect(selected, false, state.selectedAll, selectedCells);
      return { selected, selectedCells };
    });
  }

  headerSelectionChange = (event) => {
    const checked = event.syntheticEvent.target.checked;
    const selected = checked && this.state.selected.length === 0 ? this.props.data : [];
    const selectedCells = checked && this.state.selected.length === 0 ? this.getSelectedCells(this.props.data, true, []) : [];
    this.props.onSelect(selected, false, this.state.selectedAll, selectedCells);
    this.setState({ selected, selectedCells });
  }

  buttonSelection = (action) => {
    switch (action) {
      case 0:
        const selectedCells = this.getSelectedCells(this.props.data, true, []);
        this.setState({ selected: this.props.data, selectedCells: selectedCells });
        this.props.onSelect(this.props.data, false, this.state.selectedAll, selectedCells);
        break;
      case 1:
        this.setState({ selected: [], selectedCells: [] });
        this.props.onSelect([], false, this.state.selectedAll, []);
        break;
      default:
        break;
    }
  }

  tryRowClick = (event) => {
    const { primaryField } = this.props;

    if (this.props.modified && !this.state.selected.find(x => x[primaryField] === event.dataItem[primaryField])) {
      _lastRowEvent = event;
      this.handleOpenDiscard();
    }
    else {
      this.rowClick(event);
    }
  }

  rowClick = (event) => {
    let selected = [];
    const field = this.getField();
    if (this.props.multiple) {
      const select = !event.dataItem.selected;
      const current = this.state.data.findIndex(dataItem => dataItem[field] === event.dataItem[field]);

      if (event.nativeEvent && !event.nativeEvent.shiftKey) {
        _lastRowIndex = current;
      }

      if (event.nativeEvent && event.nativeEvent.ctrlKey) {
        const deselect = event.selectedCells.filter(x => x.rowIndex === current).length === 0;
        selected = select ? [...this.state.selected, event.dataItem] :
          (deselect ? this.state.selected.filter(x => x[field] !== event.dataItem[field]) : this.state.selected);
        if (select || deselect) { this.props.onSelect(selected, false, this.state.selectedAll, event.selectedCells); }
      }
      else {
        selected = this.state.data.filter((x, index) => index >= Math.min(_lastRowIndex, current) && index <= Math.max(_lastRowIndex, current));
      }
    }
    else {
      selected = [event.dataItem];
    }
    this.onSelect(selected, event.selectedCells);

    const lastClick = Date.now();

    if (event.type === "click" && selected.length === 1 && this.state.selected.length === 1
      && selected[0][field] === this.state.selected[0][field] && !this.props.onRowDoubleClick) {
      if (lastClick - _lastRowClick < 500 && this.props.onConfirm) {
        for (const row of selected) {
          if (row.inEdit)
            return;
        }

        this.props.onConfirm();
      }
    }

    _lastRowClick = lastClick;
  }

  onSelect = (selected, selectedCells) => {
    this.props.onSelect(selected, false, this.state.selectedAll, selectedCells);
    this.setState({ selected, selectedCells });
  }

  onCopy = () => {
    this.setState({ selected: [], selectedCells: [] });
    this.props.onSelect([], true, this.state.selectedAll, []);
    this.props.onCopy();
  }

  onCancel = () => {
    this.props.onCancel(this.state.selected[0]);
  }

  getField = () => {
    return this.props.primaryField;
  }

  buildWidth = (x) => {
    if (!this.state.filterable && x.compactWidth) {
      return x.compactWidth === 'auto' ? undefined : x.compactWidth;
    }
    if (x.width) {
      return x.width === 'auto' ? undefined : x.width;
    }

    switch (x.filter) {
      case 'numeric':
        return this.state.filterable ? 130 : 80;
      case 'boolean':
        return this.state.filterable ? 100 : 70;
      case 'cmd':
        return this.state.filterable ? 100 : 70;
      case 'date':
        return this.state.filterable ? 190 : 105;
      case 'text':
      case 'enum':
      default:
        return this.state.filterable ? 220 : 105;
    }
  }

  updateSort = (sort) => {
    if (!this.props.isPicker) {
      const s = [...sort, ...this.columns.map(col => ({ field: col.field + (col.textField ? "." + col.textField : ""), disabled: true })).filter(col => !sort.find(s => s.field === col.field))];
      this.props.meta.updateSort(this.props.primaryField, s);
    }
  }

  getColumn = (columns, col) => {
    const field = col.field + (col.textField ? "." + col.textField : "");
    let column = undefined;
    eachDeep(columns, null, (item, parent) => {
      if (item.field && !item.disabled && !item.hidden && item.field === field) {
        column = item;
      }
    });
    return column;
  }

  onColumnReorder = event => {
    const columns = _.cloneDeep(this.state.columns);
    eachDeep(columns, null, (item, parent) => {
      const column = this.getColumn(event.columns, item);
      if (column) {
        item.order = column.orderIndex;
      }
    });

    this.setState({ columns }, () => { this.updateSchema(); });
  }

  onColumnResize = event => {
    if (event.end) {
      const columns = _.cloneDeep(this.state.columns);
      eachDeep(columns, null, (item, parent) => {
        const column = this.getColumn(event.columns, item);
        if (column) {
          item.width = column.width;
        }
      });

      this.setState({ columns }, () => { this.updateSchema(); });
    }
  }

  onColumnsSubmit = (columns) => {
    this.setState({ columns }, () => { this.updateSchema(); });
  }

  getPage = async () => {
    let page = await this.props.storage.getPage();
    if (page) {
      page.skip = 0;
      this.setState({ page });
      return page;
    }
    else {
      return PAGE;
    }
  }

  getFilterable = async () => {
    const filterable = await this.props.storage.getFilterable();
    this.handleChangeFilterable({ filterable });
  }

  getSort = async () => {
    const sort = this.props.initSort || await this.props.meta.getSort(this.props.primaryField);
    this.setState({ sort });
    return sort;
  }

  getSchema = async () => {
    const { onGetSchema } = this.props;

    this.setState({ isSchemaLoading: true });
    const schema = await this.props.meta.getSchema(this.props.primaryField);

    if (this.props.schema.length === 0) {
      if (onGetSchema) {
        this.props.onGetSchema(schema);
      }
      this.setState({ columns: schema.Grid }, () => { this.setColumns(); });
    }
    else {
      if (!this.props.isPicker && schema && schema.Grid && schema.Grid.length > 0) {
        const columns = this.props.schema.map(column => {
          const c = schema.Grid.find(x => x.field === column.field);
          if (c) {
            column.order = c.order;
            column.disabled = c.disabled || column.disabled;
            column.hidden = c.hidden || column.hidden;
            column.width = c.width || column.width;
          }
          return column;
        })
        this.setState({ columns }, () => { this.setColumns(); });
      }
    }

    this.setState({ isSchemaLoading: false });
  }

  getFilter = async () => {
    if (this.props.filter) {
      return this.props.filter;
    }

    const filter = this.props.initFilter || await this.props.storage.getFilter(this.props.filterField || this.props.primaryField);
    this.setState({ filter });
    return filter;
  }

  handleChangeSelected = ({ name, selected }) => {
    if (name === this.props.primaryField) {
      this.onSelect(selected, this.state.selectedCells);
    }
  }

  applyGlobalization() {
    setTimeout(() => {
      for (let key in sk.grid.extra) {
        let elementsToTranslate = document.querySelectorAll(key);
        for (let element of elementsToTranslate) {
          if (element.getAttribute('title') === null)
            element.setAttribute('title', sk.grid.extra[key]);
        }
      }
    }, 500);
  }

  componentWillMount() {
    eventEmitter.on('CHANGE_PAGE', this.handleChangePage);
    eventEmitter.on('CHANGE_FILTERABLE', this.handleChangeFilterable);
    eventEmitter.on('CHANGE_SELECTED', this.handleChangeSelected);
  }

  getSelected = () => {
    if (this.props.selected && this.props.rememberSelection) {
      _reselect = true;
      const pageIds = this.props.data.map(item => item[this.props.primaryField]);
      const selected = this.props.selected.filter(item => pageIds.indexOf(item[this.props.primaryField]) !== -1);
      const selectedAll = this.props.selected.filter(item => pageIds.indexOf(item[this.props.primaryField]) === -1);
      this.setState({ selected, selectedAll });
    }
  }

  async init() {
    await this.getSchema();
    await this.getFilterable();
    const sort = await this.getSort();
    let page = await this.getPage();
    const filter = await this.getFilter();
    this.props.onChange(filter, sort, page);
    this.getSelected();
  }

  async componentDidMount() {
    await this.init();
    this.applyGlobalization();
  }

  isDataChanged = (oldData, newData) => {
    if (newData.length === oldData.length) {
      for (let i = 0; i < newData.length; i++) {
        for (let j = 0; j < this.columns.length; j++) {
          const field = this.columns[j].field.split('.');
          if (_.get(newData[i], field) !== _.get(oldData[i], field)) {
            return true;
          }
        }
      }
    } else return true;
    return false;
  }

  isSchemaChanged = (oldSchema, newSchema) => {
    if (newSchema.length === oldSchema.length) {
      let oldCols = [];
      let newCols = [];
      eachDeep(oldSchema, null, (item) => {
        if (item.filter !== 'group' && item.field) {
          oldCols.push({ field: item.field, disabled: item.disabled });
        }
      });
      eachDeep(newSchema, null, (item) => {
        if (item.filter !== 'group' && item.field) {
          newCols.push({ field: item.field, disabled: item.disabled });
        }
      });
      return !_.isEqual(newCols, oldCols)
    } else return true;
  }

  componentDidUpdate(prevProps, prevState) {
    const isDataChanged = this.isDataChanged(prevProps.data, this.props.data);
    const isSchemaChanged = this.isSchemaChanged(prevProps.schema, this.props.schema);

    if (isSchemaChanged && this.props.schema.length > 0) {
      this.setState({ columns: this.props.schema }, () => { this.setColumns(); });
    }
    if (_refresh || isSchemaChanged || isDataChanged) {
      _refresh = false;
      this.setState({ data: this.props.data }, () => { this.oldData = this.state.data; });
    }
    if (prevProps.selected !== this.props.selected) {
      this.setState({ selected: this.props.selected });
    }
    const cell = this.getCurrentCell();
    if (!(this.props.hidden & flags.EDITCELL) && cell && prevState.data[cell.rowIndex] && this.state.data[cell.rowIndex] && prevState.data[cell.rowIndex].inEdit !== this.state.data[cell.rowIndex].inEdit) {
      this.focusCell();
    }
    if (_reselect && isDataChanged) {
      _reselect = false;
      const oldSelectedAll = [...this.state.selectedAll, ...this.state.selected]
      const pageIds = this.props.data.map(item => item[this.props.primaryField]);
      const selected = oldSelectedAll.filter(item => pageIds.indexOf(item[this.props.primaryField]) !== -1);
      const selectedAll = oldSelectedAll.filter(item => pageIds.indexOf(item[this.props.primaryField]) === -1);
      const selectedCells = this.state.selectedCellsAll.filter(item => pageIds.indexOf(item.id) !== -1);
      const selectedCellsAll = this.state.selectedCellsAll.filter(item => pageIds.indexOf(item.id) === -1);
      this.setState({ selected, selectedCells, selectedAll, selectedCellsAll });
    }
  }

  handleReset = async () => {
    await this.props.meta.deleteSchema(this.props.primaryField);
    await this.init();
  }

  componentWillUnmount() {
    eventEmitter.removeListener('CHANGE_PAGE', this.handleChangePage);
    eventEmitter.removeListener('CHANGE_FILTERABLE', this.handleChangeFilterable);
    eventEmitter.removeListener('CHANGE_SELECTED', this.handleChangeSelected);
  }

  buildFilter = (x) => {
    switch (x.filter) {
      case 'numeric':
        return 'numeric';
      case 'boolean':
        return 'boolean';
      case 'date':
        return 'date';
      case 'dateTime':
      case 'time':
      case 'enum':
      case 'container':
      case 'group':
        return null;
      default:
        return 'text';
    }
  }

  buildCell = (props) => {
    const column = this.getColumn(this.state.columns, { field: props.field });
    return <Cell {...props} column={column} />;
  }

  focusCell = () => {
    const input = this.ref.current.querySelector('td.k-state-selected.k-grid-edit-cell input');
    const td = this.ref.current.querySelector('td.k-state-selected');
    const activeElement = document.activeElement;

    if (input) {
      if ((activeElement && input !== activeElement) || !activeElement) {
        if (input.type === 'checkbox') {
          input.focus();
        } else {
          input.select();
        }
      }
    } else {
      if (td) {
        td.focus();
      }
    }
  }

  onCellClick = (event, cellProps) => {
    const { dataItem, field } = cellProps;
    if (field === "selected" || field === "") return;
    this.selectCell(event, cellProps);
    if (!(this.props.hidden & flags.EDITCELL)) {
      this.enterEdit(dataItem, field);
    }
  }

  cellRender = (tdElement, cellProps) => {
    const { primaryField } = this.props;
    const { dataItem, field } = cellProps;
    const rowIndex = this.state.data.findIndex(x => x[primaryField] === dataItem[primaryField]);
    const colIndex = this.visibleColumns.findIndex(x => x.field === field);
    const columnIndex = this.getColOffset() + colIndex;
    const column = this.visibleColumns[colIndex];

    const additionalProps = (field && field === dataItem['inEdit'] && colIndex !== -1) ? {} :
      {
        onClick: (e) => {
          this.onCellClick(e, { dataItem, field, rowIndex, columnIndex });
        },
        tabIndex: "0"
      };

    var tdProps = { ...tdElement.props };
    const selectedCells = this.state.selectedCells;
    const oldDataItem = this.oldData.find(x => x[primaryField] === dataItem[primaryField]);
    const oldValue = oldDataItem ? _.get(oldDataItem, field) : null;
    const newValue = _.get(dataItem, field);
    const oldValueS = (oldValue && oldValue.getTime ? oldValue.getTime() : oldValue);
    const newValueS = (newValue && newValue.getTime ? newValue.getTime() : newValue);

    tdProps.className = tdProps.className.replace(" k-state-selected", "");
    tdProps.className = tdProps.className.replace(" k-state-changed", "");

    if (column && column.locked && !tdProps.className.match(/k-grid-content-sticky/)) {
      tdProps.className += ' k-grid-content-sticky';
    }

    if (selectedCells.find(item => item.rowIndex === rowIndex && item.columnIndex === columnIndex && this.props.cellSelect)) {
      tdProps.className += " k-state-selected";
    }
    if (dataItem.hasChanged && !_.isEqual(oldValueS, newValueS)) {
      tdProps.className += " k-state-changed";
    }

    const td = React.cloneElement(tdElement, { ...tdProps, ...additionalProps }, tdElement.props.children);

    return this.props.cellRender ? this.props.cellRender(td, cellProps) : td;
  }

  selectCell = (e, cellProps) => {
    const minCol = this.getColOffset();
    const pField = this.props.primaryField;
    let { dataItem, field } = cellProps;
    let selectedCells = this.state.selectedCells;
    const colIndex = this.visibleColumns.findIndex(x => x.field === field);
    if (colIndex === -1) { return; }
    let columnIndex = minCol + colIndex;
    let rowIndex = this.state.data.findIndex(x => x[pField] === dataItem[pField]);
    const id = dataItem[pField];
    const cell = { id, field, rowIndex, columnIndex };

    _lastCell = _lastCell || this.getCurrentCell();

    if (!e.ctrlKey || e.shiftKey || !this.props.multiple) { selectedCells = []; }

    if (e.shiftKey && this.props.multiple && _lastCell) {
      const minRowIndex = Math.min(rowIndex, _lastCell.rowIndex);
      const maxRowIndex = Math.max(rowIndex, _lastCell.rowIndex);
      const minColIndex = Math.min(columnIndex, _lastCell.columnIndex);
      const maxColIndex = Math.max(columnIndex, _lastCell.columnIndex);
      for (let i = minRowIndex; i <= maxRowIndex; i++) {
        for (let j = minColIndex; j <= maxColIndex; j++) {
          const _i = (rowIndex >= _lastCell.rowIndex) ? i : maxRowIndex - i + minRowIndex;
          const _j = (columnIndex >= _lastCell.columnIndex) ? j : maxColIndex - j + minColIndex;
          const dataItemS = this.props.data[_i];
          const idS = dataItemS[this.props.primaryField];
          const fieldS = this.visibleColumns[_j - minCol].field;
          const cellS = { id: idS, field: fieldS, rowIndex: _i, columnIndex: _j };
          selectedCells.push(cellS)
        }
      }
    } else {
      _lastCell = null;
      if (!selectedCells.find(item => item.id === id && item.field === field)) {
        selectedCells = [...selectedCells, cell];
      } else {
        selectedCells = selectedCells.filter(item => item.id !== id || item.field !== field);
      }
    }

    e.dataItem = dataItem;
    e.selectedCells = selectedCells;
    this.tryRowClick(e);
  }

  getSelectedCells = (dataItems, select, oldSelectedCells) => {
    const pField = this.props.primaryField;
    const minCol = this.getColOffset();
    const maxCol = this.visibleColumns.length - 1 + minCol;

    let selectedCells = oldSelectedCells;
    for (let i = 0; i < dataItems.length; i++) {
      const dataItem = dataItems[i];
      const id = dataItem[pField];
      const rowIndex = this.state.data.findIndex(item => item[pField] === id);

      selectedCells = selectedCells.filter(cell => cell.rowIndex !== rowIndex)
      if (select) {
        for (let j = minCol; j <= maxCol; j++) {
          const field = this.visibleColumns[j - minCol].field;
          const cell = { id: id, field: field, rowIndex: rowIndex, columnIndex: j };
          selectedCells.push(cell);
        }
      }
    }

    return selectedCells;
  }

  enterEdit = (dataItem, field) => {
    const splitField = field ? field.split(".")[0] : field;
    const editcell = !(this.props.hidden & flags.EDITCELL);
    const editable = this.columns.some(x => x.field === splitField && x.editable !== false);
    const pkField = this.props.primaryField;
    const lastEditItem = this.state.data.find(item => item.inEdit !== undefined);

    if (lastEditItem && (lastEditItem.inEdit !== field || lastEditItem[pkField] !== dataItem[pkField])) {
      this.exitEdit(lastEditItem, lastEditItem.inEdit);
    }

    if (editcell || field === undefined) {
      this.setState(state => {
        return {
          data: state.data.map(item => {
            const edit = this.props.enterEdit ? this.props.enterEdit(item, field) : true;
            return item[pkField] === dataItem[pkField] && ((editcell && editable && edit) || field === undefined) ?
              { ...item, inEdit: splitField ? splitField : true } : { ...item, inEdit: undefined };
          })
        }
      });
    }
  }

  exitEdit = (dataItem, field) => {
    const data = this.state.data.map(item => { return { ...item, inEdit: undefined } });
    this.setState({ data });
    if (this.props.exitEdit) { this.props.exitEdit(dataItem, field, data); }
  }

  expandChange = (event) => {
    this.setState(state => {
      return {
        data: state.data.map(x => {
          if (x[this.props.primaryField] === event.dataItem[this.props.primaryField]) {
            x.expanded = !x.expanded;
          }
          return x;
        })
      }
    });

    if (this.props.onExpandChange) {
      this.props.onExpandChange(event.dataItem);
    }
  }

  abortChanges = (dataItem) => {
    if (this.props.onAbortChanges !== undefined) {
      this.props.onAbortChanges();
    }

    let originalItem = this.props.data.find(item => item[this.props.primaryField] === dataItem[this.props.primaryField]);
    let data = this.state.data.map(item => item[this.props.primaryField] === originalItem[this.props.primaryField]
      ? originalItem : item);
    this.setState({ data });
  }

  isInvalid = (field, dataItem) => {
    if (field.disabled || field.hidden) {
      return false;
    }

    const value = _.get(dataItem, field.field);
    return this.props.isInvalid ? this.props.isInvalid(field, dataItem, value) : (
      ((value === null || value === undefined || (value instanceof Object && !(value instanceof Date) && !Object.entries(value).length) || value === "" || (/^\s+$/gm.test(value))) && field.required)
      || (value !== null && value !== undefined && field.type === "numeric" && ((field.min && (value < field.min)) || ((field.max && (value > field.max)))))
      || (value && field.type === "string" && ((field.minLength && (value.length < field.minLength)) || ((field.maxLength && (value.length > field.maxLength)))))
      || (value && field.type === "date" && ((field.min && (value.getDate() < field.min.getDate())) || (field.max && (value > field.max.getDate()))))
      || (value && field.pattern && !new RegExp(field.pattern).test(value))
    )
  }

  update = (dataItem) => {
    let canUpdate = true;
    this.columns.forEach(field => {
      if (this.isInvalid(field, dataItem)) {
        canUpdate = false;
      }
    });
    if (canUpdate) {
      delete dataItem.inEdit;
      this.props.onUpdate(dataItem[this.props.primaryField], dataItem);
      const data = this.state.data.map(item => {
        return (
          item[this.props.primaryField] === dataItem[this.props.primaryField] ? { ...item, inEdit: undefined, hasChanged: undefined } : item
        )
      })

      this.setState({ data }, () => { this.oldData = this.state.data; });
    } else {
      this.setState({
        dataInvalid: true
      })
      clearTimeout(this.alertTimeout)
      this.alertTimeout = setTimeout(() => {
        this.setState({
          dataInvalid: false
        })
      }, 4500)
    }
  }

  itemChange = (event) => {
    this.setState(state => {
      const data = this.props.onItemChange ?
        this.props.onItemChange(event, state.data)
        :
        state.data.map(item =>
          item[this.props.primaryField] === event.dataItem[this.props.primaryField] ?
            { ...item, [event.field]: event.value, hasChanged: true } : item
        );
      return { data };
    });
  }

  rowRender = (trElement, props) => {
    //const rowProps = this.props.rowProps(props);
    const rowProps = {
      ...this.props.rowProps && this.props.rowProps(props),
      onContextMenu: (e) => {
        if (this.props.contextMenu && this.props.contextMenu.length > 0) {
          e.preventDefault();
          this.handleContextMenuOpen(e, props);
        }
      }
    }
    return React.cloneElement(trElement, { ...rowProps }, trElement.props.children);
  }

  // context menu
  handleContextMenuOpen = (e, props) => {
    _contextMenuItem = props.dataItem;
    this.offset = { left: e.clientX, top: e.clientY };
    this.setState({ contextMenuPopupOpen: true });
  }

  contextMenuOnBlurHandler = event => {
    clearTimeout(_contextMenuBlurTimeoutRef);
    _contextMenuBlurTimeoutRef = setTimeout(this.contextMenuOnBlurTimeout);
  }

  contextMenuOnFocusHandler = () => {
    clearTimeout(_contextMenuBlurTimeoutRef);
    _contextMenuBlurTimeoutRef = undefined;
  };

  contextMenuOnBlurTimeout = () => {
    this.setState({ contextMenuPopupOpen: false });

    _contextMenuBlurTimeoutRef = undefined;
  };

  oncontextMenuPopupOpen = () => {
    _contextMenuWrapperRef.querySelector('[tabindex]').focus();
  };

  handleContextMenuOnSelect = (e) => {
    this.setState({ contextMenuPopupOpen: false });
    if (this.props.onContextMenuSelect) {
      this.props.onContextMenuSelect(_contextMenuItem, e.item);
    }
  }
  // end context menu

  handleSwitchFilterable = () => {
    this.setState(prevState => {

      const filterable = !prevState.filterable;
      this.props.storage.setFilterable(filterable);
      return { filterable };
    });
  }

  handleExport = async () => {
    const canvas = await html2canvas(this.ref.current);
    canvas.toBlob((blob) => {
      saveAs(blob, this.props.imgName + ".png");
    });
  }

  updateSchema = () => {
    this.setColumns();
    if (!this.props.isPicker) {
      this.props.meta.updateSchema(this.props.primaryField, { Grid: this.columns });
    }
  }

  handlePrint = (index, name) => {
    let filter = this.props.filter || this.state.filter;
    if (this.props.fixedFilter) {
      filter = { filters: [...filter.filters, ...this.props.fixedFilter.filters] };
    };
    if (index <= 1) {
      const fileType = (index === 0 ? "xlsx" : "pdf");
      this.props.meta.postPrint(this.props.primaryField, filter, this.state.sort, fileType, { Grid: this.columns })
        .then(res => {
          if (!res) return;
          if (fileType === "pdf") {
            this.setState({ blob: res.blob, fileName: res.fileName, isOpenReportDialog: true });
          } else {
            saveAs(res.blob, res.fileName);
          }
        });
    }

    if (this.props.onPrint && index > 1) { this.props.onPrint(index, name, filter, this.state.selected); }
  }

  buildFormat = (x) => {
    if (x.filter === 'date') {
      return x.format ? x.format : "{0:dd. MM. y}"
    }
    else if (x.filter === 'numeric') {
      return x.format ? x.format : "{0:n}"
    }
    else return null;
  }

  handleEditAll = () => {
    this.setState(prevstate => {
      return {
        data: prevstate.data.map(item => (
          { ...item, inEdit: true }
        ))
      }
    });
  }

  handleUpdateAll = () => {
    let dataToupdate = [];

    const areInvalid = this.state.data.some((dataItem, index) => {
      if (dataItem.hasChanged) {
        if (this.columns.some(field => this.isInvalid(field, dataItem))) {
          return true;
        }
        else {
          dataToupdate.push(dataItem);
        }
      }
      return false;
    })

    if (areInvalid) {
      this.setState({
        dataInvalid: true
      })
      clearTimeout(this.alertTimeout)
      this.alertTimeout = setTimeout(() => {
        this.setState({
          dataInvalid: false
        })
      }, 4500)
      return false;
    }
    else {
      if (dataToupdate.length > 0) {
        if (this.props.onUpdateAll) {
          this.props.onUpdateAll(dataToupdate);
        } else {
          dataToupdate.forEach(dataItem => {
            delete dataItem.inEdit;
            delete dataItem.hasChanged;
            this.props.onUpdate(dataItem[this.props.primaryField], dataItem);
          })
        }
        const data = this.state.data.map(item => {
          return (
            { ...item, inEdit: undefined, hasChanged: undefined }
          )
        })
        this.setState({ data }, () => { this.oldData = this.state.data; });
      }
      return true;
    }
  }

  handleAbortChangesAll = () => {
    if (this.props.onAbortChangesAll !== undefined) {
      this.props.onAbortChangesAll();
    }

    const data = this.oldData.map(item => {
      return (
        { ...item, inEdit: undefined }
      )
    })
    this.setState({ data });
  }

  handleKeyDown = (e) => {
    const cell = this.getCurrentCell();
    if (!cell || e.target.closest(".k-grid-container") !== this.ref.current.querySelector(".k-grid-container")) {
      return;
    }

    if (_preventKey) {
      e.preventDefault();
      return;
    }

    _preventKey = true;
    setTimeout(() => { _preventKey = false; }, 100);

    let rowIndex = cell.rowIndex;
    let columnIndex = cell.columnIndex;
    let dataItem = this.state.data[rowIndex];
    let field = cell.field;

    if (!(this.props.hidden & flags.EDITCELL)) {
      if (e.key === "Enter") {
        if (!dataItem["inEdit"]) {
          this.enterEdit(dataItem, field);
        }
        else {
          this.exitEdit(dataItem, field);
        }
      }
      if (e.key === "Escape" && dataItem["inEdit"]) {
        this.abortChanges(dataItem);
        this.exitEdit(dataItem, field);
      }
      if (e.key === "Delete" && !dataItem["inEdit"]) {
        const columns = this.visibleColumns;
        const data = this.state.data.map(item => item);
        const editcell = !(this.props.hidden & flags.EDITCELL);

        this.state.selectedCells.forEach(cell => {
          const columnIndex = columns.findIndex(col => col.field === cell.field);
          const dataItem = data[cell.rowIndex];
          const column = columns[columnIndex];
          const edit = this.props.enterEdit ? this.props.enterEdit(dataItem, column.field) : true;

          if (dataItem && column && column.editable && editcell && edit) {
            if (data[cell.rowIndex][column.field] !== undefined) {
              data[cell.rowIndex][column.field] = null;
              data[cell.rowIndex].hasChanged = true;
            }
          }
        });

        this.setState({ data });
      }
    }

    //ctrl+c a ctrl+alt+c
    if (e.keyCode === 67 && e.ctrlKey) {
      const pkField = this.props.primaryField;
      const selectedCells = this.state.selectedCells;
      const selectedColumns = this.visibleColumns.filter(col => selectedCells.some(cell => cell.field === col.field));
      let data = '';

      if (e.altKey) {
        selectedColumns.forEach(col => {
          data += col.title;
          data += '\t';
        })
        data = data.replace(/\t$/, "") + '\r\n';
      }

      this.formatData(this.state.data, selectedColumns)
        .filter(dataItem => { return selectedCells.some(cell => cell.id === dataItem[pkField]) })
        .forEach(dataItem => {
          selectedColumns.forEach(col => {
            if (selectedCells.some(cell => (cell.id === dataItem[pkField]) && cell.field === col.field)) {
              data += _.get(dataItem, col.field);
            }
            data += '\t';
          })
          data = data.replace(/\t$/, "") + '\r\n';
        });

      copyToClipboard(data);
    }

    //keynav
    if (!dataItem["inEdit"]) {
      switch (e.key) {
        case "ArrowLeft": columnIndex -= 1;
          break;
        case "ArrowRight": columnIndex += 1;
          break;
        case "ArrowUp": rowIndex -= 1;
          break;
        case "ArrowDown": rowIndex += 1;
          break;
        default: return;
      }

      const minCol = this.getColOffset();
      const maxCol = this.visibleColumns.length - 1 + minCol;
      columnIndex = columnIndex < minCol ? minCol : (columnIndex > maxCol ? maxCol : columnIndex);
      rowIndex = rowIndex < 0 ? 0 : (rowIndex > this.state.data.length - 1 ? this.state.data.length - 1 : rowIndex);
      dataItem = this.state.data[rowIndex];
      field = this.visibleColumns[columnIndex - minCol].field;
      this.selectCell(e, { dataItem, field });

      //custom v/h-scroll for grid
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        const div = this.ref.current.querySelector('div.k-grid-content.k-virtual-content');
        const firstCells = [...div.querySelectorAll('tr.k-master-row')[0].cells];
        const cells = [...div.querySelectorAll('tr.k-master-row')[rowIndex].cells];
        const cellWidth = cells[columnIndex].offsetWidth;
        const cellHeight = cells[columnIndex].offsetHeight;
        const cellOffsetLeft = cells[columnIndex].offsetLeft;
        const cellOffsetTop = cells[columnIndex].offsetTop;
        const firstIndex = firstCells.findIndex(c => !c.className.includes('sticky'));
        const lockedLeftWidth = firstCells[firstIndex].offsetLeft;
        const lockedWidth = firstCells.filter(c => c.className.includes('sticky')).map(c => c.offsetWidth).reduce((a, b) => a + b, 0);
        const unlockedWidth = div.clientWidth - lockedWidth;
        const unlockedLeftWidth = (cellOffsetLeft - div.scrollLeft - lockedLeftWidth) % unlockedWidth;

        if ((unlockedLeftWidth + cellWidth) > unlockedWidth && e.key === "ArrowRight") {
          div.scrollLeft += cellWidth;
        }

        if (unlockedLeftWidth < 0 && e.key === "ArrowLeft") {
          div.scrollLeft -= cellWidth;
        }

        if ((cellOffsetTop - div.scrollTop + cellHeight) > div.clientHeight && e.key === "ArrowDown") {
          div.scrollTop += cellHeight;
        }

        if ((cellOffsetTop - div.scrollTop) < 0 && e.key === "ArrowUp") {
          div.scrollTop -= cellHeight;
        }
      }
    }
  }

  formatData = (data, columns) => {
    return this.props.formatData ? this.props.formatData(data, columns) :
      data.map(item => {
        let newItem = { ...item };
        columns.forEach(col => {
          const value = _.get(item, col.field);
          _.set(newItem, col.field, (value instanceof Date ? moment(value).format('DD.MM.YYYY') : (value ? String(value) : '')));
        });
        return newItem;
      })
  }

  handlePaste = (e) => {
    const clipboardData = e.clipboardData.getData('text/plain');
    if (!clipboardData) return;
    const editcell = !(this.props.hidden & flags.EDITCELL);
    const rows = clipboardData.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n$/, '').split('\n');
    const columns = this.visibleColumns;
    const data = this.state.data.map(item => item);

    if (this.state.selectedCells.length === 0) return;
    const cell = this.state.selectedCells[0];
    const cellColIndex = columns.findIndex(col => col.field === cell.field);

    for (var i = 0; i < rows.length; i++) {
      const values = rows[i].split('\t');
      for (var j = 0; j < values.length; j++) {
        const rowIndex = cell.rowIndex + i;
        const columnIndex = cellColIndex + j;
        const dataItem = data[rowIndex];
        const column = columns[columnIndex];
        const edit = this.props.enterEdit ? this.props.enterEdit(dataItem, column.field) : true;

        if (dataItem && column && column.editable && editcell && edit) {
          const value = this.parseValue(values[j].replace(/(\r\n|\n|\r)/g, ''), dataItem, column);

          if (value !== undefined) {
            data[rowIndex][column.field] = value;
            delete data[rowIndex].hasChanged;
            data[rowIndex].hasChanged = true;
          }
        }
      }
    }
    this.setState({ data });
  }

  parseValue = (textValue, dataItem, column) => {
    if (this.props.parseValue) {
      return this.props.parseValue(textValue, dataItem, column)
    }

    let value = textValue;
    if (value === undefined || value === null) return undefined;

    switch (column.filter) {
      case 'numeric':
        value = value.replace(',', '.');
        value = value.match(/\./) ? parseFloat(value) : parseInt(value);
        return isNaN(value) ? undefined : value;
      case 'date':
        const m = moment(value, DATE_FORMATS, true);
        return m.isValid() ? m.toDate() : undefined;
      case 'boolean':
        value = removeAccents(value.toLowerCase());
        return new RegExp(/^[ano|yes|1|true]$/).test(value) ? true :
          new RegExp(/^[nie|no|0|false]$/).test(value) ? false : undefined;
      default:
        return value;
    }
  }

  buildText = (id) => {
    return this.props.discardText ? this.props.discardText : id ? `Máte rozpracovaný záznam ${id}. Chcete zahodiť zmeny?` : "Máte rozpracovaný nový záznam. Chcete zahodiť zmeny?"
  }

  buildDeleteText = (selected) => {
    let ids = selected && selected.map(id => ` ${id[this.props.primaryField]}`);
    return selected && selected.length > 1 ? `Určite chcete zmazať záznamy ${ids}?` : `Určite chcete zmazať záznam ${ids}?`;
  }

  buildColumns() {
    let cols = [];

    if (!(this.props.hidden & flags.COLUMN_MENU)) {
      cols.push(<Column
        filterable={false}
        sortable={false}
        key="columnMenu"
        field=""
        resizable={false}
        reorderable={false}
        width="15px"
        locked={true}
        columnMenu={props => <ColumnMenu {...props} columns={this.state.columns} onColumnsSubmit={this.onColumnsSubmit} />}
      />);
    }

    if (this.state.columns.length === 0) {
      cols.push(<Column
        filterable={false}
        sortable={false}
        key="empty"
        field=""
        resizable={false}
        reorderable={false}
        width="auto"
        locked={true}
      />);
    }

    if (this.props.multiple && (!(this.props.hidden & flags.COLUMN_SELECTED))) {
      cols.push(<Column
        filterable={false}
        sortable={false}
        key="selected"
        field="selected"
        resizable={false}
        reorderable={false}
        width="50px"
        locked={true}
        headerCell={props =>
          <SelectionMenu
            {...props}
            actions={this.props.actions}
            onHeaderSelectionChange={this.headerSelectionChange}
            checked={this.getChecked(this.state.selected)}
            buttonSelection={this.buttonSelection}
          />}
      />);
    }

    eachDeep(this.state.columns, null, (x) => {
      x.subcols = undefined;
    });

    eachDeep(this.state.columns, null, (x, parent) => {
      if (x.field && !x.disabled && !x.hidden && !(parent && parent.filter !== 'group' && parent.schema)) {
        const isActionOrGroup = x.filter === 'cmd' || x.filter === 'group' || x.filter === 'file';
        const buildedFilter = this.buildFilter(x);

        const col = (x.filter === 'group' ?
          <Column
            key={x.field}
            field={x.field}
            title={x.title}
            filter={buildedFilter}
            width={x.width}
            orderIndex={x.order}
            className={x.filter}
            filterable={false}
            sortable={false}
            editable={false}
            locked={x.locked}
          >
            {x.subcols ? x.subcols : null}
          </Column>
          :
          <Column
            key={x.field}
            field={x.filter === 'container' ? `${x.field}.${x.textField}` : x.field}
            title={x.title}
            filter={buildedFilter}
            format={this.buildFormat(x)}
            width={this.buildWidth(x)}
            cell={(x.cell ? this.buildCell :
              x.filter === 'boolean' && x.format === '{checkbox}' ? EditBooleanCheckCell :
                x.filter === 'boolean' ? EditBooleanCell :
                  x.filter === 'enum' ? this.EditDropdownCell :
                    x.filter === 'file' ? this.FileCell :
                      x.filter === 'container' ? this.EditPickerCell :
                        x.filter === 'dateTime' ? this.EditDateTimeCell :
                          x.filter === 'time' ? this.EditTimeCell : null)
            }
            filterCell={x.filter === 'enum' ? DropdownFilterCell(this.props.parentProps[x.dataField], ENUM_DEFAULT) : x.filterCell}
            orderIndex={x.order}
            className={x.filter}
            filterable={!isActionOrGroup}
            sortable={!isActionOrGroup}
            editable={x.editable}
            editor={buildedFilter}
            locked={x.locked}
          />);

        if (!parent) {
          cols.push(col)
        } else {
          if (!parent.subcols) {
            parent.subcols = [];
          }
          parent.subcols.push(col);
        }
      }
    });

    if (!this.props.isPicker && !(this.props.hidden & flags.EDIT)) {
      cols.push(
        <Column
          key="akcie"
          field="akcie"
          cell={this.EditCommandCell}
          filterable={false}
          sortable={false}
          reorderable={false}
          orderIndex="1000000"
          locked={true}
          width="200px"
        />);
    }

    return cols;
  }

  handleRefresh = () => {
    _refresh = true;
    this.props.onChange(this.state.filter, this.state.sort, this.state.page);
  }

  render() {
    const field = this.getField();
    const selected = this.props.selected || this.props.rememberSelection ? _.unionBy(this.state.selected, this.state.selectedAll, this.props.primaryField) : this.state.selected;
    const data = this.state.columns.length === 0 ? [] : this.state.data.map(x => ({ ...x, selected: selected.find(e => e[field] === x[field]) !== undefined }));
    const id = selected.length === 1 ? selected[0][this.props.primaryField] : null;
    const filter = this.props.filter || this.state.filter;
    const expandChange = this.props.detail ? this.expandChange : null;

    return (
      <div
        ref={this.ref}
        onKeyDown={this.handleKeyDown}
        tabIndex="0"
      >
        <ValidationAlert dataInvalid={this.state.dataInvalid} />
        {this.props.contextMenu &&
          <Popup
            offset={this.offset}
            show={this.state.contextMenuPopupOpen}
            open={this.oncontextMenuPopupOpen}
            popupClass={'popup-content'}
          >
            <div
              onFocus={this.contextMenuOnFocusHandler}
              onBlur={this.contextMenuOnBlurHandler}
              tabIndex={-1}
              ref={el => (_contextMenuWrapperRef = el)}
            >
              <Menu vertical={true} style={{ display: 'inline-block' }} onSelect={this.handleContextMenuOnSelect}>
                {this.props.contextMenu.map((item, index) =>
                  <MenuItem key={index} text={item.text} />
                )}
              </Menu>
            </div>
          </Popup>
        }

        <Grid
          cellRender={this.cellRender}
          className={this.props.className}
          data={data}
          detail={this.props.detail}
          editField="inEdit"
          expandField="expanded"
          filter={filter}
          filterOperators={FILTER_OPERATORS}
          filterable={this.state.filterable}
          onColumnReorder={this.onColumnReorder}
          onColumnResize={this.onColumnResize}
          onExpandChange={expandChange}
          onFilterChange={this.onFilterChange}
          onHeaderSelectionChange={this.headerSelectionChange}
          onItemChange={this.itemChange}
          onPageChange={this.onPageChange}
          onRowDoubleClick={this.props.onRowDoubleClick}
          onSelectionChange={this.selectionChange}
          onSortChange={this.onSortChange}
          pageable={this.props.disabled & flags.PAGING ? false : {
            info: true,
            type: 'input',
            pageSizes: [5, 10, 25, 50, 100],
            previousNext: true
          }}
          resizable
          reorderable
          rowRender={this.props.rowProps || this.props.contextMenu ? this.rowRender : null}
          selectedField={(!(this.props.disabled & flags.ONLY_SELECT) && !(this.props.hidden & flags.ONLY_SELECT)) ? 'selected' : null}
          skip={this.state.page.skip}
          sort={this.state.sort}
          sortable={this.props.disabled & flags.SORT ? false : {
            allowUnsort: true,
            mode: 'multiple'
          }}
          style={this.props.style}
          take={this.state.page.take}
          total={this.props.total}
        >
          {!(this.props.hidden & flags.TOOLBAR) &&
            <GridToolbar>
              <Toolbar
                handleOpenFilter={this.handleOpenFilter}
                handleOpenSort={this.handleOpenSort}
                onAdd={this.onAdd}
                onDelete={this.handleOpenDelete}
                onCopy={this.onCopy}
                onCancel={this.onCancel}
                disabled={this.props.disabled}
                hidden={this.props.hidden}
                selected={selected}
                onRefresh={this.handleRefresh}
                onClear={this.onClear}
                toolbarHidden={this.props.toolbarHidden}
                filterLength={filter.filters.length}
                onSwitchFilterable={this.handleSwitchFilterable}
                filterable={this.state.filterable}
                imgName={this.props.imgName}
                onExport={this.handleExport}
                onPrint={this.handlePrint}
                onReset={this.handleReset}
                onEditAll={this.handleEditAll}
                onUpdateAll={this.handleUpdateAll}
                onAbortChangesAll={this.handleAbortChangesAll}
                printItems={this.props.printItems}
              >
                {typeof this.props.toolbarActions === 'function' ? this.props.toolbarActions() : this.props.toolbarActions}
              </Toolbar>
            </GridToolbar>
          }
          {this.buildColumns()}
        </Grid>
        <LoadingPanel isLoading={this.props.isLoading || this.state.isSchemaLoading} />
        <ConfirmDialog
          isOpen={this.state.isOpenDelete}
          onClose={this.handleCloseDelete}
          onConfirm={this.handleConfirmDelete}
          text={this.buildDeleteText(selected)}
        />
        <ConfirmDialog
          isOpen={this.state.isOpenDiscard}
          onClose={this.handleCloseDiscard}
          onConfirm={this.handleConfirmDiscard}
          text={this.buildText(id)}
        />
        <FileDialog
          isOpen={this.state.selectedFile !== null}
          onClose={this.handleCloseFile}
          dataItem={this.state.selectedFile}
          column={_column}
        />
        <DialogFilter
          schema={this.columns}
          parentProps={this.props.parentProps}
          isOpen={this.state.isOpenFilter}
          handleCloseFilter={this.handleCloseFilter}
          handleOpenFilter={this.handleOpenFilter}
          handleConfirmFilter={this.handleConfirmFilter}
          filter={this.props.filter || this.state.filter}
          enumDefault={ENUM_DEFAULT}
          primaryField={this.props.primaryField}
          userFilter={!(this.props.hidden & flags.USER_FILTER)}
          userFilterList={this.state.userFilter}
          getFilterList={this.getFilterList}
          createFilter={this.createFilter}
          deleteFilter={this.deleteFilter}
        />
        <DialogSort
          isOpen={this.state.isOpenSort}
          handleCloseSort={this.handleCloseSort}
          handleConfirmSort={this.handleConfirmSort}
          sort={this.state.sort}
          schema={this.columns}
        />
        <ReportDialog
          isOpen={this.state.isOpenReportDialog}
          onClose={this.handleCloseReportDialog}
          blob={this.state.blob}
          fileName={this.state.fileName}
        />
      </div>
    );
  }
}

GridComponent.propTypes = {
  // udrzuj v ABECEDNOM poradi !!!!
  actions: PropTypes.array,
  cellSelect: PropTypes.bool,
  cellRender: PropTypes.func,
  className: PropTypes.string,
  contextMenu: PropTypes.array,
  data: PropTypes.array.isRequired,
  dataItem: PropTypes.object,
  detail: PropTypes.any,
  disabled: PropTypes.number,
  discardText: PropTypes.string,
  enterEdit: PropTypes.func,
  exitEdit: PropTypes.func,
  filter: PropTypes.object,
  fixedFilter: PropTypes.object,
  format: PropTypes.string,
  formatData: PropTypes.func,
  hidden: PropTypes.number,
  isLoading: PropTypes.bool.isRequired,
  imgName: PropTypes.string,
  initFilter: PropTypes.object,
  initSort: PropTypes.array,
  isInvalid: PropTypes.func,
  isPicker: PropTypes.bool,
  modified: PropTypes.bool,
  multiple: PropTypes.bool,
  onAbortChanges: PropTypes.func,
  onAbortChangesAll: PropTypes.func,
  onAdd: PropTypes.func,
  onActionSelect: PropTypes.func,
  onCancel: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  onContextMenuSelect: PropTypes.func,
  onCopy: PropTypes.func,
  onDelete: PropTypes.func,
  onExpandChange: PropTypes.func,
  onFilter: PropTypes.func,
  onGetSchema: PropTypes.func,
  onPrint: PropTypes.func,
  onRowDoubleClick: PropTypes.func,
  onSelect: PropTypes.func,
  onUpdate: PropTypes.func,
  onUpdateAll: PropTypes.func,
  parentProps: PropTypes.object,
  parseValue: PropTypes.func,
  primaryField: PropTypes.string.isRequired,
  printItems: PropTypes.array,
  rememberSelection: PropTypes.bool,
  rowProps: PropTypes.func,
  schema: PropTypes.array.isRequired,
  selected: PropTypes.array,
  storage: PropTypes.object.isRequired,
  style: PropTypes.object,
  /*toolbarActions: PropTypes.element,*/
  toolbarHidden: PropTypes.bool,
  total: PropTypes.number.isRequired,
  filterField: PropTypes.string
}

export default withMeta(withStorage(GridComponent));