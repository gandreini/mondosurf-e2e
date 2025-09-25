describe('Authentication', () => {
    const freeEmail = 'free@mailinator.com';
    const freeName = 'Free user';
    const newEmail = 'new@mailinator.com';
    const newName = 'New user';
    const disabledEmail = 'disabled@mailinator.com';
    const disabledName = 'Disabled';

    // Login
    it('simple login', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Login the user.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Subscription confirmation page not displayed.
        cy.getBySel("subscription-confirmed").should("not.exist");
    });

    // Login with errors
    it('login with errors', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Email form.

        // Inputs short email.
        cy.getBySel('auth-email-field').clear();
        cy.getBySel('auth-email-field').type('d@d.d');

        // Submit short email.
        cy.getBySel('auth-email-submit').click();

        // Error check.
        cy.getBySel('auth-email-error-short').should('exist');

        // Inputs wrong email.
        cy.getBySel('auth-email-field').clear();
        cy.getBySel('auth-email-field').type('ddasdasd@ddasdasdasda');

        // Submit wrong email.
        cy.getBySel('auth-email-submit').click();

        // Error check.
        cy.getBySel('auth-email-error-not-valid').should('exist');

        // Inputs email.
        cy.getBySel('auth-email-field').clear();
        cy.getBySel('auth-email-field').type(freeEmail);

        // Submit email.
        cy.getBySel('auth-email-submit').click();

        // Email password form.

        // Waits after the "Email" field was focused
        cy.wait(1200);

        // Inputs short email.
        cy.getBySel('auth-login-email-field').clear();
        cy.getBySel('auth-login-email-field').type('d@d.d');

        // Submit short email.
        cy.getBySel('auth-login-submit').click();

        // Error check.
        cy.getBySel('auth-login-error-short').should('exist');
        cy.getBySel('auth-login-error-password-missing').should('exist');

        // Inputs wrong email.
        cy.getBySel('auth-login-email-field').clear();
        cy.getBySel('auth-login-email-field').type('ddasdasd@ddasdasdasda');

        // Submit wrong email.
        cy.getBySel('auth-login-submit').click();

        // Error check.
        cy.getBySel('auth-login-error-not-valid').should('exist');
        cy.getBySel('auth-login-error-password-missing').should('exist');

        // Inputs email.
        cy.getBySel('auth-login-email-field').clear();
        cy.getBySel('auth-login-email-field').type(freeEmail);

        // Inputs short password.
        cy.getBySel('auth-login-password-field').type('d');

        // Login click.
        cy.getBySel('auth-login-submit').click();

        // Error check.
        cy.getBySel('auth-login-error-password-short').should('exist');

        // Inputs password again, still wrong.
        cy.getBySel('auth-login-password-field').clear();
        cy.getBySel('auth-login-password-field').type('fkjhsdfgsdfsjkfkjsdgfjksgdkf');

        // Login click.
        cy.getBySel('auth-login-submit').click();

        // Error check.
        cy.getBySel('auth-login-error-password-wrong').should('exist');

        // Inputs password again, the right one.
        cy.getBySel('auth-login-password-field').clear();
        cy.getBySel('auth-login-password-field').type(Cypress.env('demo_users_password'));

        // Login click.
        cy.getBySel('auth-login-submit').click();

        // User is logged.
        cy.getBySel('user-tab-bar').should('exist');

    });

    // Login show password
    it('login show password', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Inputs email.
        cy.getBySel('auth-email-field').type(freeEmail);

        // Submit email.
        cy.getBySel('auth-email-submit').click();

        // Inputs password.
        cy.getBySel('auth-login-password-field').type(Cypress.env('demo_users_password'));

        // Show password.
        cy.getBySel('auth-login-password-toggle').click();

        // Check if the password is visible.
        cy.getBySel('auth-login-password-field').should('have.value', Cypress.env('demo_users_password'));
        cy.getBySel('auth-login-password-field').should('have.attr', 'type').and('match', /text/);
    });

    // Registration
    it('simple registration', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Registers user.
        cy.register(newEmail, newName, Cypress.env('demo_users_password'));

        // Subscription confirmation page displayed.
        cy.getBySel("subscription-confirmed").should("exist");

        // Checks that the invasive banner is there
        cy.getBySel("invasive-banner").should("exist");

        // Loads the static HTML email.
        cy.loadEmailHtml();

        // Check contents of the email.
        cy.getBySel('email-user-registration-1-name').contains(newName);

        // Clicks button in the email.
        if (Cypress.env('app') === "app") {
            cy.getBySel('email-registration-1-button').invoke('attr', 'href').then((hrefValue) => {
                // Replaces the URL for app/web (the email text has 'https://mondosurf.local.com:3000/' hardcoded)
                const hrefValue2 = hrefValue?.includes(Cypress.env('main_url')) ? hrefValue :
                    hrefValue?.replace('https://mondosurf.local.com:3000/', Cypress.env('main_url'));
                if (hrefValue2) {
                    cy.visit(hrefValue2);
                }
            });
        }

        // Final check.
        if (Cypress.env('app') === "app") cy.getBySel('account-verify-verified').should('exist');
    });

    // Registration with errors
    it('registration with errors', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Email form.

        // Inputs short email.
        cy.getBySel('auth-email-field').type(newEmail);

        // Submit email.
        cy.getBySel('auth-email-submit').click();

        // Name Email password form.

        // Submit registration.
        cy.getBySel('auth-registration-submit').click();

        // Error check.
        cy.getBySel('auth-registration-error-name-required').should('exist');
        cy.getBySel('auth-registration-error-password-required').should('exist');

        // Inputs short name.
        cy.getBySel('auth-registration-name-field').clear();
        cy.getBySel('auth-registration-name-field').type('n');

        // Submit registration.
        cy.getBySel('auth-registration-submit').click();

        // Error check.
        cy.getBySel('auth-registration-error-name-too-short').should('exist');
        cy.getBySel('auth-registration-error-password-required').should('exist');

        // Inputs short name.
        cy.getBySel('auth-registration-name-field').clear();
        cy.getBySel('auth-registration-name-field').type(newName);

        // Deletes email.
        cy.getBySel('auth-registration-email-field').clear();

        // Submit registration.
        cy.getBySel('auth-registration-submit').click();

        // Error check.
        cy.getBySel('auth-registration-error-email-required').should('exist');
        cy.getBySel('auth-registration-error-password-required').should('exist');

        // Short email.
        cy.getBySel('auth-registration-email-field').clear();
        cy.getBySel('auth-registration-email-field').type('a@a.c');

        // Submit registration.
        cy.getBySel('auth-registration-submit').click();

        // Error check.
        cy.getBySel('auth-registration-error-email-too-short').should('exist');
        cy.getBySel('auth-registration-error-password-required').should('exist');

        // Not-valid email.
        cy.getBySel('auth-registration-email-field').clear();
        cy.getBySel('auth-registration-email-field').type('giulio@mondo');

        // Submit registration.
        cy.getBySel('auth-registration-submit').click();

        // Error check.
        cy.getBySel('auth-registration-error-email-not-valid').should('exist');
        cy.getBySel('auth-registration-error-password-required').should('exist');

        // Email correct.
        cy.getBySel('auth-registration-email-field').clear();
        cy.getBySel('auth-registration-email-field').type(newEmail);

        // Password short.
        cy.getBySel('auth-registration-password-field').type('pass');

        // Submit registration.
        cy.getBySel('auth-registration-submit').click();

        // Error check.
        cy.getBySel('auth-registration-error-password-noo-short').should('exist');

        // Password correct.
        cy.getBySel('auth-registration-password-field').clear();
        cy.getBySel('auth-registration-password-field').type(Cypress.env('demo_users_password'));

        // Registration.
        cy.getBySel('auth-registration-submit').click();

        // User is logged.
        cy.getBySel('user-tab-bar').should('exist');
    });

    // Registration show password
    it('registration show password', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Inputs email.
        cy.getBySel('auth-email-field').type(newEmail);

        // Submit email.
        cy.getBySel('auth-email-submit').click();

        // Waits after the "Name" field was focused
        cy.wait(1200);

        // Inputs password.
        cy.getBySel('auth-registration-password-field').type(Cypress.env('demo_users_password'));

        // Show password.
        cy.getBySel('auth-registration-password-toggle').click();

        // Check if the password is visible.
        cy.getBySel('auth-registration-password-field').should('have.value', Cypress.env('demo_users_password'));
        cy.getBySel('auth-registration-password-field').should('have.attr', 'type').and('match', /text/);
    });

    // Password reset
    it('requests password reset', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Inputs email.
        cy.getBySel('auth-email-field').type(freeEmail);

        // Click on Forgot password link.
        cy.getBySel('auth-email-password-forgot').click();

        // Checks if the email is already in the field.
        cy.getBySel('auth-password-reset-email-field').should('have.value', freeEmail);

        // Click on submit button.
        cy.getBySel('auth-password-reset-submit').click();

        // Loads the static HTML email.
        cy.loadEmailHtml();

        // Check contents of the email.
        cy.getBySel('email-password-reset-name').contains(freeName);

        // Gets the URL of the button "RESET THE PASSWORD" in the email.
        cy.getBySel('email-password-reset-button').invoke('attr', 'href').then((hrefValue) => {
            // Replaces ths URL for app/web (the email text has 'https://mondosurf.local.com:3000/' hardcoded)
            const hrefValue2 = hrefValue?.includes(Cypress.env('main_url')) ? hrefValue : hrefValue?.replace('https://mondosurf.local.com:3000/', Cypress.env('main_url'));
            if (hrefValue2) {
                cy.visit(hrefValue2);
                cy.getBySel('password-reset-password1', { timeout: 30000 });

                // Fills the form with the new password.
                cy.getBySel('password-reset-password1').type('newpassword');
                cy.getBySel('password-reset-password2').type('newpassword');

                // Submit the form.
                cy.getBySel('password-reset-button').click();

                // Final check.
                cy.getBySel('password-reset-success').should('exist');
            }
        });
    });

    // Disabled user registration
    it('disabled user registers again', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Registers user.
        cy.register(disabledEmail, disabledName, Cypress.env('demo_users_password'));

        // Subscription confirmation page displayed.
        cy.getBySel("subscription-confirmed").should("exist");

        // Checks that the invasive banner is there
        cy.getBySel("invasive-banner").should("exist");
    });

    // Moving among modals
    it('check all login modals', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Inputs email.
        cy.getBySel('auth-email-field').type(freeEmail);

        // Move to Forgot password.
        cy.getBySel('auth-email-password-forgot').click();

        // Check
        cy.getBySel('auth-password-reset-form').should('exist');

        // Click on back button
        cy.getBySel('auth-password-reset-back-button').click();

        // Submit Free email.
        cy.getBySel('auth-email-submit').click();

        // Check
        cy.getBySel('auth-login-form').should('exist');

        // Back
        cy.getBySel('auth-login-back-button').click();

        // Insert new email and click.
        cy.getBySel('auth-email-field').clear();
        cy.getBySel('auth-email-field').type(newEmail);
        cy.getBySel('auth-email-submit').click();

        // Check
        cy.getBySel('auth-registration-form').should('exist');

        // Click on back button
        cy.getBySel('auth-registration-back-button').click();

        // Check
        cy.getBySel('auth-email-form').should('exist');
    });
});
