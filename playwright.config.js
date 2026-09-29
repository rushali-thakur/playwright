// @ts-check
const { devices } = require('@playwright/test');

const config = {
  testDir: './tests/WecareTest',
  testMatch: '**/*.spec.js',
  retries :1,
  
  /* Maximum time one test can run for. */
  timeout: 300 * 1000,
  expect: {
  
    timeout: 10000
  },
  
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {

    browserName : 'chromium',
    actionTimeout: 10000,
    headless : false,
    screenshot : 'on',
    trace : 'on',//off,on
    
    
    
  },


};

module.exports = config;
