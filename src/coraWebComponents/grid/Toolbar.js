import * as React from 'react';

import Button from '../buttons/Button';
import DropDownButton  from '../buttons/DropDownButton';
import PropTypes from 'prop-types';
import flags from '../utils/flags';
import { buildUrl } from '../utils/helper';
import './Toolbar.scss';

/**
 * Toolbar grid component
 * @module
 * @param {func} [onAdd] - Function invoked on entry add
 * @param {func} [onDelete] - Function invoked on entry delete
 * @param {func} [onCopy] - Function invoked on entry copy
 * @param {func} [onCancel] - Function invoked on entry cancel
 * @param {func} onRefresh - Function invoked on refresh
 * @param {func} onClear - Function invoked on clear
 * @param {element} [children] - Children element
 * @param {number} [disabled] - Flags for disabling actions
 * @param {number} [filterLength] - Filter length
 * @param {func} onSwitchFilterable - On switch filterable function
 * @param {number} [hidden] - Flags for hiding actions
 * @param {string} [imgName] - Image name
 * @param {func} onExport - Function invoked on file export
 * @param {func} [onPrint] - Function invoked on print
 * @param {func} onReset - Function invoked on reset
 * @param {func} onUpdateAll - Function invoked on update all entries
 * @param {func} onAbortChangesAll - Function invoked on abort all changes
 * @param {func} onEditAll - Function invoked on edit all entries
 * @param {array} selected - Selected entries
 */
class ToolbarComponent extends React.Component {
  
  constructor(props) {
    super(props); 

    this.state = {
      editingAll: (props.hidden & flags.EDITALL) === 0 ? false : undefined,
      editingCell: (props.hidden & flags.EDITCELL) === 0 
    }
  }

  handlePrint = (index, name) => {
    this.props.onPrint(index, name);
  }

  handleEditAll = () => {
    this.setState({
      editingAll: true
    })
    this.props.onEditAll()
  }

  handleUpdateAll = () => {
    if(this.props.onUpdateAll()){
      this.setState({
        editingAll: false
      })
    }
  }

  handleAbortChangesAll = () => {
    this.setState({
      editingAll: false
    })
    this.props.onAbortChangesAll()
  }

