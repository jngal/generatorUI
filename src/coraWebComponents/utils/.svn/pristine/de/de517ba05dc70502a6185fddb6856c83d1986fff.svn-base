import React from 'react';
import * as requests from './requests';
import { sessionProviderInit } from './storage';

const PAGE_KEY = 'Page';
const TABS_TYPE_KEY = 'TabsType';
const FILTERABLE = 'Filterable';
const THEME = 'Theme';
const APPLICATION_SETTINGS_KEY = 'ApplicationSettings';

/**
 * Returns wrapped component with storage props
 * @module
 * @param {element} WrappedComponent - Wrapped component
 */
export default (WrappedComponent) => {
  class HOC extends React.Component {
    getItem = async (key) => {
      const url = `/api/meta/def?Key=${key}`;
      try {
        var item = await requests.get(url);
        return JSON.parse(item.Data.Value);
      }
      catch (error) {
        return JSON.parse(sessionStorage.getItem(key));
      }
    }

    setItem = async (key, value) => {
      const v = JSON.stringify(value);
      sessionStorage.setItem(key, v);

      const url = `/api/meta/def`;
      try {
        await requests.put(url, { Key: key, Value: v });
      }
      catch (error) {
      }
    }

    getApplicationSettings = async () => {
      return await this.getItem(`${APPLICATION_SETTINGS_KEY}_${process.env.REACT_APP_NAME}`);
    }

    setApplicationSettings = async (data) => {
      await this.setItem(`${APPLICATION_SETTINGS_KEY}_${process.env.REACT_APP_NAME}`, data);
    }

    getPage = async () => {
      return await this.getItem(PAGE_KEY);
    }

    setPage = async (page) => {
      await this.setItem(PAGE_KEY, page);
    }

    getTabsType = async () => {
      return await this.getItem(TABS_TYPE_KEY);
    }

    setTabsType = async (type) => {
      await this.setItem(TABS_TYPE_KEY, type);
    }

    getFilterable = async () => {
      return await this.getItem(FILTERABLE);
    }

    setFilterable = async (filterable) => {
      await this.setItem(FILTERABLE, filterable);
    }

    getTheme = async () => {
      return await this.getItem(THEME);
    }

    setTheme = async (theme) => {
      await this.setItem(THEME, theme);
    }

    getFilter = async (primaryField) => {
      const url = `/api/filter/${primaryField}`;
      try {
        let filter = await requests.get(url);
        return {
          filters: filter.Data.filters.map(x => {
            const isDate = x.type === 'date' || x.field.startsWith('D_') || x.field.startsWith('Datum');
            return {
              field: x.field,
              operator: x.operator,
              value: isDate ? new Date(x.value) : x.value
            }
          })
        }
      }
      catch (error) {
        return { filters: [] }
      }
    }

    render() {
      const { forwardedRef, ...props } = this.props;
      return (
        <WrappedComponent
          ref={forwardedRef}
          {...props}
          storage={{
            /**
             * Get item function
             * @function getItem
             * @param {string} key key
             * @returns {object} Item
             */
            getItem: this.getItem,
            /**
             * Set item function
             * @function getItem
             * @param {string} key key
             * @param {object} value value
             * @returns {object} Item
             */
            setItem: this.setItem,
            /**
             * Get filter function
             * @function getFilter
             * @param {string} primaryField Primary field
             * @returns {object} Filter
             */
            getFilter: this.getFilter,
            /**
             * Get page function
             * @function getPage
             * @returns {object} Page
             */
            getPage: this.getPage,
            /**
             * Set page function
             * @function setPage
             * @param {string} page Page
             */
            setPage: this.setPage,
            /**
             * Get tabs type function
             * @function getTabsType
             * @returns {object} Tabs type
             */
            getTabsType: this.getTabsType,
            /**
             * Set tabs type function
             * @function setTabsType
             * @param {string} type Type
             */
            setTabsType: this.setTabsType,
            /**
             * Get filterable function
             * @function getFilterable
             * @returns {object} Filterable
             */
            getFilterable: this.getFilterable,
            /**
             * Set filterable function
             * @function setFilterable
             * @param {string} filterable Filterable
             */
            setFilterable: this.setFilterable,
            /**
             * Get theme function
             * @function getTheme
             * @returns {object} Theme
             */
            getTheme: this.getTheme,
            /**
             * Set page function
             * @function setTheme
             * @param {string} theme Theme
             */
            setTheme: this.setTheme,
            /**
             * Initializes session provider.
             * @function sessionProviderInit
             * @param {object} cb Callback
             */
            sessionProviderInit,
            /**
             * Set application settings function
             * @function setApplicationSettings
             * @param {string} data data
             */
            setApplicationSettings: this.setApplicationSettings,
            /**
             * Get application settings function
             * @function getApplicationSettings
             * @returns {object} Application settings
             */
            getApplicationSettings: this.getApplicationSettings,
          }}
        />
      );
    }
  }

  return React.forwardRef((props, ref) => {  return <HOC {...props} forwardedRef={ref} />;  });
};