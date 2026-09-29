import { test } from '@playwright/test';
const { POManager } = require('../../pageobjects/POManager');

test('test', async ({ page }) => {
  const poManager = new POManager(page);
  const wecarePlaceOrderPage = poManager.getWecarePlaceOrderPage();

  await wecarePlaceOrderPage.login();
  await wecarePlaceOrderPage.addHaircutToCart();
  await wecarePlaceOrderPage.placeOrder();
  await wecarePlaceOrderPage.verifyOrderPlaced();
});