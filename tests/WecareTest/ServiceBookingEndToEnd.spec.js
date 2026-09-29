const { test, expect } = require('@playwright/test');
const { POManager } = require('../../pageobjects/POManager');

test.describe('WeCare end-to-end service booking flow', () => {
  let serviceBookingID;
  let serviceProviderName;

  test('add services to cart and place booking', async ({ page }) => {
    const poManager = new POManager(page);
    const wecarePage = poManager.getWecarePlaceOrderPage();

    await wecarePage.login();
    await wecarePage.addServiceToCart('Medium Length Hair spa');
    await wecarePage.proceedToBooking('30', 'Sep', '6:30 PM');

    const message = await wecarePage.actualMessage();
    expect(message).toBe('Order Placed!');

    serviceBookingID = await wecarePage.getBookingId();
    console.log('Booking ID:', serviceBookingID);
  });

  test('open admin panel and find service provider by booking id', async ({ page }) => {
    test.skip(!serviceBookingID, 'Booking ID not available from previous test');
    const poManager = new POManager(page);
    const wecarePage = poManager.getWecarePlaceOrderPage();
    await wecarePage.goToAdminPanel();
    serviceProviderName = await wecarePage.getServiceProviderNameByBookingId(serviceBookingID);
    console.log('Service Provider Name:', serviceProviderName);
  });

  test('open service provider portal and mark booking in progress', async ({ page }) => {
    test.skip(!serviceProviderName, 'Service provider not found from previous test');

    const poManager = new POManager(page);
    const wecarePage = poManager.getWecarePlaceOrderPage();

    const serviceProviderPage = await wecarePage.openNewTab('https://serviceprovider.wecarehomesalon.com/');
    await wecarePage.gotoServiceProvider(serviceProviderName);
    await wecarePage.serviceProviderBookingSlot();
    await wecarePage.markBookingInProgress();
    await wecarePage.paymentSectionServiceProv();
  });
});
