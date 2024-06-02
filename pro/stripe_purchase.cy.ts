describe('Stripe monthly subscription purchase', () => {
    it('successfully loads', () => {
        const email = 'trial-2@mailinator.com';
        const name = 'Trial -2 user';

        cy.visit('/'); // change URL to match your dev URL

        // Clicks the Iubenda cookie banner.
        cy.iubenda();

        // Visits Indicators
        cy.searchAndGoToSpotPage('indicator');

        cy.goHome();

        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Login the user.
        cy.login(email, name, Cypress.env('demo_users_password'));

        // Click on Pro subscription cta.
        cy.getBySel('home-pro-cta-pro-button').click();

        // Click on monthly button.
        // cy.getBySel('pro-modal-web-monthly-button').click();

        cy.visit('/monthly-subscription-success'); // change URL to match your dev URL

        cy.getBySel('surf-spot-preview-link').first().click();
    });
});
