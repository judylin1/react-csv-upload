import React, { PropTypes } from 'react';

const FailedSection = props => {
  const {
    failedRows,
    numOfSuccessfulRows,
  } = props;

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        The CSV you've uploaded contains {failedRows.length} errors. The following rows have errors:
      </div>
      {
        failedRows.map((row, i) => {
          return (
            <div key={i}>
              Row {row.line} - {row.error}
            </div>
          );
        })
      }
      <div style={{ marginTop: '10px' }}>
        Do you want to fix these rows and reupload the file or proceed with uploading the {numOfSuccessfulRows} successful rows?
      </div>
    </div>
  );
};

FailedSection.propTypes = {
  failedRows: PropTypes.array,
  numOfSuccessfulRows: PropTypes.number,
};

export default FailedSection;
