const assert = require('assert');
const convertCSV = require('../src/app/csv-upload/helperFunctions').convertCSV;
const TestData = require('./testData');

assert.deepEqual(
  convertCSV(TestData.mismatchWithoutHeadersCSV, TestData.headers),
  { CSVHeaderMismatch: true }
);

assert.deepEqual(
  convertCSV(TestData.mismatchWithHeadersCSV, TestData.headers),
  { CSVHeaderMismatch: true }
);

assert.deepEqual(
  convertCSV(TestData.threeFailed4Pass, TestData.headers),
  threeFailed4PassResult
);

console.log('all passing');
