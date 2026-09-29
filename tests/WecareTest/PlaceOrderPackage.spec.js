import { test } from '@playwright/test';
const { POManager } = require('../../pageobjects/POManager');

test('Place order via package flow', async ({ page }) => {
  const poManager = new POManager(page);
  const wecarePlaceOrderPage = poManager.getWecarePlaceOrderPage();

  await wecarePlaceOrderPage.login();
  await wecarePlaceOrderPage.placePackageOrder();
  await wecarePlaceOrderPage.verifyOrderPlaced();
});