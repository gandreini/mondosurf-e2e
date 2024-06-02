describe('Pro user access full forecast', () => {
    it('successfully loads', () => {
        const email = 'pro@mailinator.com';
        const name = 'Pro user';
        const searchString = 'lilla';

        cy.visit('/'); // change URL to match your dev URL

        // Clicks the Iubenda cookie banner.
        cy.iubenda();

        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Login the user.
        cy.login(email, name, Cypress.env('demo_users_password'));

        // Back to home.
        cy.goHome();

        // Search spot and go to page.
        cy.searchAndGoToSpotPage(searchString);

        // Check if the right elements are present on the page.
        cy.getBySel('surf-spot-forecast-days-nav-button').should('have.length', 7);
        cy.getBySel('chart-forecast-background-day').should('have.length', 7);

        // Click on first day.
        cy.getBySel('surf-spot-forecast-days-nav-button').last().click();

        // Counts the row in the day data table.
        cy.getBySel('day-data-table-row').should('have.length.greaterThan', 2);

        // Check contents of day astronomy table.
        cy.getBySel('day-astronomy-table-dawn').should('not.be.empty');
        cy.getBySel('day-astronomy-table-sunrise').should('not.be.empty');
        cy.getBySel('day-astronomy-table-sunset').should('not.be.empty');
        cy.getBySel('day-astronomy-table-dusk').should('not.be.empty');

        // Click on the tide table.
        cy.getBySel('surf-spot-forecast-tide-table-button').click();
    });
});
