import React, { Component, PropTypes } from 'react';
const XLSX = window.XLSX;
import { convertCSV } from './helperFunctions';
import UploadModal from './upload-modal';

class CSVUploadContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      successfulContacts: [],
      contactsWithErrors: [],
      processing: false,
      CSVHeaderMismatch: false,
    };
  }

  onDrop = ([file]) => {
    if (!file) return;
    if (this.state.CSVHeaderMismatch) this.setState({ CSVHeaderMismatch: false });
    if (
      file.type.indexOf('.csv') > -1 ||
      file.type.indexOf('/csv') > -1 ||
      (file.type === 'application/vnd.ms-excel' && file.name.indexOf('.csv') > -1)
    ) { // third check is for csv files on excel
      this.setState({
        processing: true,
      });
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContents = e.target.result;
        convertCSV(fileContents, this.props.headers, this.updateState);
        if (!this.props.showFailedSection && !this.state.CSVHeaderMismatch) this.props.onCompleteFunc(this.state.successfulContacts, this.state.contactsWithErrors);
        this.setState({
          processing: false,
        });
      };
      reader.readAsText(file);
    } else if (file.type === 'application/vnd.ms-excel' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.setState({
        processing: true,
      });
      const reader = new FileReader();
      reader.onload = (e) => {
        let binary = '';
        const data = e.target.result;
        const bytes = new Uint8Array(data);
        const length = bytes.byteLength;

        for (let i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }

        const workbook = XLSX.read(binary, { type: 'binary' });
        const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);
        convertCSV(csv, this.props.headers, this.updateState);
        if (!this.props.showFailedSection && !this.state.CSVHeaderMismatch) this.props.onCompleteFunc(this.state.successfulContacts, this.state.contactsWithErrors);
        this.setState({
          processing: false,
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Please upload a valid excel or csv file!');
    }
  };

  updateState = (key, value) => this.setState({ [key]: value });

  render() {
    const {
      open,
      onRequestClose,
      dialogTitle,
      note,
      dropzoneText,
      onCompleteFunc,
      showFailedSection,
    } = this.props;

    return (
      <div>
        <UploadModal
          open={open}
          onRequestClose={() => {
            this.setState({
              successfulContacts: [],
              contactsWithErrors: [],
              processing: false,
            });
            onRequestClose();
          }}
          onDrop={this.onDrop}
          dialogTitle={dialogTitle}
          note={note}
          dropzoneText={dropzoneText}
          showFailedSection={showFailedSection}
          failedRows={this.state.contactsWithErrors}
          numOfSuccessfulRows={this.state.successfulContacts.length}
          onCompleteFunc={() => onCompleteFunc(this.state.successfulContacts)}
          CSVHeaderMismatch={this.state.CSVHeaderMismatch}
          processing={this.state.processing}
        />
      </div>
    );
  }
}

CSVUploadContainer.propTypes = {
  open: PropTypes.bool,
  onRequestClose: PropTypes.func,
  dialogTitle: PropTypes.string,
  note: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  dropzoneText: PropTypes.string,
  onCompleteFunc: PropTypes.func, // if showFailedSection and user clicks upload successful contacts, this will only receive successfulrows
  headers: PropTypes.array,
  showFailedSection: PropTypes.bool, // if true, user will see which rows failed. if false, onCompleteFunc will run
};

export default CSVUploadContainer;
