import React from 'react';
import * as requests from './requests';

const Context = React.createContext();

export class MetaProvider extends React.Component {
  state = {
    menu: [],
    menuTree: {
      children: []
    }
  }

  init = async (isPublic = false, applicationId = null) => {
    await this.initMenu(isPublic, applicationId);
  }

  initMenu = async (isPublic = false, applicationId = null) => {
    const menu = await this.getMenu(isPublic, applicationId);
    const menuTree = getPreprocessedMenuData(menu.find(x => x.NadMenuID === null), menu.filter(x => x.Visible === true));
    this.setState({ menu, menuTree });
  }

  getMenu = async (isPublic, applicationId = null) => {
    try {
      let url = isPublic ? "/api/meta/menuPublic" : "/api/meta/menu";
      if (applicationId) {
        url = url + `/${applicationId.toString()}`
      }
      const menu = await requests.get(url);
      return menu.Data;
    }
    catch (error) {
      return [];
    }
  }

  getList = async (primaryField, filter, sort, page) => {
    const url = `/api/meta/form/${primaryField}`;

    try {
      let res = await requests.getList(url, filter, sort, page);
      return res;
    }
    catch (error) {
      return {
        Data: {
          Items: [],
          TotalRecords: 0
        }
      }
    }
  }

  get = async (primaryField, id) => {
    const url = `/api/meta/form/${primaryField}/${id}`;

    try {
      let res = await requests.get(url);
      return res;
    }
    catch (error) {
      throw error;
    }
  }

  create = async (primaryField, data) => {
    const url = `/api/meta/form/${primaryField}`;

    try {
      let res = await requests.post(url, data);
      return res;
    }
    catch (error) {
      throw error;
    }
  }

  update = async (primaryField, id, data) => {
    const url = `/api/meta/form/${primaryField}/${id}`;

    try {
      let res = await requests.put(url, data);
      return res;
    }
    catch (error) {
      throw error;
    }
  }

  delete = async (primaryField, id) => {
    const url = `/api/meta/form/${primaryField}/${id}`;

    try {
      await requests.del(url);
    }
    catch (error) {
      throw error;
    }
  }

  getSchema = async (primaryField) => {
    const url = `/api/meta/schema/${primaryField}`;

    try {
      let res = await requests.get(url);

      const schemaDet = res.Data.Detail.map(item => { item.format = item.format ? item.format.replace(/^\{0:/, "").replace(/\}$/, "") : null; return item; });
      res.Data.Detail = schemaDet;

      return res.Data;
    }
    catch (error) {
      return null;
    }
  }

  updateSchema = async (primaryField, schema) => {
    const url = `/api/meta/schema/${primaryField}`;

    try {
      await requests.put(url, schema);
    }
    catch (error) {

    }
  }

  getSort = async (primaryField) => {
    const url = `/api/meta/sort/${primaryField}`;

    try {
      let res = await requests.get(url);
      if (res && res.Data) {
        return res.Data;
      }
      return [];
    }
    catch (error) {
      return [];
    }
  }

  updateSort = async (primaryField, sort) => {
    const url = `/api/meta/sort/${primaryField}`;

    try {
      await requests.put(url, sort);
    }
    catch (error) {
    }
  }

  getFilterList = async (primaryField) => {
    const url = `/api/meta/user-filters/${primaryField}`;

    try {
      let res = await requests.get(url);
      return res.Data;
    }
    catch (error) {
      return [];
    }
  }

  createFilter = async (primaryField, filter) => {
    const url = `/api/meta/user-filters/${primaryField}`;

    try {
      await requests.post(url, filter);
    }
    catch (error) {
    }
  }

  deleteFilter = async (primaryField, id) => {
    const url = `/api/meta/user-filters/${primaryField}/${id}`;

    try {
      await requests.del(url);
    }
    catch (error) {
      throw error;
    }
  }

  deleteSchema = async (primaryField) => {
    const url = `/api/meta/schema/${primaryField}`;

    try {
      await requests.del(url);
    }
    catch (error) {
    }
  }

  postPrint = async (primaryField, filter, sort, fileType, schema) => {
    const url = `/api/meta/print/${primaryField}`;

    try {
      let res = await requests.postPrint(url, filter, sort, fileType, schema);
      return res;
    }
    catch (error) {
    }
  }

  getAkc = async (primaryField) => {
    const url = `/api/meta/akc/${primaryField}`;

    try {
      let res = await requests.get(url);
      return res.Data;
    }
    catch (error) {
      return null;
    }
  }

