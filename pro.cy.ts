describe('Pro', () => {
    const newEmail = 'new@mailinator.com';
    const newName = 'New user';
    const freeEmail = 'free@mailinator.com';
    const freeName = 'Free user';

    // NEW USER

    // New user registration from header
    /* it('new user registration from header', () => {
        // Registration CTA is there
        cy.getBySel("home-pro-cta-register").should("exist");

        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Registers the user.
        cy.register(newEmail, newName, Cypress.env('demo_users_password'));

        // Subscription confirmation page displayed.        
        cy.getBySel("subscription-confirmed").should("exist");
    }); */

    // New user clicks on home CTA
    /* it('new user clicks on home CTA', () => {
        // Registration CTA is displayed.
        cy.getBySel("home-pro-cta-register").should("exist");

        // Click on the button in the CTA.
        cy.getBySel('home-pro-cta-register-button').click();

        // Registers the user.
        cy.register(newEmail, newName, Cypress.env('demo_users_password'));

        // Subscription confirmation page displayed.
        cy.getBySel("subscription-confirmed").should("exist");
    }); */

    // New user clicks on home CTA already-member link
    /* it('new user clicks on home CTA already a member', () => {
        // Registration CTA is displayed.
        cy.getBySel("home-pro-cta-register").should("exist");

        // Click on the button in the CTA.
        cy.getBySel('home-pro-cta-already-member').click();

        // Registers the user.
        cy.register(newEmail, newName, Cypress.env('demo_users_password'));

        // Subscription confirmation page displayed.
        cy.getBySel("subscription-confirmed").should("exist");
    }); */

    // New user clicks on favorite icon
    // See favorites.cy.ts

    // New user clicks on calendar CTA
    // See calendar.cy.ts

    // FREE USER

    // Show pro modal from profile page
    it('show pro modal from profile page', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Free user logins.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Navigate to profile page.
        cy.getBySel('user-tab-bar').click();

        // Click on Pro button.
        cy.getBySel('pro-button').click();

        // Check the pro modal.
        cy.getBySel("pro-modal-content").should("exist");
        cy.getBySel("pro-modal-web-yearly-button").should("exist");
        cy.getBySel("pro-modal-web-monthly-button").should("exist");
    });

    // Show pro modal from profile plan page
    it('show pro modal from profile plan page', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Free user logins.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Navigate to profile page.
        cy.getBySel('user-tab-bar').click();

        // Navigate to plan.
        cy.getBySel('profile-logged-your-plan').click();

        // Check the pro modal.
        cy.getBySel("pro-modal-content").should("exist");
        cy.getBySel("pro-modal-web-yearly-button").should("exist");
        cy.getBySel("pro-modal-web-monthly-button").should("exist");
    });

    // Show pro modal from favorite icon
    it('show pro modal from favorite icon', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Free user logins.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Go to lillatro page.
        cy.searchAndGoToSpotPage('lillat');

        // Click on favorite icon.
        cy.getBySel('favorite-add-button').click();

        // Check the pro modal.
        cy.getBySel("pro-modal-content").should("exist");
        cy.getBySel("pro-modal-web-yearly-button").should("exist");
        cy.getBySel("pro-modal-web-monthly-button").should("exist");
    });

    // Show pro modal from calendar icon
    it('show pro modal from calendar icon', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Free user logins.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Go to lillatro page.
        cy.searchAndGoToSpotPage('lillat');

        // Click on calendar icon.
        cy.getBySel('calendar-add-button').click();

        // Check the pro modal.
        cy.getBySel("pro-modal-content").should("exist");
        cy.getBySel("pro-modal-web-yearly-button").should("exist");
        cy.getBySel("pro-modal-web-monthly-button").should("exist");
    });

    // Show pro modal from full forecast
    it('show pro modal from full forecast', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Free user logins.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Go to lillatro page.
        cy.searchAndGoToSpotPage('lillat');
        cy.getBySel('surf-spot-tab-forecast').click();

        // Click on full forecast banner.
        cy.getBySel('surf-spot-full-forecast-banner').click();

        // Check the pro modal.
        cy.getBySel("pro-modal-content").should("exist");
        cy.getBySel("pro-modal-web-yearly-button").should("exist");
        cy.getBySel("pro-modal-web-monthly-button").should("exist");
    });

    // Test pro outcome pages
    it('test pro outcome pages', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Free user logins.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Navigate to the monthly subscription success page.
        cy.visit('/monthly-subscription-success');

        cy.getBySel("subscription-success-empty-list").should("exist");
        cy.getBySel("subscription-success-title").should("exist");

        // Navigate to the yearly subscription success page.
        cy.visit('/yearly-subscription-success');

        cy.getBySel("subscription-success-empty-list").should("exist");
        cy.getBySel("subscription-success-title").should("exist");

        // Navigate to the monthly subscription failed page.
        cy.visit('/monthly-subscription-cancel');

        cy.getBySel("subscription-failed-title").should("exist");

        // Navigate to the yearly subscription failed page.
        cy.visit('/yearly-subscription-cancel');

        cy.getBySel("subscription-failed-title").should("exist");
    });

    // Free user clicks on home CTA
    /* it('free user clicks on home CTA', () => {
        // Registration CTA is displayed.
        cy.getBySel("home-pro-cta-register").should("exist");

        // Click on the button in the CTA.
        cy.getBySel('home-pro-cta-register-button').click();

        // Free user logins.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Trial CTA is there.
        cy.getBySel("home-pro-cta-trial").should("exist");
    }); */
});
