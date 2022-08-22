import React from 'react';
import Dialog from './Dialog';
import PropTypes from 'prop-types';
import Button from '../buttons/Button';
import './ReportDialog.scss';
import fileSaver from 'file-saver';

let _createdUrl = null;

/**
 * Report dialog
 * @module
 * @param {bool} isOpen - Is dialog open?
 * @param {func} onClose - Function invoked on dialog close
 * @param {object} [blob] - Blob
 * @param {sting} [fileName] - File name
 */
class ReportDialog extends React.Component {

  handlePrint = () => {
    if (this.iframe !== undefined) {
      const iframeContent = this.iframe.contentWindow;
      if (iframeContent) {
        try {
          iframeContent.focus();
          iframeContent.print();
        }
        catch (e) {
          var win = window.open(_createdUrl, '_blank');
          win.focus();
        }
      }
    }
  }

  handleDownload = () => {
    if (this.props.blob) {
      fileSaver.saveAs(this.props.blob, this.props.fileName);
    }
  }

  render() {
    _createdUrl = null;
    if (this.props.blob) {
      _createdUrl = URL.createObjectURL(this.props.blob);     
    }

    return (
      _createdUrl && <Dialog
        isOpen={this.props.isOpen}
        title={'Náhľad'}
        onClose={this.props.onClose}
        fullscreen={true}
        className={"fullscreen-report"}
      >
        <div style={{ width: '100%', height: '100%' }}>
          <div className="report-buttons">
            <Button
              label="Tlačiť"
              primary={true}
              icon="print"
              onClick={this.handlePrint}
            />
            <Button
              label="Stiahnuť dokument"
              primary={true}
              icon="download"
              onClick={this.handleDownload}
            />
          </div>
          {<iframe
            src={_createdUrl + '#toolbar=0&navpanes=0'}
            width="100%"
            height="100%"
            title={this.props.fileName}
            ref={(frame) => { this.iframe = frame }}
          />}          
        </div>
      </Dialog>
    )
  }
}

ReportDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  blob: PropTypes.object,
  fileName: PropTypes.string,
}

export default ReportDialog;

