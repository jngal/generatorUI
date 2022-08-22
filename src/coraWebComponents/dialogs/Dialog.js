import React from 'react';
import PropTypes from 'prop-types';

import { Prompt } from "react-router-dom";
import DialogContent from './DialogContent';
import './Dialog.scss';

/**
 * Dialog
 * @module
 * @param {bool} isOpen - Is dialog open?
 * @param {func} onClose - Function invoked on dialog close
 * @param {func} [onCancel] - Function invoked on cancel
 * @param {func} [onConfirm] - Function invoked on confirm
 * @param {element} children - Children content of dialog
 * @param {string} title - Title text of dialog
 * @param {bool} [fullscreen] - Full screen dialog
 * @param {bool} [hideButtons] - Hide dialog buttons
 * @param {bool} [confirmDisabled] - Confirm disabled
 * @param {string} [form] - Form
 * @param {string} [className] - Dialog class name
 * @param {func} [onEsc] - Invoked when user presses esc
 * @param {string} [confirmText] - Text of confirm button
 * @param {string} [cancelText] - Text of cancel button
 */
class DialogComponent extends React.Component {

  onClose = event => {
    if (event.nativeEvent.keyCode === 27) {
      if (this.props.onEsc) {
        this.props.onEsc();
      }
    }
    else {
      this.props.onClose();
    }
  }

  render() {
    const className = `${this.props.fullscreen ? "fullscreen" : ""} ${this.props.className || ""}`;
    return (
      <div>
        {this.props.isOpen &&
          <div className="k-dialog-wrapper">
            <div className={className}>
              <Prompt
                when={true}
                message={() => {
                  this.props.onClose();
                  return false;
                }}
              />
              <DialogContent
                title={this.props.title}
                onClose={this.onClose}
                onCancel={this.props.onCancel}
                children={this.props.children}
                fullscreen={this.props.fullscreen}
                form={this.props.form}
                onClick={this.props.onConfirm}
                disabled={this.props.confirmDisabled}
                width={this.props.width}
                confirmText={this.props.confirmText}
                cancelText={this.props.cancelText}
                hideButtons={this.props.hideButtons}
                relativeTop={this.props.relativeTop || 0}
                relativeLeft={this.props.relativeLeft || 0}
              />
            </div>
          </div>
        }
      </div>
    );
  }
}

DialogComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  children: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  fullscreen: PropTypes.bool,
  hideButtons: PropTypes.bool,
  confirmDisabled: PropTypes.bool,
  form: PropTypes.string,
  className: PropTypes.string,
  onEsc: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  relativeTop: PropTypes.number,
  relativeLeft: PropTypes.number,
}

export default DialogComponent;