import React from 'react';
import { withRouter } from "react-router";

/**
 * WithRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 * @module
 * @param {element} WrappedComponent - Wrapped component
 */
export default (WrappedComponent) => {
  class HOC extends React.Component {

    render() {
      return (
        <WrappedComponent
          {...this.props}
        />
      );
    }
  }
  
  return withRouter(HOC);
};