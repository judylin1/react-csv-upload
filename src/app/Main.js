import React, { Component } from 'react';
import {deepOrange500} from 'material-ui/styles/colors';
import { RaisedButton } from 'material-ui';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CSVUpload from './csv-upload/csv-upload-container';

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200,
  },
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

class Main extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
    };
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <RaisedButton
            key="CSV"
            label="CSV"
            onTouchTap={() => this.setState({
              open: true,
            })}
          />
          <CSVUpload
            onCompleteFunc={(successfulRows, failedRows) => {
              console.log('successfulRows', successfulRows);
              console.log('failedRows', failedRows);
              // updateMMProp({ openCSVDialog: false });
            }}
            open={this.state.open}
            onRequestClose={() => this.setState({ open: false })}
            dialogTitle={'Upload A File'}
            note={
              <div>
                The CSV file must have the following layout: <br/>
                Email (required), Company Name (optional), First Name (optional), Last Name (optional)<br/>
              </div>
            }
            dropzoneText={'Drag and drop your CSV or Excel file here or click inside to choose a file from your computer.'}
            headers={[
              {
                headerTitle: 'Email',
                required: true,
              },
              {
                headerTitle: 'Company Name',
                required: false,
              },
              {
                headerTitle: 'First Name',
                required: false,
              },
              {
                headerTitle: 'Last Name',
                required: false,
              },
            ]}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
