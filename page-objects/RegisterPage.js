export class RegisterPage {
    constructor(page) {
        this.page = page;

        this.emailInput = page.getByPlaceholder('E-Mail');
        this.passwordInput = page.getByPlaceholder('Password');
        this.registerButton = page.getByRole('button', { name: 'Register' });
    }

    signUpAsNewUser = async (email, password) => {
        // type into email input
        await this.emailInput.waitFor();
        // const emailId = uuidv4();
        // const email = emailId + "@gmail.com" //afec-123c-2344@gmail.com
        //await this.emailInput.fill("hello@testers.com");
        await this.emailInput.fill(email);
        // type into password input
        await this.passwordInput.waitFor();
        //const password = uuidv4();
        //await this.passwordInput.fill("supersecretpassword")
        await this.passwordInput.fill(password)
        // click register button 
        await this.registerButton.waitFor();
        await this.registerButton.click();
    }
}