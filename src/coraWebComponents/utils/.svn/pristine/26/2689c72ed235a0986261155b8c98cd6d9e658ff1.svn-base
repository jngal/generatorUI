import React from 'react';
import * as requests from './requests';

/**
 * Returns wrapped component with requests
 * @module
 * @param {element} WrappedComponent - Wrapped component
 */
export default (WrappedComponent) => {
  class HOC extends React.Component {

    render() {
      return (
        <WrappedComponent
          {...this.props}
          requests={{
            /**
             * Asynchronously returns response from get list of data.
             * @function getList
             * @param {string} url url
             * @param {object} filter filter
             * @param {object} sort sort
             * @param {object} page page
             * @returns {Object}
             */
            getList: requests.getList,
            /**
             * Asynchronously returns blob.
             * @function getBlob
             * @param {string} url url
             * @returns {Object}
             */
            getBlob: requests.getBlob
          }}
        />
      );
    }
  }
  
  return HOC;
};