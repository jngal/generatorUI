import React from 'react';
import PropTypes from 'prop-types';

/**
 * Tab component
 * @module
 * @param {element} children - Children element
 * @param {string} title - Title of tab component
 */

class TabComponent extends React.Component {
  render() {
    return this.props.children;
  }
}

TabComponent.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired
}

export default TabComponent;