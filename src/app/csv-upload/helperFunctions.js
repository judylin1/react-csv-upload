'use strict';

const Papa = require('papaparse');
const R = require('ramda');

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

const doesAColumnOfEmailsExist = (headers) => R.call(R.compose(R.contains('email'), R.map(toLowerCase), R.pluck('headerTitle')), headers);

// This is based on a row of email existing
const checkIfCSVHeaderMatchesHeaderRequirement = ({ headers, headerRemoved, csv }) => {
  const checkIfAColOfEmailsExists = doesAColumnOfEmailsExist(headers);
  if (checkIfAColOfEmailsExists) {
    const headerIndexOfEmails = R.indexOf('email', lowerCaseHeaders(headers));
    const arrayOfEmails = R.pluck(headerIndexOfEmails)(csv);
    const anyEmailExistsInExpectedRow = R.any(validEmail, R.reject(isNilOrEmpty, arrayOfEmails));
    return anyEmailExistsInExpectedRow ? ({ headers, headerRemoved, csv }) : ({ CSVFileError: 'header mismatch' });
  }
  return ({ headers, headerRemoved, csv });
};

// Find the invalid row in the csv.
const findInvalidRowIndex = (csv, invalidRow) => R.map(row => R.indexOf(row, csv), invalidRow);

// Check each header row.
const checkRequiredFields = ({ headers, headerRemoved, csv }) => {
  let remainingRowsToCheck;
  const failedRows = [];
  const checkIfAColOfEmailsExists = doesAColumnOfEmailsExist(headers);
  headers.forEach((header, headerIndex) => {
    if (header.required) {
      const findMissingRows = R.filter(arr => isNilOrEmpty(R.prop(headerIndex, arr)), (remainingRowsToCheck || csv));
      const findMissingRowsIndex = findInvalidRowIndex(csv, findMissingRows);
      findMissingRowsIndex.forEach(index => {
        const error = `Missing ${header.headerTitle}`;
        failedRows.push({ line: headerRemoved ? index + 2 : index + 1, error });
      });
      remainingRowsToCheck = R.reject(arr => R.contains(arr, findMissingRows), (remainingRowsToCheck || csv));
    }
    if (checkIfAColOfEmailsExists) {
      const headerIndexOfEmails = R.indexOf('email', lowerCaseHeaders(headers));
      const findInvalidEmailRows = R.filter(arr => R.not(isNilOrEmpty(R.prop(headerIndexOfEmails, arr))) && !validEmail(R.prop(headerIndexOfEmails, arr)), (remainingRowsToCheck || csv));
      const findInvalidEmailRowsIndex = findInvalidRowIndex(csv, findInvalidEmailRows);
      findInvalidEmailRowsIndex.forEach(index => {
        const error = 'Invalid email';
        failedRows.push({ line: headerRemoved ? index + 2 : index + 1, error });
      });
      remainingRowsToCheck = R.reject(arr => R.contains(arr, findInvalidEmailRows), (remainingRowsToCheck || csv));
    }
  });
  return ({
    successfulRows: remainingRowsToCheck,
    failedRows,
  });
};

// PapaParse converts each row to an array of strings (['bat@man.com', 'Batman Biz', 'Bruce', 'Wayne']).
// Need to convert this into an array of objects with the key being the row header ({ email: 'bat@man.com', companyName: 'Batman Biz', firstName: 'Bruce', lastName: 'Wayne' }).
const convertRowsToObjects = R.curry((headers, csv, { successfulRows, failedRows }) => {
  const covertSuccessfulRowsToObj = (successfulRows || []).map(row => {
    const obj = {};
    headers.forEach((header, headerIndex) => {
      obj[header.headerTitle] = row[headerIndex];
    });
    return obj;
  });
  const convertFailedRowsToObject = (failedRows || []).map(row => {
    const updatedRow = R.merge(row, {}); // avoid mutating row
    headers.forEach((header, headerIndex) => {
      updatedRow[header.headerTitle] = csv[row.line - 1][headerIndex];
    });
    return updatedRow;
  });
  return ({
    successfulRows: covertSuccessfulRowsToObj,
    failedRows: convertFailedRowsToObject,
  });
});

const handleCSVMisMatch = () => ({ CSVHeaderMismatch: true });

// headers is an array of objects with headerTitle and required Boolean
// For ex: [
// {
//   headerTitle: 'Email',
//   required: true,
// },
// {
//   headerTitle: 'Company Name',
//   required: false,
// },
// ]
const convertCSV = (csv, headers) => {
  const parsedCSV = Papa.parse(csv, { skipEmptyLines: true });
  return R.call(R.compose(
    R.ifElse(
      R.prop('CSVFileError'),
        () => handleCSVMisMatch(),
      R.compose(
        convertRowsToObjects(headers, parsedCSV.data),
        checkRequiredFields,
      )
    ),
    checkIfCSVHeaderMatchesHeaderRequirement,
    checkIfHeaderRowExists(headers),
  ), parsedCSV.data);
};

export {
  convertCSV,
};
