describe('Pro', () => {
    const newEmail = 'new@mailinator.com';
    const newName = 'New user';
    const freeEmail = 'free@mailinator.com';
    const freeName = 'Free user';

    // NEW USER

    // New user registration from header
    it('new user registration from header', () => {
        // Registration CTA is there
        cy.getBySel("home-pro-cta-register").should("exist");

        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Registers the user.
        cy.register(newEmail, newName, Cypress.env('demo_users_password'));

        // Subscription confirmation page displayed.        
        cy.getBySel("subscription-confirmed").should("exist");
    });

    // New user clicks on home CTA
    it('new user clicks on home CTA', () => {
        // Registration CTA is displayed.
        cy.getBySel("home-pro-cta-register").should("exist");

        // Click on the button in the CTA.
        cy.getBySel('home-pro-cta-register-button').click();

        // Registers the user.
        cy.register(newEmail, newName, Cypress.env('demo_users_password'));

        // Subscription confirmation page displayed.
        cy.getBySel("subscription-confirmed").should("exist");
    });

    // New user clicks on home CTA already-member link
    it('new user clicks on home CTA already a member', () => {
        // Registration CTA is displayed.
        cy.getBySel("home-pro-cta-register").should("exist");

        // Click on the button in the CTA.
        cy.getBySel('home-pro-cta-already-member').click();

        // Registers the user.
        cy.register(newEmail, newName, Cypress.env('demo_users_password'));

        // Subscription confirmation page displayed.
        cy.getBySel("subscription-confirmed").should("exist");
    });

    // New user clicks on favorite icon
    // See favorites.cy.ts

    // New user clicks on calendar CTA
    // See calendar.cy.ts

    // FREE USER

    // Free user login from header
    it('free user login from header', () => {
        // Registration CTA is there
        cy.getBySel("home-pro-cta-register").should("exist");

        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Free user logins.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Trial CTA is there.
        cy.getBySel("home-pro-cta-trial").should("exist");
    });

    // Free user clicks on home CTA
    it('free user clicks on home CTA', () => {
        // Registration CTA is displayed.
        cy.getBySel("home-pro-cta-register").should("exist");

        // Click on the button in the CTA.
        cy.getBySel('home-pro-cta-register-button').click();

        // Free user logins.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Trial CTA is there.
        cy.getBySel("home-pro-cta-trial").should("exist");
    });

    // Free user clicks on home CTA already-member link
    it('free user clicks on home CTA already a member', () => {
        // Registration CTA is displayed.
        cy.getBySel("home-pro-cta-register").should("exist");

        // Click on the button in the CTA.
        cy.getBySel('home-pro-cta-already-member').click();

        // Free user logins.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Trial CTA is there.
        cy.getBySel("home-pro-cta-trial").should("exist");
    });

    // Free user clicks on favorite icon
    it("free user adds favorites", () => {
        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Click on favorite button.
        cy.getBySel('favorite-add-button').click();

        // Free user logins.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Email modal is displayed.
        cy.getBySel('trial-modal').should('be.visible');

        // Click on Trial start button.
        cy.getBySel('trial-modal-cta').click();

        // Subscription confirmation page displayed.
        cy.getBySel("subscription-confirmed").should("exist");
    });

    // Free user clicks on calendar CTA
    it("free user clicks on calendar CTA", () => {
        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Click on good times tab.
        cy.getBySel('surf-spot-tab-good-times').click();

        // Click on favorite button.
        cy.getBySel('surf-spot-forecast-calendar-banner').click();

        // Free user logins.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Email modal is displayed.
        cy.getBySel('trial-modal').should('be.visible');

        // Click on Trial start button.
        cy.getBySel('trial-modal-cta').click();

        // The calendar modal shows up.
        // Close the modal.
        cy.getBySel('modal-close').click();

        // Subscription confirmation page displayed.
        cy.getBySel("subscription-confirmed").should("exist");
    });
});