  render() {
    return (
      <Context.Provider
        value={{
          /**
           * Init
           * @function init
           * @param {element} [isPublic] - is public
           */
          init: this.init,
          /**
           * Init menu
           * @function initMenu
           * @param {element} [isPublic] - is public
           */
          initMenu: this.initMenu,
          /**
           * Menu
           */
          menu: this.state.menu,
          /**
           * Menu tree with children
           */
          menuTree: this.state.menuTree,
          /**
           * Asynchronously returns response from get list of data.
           * @function getList
           * @param {string} primaryField Primary field
           * @param {object} filter filter
           * @param {object} sort sort
           * @param {object} page page
           * @returns {Object}
           */
          getList: this.getList,
          /**
           * Asynchronously returns response from get item.
           * @function get
           * @param {string} primaryField Primary field
           * @param {string} id Item id
           * @returns {Object}
           */
          get: this.get,
          /**
           * Asynchronously returns response from crete item.
           * @function create
           * @param {string} primaryField Primary field
           * @param {object} data data
           * @returns {Object}
           */
          create: this.create,
          /**
           * Asynchronously returns response from update item.
           * @function update
           * @param {string} primaryField Primary field
           * @param {string} id id
           * @param {object} data data
           * @returns {Object}
           */
          update: this.update,
          /**
           * Asynchronously deletes item.
           * @function delete
           * @param {string} primaryField Primary field
           * @param {string} id id
           */
          delete: this.delete,
          /**
           * Asynchronously returns schema.
           * @function getSchema
           * @param {string} primaryField Primary field
           * @returns {Object}
           */
          getSchema: this.getSchema,
          /**
           * Asynchronously updates schema.
           * @function updateSchema
           * @param {string} primaryField Primary field
           * @param {object} schema Schema
           */
          updateSchema: this.updateSchema,
          /**
           * Asynchronously returns sort.
           * @function getSort
           * @param {string} primaryField Primary field
           * @returns {Object}
           */
          getSort: this.getSort,
          /**
           * Asynchronously updates sort.
           * @function updateSort
           * @param {string} primaryField Primary field
           * @param {object} sort sort
           */
          updateSort: this.updateSort,
          /**
           * Asynchronously posts print file.
           * @function postPrint
           * @param {string} primaryField Primary field
           * @param {object} filter filter
           * @param {object} sort sort
           * @param {object} fileType fileType
           * @param {object} schema schema
           * @returns {Object}
           */
          postPrint: this.postPrint,
          /**
           * Asynchronously delete schema.
           * @function deleteSchema
           * @param {string} primaryField Primary field
           */
          deleteSchema: this.deleteSchema,
          /**
           * Asynchronously returns filter.
           * @function getFilterList
           * @param {string} primaryField Primary field
           * @returns {Object}
           */
          getFilterList: this.getFilterList,
          /**
           * Asynchronously create filter.
           * @function createFilter
           * @param {string} primaryField Primary field
           * @param {object} filter filter
           */
          createFilter: this.createFilter,
          /**
           * Asynchronously delete filter.
           * @function deleteFilter
           * @param {string} primaryField Primary field
           * @param {string} id id
           */
          deleteFilter: this.deleteFilter,
          /**
           * Asynchronously returns response from get action. 
           * @function getAkc
           * @param {string} primaryField Primary field
           * @returns {Object}
           */
          getAkc: this.getAkc
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}



/***
 * @function menuItemHasChildren - Find out if the @param menuItem has children
 * @param menuItem - Menu item
 * @returns {bool} - true or false
 */
const menuItemHasChildren = (menuItem) => {
  return menuItem.children && menuItem.children.length > 0;
}

/***
 * @function getPreprocessedMenuData - From @param rootMenuItem creates a new menu data structure usable for rendering
 * @param rootMenuItem - Root menu item
 * @param menu - menu
 * @returns @var menuItem - Menu item with children
 */
const getPreprocessedMenuData = (rootMenuItem, menu) => {
  let menuItem = { ...rootMenuItem };

  menuItem.children = menu.filter(subMenuItem => subMenuItem.NadMenuID === menuItem.MenuID);
  if (!menuItemHasChildren(menuItem)) {
    return menuItem;
  }

  for (let i = 0; i < menuItem.children.length; i++) {
    menuItem.children[i] = getPreprocessedMenuData(menuItem.children[i], menu);
  }

  menuItem.children = menuItem.children.sort((menuItem1, menuItem2) => menuItem1.Pozicia - menuItem2.Pozicia);
  return menuItem;
}

/**
 * Returns wrapped component with meta functions
 * @module
 * @param {element} WrappedComponent - Wrapped component
 */
export default (WrappedComponent) => {
  return (props) => {
    return (
      <Context.Consumer>
        {x =>
          <WrappedComponent
            {...props}
            meta={x}
          />
        }
      </Context.Consumer>
    );
  }
};