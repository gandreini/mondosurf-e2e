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

    // Trial user logins and adds favorite.
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
            .first().click()
            .wait('@addFavoriteApi')
            .its('response.body.success')
            .should('equal', true);

        // Remove favorite button is displayed.
        cy.getBySel('favorite-remove-button').should('be.visible');
    });

    // Pro user logins and adds favorite
    it('pro user can add favorites', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Pro user logins.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Adds the favorite.
        cy.intercept('POST', 'https://rest-api.mondosurf.local.com/wp-json/mondo_surf_api/v1/user-add-favourite').as(
            'addFavoriteApi'
        );
        cy.getBySel('favorite-add-button')
            .first().click()
            .wait('@addFavoriteApi')
            .its('response.body.success')
            .should('equal', true);

        // Remove favorite button is displayed.
        cy.getBySel('favorite-remove-button').should('be.visible');
    });

    // Pro user logins and add and remove favorite from search results
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

    // Pro user logins and add and remove favorite from surf spot page
    it('add/remove favorite from spot page', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Login the user.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

        // Go to lillatro page.
        cy.searchAndGoToSpotPage('lillatr');

        // Click on add favorite button.
        cy.getBySel('favorite-add-button').first().click();

        // Toast is displayed.
        cy.checkToast('data-test-toast-favorite-added');

        // Click on add favorite button.
        cy.getBySel('favorite-remove-button').first().click();

        // Toast is displayed.
        cy.checkToast('data-test-toast-favorite-removed');
    });

    // Pro user logins, adds a spot to favorites from search results, and removes it from spot page
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

    // pro user logins, browses the favorites profile page and deletes a favorite
    it('favorites profile page', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Free user logins.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Click on add favorite button.
        cy.getBySel('favorite-add-button').first().click();

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
        cy.getBySel('surf-spot-tab-info').click();

        // Click on add favorite banner.
        cy.getBySel('surf-spot-forecast-favorite-banner').click();

        // Toast is displayed.
        cy.checkToast('data-test-toast-favorite-added');
    });

    // New user clicks on icon, registers, and adds favorite in spot page.
    it('new user adds favorite from icon', () => {
        // Go to lillatro page.
        cy.searchAndGoToSpotPage('lillatr');

        // Click on favorite button.
        cy.getBySel('favorite-add-button').first().click();

        // Email modal is displayed.
        cy.getBySel('auth-email-form').should('be.visible');

        // Registers
        cy.register(newEmail, newName, Cypress.env('demo_users_password'));

        // Toast is displayed.
        cy.checkToast('data-test-toast-favorite-added');

        // The banner is hidden
        cy.getBySel('subscription-confirmed').should('exist');
    });

    // New user clicks on banner, registers, and adds favorite in spot page.
    it('new user adds favorite from banner', () => {
        // Go to lillatro page.
        cy.searchAndGoToSpotPage('lillatr');

        // Click on favorite button.
        cy.getBySel('surf-spot-forecast-favorite-banner').click();

        // Email modal is displayed.
        cy.getBySel('auth-email-form').should('be.visible');

        // Registers
        cy.register(newEmail, newName, Cypress.env('demo_users_password'));

        // Toast is displayed.
        cy.checkToast('data-test-toast-favorite-added');

        // The banner is hidden
        cy.getBySel('subscription-confirmed').should('exist');
    });

    // Free user clicks on icon, logins, and can't add favorite in spot page.
    it('free user adds favorite from icon', () => {
        // Go to lillatro page.
        cy.searchAndGoToSpotPage('lillatr');

        // Click on favorite button.
        cy.getBySel('favorite-add-button').first().click();

        // Email modal is displayed.
        cy.getBySel('auth-email-form').should('be.visible');

        // Free user logins.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Pro modal is displayed.
        cy.getBySel('pro-modal').should('be.visible');
    });

    // Free user clicks on banner, logins, and can't add favorite in spot page.
    it('free user adds favorite from banner', () => {
        // Go to lillatro page.
        cy.searchAndGoToSpotPage('lillatr');

        // Click on favorite button.
        cy.getBySel('surf-spot-forecast-favorite-banner').click();

        // Email modal is displayed.
        cy.getBySel('auth-email-form').should('be.visible');

        // Free user logins.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Pro modal is displayed.
        cy.getBySel('pro-modal').should('be.visible');
    });

    // Pro user clicks on icon, logins, and adds favorite in spot page.
    it('pro user adds favorite from icon', () => {
        // Go to lillatro page.
        cy.searchAndGoToSpotPage('lillatr');

        // Click on favorite button.
        cy.getBySel('favorite-add-button').first().click();

        // Email modal is displayed.
        cy.getBySel('auth-email-form').should('be.visible');

        // Pro user logins.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

        // Toast is displayed.
        cy.checkToast('data-test-toast-favorite-added');

        // The banner is hidden
        cy.getBySel('surf-spot-forecast-favorite-hidden-banner').should('exist');

        // Remove favorite button is displayed.
        cy.getBySel('favorite-remove-button').should('be.visible');
    });

    // Pro user clicks on banner, logins, and adds favorite in spot page.
    it('pro user adds favorite from banner', () => {
        // Go to lillatro page.
        cy.searchAndGoToSpotPage('lillatr');

        // Click on favorite button.
        cy.getBySel('surf-spot-forecast-favorite-banner').click();

        // Email modal is displayed.
        cy.getBySel('auth-email-form').should('be.visible');

        // Pro user logins.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

        // Toast is displayed.
        cy.checkToast('data-test-toast-favorite-added');

        // The banner is hidden
        cy.getBySel('surf-spot-forecast-favorite-hidden-banner').should('exist');

        // Remove favorite button is displayed.
        cy.getBySel('favorite-remove-button').should('exist');
    });

    // Skipped: Add and remove favorite from homepage near spots.
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
});