  render() {  
    const isSelected = this.props.selected && this.props.selected.length === 1;
    let printItems = [{ text: "Tlač mriežky do XLSX", imageUrl: buildUrl('assets/toolbar_cg_xlsx.svg')},
                      { text: "Tlač mriežky do PDF", imageUrl: buildUrl('assets/toolbar_cg_pdf.svg')}];
    if (this.props.printItems) { printItems = [ ...printItems, ...this.props.printItems ] }

    return (
      <div id="grid-toolbar">
      { (!this.props.toolbarHidden || !(this.props.hidden & flags.LEFT_TOOLBAR))  &&
        <span className="left">
          {!(this.props.hidden & flags.ADD) &&
            <Button
              onClick={this.props.onAdd}
              primary={true}
              disabled={this.props.disabled & flags.ADD}
              title="Nový záznam"
              icon="novy-zaznam"
              imageUrl={buildUrl('assets/toolbar_cg_new.svg')}
            />
          }
          {!(this.props.hidden & flags.COPY) &&
            <Button
              onClick={this.props.onCopy}
              disabled={!isSelected || (this.props.disabled & flags.COPY)}
              primary={true}
              title="Nový záznam ako kópia"
              imageUrl={buildUrl('assets/toolbar_cg_copy.svg')}
            />
          }
          {!(this.props.hidden & flags.CANCEL) &&
            <Button
              onClick={this.props.onCancel}
              disabled={!isSelected || (this.props.disabled & flags.CANCEL)}
              primary={true}
              icon="cancel"
              title="Zrušenie záznamu"
              imageUrl={buildUrl('assets/toolbar_cg_cancel.svg')}
            />
          }
          {(this.props.hidden & flags.DELETE) !== flags.DELETE &&
            <Button
              onClick={this.props.onDelete}
              disabled={((this.props.disabled & flags.DELETE) === flags.DELETE || !isSelected) && ((this.props.disabled & flags.DELETEALL || this.props.selected.length === 0))}
              primary={true}
              icon="delete"
              title="Zmazanie záznamu"
              imageUrl={buildUrl('assets/toolbar_cg_delete.svg')}
            />
          }
          {(this.state.editingAll === false && !this.state.editingCell) &&
            <Button
              onClick={this.handleEditAll}               
              primary={true}
              icon="track-changes-enable"
              title="Upraviť všetky"
            />
          }
          {(this.state.editingAll === true || this.state.editingCell) &&
            <>
              <Button
                onClick={this.handleUpdateAll}               
                primary={true}
                icon="track-changes-accept"
                title="Uložiť zmeny"
              />
              <Button
                onClick={this.handleAbortChangesAll}                
                primary={true}
                icon="track-changes-reject"
                title="Zrušiť úpravu"
              />
            </>
          }

          {this.props.children}
        </span>
      }
        <span className="right">
        {!(this.props.hidden & flags.PRINT) &&
          <DropDownButton
            text=""
            popupSettings={{ popupClass: 'dropdown-print' }}
            icon="print"
            title="Tlač"
            items={printItems}
            onClick={this.handlePrint}
            disabled={false || Boolean(this.props.disabled & flags.PRINT)}
            imageUrl={buildUrl('assets/toolbar_cg_print.svg')}
          />
        }
        {!(this.props.hidden & (flags.SORT_DIALOG | flags.SORT)) &&
          <Button
            onClick={this.props.handleOpenSort}
            primary={true}
            icon="sort-desc"
            title="Zoradenie"
          />
        }
        {(!(this.props.disabled & flags.FILTER) && !(this.props.hidden & flags.FILTER)) &&
          <span>
            <Button
              onClick={this.props.handleOpenFilter}
              imageUrl={this.props.filterLength > 0 ? buildUrl('assets/toolbar_cg_filter-active.svg') : buildUrl('assets/toolbar_cg_filter-add.svg')}
              title="Filter"
            />
            <Button
              onClick={this.props.onClear}
              icon="filter-clear"
              title="Zrušenie filtra"
              imageUrl={buildUrl('assets/toolbar_cg_filter.svg')}
            />
            <Button
              onClick={this.props.onSwitchFilterable}
              imageUrl={this.props.filterable ? buildUrl('assets/toolbar_cg_minimize.svg') : buildUrl('assets/toolbar_cg_expand.svg')}
              title="Mód"
            />
          </span>
        }
        {!(this.props.hidden & flags.RESET) &&
            <Button
              onClick={this.props.onReset}
              icon="reset-sm"
              title="Reset"
              disabled={(this.props.disabled & flags.RESET)}
            />
        }
        {this.props.imgName && 
          <Button
            onClick={this.props.onExport}
            icon="image-export"
            title="Export"
            imageUrl={buildUrl('assets/toolbar_cg_export.svg')}
          />
        }
        <Button
          onClick={this.props.onRefresh}
          icon="refresh"
          title="Obnovenie"
          imageUrl={buildUrl('assets/toolbar_cg_refresh.svg')}
        />
      </span>
      </div>
    );
  }
}

ToolbarComponent.propTypes = {
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  onCopy: PropTypes.func,
  onCancel: PropTypes.func,
  onRefresh: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  children: PropTypes.element,
  disabled: PropTypes.number,
  filterLength: PropTypes.number,
  onSwitchFilterable: PropTypes.func.isRequired,
  hidden: PropTypes.number,
  imgName: PropTypes.string,
  onExport: PropTypes.func.isRequired,
  onPrint: PropTypes.func,
  onReset: PropTypes.func.isRequired,
  onUpdateAll: PropTypes.func.isRequired,
  onAbortChangesAll: PropTypes.func.isRequired,
  onEditAll: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
  handleOpenSort: PropTypes.func
}

export default ToolbarComponent;