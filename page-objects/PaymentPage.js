import { expect } from "@playwright/test"

export class PaymentPage {
    constructor(page) {
        this.page = page;
        this.discountCode = page.frameLocator('[data-qa="active-discount-container"]').locator('[data-qa="discount-code"]');
        //new element for discount input
        this.discountInput = page.locator('[data-qa="discount-code-input"]');
        this.activateDiscountButton = page.locator('[data-qa="submit-discount-button"]');
        this.totalValue = page.locator('[data-qa="total-value"]');
        this.discountedValue = page.locator('[data-qa="total-with-discount-value"]');
        this.discountActiveMessage = page.locator('[data-qa="discount-active-message"]');
        this.creditCardOwnerInput = page.getByRole('textbox', { name: 'Credit card owner' });
        this.creditCardNumberInput = page.getByRole('textbox', { name: 'Credit card number' });
        this.creditCardValidUntilInput = page.getByRole('textbox', { name: 'Valid until' });
        this.creditCardCvcInput= page.getByRole('textbox', { name: 'Credit card CVC' });
        this.payButton = page.locator('[data-qa="pay-button"]');
    }

    activateDiscount = async () => {
        await this.discountCode.waitFor();
        const code = await this.discountCode.innerText();
        // need to fil out the discount input
        await this.discountInput.waitFor();

        //Option 1 for laggy inputs: using .fill() with await expect()
        await this.discountInput.fill(code);
        // wait to see that the input contains the value which was entered
        await expect(this.discountInput).toHaveValue(code);

        // // Option 2 for laggy inputs : slow typing
        // await this.discountInput.focus();
        // await this.page.keyboard.type(code, {delay: 1000});
        // expect(await this.discountInput.inputValue()).toBe(code);

        expect(await this.discountedValue.isVisible()).toBe(false);
        await this.activateDiscountButton.waitFor();
        await this.activateDiscountButton.click();
        // check that it displays "Discount activated"
        await this.discountActiveMessage.waitFor();
        // check that there is now a discounted price total showing
        await this.discountedValue.waitFor();
        const discountValueText = await this.discountedValue.innerText(); //"345$"
        const discountValueOnlyStringNumber = discountValueText.replace("$", "");
        const discountValueNumber = parseInt(discountValueOnlyStringNumber, 10)
        await this.totalValue.waitFor();
        const totalValueText = await this.totalValue.innerText(); //"1076$"
        const totalValueOnlyStringNumber = totalValueText.replace("$", "");
        const totalValueNumber = parseInt(totalValueOnlyStringNumber, 10)
        // check that the discounted price total is smaller than the regular one
        expect(discountValueNumber).toBeLessThan(totalValueNumber)
    }

    fillPaymentDetails = async (paymentDetails) => {
        await this.creditCardOwnerInput.waitFor();
        await this.creditCardOwnerInput.fill(paymentDetails.owner);
        await this.creditCardNumberInput.waitFor();
        await this.creditCardNumberInput.fill(paymentDetails.number);
        await this.creditCardValidUntilInput.waitFor();
        await this.creditCardValidUntilInput.fill(paymentDetails.validUntil);
        await this.creditCardCvcInput.waitFor();
        await this.creditCardCvcInput.fill(paymentDetails.cvc);
    }

    completePayment = async() =>{
        await this.payButton.waitFor();
        await this.payButton.click();
        await this.page.waitForURL(/\/thank-you/, {timeout:3000});
    }
}