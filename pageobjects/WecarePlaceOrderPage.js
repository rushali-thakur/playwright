const { expect } = require('@playwright/test');

class WecarePlaceOrderPage {
    constructor(page) {
        this.page = page;
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.passwordTab = page.getByRole('button', { name: 'Password' });
        this.mobileNumber = page.getByRole('textbox', { name: 'Mobile Number' });
        this.password = page.getByRole('textbox', { name: 'Password' });
        this.loginSubmit = page.locator('form').getByRole('button', { name: 'Log In' });
        this.packagesTab = page.getByRole('button', { name: 'Packages' });
        this.packageCard = page.getByRole('img', { name: 'BestSeller Combo Packages' });
        this.addPackageButton = page.getByRole('button', { name: '+ Add' }).first();
        this.viewCart = page.getByRole('button', { name: 'View Cart arrow_forward' });
        this.proceedToCheckout = page.getByRole('button', { name: 'Proceed to Checkout' });
        this.addressOption = page.getByText(/Hinjewadi Phase III.*Rajiv Gandhi Infotech/i);
        this.nextChooseSlot = page.getByRole('button', { name: 'Next: Choose Slot' });
        this.date = page.getByRole('button', { name: 'Mon 21 Sep' });
        this.confirmOrder = page.getByRole('button', { name: 'Confirm & Place Order' });
        this.orderPlacedHeading = page.getByRole('heading');

        this.searchServices = page.getByText('Search services, packages,');
        this.serviceSearch = page.getByRole('textbox', { name: 'Search services, products,' });
        this.service = page.getByRole('button', { name: "spa Haircut Women's Salon at" });
        this.addToCart = page.getByRole('button', { name: 'Add to Cart' }).nth(2);
        this.hairLength = page.getByRole('checkbox', { name: 'Above Shoulder Hair spa Above' });
        this.addItemToCart = page.getByRole('button', { name: 'Add 1 to Cart' });
        this.paymentOption = page.getByText('radio_button_checked');
        this.timeSlot = page.getByRole('button', { name: ':00 PM – 6:30 PM' });
    }

    async waitForNetworkIdle() {
        await this.page.waitForTimeout(3000);
        await this.page.waitForLoadState('networkidle');
    }

    async login(
        mobileNumber = process.env.WECARE_USER_MOBILE,
        password = process.env.WECARE_USER_PASSWORD
    ) {
        if (!mobileNumber || !password) {
            throw new Error('Set WECARE_USER_MOBILE and WECARE_USER_PASSWORD before running WeCare tests.');
        }
        await this.page.goto('https://wecarehomesalon.com/login');
        await this.loginButton.click();
        await this.passwordTab.click();
        await this.mobileNumber.fill(mobileNumber);
        await this.password.fill(password);
        await this.loginSubmit.click();
    }

    async addHaircutToCart() {
        await this.searchServices.click();
        await this.serviceSearch.fill('haircut');
        await this.serviceSearch.press('Enter');
        await this.service.click();
        await this.addToCart.click();
        await this.hairLength.check();
        await this.addItemToCart.click();
        await this.waitForNetworkIdle();
    }

    async placePackageOrder() {
        await this.packagesTab.click();
        await this.packageCard.click();
        await this.addPackageButton.click();
        await this.viewCart.click();
        await this.waitForNetworkIdle();
        await this.proceedToCheckout.click();
        await this.addressOption.click();
        await this.nextChooseSlot.click();
        await this.date.click();
        await this.confirmOrder.click();
    }

    async placeOrder() {
        await this.viewCart.click();
        await this.proceedToCheckout.click();
        await this.paymentOption.click();
        await this.nextChooseSlot.click();
        await this.date.click();
        await this.timeSlot.click();
        await this.confirmOrder.click();
    }

