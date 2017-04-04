import React, { PropTypes } from 'react';
import Dropzone from './dropzone';
import Icon from './icon';

const DropzoneContainer = props => {
  const {
    onDrop,
    dropzoneText,
  } = props;

  return (
    <Dropzone
      onDrop={onDrop}
      style={{
        height: '200px',
        border: '4px dashed #efefef',
        position: 'relative',
        marginTop: '24px',
        cursor: 'pointer',
      }}
      disableClick={false}
    >
      <div
        style={{
          position: 'relative',
          textAlign: 'center',
          lineHeight: '200px',
          fontSize: '16px',
        }}
      >
        <Icon
          style={{
            float: 'none',
            display: 'inline-block',
            textAlign: 'center',
            lineHeight: '200px',
            color: '#ccc',
            top: '-8px',
            verticalAlign: 'middle',
            width: '25%',
            fontSize: '100px',
          }}
          className="tc-icon-add"
        />
        <div
          style={{
            display: 'inline-block',
            width: '75%',
            wordWrap: 'break-word',
            lineHeight: '24px',
            margin: '0',
            padding: '15px',
          }}
        >
          { dropzoneText || 'Drag and drop your CSV or Excel file here or click inside to choose a file from your computer' }
        </div>
      </div>
    </Dropzone>
  );
};

DropzoneContainer.propTypes = {
  onDrop: PropTypes.func,
  dropzoneText: PropTypes.string,
};

export default DropzoneContainer;
