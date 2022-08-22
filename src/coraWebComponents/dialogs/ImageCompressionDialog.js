import React from 'react';
import PropTypes from 'prop-types';
import Dialog from './Dialog';
import ImageCompression from '../forms/ImageCompression';

class ImageCompressionDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
    };
  }

  onChange = (name, file) => {
    let files = [...this.props.files];
    const fileIndex = parseInt(name.replace("image", ""));    
    const fileInfo = {
      ...files[fileIndex],
      name: file.name,
      extension: "." + file.name.split(".")[1],
      size: file.size,
      getRawFile: () => { return file; },
    }
    files[fileIndex] = fileInfo;
    this.props.onChange(files);
  }

  render() {
    const files = this.props.files;
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        onConfirm={this.props.onConfirm}
        title={"Úprava veľkosti obrázkov"}
        fullscreen={true}
      >
        <div>
        { 
          files          
          .map((file, fileIndex) => file.l_resize && 
            <ImageCompression
              file={file.getRawFile()}
              imageTitle={file.name}
              onChange={this.onChange}
              name={"image" + fileIndex}
              key={"image" + fileIndex}
              requiredMaximumSize={this.props.requiredMaximumSize}
              required
              />
          )
        }
        </div>
      </Dialog>
    );
  }
}

ImageCompressionDialog.propTypes = {
  files: PropTypes.array,
  requiredMaximumSize: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

export default ImageCompressionDialog;