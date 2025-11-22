// Global test setup
require('dotenv').config({ path: '.env.test' });

// Increase timeout for all tests
jest.setTimeout(10000);

// Suppress console logs during tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});