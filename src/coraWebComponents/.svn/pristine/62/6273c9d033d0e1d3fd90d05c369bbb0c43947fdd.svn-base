import React from 'react';
import PropTypes from 'prop-types';
import Dialog from './Dialog';

/**
 * Confirm dialog
 * @module
 * @param {bool} isOpen - Is dialog open?
 * @param {func} onClose - Function invoked on dialog close
 * @param {func} onConfirm - Function invoked on dialog confirm
 * @param {string} text - Text of dialog
 * @param {string} [confirmText] - Confirm button text
 * @param {string} [cancelText] - Cancel button text
 */
class ConfirmDialog extends React.Component {
  render() {
    return (
      <div className="confirm-dialog">
        <Dialog
          title="Potvrdenie"
          onClose={this.props.onClose}
          onConfirm={this.props.onConfirm}
          isOpen={this.props.isOpen}
          confirmText={this.props.confirmText}
          cancelText={this.props.cancelText}
        >          
        <p style={{ margin: "15px", textAlign: "center" }}>{this.props.text}</p>
        </Dialog>
      </div>
    );
  }
}

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string
}

export default ConfirmDialog;