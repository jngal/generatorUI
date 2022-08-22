import React from 'react';
import PropTypes from 'prop-types';
import Button from '../buttons/Button';
import saveAs from 'file-saver';

/**
 * File content
 * @module
 * @param {object} [requests] - Request
 * @param {string} name - Name
 * @param {string} url - Url
 * @param {string} mineType - Mine type
 * @param {number} id - File ID
 * @param {object} [style] - Style object
 * @param {bool} [hideButton] - Hide button
 * @param {number} [imgWidth] - Image width
 * @param {number} [pdfWidth] - Pdf width
 * @param {number} [pdfHeight] - Pdf height
 */
class FileContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      src: null,
      data: null
    }
  }

  async init() {
    const { url, mimeType } = this.props;

    try {
      const data = await this.props.requests.getBlob(url);

      if (mimeType === 'image/jpeg' || mimeType === 'image/png' || mimeType === 'image/gif' || mimeType === 'image/bmp') {
        const reader = new FileReader();
        reader.readAsDataURL(data);
        reader.onloadend = () => {
          this.setState({ src: reader.result, data });
        }
      }
      else if (mimeType === 'application/pdf' || mimeType === 'text/plain') {
        this.setState({ src: URL.createObjectURL(data), data })
      }
      else {
        this.setState({ data });
      }
    }
    catch (error) {
      console.error(error)
    }
  }

  componentDidMount() {
    if (this.props.id) {
      this.init();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.id !== prevProps.id) {
      this.init();
    }
  }

  handleDownload = () => {
    saveAs(this.state.data, this.props.name);
  }

  buildPreview = () => {
    if (!this.state.src) {
      return null;
    }

    switch (this.props.mimeType) {
      case 'application/pdf':
      case 'text/plain':
        return (
          <iframe
            src={this.state.src + '#toolbar=0&navpanes=0'}
            width={this.props.pdfWidth ? `${this.props.pdfWidth}%` : "100%"}
            height={this.props.pdfHeight ? this.props.pdfHeight : "100%"}
            title={this.props.name}
          />
        );
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
      case 'image/bmp':
        return (
          <img
            width={this.props.imgWidth ? `${this.props.imgWidth}%` : 300}
            src={this.state.src}
            alt={this.props.name}
          />
        );
      default:
        return (
          <div>nie je k dizpozicii</div>
        );
    }
  }

  buildButton = () => {
    if (this.props.hideButton) {
      return null;
    }
    return (
      <Button
        label="Stiahnuť"
        primary={true}
        icon="download"
        onClick={this.handleDownload}
        disabled={!this.state.src}
      />
    );
  }

  render() {
    return (
      <>
        {this.buildPreview()}
        {this.buildButton()}
      </>
    );
  }
}

FileContent.propTypes = {
  requests: PropTypes.object,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  mimeType: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  style: PropTypes.object,
  hideButton: PropTypes.bool,
  imgWidth: PropTypes.number,
  pdfWidth: PropTypes.number,
  pdfHeight: PropTypes.number
}

export default FileContent;