    async addServiceToCart(serviceName) {
        await this.page.getByText('Search services, packages,').click();
        await this.serviceSearch.fill(serviceName);
        await this.waitForNetworkIdle();
        await this.page.keyboard.press('Enter');
        await this.waitForNetworkIdle();
        const serviceOption = this.page.locator('button, [role="button"]').filter({ hasText: serviceName }).first();
        await serviceOption.click();
        await this.waitForNetworkIdle();
        const addToCartButton = this.page.locator('button:has-text("Add to Cart")').first();
        try {
            await addToCartButton.click();
        } catch {
            console.log(`Add to Cart button not found for service: ${serviceName}`);
        }
        await this.waitForNetworkIdle();
        const viewCartButton = this.page.locator('button:has-text("View Cart")').first();
        await viewCartButton.click();
        await this.waitForNetworkIdle();
        const variantOption = this.page.locator('button:has-text("Proceed to Checkout")').first();
        await variantOption.click();

        await this.waitForNetworkIdle();
        const addOneToCartButton = this.page.locator('button:has-text("Next: Choose Slot")').first();
        await addOneToCartButton.click();
        await this.waitForNetworkIdle();
    }

    async proceedToBooking(day, month, time) {
        const dateButton = this.page.locator('button').filter({ hasText: new RegExp(`${month}.*${day}|${day}.*${month}`, 'i') }).first();
        await dateButton.click();
        await this.waitForNetworkIdle();
        const timeButton = this.page.locator('button').filter({ hasText: new RegExp(time, 'i') }).first();
        await timeButton.click();
        await this.waitForNetworkIdle();
        await this.confirmOrder.click();
        await this.waitForNetworkIdle();
    }

    async actualMessage() {
        const success = this.page.getByText(/Order Placed!/i).first();
        await success.waitFor({ state: 'visible', timeout: 30000 });
        return 'Order Placed!';
    }

    async getBookingId() {
        const bookingText = await this.page.locator("//span[@class='co-done-card-hid']").innerText();
        const match = bookingText.match(/(?:Booking|Order)\s*#?\s*(\d+)/i);
        if (!match) {
            throw new Error(`Could not extract booking ID from: ${bookingText}`);
        }
        return match[1];
    }

    async openNewTab(url) {
        const newPage = await this.page.context().newPage();
        await newPage.goto(url);
        return newPage;
    }

    async goToAdminPanel() {
        const email = process.env.WECARE_ADMIN_EMAIL;
        const password = process.env.WECARE_ADMIN_PASSWORD;
        if (!email || !password) {
            throw new Error('Set WECARE_ADMIN_EMAIL and WECARE_ADMIN_PASSWORD before opening the admin panel.');
        }
        this.page = await this.openNewTab('https://admin.wecarehomesalon.com/');
        await this.page.locator('#email').fill(email);
        await this.page.locator('#password').fill(password);
        await this.page.locator('.login-button').click();
    }

    async getServiceProviderNameByBookingId(serviceBookingID) {
        await this.waitForNetworkIdle();
        await this.page.locator('body').waitFor();
       // await this.page.locator('.login-button').click();
        const locator = this.page.locator("//td[contains(.,'" + serviceBookingID + "')]/parent::tr//span[contains(.,'edit')]");
        await locator.click();
        const rowText = await locator.first().locator('xpath=ancestor::tr').textContent();
        const match = rowText.match(/([A-Za-z0-9 ._-]+)\s*\|/i) || rowText.match(/([A-Za-z0-9 ._-]+)\s*$/i);
        return match ? match[1].trim() : 'SERVICE_PROVIDER_NAME_NOT_FOUND';

        return 'SERVICE_PROVIDER_NAME_NOT_FOUND';
    }

    async gotoServiceProvider(serviceProviderName) {
        await this.page.goto('https://serviceprovider.wecarehomesalon.com/');
        const providerLink = this.page.locator('a, button').filter({ hasText: new RegExp(serviceProviderName, 'i') }).first();

        await providerLink.click();

    }

    async serviceProviderBookingSlot() {
        await this.page.locator('body').waitFor();
    }

    async markBookingInProgress() {
        const inProgressButton = this.page.locator('button').filter({ hasText: /In Progress|Mark In Progress|Booking In Progress/i }).first();

        await inProgressButton.click();

    }

    async paymentSectionServiceProv() {
        const paymentButton = this.page.locator('button').filter({ hasText: /Payment|Complete Payment|Cash/i }).first();

        await paymentButton.click();

    }

    async verifyOrderPlaced() {
        await expect(this.orderPlacedHeading).toContainText('Order Placed!');
    }
}

module.exports = { WecarePlaceOrderPage };
