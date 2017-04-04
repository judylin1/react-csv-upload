import Papa from 'papaparse';
import R from 'ramda';

const isNilOrEmpty = R.either(R.isEmpty, R.isNil);

// Check if email is valid.
const validEmail = (email) => {
  const filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
  return String(email).search(filter) !== -1;
};

const toLowerCase = (string) => string.toLowerCase();

// Convert header to lowercase.
const lowerCaseHeaders = (headers) => R.call(R.compose(R.map(toLowerCase), R.pluck('headerTitle')), headers);

const checkIfHeaderRowExists = R.curry((headers, parsedCSV) => {
  const firstRowOfCSV = R.call(R.compose(R.map(toLowerCase), R.head), parsedCSV);
  const isFirstRowHeaders = R.not(isNilOrEmpty(R.intersection(firstRowOfCSV, lowerCaseHeaders(headers))));
  const info = {
    headers,
    headerRemoved: isFirstRowHeaders,
  };
  return isFirstRowHeaders ? R.merge(info, { csv: R.tail(parsedCSV) }) : R.merge(info, { csv: parsedCSV });
});

// Find the invalid row in the csv.
const findInvalidRowIndex = (csv, invalidRow) => R.call(R.map(row => R.indexOf(row, csv)), invalidRow);

// Check each header row.
const checkRequiredFields = ({ headers, headerRemoved, csv }) => {
  let successfulRows;
  let remainingRowsToCheck;
  const failedRows = [];
  const checkIfARowOfEmailsExists = R.call(R.compose(R.contains('email'), R.map(toLowerCase), R.pluck('headerTitle')), headers);
  headers.forEach((header, headerIndex) => {
    if (header.required) {
      const findMissingRows = R.call(R.compose(R.filter(arr => isNilOrEmpty(R.prop(headerIndex, arr)))), (remainingRowsToCheck || csv));
      const findMissingRowsIndex = findInvalidRowIndex(csv, findMissingRows);
      findMissingRowsIndex.map(index => {
        const error = `Missing ${header.headerTitle}`;
        failedRows.push({ line: headerRemoved ? index + 2 : index + 1, error });
      });
      remainingRowsToCheck = R.reject(arr => R.contains(arr, findMissingRows), (remainingRowsToCheck || csv));
    }
    if (checkIfARowOfEmailsExists) {
      const headerIndexOfEmails = R.indexOf('email', lowerCaseHeaders(headers));
      const findInvalidEmailRows = R.call(R.compose(R.filter(arr => R.not(isNilOrEmpty(R.prop(headerIndexOfEmails, arr))) && !validEmail(R.prop(headerIndexOfEmails, arr)))), (remainingRowsToCheck || csv));
      const findInvalidEmailRowsIndex = findInvalidRowIndex(csv, findInvalidEmailRows);
      findInvalidEmailRowsIndex.map(index => {
        const error = 'Invalid email';
        failedRows.push({ line: headerRemoved ? index + 2 : index + 1, error });
      });
      remainingRowsToCheck = R.reject(arr => R.contains(arr, findInvalidEmailRows), (remainingRowsToCheck || csv));
    }
    successfulRows = remainingRowsToCheck;
  });
  return ({
    successfulRows,
    failedRows,
  });
};

// PapaParse converts each row to an array of strings (['bat@man.com', 'Batman Biz', 'Bruce', 'Wayne']).
// Need to convert this into an array of objects with the key being the row header ({ email: 'bat@man.com', companyName: 'Batman Biz', firstName: 'Bruce', lastName: 'Wayne' }).
const convertSuccessfulRowsToObjects = R.curry((headers, { successfulRows, failedRows }) => {
  if (R.not(isNilOrEmpty(successfulRows))) {
    const covertSuccessfulRowsToObj = successfulRows.map(row => {
      const obj = {};
      headers.forEach((header, headerIndex) => {
        obj[header.headerTitle] = row[headerIndex];
      });
      return obj;
    });
    return ({
      successfulRows: covertSuccessfulRowsToObj,
      failedRows,
    });
  }
  return ({
    successfulRows,
    failedRows,
  });
});

// Return array of successful rows and failed rows to container.
const updateContainerState = R.curry((updateState, { successfulRows, failedRows }) => {
  updateState('successfulContacts', successfulRows);
  updateState('contactsWithErrors', failedRows);
});

const convertCSV = (csv, headers, updateState) => {
  const parsedCSV = Papa.parse(csv, { skipEmptyLines: true });
  R.call(R.compose(
    updateContainerState(updateState),
    convertSuccessfulRowsToObjects(headers),
    checkRequiredFields,
    checkIfHeaderRowExists(headers),
  ), parsedCSV.data);
};

export {
  convertCSV,
};
