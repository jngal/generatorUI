import EventEmitter from 'events';

/** @module utils/eventEmitter */

/** Class extending an EventEmitter. 
 * @extends EventEmitter
*/
class ExtendedEventEmitter extends EventEmitter {
  
  /**
   * Emits event 'CHANGE_TAB' which changes tab.
   * @param {string} name name
   * @param {number} tab number of tab
   */
  changeTab(name, tab) {
    this.emit('CHANGE_TAB', { name, tab });
  }

  /**
   * Emits event 'CHANGE_TABS_TYPE' which changes type of tabs.
   * @param {Object} tabsType type of tabs -> {name: string, id: number}
   */
  changeTabsType(tabsType) {
    this.emit('CHANGE_TABS_TYPE', tabsType)
  }

  /**
  * Emits event 'CHANGE_PAGE' which changes the page.
  * @param {Object} page page -> {skip: number, take: number}
  */
  changePage(page) {
    this.emit('CHANGE_PAGE', page)
  }

  /**
  * Emits event 'CHANGE_FILTERABLE' which changes the filterable.
  * @param {Object} filterable filterable -> {name: string, filterable: Object}
  */
  changeFilterable(filterable) {
    this.emit('CHANGE_FILTERABLE', filterable)
  }

  /**
  * Emits event 'CHANGE_SELECTED' which changes selected element.
  * @param {Array.<Object>} selected selected
  * @param {string} name element name
  */
  changeSelected(selected, name) {
    this.emit('CHANGE_SELECTED', { selected, name });
  }
  /**
  * Emits event 'ON_UPDATE'.
  */
  onUpdate() {
    this.emit('ON_UPDATE');
  }

  /**
  * Emits event 'CHANGE_SIDEBAR' which changes the sidebar.
  * @param {string} type type of sidebar
  */
  changeSidebar(type) {
    this.emit('CHANGE_SIDEBAR', type);
  }
}

export default new ExtendedEventEmitter();