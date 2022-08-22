import React from 'react';
import PropTypes from 'prop-types';
import { Upload } from '@progress/kendo-react-upload';
import ImageCompressionDialog from '../dialogs/ImageCompressionDialog';
import {stringToBytes} from '../utils/convert';
import './Upload.scss';

const USER_KEY = 'User';

/**
 * Upload component
 * @module
 * @param {bool} [disabled] - Is upload readonly?
 * @param {string} url - Url
 * @param {string} name - Name
 * @param {array} [value] - Current value
 * @param {object} [data] - Data
 * @param {func} [onUpload] - Function invoked on file upload
 * @param {number} [tabindex] - Upload tab index
 * @param {func} [onBlur] - Function invoked on blur
 * @param {object} [restrictions] - Upload restriction
  */
class UploadComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      isImageCompressionDialogOpen: false,
    };
  }

  handleImageCompressionDialogClose = () => {
    this.setState({ isImageCompressionDialogOpen: false });
  }

  handleImageCompressionDialogConfirm = (data) => {
    
  }

  onChange = (files) => {
    this.props.onChange(this.props.name, files);
  }

  onAdd = (event) => {
    // console.log('onAdd: ', event.affectedFiles);
    this.onChange(event.newState);

    if (this.props.autoUpload) { return; } 

    const files = event.affectedFiles.map(
      file => ({ ...file, l_resize: (file.extension === ".jpg" || file.extension === ".png") && this.props.requiredMaximumSize && file.size > stringToBytes(this.props.requiredMaximumSize) })
    );

    if (files.some(file => file.l_resize)) {
      this.setState({
        isImageCompressionDialogOpen: true,
        files: files
      })
    }    
  }

  onRemove = (event) => {
    // console.log('onRemove: ', event.affectedFiles);
    this.onChange(event.newState);
  }

  onProgress = (event) => {
    // console.log('onProgress: ', event.affectedFiles, event.serverResponse);
    this.onChange(event.newState);
  }

  onStatusChange = (event) => {
    // console.log('onStatusChange: ', event.affectedFiles, event.serverResponse);
    this.onChange(event.newState);
    if(this.props.onUpload && event.response) {
      this.props.onUpload(event.response.response);
    }
  }

  handleBeforeSend = (event) => {
    event.additionalData = this.props.data || {};
    event.headers.Authorization = this.getAuthorizationHeader();
  }

  getAuthorizationHeader = () => {
    const user = JSON.parse(sessionStorage.getItem(USER_KEY));

    if(user) {
      const token = user.RefreshToken || user.Token;
      return `Bearer ${token}`;
    }
    
    return null;
  }

  onBlur = () => {
    if(this.props.onBlur) {
      this.props.onBlur();
    }
  }

  render() {
    const { 
      url,
      autoUpload, 
      errorText,
      showHint,
      disabled,
      tabindex,
      value,
      restrictions,
      multiple
    } = this.props;

    const saveUrl = `${window.config.url}/${url}`;

    return (
      <div className={`upload 
                      ${autoUpload ? "" : "upload-hide-k-action-buttons"} 
                      ${showHint ? "upload-dropzone-hint" : ""}`}>
        <Upload
          autoUpload={autoUpload}
          restrictions={restrictions}
          batch={false}
          multiple={multiple ? true : false}
          files={value}
          onBeforeUpload={this.handleBeforeSend}
          onBeforeRemove={this.handleBeforeSend}
          onAdd={this.onAdd}
          onRemove={this.onRemove}
          onProgress={this.onProgress}
          onStatusChange={this.onStatusChange}
          withCredentials={false}
          saveUrl={saveUrl}
          disabled={disabled}
          tabindex={tabindex}
          onBlur={this.onBlur}
        />
        {errorText &&
          <div className="k-widget k-upload k-header">
            <ul className="k-upload-files k-reset">
              <li className="k-file k-file-invalid">
                <div className="k-file-single">
    
                  <span className="k-progress"></span>
    
                  <span className="k-file-invalid-extension-wrapper"> 
                    <span className="k-file-invalid-icon">!</span>
                    <span className="k-file-state"></span>
                  </span>
    
                  <span className="k-file-name-size-wrapper">
                    <span className="k-file-name k-file-name-invalid">
                      {errorText}
                    </span>
                  </span>
                
                </div>
              </li>
            </ul>
          </div>
        }

        <ImageCompressionDialog
          isOpen={this.state.isImageCompressionDialogOpen}
          onClose={this.handleImageCompressionDialogClose}
          onConfirm={this.handleImageCompressionDialogConfirm}
          files={this.state.files}
          requiredMaximumSize={this.props.requiredMaximumSize}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

UploadComponent.propTypes = {
  autoUpload: PropTypes.bool,
  disabled: PropTypes.bool,
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.array,
  data: PropTypes.object,
  onUpload: PropTypes.func,
  tabindex: PropTypes.number,
  onBlur: PropTypes.func,
  restrictions: PropTypes.object,
  showHint: PropTypes.bool,
  errorText: PropTypes.string,
  multiple: PropTypes.bool,
  requiredMaximumSize: PropTypes.string,
}

export default UploadComponent;