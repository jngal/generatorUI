import React from 'react';
import PropTypes from 'prop-types';

/**
 * Validation Message Component
 * @module
 * @param {bool} required - Is field required?
 * @param {bool} recommended - Is field recommended?
 * @param {string} [validationMessage] - Validation message
 */
class ValidationMessage extends React.Component {
  render() {
    const { required, recommended, validationMessage } = this.props;

    if(required) {
      return (
        <div className="validation">
          {validationMessage ? validationMessage : 'Toto pole je povinné'}
        </div>
      );
    }
    else if(recommended) {
      return (
        <div className="validation validation-recommended">
          {validationMessage ? validationMessage : 'Toto pole je odporúčané'}
        </div>
      );
    }
    else {
      return null;
    }
  }
}

ValidationMessage.propTypes = {
  required: PropTypes.bool,
  recommended: PropTypes.bool,
  validationMessage: PropTypes.string
}

export default ValidationMessage;