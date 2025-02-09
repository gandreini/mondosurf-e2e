describe('Basic Navigation', () => {
    const proEmail = 'pro@mailinator.com';
    const proName = 'Pro user';

    // Navigate to surf spot page
    it('navigate to surf spot page', () => {
        // Click on the surf spots link in the tab bar
        cy.getBySel('spots-tab-bar').click();

        // Page checks
        cy.getBySel('countries-list').should('exist');
        cy.getBySel('page-title').should('have.text', 'Surf spots')

        // Click on Italy
        cy.getBySel('country-preview').contains('Italy').click();

        // Page checks
        cy.getBySel('regions-list').should('exist');
        cy.getBySel('page-title').should('exist');

        // Click on Tuscany
        cy.getBySel('region-preview').contains('Tuscany').click();


        // Page checks
        cy.getBySel('spots-list').should('exist');
        cy.getBySel('page-title').should('exist');

        // Click on pagination
        cy.getBySel('list-show-more-button').click();

        // Click on Lillatro
        cy.getBySel('surf-spot-preview-link').contains('Lillatro').click();

        // Page checks
        cy.getBySel('spot-description').should('exist');
    });

    // Search and navigate all surf spot pages
    it('search and navigate all surf spot pages', () => {
        // Click on the surf spots link in the tab bar
        cy.getBySel('spots-tab-bar').click();

        // Search button
        cy.getBySel('search-button').click();

        // Search the spot.
        cy.intercept('GET', 'https://rest-api.mondosurf.local.com/wp-json/mondo_surf_api/v1/spot-search/lilla').as(
            'searchApi'
        );
        cy.getBySel('search-input').type("lilla").wait('@searchApi').its('response.statusCode').should('equal', 200);

        // Goes to the favorite page.
        cy.getBySel('search-results-list')
            .find('[data-test="surf-spot-preview"]')
            .first()
            .find('[data-test="surf-spot-preview-link"]')
            .click();

        // Page checks
        cy.getBySel('spot-description').should('exist');
        cy.getBySel('favorite-add-button').should('exist');
        cy.getBySel('surf-spot-map').should('exist');
        cy.getBySel('surf-spot-coordinates').should('exist');
        cy.getBySel('surf-spot-info-direction').should('exist');
        cy.getBySel('surf-spot-special-info').should('exist');
        cy.getBySel('surf-spot-info').should('exist');

        // Click on Good Surf
        cy.getBySel('surf-spot-tab-good-times').click();

        // Page checks
        cy.getBySel('astronomy-table').should('exist');
        cy.getBySel('day-data-table-row').should('exist');

        // Click on Forecast
        cy.getBySel('surf-spot-tab-forecast').click();

        // Page checks
        cy.getBySel('full-forecast').should('exist');

        // Click on Near spots
        cy.getBySel('surf-spot-tab-near').click();

        // Page checks
        cy.getBySel('surf-spot-near-spots-list').should('exist');

        // Click on Videos
        cy.getBySel('surf-spot-tab-videos').click();

        // Page checks
        cy.getBySel('surf-spot-video-list').should('exist');
    });

    // Navigate to favorites
    it('navigate to favorites', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Login the user.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

        // Click on favorites in the tab bar to login.
        cy.getBySel('favorites-tab-bar').click();

        // Page checks
        cy.getBySel('favorites-empty-cta').should('exist');

        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Click on favorite button.
        cy.getBySel('favorite-add-button').first().should('exist');
        cy.wait(Cypress.env('favorite_button_click_wait')); // Added to avoid the Cypress error "Cannot read properties of undefined"
        cy.getBySel('favorite-add-button').first().click();

        // Click on favorites in the tab bar to login.
        cy.getBySel('favorites-tab-bar').click();

        // Page checks
        cy.getBySel('profile-favorites-list').should('exist');
    });

    // Navigate to map
    it('navigate to map', () => {
        // Click on map in the tab bar to login.
        cy.getBySel('map-tab-bar').click();

        // Page checks
        cy.getBySel('surf-spot-map-controls').should('exist');
        cy.getBySel('surf-spot-map-center').should('exist');
        // cy.getBySel('surf-spot-map-filters-button').should('exist');
    });

    // Navigate profile pages
    it('navigate profile pages', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Login the user.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

        // Back to profile page
        cy.getBySel('user-tab-bar').click();

        // Click on Your Profile
        cy.getBySel('profile-logged-your-profile').click();

        // Page checks
        cy.getBySel('profile-details-list').should('exist');

        cy.getBySel('profile-edit-button').click();

        // Back to profile page
        cy.getBySel('user-tab-bar').click();

        // Click on Your Plan
        cy.getBySel('profile-logged-your-plan').click();

    });
});
