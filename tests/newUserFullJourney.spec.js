import { test } from "@playwright/test";
import { v4 as uuidv4 } from "uuid";
import { ProductsPage } from "../page-objects/ProductsPage";
import { Navigation } from "../page-objects/Navigation.js";
import { Checkout } from "../page-objects/Checkout.js";
import { LoginPage } from "../page-objects/LoginPage.js";
import { RegisterPage } from "../page-objects/RegisterPage.js";
import { DeliveryDetails } from "../page-objects/DeliveryDetails.js";
import { deliveryDetails as userAddress} from "../data/deliverDetails.js";
import { PaymentPage } from "../page-objects/PaymentPage.js";
import { paymentDetails } from "../data/paymentDetails.js";

test("New user full end-to-end test journey", async ({ page }) => {
    const productPage = new ProductsPage(page);
    await productPage.visit();
    await productPage.sortByCheapest();
    await productPage.addProductToBasket(0);
    await productPage.addProductToBasket(1);
    await productPage.addProductToBasket(2);
    const navigation = new Navigation(page);
    await navigation.goToCheckout();

    const checkout = new Checkout(page);
    await checkout.removeCheapestProduct();
    await checkout.continueToCheckout();

    const login = new LoginPage(page);
    await login.moveToSignup();

    const registerPage = new RegisterPage(page)
    const email = uuidv4() + "@gmail.com" //afec-123c-2344@gmail.com
    const password = uuidv4()
    await registerPage.signUpAsNewUser(email, password);

    const deliveryDetails = new DeliveryDetails(page);
    await deliveryDetails.fillDetails(userAddress);
    await deliveryDetails.saveDetails();
    await deliveryDetails.continueToPayment();

    const paymentPage = new PaymentPage(page);
    await paymentPage.activateDiscount();
    await paymentPage.fillPaymentDetails(paymentDetails);
    await paymentPage.completePayment();
})