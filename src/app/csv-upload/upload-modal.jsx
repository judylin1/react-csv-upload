import React, { Component, PropTypes } from 'react';
import { Dialog, FlatButton, CircularProgress } from 'material-ui';
import { not, either, isEmpty, isNil } from 'ramda';
import Dropzone from './dropzone/container-dropzone';
import FailedSection from './failedSection';

const isNilOrEmpty = either(isEmpty, isNil);

class UploadModal extends Component {

  onDrop = (file) => this.props.onDrop(file);

  render() {
    const actions = this.props.showFailedSection && not(isNilOrEmpty(this.props.failedRows)) ? [
      <FlatButton
        label="Fix Errors and Resubmit"
        primary
        onTouchTap={() => this.props.onRequestClose()}
      />,
      <FlatButton
        label={`Proceed with uploading ${this.props.numOfSuccessfulRows}`}
        secondary
        onTouchTap={() => {
          this.props.onCompleteFunc();
          this.props.onRequestClose();
        }}
      />,
    ] : [
      <FlatButton
        label="Cancel"
        secondary
        onTouchTap={() => this.props.onRequestClose()}
        disabled={this.props.processing}
      />,
    ];

    return (
      <Dialog
        className="form-dialog"
        title={this.props.showFailedSection && not(isNilOrEmpty(this.props.failedRows)) ? `${this.props.dialogTitle} - Error` : this.props.dialogTitle}
        ref="uploadModal"
        open={this.props.open}
        actions={actions}
        onRequestClose={() => this.props.onRequestClose()}
      >
        {
          this.props.showFailedSection && not(isNilOrEmpty(this.props.failedRows)) ?
            <FailedSection
              failedRows={this.props.failedRows}
              numOfSuccessfulRows={this.props.numOfSuccessfulRows}
            /> :
            <div>
              {
                this.props.processing ?
                  <div style={{ display: 'block', textAlign: 'center' }}>
                    <CircularProgress /><br/>
                    Please wait. Upload in progress.
                  </div> :
                  <div>
                    <div style={{ display: 'inline' }}>
                      {this.props.note}
                    </div>
                    {
                      this.props.CSVHeaderMismatch ?
                        <div style={{ color: 'red', marginTop: '7px' }}>
                          Your columns do not appear to be in the right order. Please correct this and re-upload.
                        </div> : <span/>
                    }
                    <Dropzone
                      onDrop={this.onDrop}
                      dropzoneText={this.props.dropzoneText}
                    />
                  </div>
              }
            </div>
        }
      </Dialog>
    );
  }
}

UploadModal.propTypes = {
  dialogTitle: PropTypes.string,
  onDrop: PropTypes.func,
  open: PropTypes.bool,
  onRequestClose: PropTypes.func,
  dropzoneText: PropTypes.string,
  note: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  showFailedSection: PropTypes.bool,
  failedRows: PropTypes.array,
  numOfSuccessfulRows: PropTypes.number,
  onCompleteFunc: PropTypes.func,
  CSVHeaderMismatch: PropTypes.bool,
  processing: PropTypes.bool,
};

export default UploadModal;
