import React from 'react';
import PropTypes from 'prop-types';

/**
 * Validation Alert component
 * @module
 * @param {string} dataInvalid - Are data invalid?
 */

class ValidationAlert extends React.Component {
  render() {
    return (
      <div className={"grid-validation-alert " + (this.props.dataInvalid ? '' : 'd-none')} >
        <p className="mb-0">Zadané údaje nie sú validné!</p>
      </div>
    )
  }
}

ValidationAlert.propTypes = {
  dataInvalid: PropTypes.bool
}

export default ValidationAlert;