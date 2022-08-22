import React from 'react';
import PropTypes from 'prop-types';
import './LoadingPanel.scss';

/**
 * Loading panel component
 * @module
 * @param {bool} isLoading - Is loading
 */
class LoadingPanel extends React.Component {
  render() {
    if(this.props.isLoading) {
      return (
        <div className="k-loading-mask">
          <span className="k-loading-text">Loading</span>
          <div className="k-loading-image"></div>
          <div className="k-loading-color"></div>
        </div>
      );
    }
    else {
      return null;
    }
  }
}

LoadingPanel.propTypes = {
  isLoading: PropTypes.bool.isRequired
}

export default LoadingPanel;