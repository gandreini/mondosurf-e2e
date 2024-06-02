describe('Favorites', () => {
    const freeEmail = 'free@mailinator.com';
    const freeName = 'Free user';
    const newEmail = 'new@mailinator.com';
    const newName = 'New user';
    const proEmail = 'pro@mailinator.com';
    const proName = 'Pro user';
    const trialEmail = 'trial@mailinator.com';
    const trialName = 'Trial user';
    const searchString = 'lillatr';

    // Not logged user can't add favorites
    it("not logged user can't add favorites", () => {
        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Click on favorite button.
        cy.getBySel('favorite-add-button').click();

        // Email modal is displayed.
        cy.getBySel('auth-email-form').should('be.visible');
    });

    // Free user can't add favorites
    it("free user can't add favorites", () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Free user logins.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Click on favorite button.
        cy.getBySel('favorite-add-button').click();

        // Email modal is displayed.
        cy.getBySel('pro-modal').should('be.visible');
    });

    // Trial user can add favorites
    it('trial user can add favorites', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Free user logins.
        cy.login(trialEmail, trialName, Cypress.env('demo_users_password'));

        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Adds the favorite.
        cy.intercept('POST', 'https://rest-api.mondosurf.local.com/wp-json/mondo_surf_api/v1/user-add-favourite').as(
            'addFavoriteApi'
        );
        cy.getBySel('favorite-add-button')
            .click()
            .wait('@addFavoriteApi')
            .its('response.body.success')
            .should('equal', true);

        // Remove favorite button is displayed.
        cy.getBySel('favorite-remove-button').should('be.visible');
    });

    // Pro user can add favorites
    it('pro user can add favorites', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Free user logins.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Adds the favorite.
        cy.intercept('POST', 'https://rest-api.mondosurf.local.com/wp-json/mondo_surf_api/v1/user-add-favourite').as(
            'addFavoriteApi'
        );
        cy.getBySel('favorite-add-button')
            .click()
            .wait('@addFavoriteApi')
            .its('response.body.success')
            .should('equal', true);

        // Remove favorite button is displayed.
        cy.getBySel('favorite-remove-button').should('be.visible');
    });

    // Non-logged user click on favorite, then logins and adds the favorite
    it('user logins and adds favorite', () => {
        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Click on favorite button.
        cy.getBySel('favorite-add-button').click();

        // Email modal is displayed.
        cy.getBySel('auth-email-form').should('be.visible');

        // Pro user logins.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

        // Toast is displayed.
        cy.checkToast('data-test-toast-favorite-added');
    });

    // Add and remove favorite from homepage near spots.

    it.skip('add/remove favorite from home near spots', () => {
        if (Cypress.env('app') === "app") cy.viewport(1000, 1200);

        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Free user logins.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

        // Search the near spots.
        cy.intercept(
            'GET',
            'https://rest-api.mondosurf.local.com/wp-json/mondo_surf_api/v1/near-spots-forecast/*/*/*'
        ).as('nearsApi');

        // Clicks on the button if it is present in the page.
        cy.getBySel('home-near-spots-forecast-cta').then(($btn) => {
            if ($btn) {
                cy.log('Button is there!');
                // Clicks on the Home Near Spots cta.
                cy.getBySel('home-near-spots-forecast-cta').click({ timeout: 30000 });
            } else {
                cy.log('Button is NOT there!');
            }
        });

        // Waits for the API to retrieve the near spots.
        cy.wait('@nearsApi', { timeout: 20000 }).then((response) => {
            cy.getBySel('home-near-spots-forecast-list').should('exist');

            // Add favorite
            cy.getBySel('home-near-spots-forecast-list')
                .find('[data-test="surf-spot-preview"]')
                .first()
                .find('[data-test="favorite-add-button"]')
                .click();
            // Toast is displayed.
            cy.checkToast('data-test-toast-favorite-added');

            // Remove favorite
            cy.getBySel('home-near-spots-forecast-list')
                .find('[data-test="surf-spot-preview"]')
                .first()
                .find('[data-test="favorite-remove-button"]')
                .click();
            // Toast is displayed.
            cy.checkToast('data-test-toast-favorite-removed');
        });
    });

    // Add and remove favorite from search results.
    it('add/remove favorite from search results', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Login the user.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

        // Go to search page.
        // cy.getBySel('search-header').click();
        cy.visit("/surf-spot-search")

        // Search the spot.
        cy.intercept(
            'GET',
            'https://rest-api.mondosurf.local.com/wp-json/mondo_surf_api/v1/spot-search/' + searchString
        ).as('searchApi');

        cy.getBySel('search-input')
            .type(searchString)
            .wait('@searchApi')
            .its('response.statusCode')
            .should('equal', 200);

        // Adds the favorite.
        cy.getBySel('search-results-list')
            .find('[data-test="surf-spot-preview"]')
            .first()
            .find('[data-test="favorite-add-button"]')
            .click();

        // Toast is displayed.
        cy.checkToast('data-test-toast-favorite-added');

        // Removes the spot from the favorites.
        cy.getBySel('search-results-list')
            .find('[data-test="surf-spot-preview"]')
            .first()
            .find('[data-test="favorite-remove-button"]')
            .click();

        // Toast is displayed.
        cy.checkToast('data-test-toast-favorite-removed');
    });

    // Add and remove favorite from surf spot page.
    it('add/remove favorite from spot page', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Login the user.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

        // Go to lillatro page.
        cy.searchAndGoToSpotPage('lillatr');

        // Click on add favorite button.
        cy.getBySel('favorite-add-button').click();

        // Toast is displayed.
        cy.checkToast('data-test-toast-favorite-added');

        // Click on add favorite button.
        cy.getBySel('favorite-remove-button').click();

        // Toast is displayed.
        cy.checkToast('data-test-toast-favorite-removed');
    });

    // Add and remove favorite from surf spot page near spots.
    // Near spots currently hidden.
    /*
    it('add/remove favorite from near spots', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Login the user.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

        // Go to lillatro page.
        cy.searchAndGoToSpotPage('lillatr');

        // Go to near spots.
        cy.getBySel('surf-spot-tab-near').click();

        // Add first spot as favorite.
        cy.getBySel('surf-spot-near-spots-list')
            .find('[data-test="surf-spot-preview"]')
            .first()
            .find('[data-test="favorite-add-button"]')
            .click();

        // Toast is displayed.
        cy.checkToast('data-test-toast-favorite-added');

        // Remove first spot from favorites.
        cy.getBySel('surf-spot-near-spots-list')
            .find('[data-test="surf-spot-preview"]')
            .first()
            .find('[data-test="favorite-remove-button"]')
            .click();

        // Toast is displayed.
        cy.checkToast('data-test-toast-favorite-removed');
    });
    */

    // New user registers to add a favorite.
    it('new user registers to add favorite', () => {
        // Go to lillatro page.
        cy.searchAndGoToSpotPage('lillatr');

        // Click on add favorite button.
        cy.getBySel('favorite-add-button').click();

        // Registers
        cy.register(newEmail, newName, Cypress.env('demo_users_password'));

        // Click on trial modal CTA.
        // cy.getBySel('trial-modal-cta').click();

        // Toast is displayed.
        cy.checkToast('data-test-toast-favorite-added');

        // Subscription confirmation page displayed.
        cy.getBySel("subscription-confirmed").should("exist");
    });

    // Adds a spot to favorites from search results, and removes it from spot page
    it('adds and removes a spot', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Login the user.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

        // Back to home.
        cy.goHome();

        // Go to search page.
        // cy.getBySel('search-header').click();
        cy.visit("/surf-spot-search")

        // Search the spot.
        cy.intercept(
            'GET',
            'https://rest-api.mondosurf.local.com/wp-json/mondo_surf_api/v1/spot-search/' + searchString
        ).as('searchApi');

        cy.getBySel('search-input')
            .type(searchString)
            .wait('@searchApi')
            .its('response.statusCode')
            .should('equal', 200);

        // Adds the favorite.
        cy.intercept('POST', 'https://rest-api.mondosurf.local.com/wp-json/mondo_surf_api/v1/user-add-favourite').as(
            'addFavoriteApi'
        );
        cy.getBySel('search-results-list')
            .find('[data-test="surf-spot-preview"]')
            .first()
            .find('[data-test="favorite-add-button"]')
            .click()
            .wait('@addFavoriteApi')
            .its('response.body.success')
            .should('equal', true);

        // Goes to the favorite page.
        cy.getBySel('search-results-list')
            .find('[data-test="surf-spot-preview"]')
            .first()
            .find('[data-test="surf-spot-preview-link"]')
            .click();

        // Removes the favorite.
        cy.intercept('POST', 'https://rest-api.mondosurf.local.com/wp-json/mondo_surf_api/v1/user-remove-favourite').as(
            'removeFavoriteApi'
        );
        cy.getBySel('favorite-remove-button')
            .click()
            .wait('@removeFavoriteApi')
            .its('response.body.success')
            .should('equal', true);

        // Final check to see if the button is back in add mode.
        cy.getBySel('favorite-add-button').should('exist');
    });

    // Browse the favorites profile page and deletes a favorite.
    it('favorites profile page', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Free user logins.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Click on add favorite button.
        cy.getBySel('favorite-add-button').click();

        // Toast is displayed.
        cy.checkToast('data-test-toast-favorite-added');

        // Go to the favorites page.
        cy.getBySel('favorites-tab-bar').click();

        // Count the favorites there, should be 1.
        cy.getBySel('profile-favorites-list').should('be.visible');
        cy.getBySel('profile-favorites-list').should('have.length', 1);

        // Click on remove favorite button.
        cy.getBySel('favorite-remove-button').first().click();

        // Toast is displayed.
        cy.checkToast('data-test-toast-favorite-removed');

        // List is empty.
        cy.getBySel('profile-favorites-list').should('not.exist');
        cy.getBySel('profile-favorites-empty').should('be.visible');
    });

    // Add spot to favorites from the banner in spot page
    it('add favorite from banner', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Login the user.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

        // Go to lillatro page.
        cy.searchAndGoToSpotPage('lillatr');

        // Click on good times tab.
        cy.getBySel('surf-spot-tab-good-times').click();

        if (Cypress.env('app') === "app") {
            // Click on add favorite banner.
            cy.getBySel('surf-spot-forecast-favorite-banner').click();

            // Toast is displayed.
            cy.checkToast('data-test-toast-favorite-added');
        }
    });
});
