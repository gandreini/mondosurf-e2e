describe('Trial Activation', () => {
    it('successfully loads', () => {
        const email = 'free@mailinator.com';
        const name = 'Free user';

        cy.visit('/'); // change URL to match your dev URL

        // Clicks the Iubenda cookie banner.
        cy.iubenda();

        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Login the user.
        cy.login(email, name, Cypress.env('demo_users_password'));

        // Trial activation.
        cy.activateTrial();
    });
});
