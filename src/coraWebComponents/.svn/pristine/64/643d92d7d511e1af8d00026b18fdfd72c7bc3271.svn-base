import React from 'react';
import PropTypes from 'prop-types';

import { Window } from '@progress/kendo-react-dialogs';
import { Button } from '@progress/kendo-react-buttons';
import './Dialog.scss';

/**
 * Dialog content component
 * @module
 * @param {func} onClose - Function invoked on dialog close
 * @param {func} [onCancel] - Function invoked on cancel
 * @param {func} [onClick] - Function invoked on sumbit button click
 * @param {element} children - Children content of dialog
 * @param {string} title - Title text of dialog
 * @param {bool} [fullscreen] - Full screen dialog
 * @param {bool} [disabled] - Is submit button disabled?
 * @param {bool} [hideButtons] - Hide buttons
 * @param {sting} [form] - Form
 * @param {string} [confirmText] - Confirm text
 * @param {string} [cancelText] - Cancel text
 */
class DialogContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      top: 0,
      left: 0
    }

    this.dialog = React.createRef();
  }

  handleMove = (event) => {
    if(event.left || event.top) {
      const maxLeft = window.innerWidth - event.target.windowElement.offsetWidth;
      const maxTop = window.innerHeight - event.target.windowElement.offsetHeight;
      const left = event.left > maxLeft ? maxLeft : event.left;
      const top = event.top > maxTop ? maxTop : event.top;
      this.setState({ left, top });
    }
  }

  componentDidMount() {
    this.calcOffset(this.dialog.current.windowElement.clientWidth);
  }

  calcOffset = (width) => {
    if(this.dialog.current) {
      const height = this.dialog.current.windowElement.clientHeight;
      this.setState({
        left: window.innerWidth / 2 - width / 2 + this.props.relativeLeft,
        top: window.innerHeight / 3 - height / 3 + this.props.relativeTop,
        width, height
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.width !== this.props.width) {
      this.calcOffset(this.props.width);
    }
  }

  render() {
    return (
      <Window
        title={this.props.title}
        onClose={this.props.onClose}
        draggable={true}
        resizable={false}
        modal={true}
        doubleClickStageChange={false}
        stage="DEFAULT"
        onMove={this.handleMove}
        left={this.state.left}
        top={this.state.top}
        shouldUpdateOnDrag={false}
        ref={this.dialog}
        style={{ width: this.props.width || this.state.width, height: 'none' }}
      >
        {this.props.children}
        {(this.props.hideButtons || this.props.fullscreen) ? false : true &&
          <div className="k-dialog-buttongroup k-dialog-button-layout-stretched" >
            <Button
              onClick={this.props.onCancel ? this.props.onCancel : this.props.onClose}
              key={1}
            >
              {this.props.cancelText || 'Zrušiť'}
            </Button>
            <Button
              form={this.props.form}
              type={this.props.form ? 'submit' : null}
              primary={true}
              onClick={this.props.onClick}
              disabled={this.props.disabled}
              key={2}
            >
              {this.props.confirmText || 'OK'}
            </Button>
          </div>
        }
      </Window>
    )
  }
}

DialogContent.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onClick: PropTypes.func,
  children: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  fullscreen: PropTypes.bool,
  disabled: PropTypes.bool,
  hideButtons: PropTypes.bool,
  form: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  relativeTop: PropTypes.number.isRequired,
  relativeLeft: PropTypes.number.isRequired,
}

export default DialogContent;