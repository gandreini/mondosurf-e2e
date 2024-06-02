import { getDefaultSettings } from "http2";

describe('Home', () => {
    const freeEmail = 'free@mailinator.com';
    const freeName = 'Free user';
    const newEmail = 'new@mailinator.com';
    const newName = 'New user';
    const proEmail = 'pro@mailinator.com';
    const proName = 'Pro user';
    const trialEmail = 'trial@mailinator.com';
    const trialName = 'Trial user';
    const trial2Email = 'trial-2@mailinator.com';
    const trial2Name = 'Trial -2 user';
    const trialExpiredEmail = 'trial-exp@mailinator.com';
    const trialExpiredName = 'Trial expired user';
    const freeBurnedEmail = 'free-burned@mailinator.com';
    const freeBurnedName = 'Free burned user';

    // User not logged
    it('not logged user', () => {
        cy.viewport(1000, 1200);

        // Home Trial CTA.
        cy.getBySel('home-pro-cta-register').should('be.visible');

        // Search the near spots.
        cy.intercept(
            'GET',
            'https://rest-api.mondosurf.local.com/wp-json/mondo_surf_api/v1/near-spots-forecast/*/*/*'
        ).as('nearsApi');

        // Near spots section.
        // Clicks on the button if it is present in the page.
        cy.getBySel('home-near-spots-forecast-cta').then(($btn) => {
            if ($btn) {
                cy.log('Button is there!');
                cy.getBySel('home-near-spots-forecast-cta').should('be.visible');
                cy.getBySel('home-near-spots-forecast-cta').click({ timeout: 30000 });
            } else {
                cy.log('Button is NOT there!');
            }
        });

        // Waits for the API to retrieve the near spots.
        cy.wait('@nearsApi', { timeout: 20000 }).then((response) => {
            cy.getBySel('home-near-spots-forecast-results').should('be.visible');
            cy.getBySel('home-near-spots-forecast-list').should('be.visible');
        });
    });

    // Free user logged
    it('free user logged', () => {
        cy.viewport(1000, 1200);

        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Free user logins.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password')).then((response) => { });

        // Home Trial CTA.
        cy.getBySel('home-pro-cta-trial').should('be.visible');

        // Search the near spots.
        cy.intercept(
            'GET',
            'https://rest-api.mondosurf.local.com/wp-json/mondo_surf_api/v1/near-spots-forecast/*/*/*'
        ).as('nearsApi');

        // Near spots section.
        // Clicks on the button if it is present in the page.
        cy.getBySel('home-near-spots-forecast-cta').then(($btn) => {
            if ($btn) {
                cy.log('Button is there!');
                cy.getBySel('home-near-spots-forecast-cta').should('be.visible');
                cy.getBySel('home-near-spots-forecast-cta').click({ timeout: 30000 });
            } else {
                cy.log('Button is NOT there!');
            }
        });

        // Waits for the API to retrieve the near spots.
        cy.wait('@nearsApi', { timeout: 20000 }).then((response) => {
            cy.getBySel('home-near-spots-forecast-results').should('be.visible');
            cy.getBySel('home-near-spots-forecast-list').should('be.visible');
        });
    });

    // Trial user near to expiration
    it('trial user near to expiration logged', () => {
        cy.viewport(1000, 1200);

        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Free user logins.
        cy.login(trial2Email, trial2Name, Cypress.env('demo_users_password')).then((response) => { });

        // Home Trial PRO.
        cy.getBySel('home-favorites-forecast-no-favs').should('be.visible');
        cy.getBySel('home-pro-cta-pro').should('be.visible');

        // Click on CTA
        cy.getBySel('home-pro-cta-pro-button').click();

        // Pro membership modal shows up.
        cy.getBySel('pro-modal-web-yearly-button').should('be.visible');
        cy.getBySel('pro-modal-web-monthly-button').should('be.visible');
    });

    // Trial user expired
    it('trial user expired logged', () => {
        cy.viewport(1000, 1200);

        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Free user logins.
        cy.login(trialExpiredEmail, trialExpiredName, Cypress.env('demo_users_password')).then((response) => { });

        // Home Trial PRO.
        cy.getBySel('home-favorites-forecast-no-favs').should('be.visible');
        cy.getBySel('home-pro-cta-pro').should('be.visible');

        // Click on CTA
        cy.getBySel('home-pro-cta-pro-button').click();

        // Pro membership modal shows up.
        cy.getBySel('pro-modal-web-yearly-button').should('be.visible');
        cy.getBySel('pro-modal-web-monthly-button').should('be.visible');
    });

    // Free user with trial burned
    it('free user trial burned logged', () => {
        cy.viewport(1000, 1200);

        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Free user logins.
        cy.login(freeBurnedEmail, freeBurnedName, Cypress.env('demo_users_password')).then((response) => { });

        // Home Trial PRO.
        cy.getBySel('home-favorites-forecast-no-favs').should('not.exist');
        cy.getBySel('home-pro-cta-pro').should('be.visible');
    });

    // Trial user logged, no favorites
    it('trial user no favorites', () => {
        cy.viewport(1000, 1200);

        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Free user logins.
        cy.login(trialEmail, trialName, Cypress.env('demo_users_password'));

        // Empty favorites.
        cy.getBySel('home-favorites-forecast-no-favs').should('be.visible');

        // Search the near spots.
        cy.intercept(
            'GET',
            'https://rest-api.mondosurf.local.com/wp-json/mondo_surf_api/v1/near-spots-forecast/*/*/*'
        ).as('nearsApi');

        // Near spots section.
        // Clicks on the button if it is present in the page.
        cy.getBySel('home-near-spots-forecast-cta').then(($btn) => {
            if ($btn) {
                cy.log('Button is there!');
                cy.getBySel('home-near-spots-forecast-cta').should('be.visible');
                cy.getBySel('home-near-spots-forecast-cta').click({ timeout: 30000 });
            } else {
                cy.log('Button is NOT there!');
            }
        });

        // Waits for the API to retrieve the near spots.
        cy.wait('@nearsApi', { timeout: 20000 }).then((response) => {
            cy.getBySel('home-near-spots-forecast-results').should('be.visible');
            cy.getBySel('home-near-spots-forecast-list').should('be.visible');
        });

        cy.getBySel('home-pro-cta-pro').should('not.exist');
    });

    // Pro user logged, adds a favorite, no good times
    it('pro user add favorite but no good times', () => {
        cy.viewport(1000, 800);

        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Pro user logins.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

        // Empty favorites.
        cy.getBySel('home-favorites-forecast-no-favs').should('be.visible');

        // Search the near spots.
        cy.intercept(
            'GET',
            'https://rest-api.mondosurf.local.com/wp-json/mondo_surf_api/v1/near-spots-forecast/*/*/*'
        ).as('nearsApi');

        // Near spots section.
        // Clicks on the button if it is present in the page.
        cy.getBySel('home-near-spots-forecast-cta').then(($btn) => {
            if ($btn) {
                cy.log('Button is there!');
                cy.getBySel('home-near-spots-forecast-cta').should('be.visible');
                cy.getBySel('home-near-spots-forecast-cta').click({ timeout: 30000 });
            } else {
                cy.log('Button is NOT there!');
            }
        });

        // Waits for the API to retrieve the near spots.
        cy.wait('@nearsApi', { timeout: 20000 }).then((response) => {
            cy.getBySel('home-near-spots-forecast-results').should('be.visible');
            cy.getBySel('home-near-spots-forecast-list').should('be.visible');
        });

        // Favorites good times.
        cy.intercept(
            'GET',
            'https://rest-api.mondosurf.local.com/wp-json/mondo_surf_api/v1/user-favourites-forecast?access_token=*&device_id=*&platform=*',
            { good_times: [], last_update: 1657735060 }
        ).as('favoritesGoodTimes');

        // Add favorite
        cy.getBySel('home-near-spots-forecast-list')
            .find('[data-test="surf-spot-preview"]')
            .first()
            .find('[data-test="favorite-add-button"]')
            .click()
            .wait('@favoritesGoodTimes', { timeout: 20000 });

        // No good times section should be visible.
        cy.getBySel('home-favorites-forecast-no-good-times').should('be.visible');
    });

    // Pro user logged, adds a favorite, has good times
    it('pro user favorites has good times', () => {

        // Fake ending date of the good times.
        const fakeStartTime = new Date();
        const fakeEndTime = new Date();
        fakeStartTime.setDate(fakeStartTime.getDate() + 1);
        fakeEndTime.setDate(fakeEndTime.getDate() + 2);
        const fakeStartTimeIso = fakeStartTime.toISOString();
        const fakeEndTimeIso = fakeEndTime.toISOString();

        cy.viewport(1000, 1300);

        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Pro user logins.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

        // Hero section.
        cy.getBySel('home-hero').should('not.exist');

        // Empty favorites.
        cy.getBySel('home-favorites-forecast-no-favs').should('be.visible');

        // Search the near spots.
        cy.intercept(
            'GET',
            'https://rest-api.mondosurf.local.com/wp-json/mondo_surf_api/v1/near-spots-forecast/*/*/*'
        ).as('nearsApi');

        // Near spots section.
        // Clicks on the button if it is present in the page.
        cy.getBySel('home-near-spots-forecast-cta').then(($btn) => {
            if ($btn) {
                cy.log('Button is there!');
                cy.getBySel('home-near-spots-forecast-cta').should('be.visible');
                cy.getBySel('home-near-spots-forecast-cta').click({ timeout: 30000 });
            } else {
                cy.log('Button is NOT there!');
            }
        });

        // Waits for the API to retrieve the near spots.
        cy.wait('@nearsApi', { timeout: 20000 }).then((response) => {
            cy.getBySel('home-near-spots-forecast-results').should('be.visible');
            cy.getBySel('home-near-spots-forecast-list').should('be.visible');
        });

        // Favorites good times.
        cy.intercept(
            'GET',
            'https://rest-api.mondosurf.local.com/wp-json/mondo_surf_api/v1/user-favourites-forecast?access_token=*&device_id=*&platform=*',
            { "good_times": [{ "start_time": fakeStartTimeIso, "day_id": 0, "end_time": fakeEndTimeIso, "good": [1], "surf_spot_id": 1599, "surf_spot_name": "Indicators", "surf_spot_slug": "indicators", "good_average": 1, "swell_direction": 237.34, "swell_height": 1.6, "swell_period": 7.04, "wind_direction": 116.88, "wind_speed": 18.54, "timezone": "Pacific\/Auckland" }, { "start_time": fakeStartTimeIso, "day_id": 1, "end_time": fakeEndTimeIso, "good": [2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 1], "surf_spot_id": 1599, "surf_spot_name": "Indicators", "surf_spot_slug": "indicators", "good_average": 1.3636363636363635, "swell_direction": 225.98, "swell_height": 1.4, "swell_period": 8.99, "wind_direction": 196.34, "wind_speed": 26.47, "timezone": "Pacific\/Auckland" }, { "start_time": fakeStartTimeIso, "day_id": 2, "end_time": fakeEndTimeIso, "good": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], "surf_spot_id": 1599, "surf_spot_name": "Indicators", "surf_spot_slug": "indicators", "good_average": 1, "swell_direction": 238.1, "swell_height": 1.8, "swell_period": 7.01, "wind_direction": 234.99, "wind_speed": 34.58, "timezone": "Pacific\/Auckland" }, { "start_time": fakeStartTimeIso, "day_id": 3, "end_time": fakeEndTimeIso, "good": [1, 1, 1, 1], "surf_spot_id": 1599, "surf_spot_name": "Indicators", "surf_spot_slug": "indicators", "good_average": 1, "swell_direction": 233.01, "swell_height": 1.87, "swell_period": 6.46, "wind_direction": 239.84, "wind_speed": 25.18, "timezone": "Pacific\/Auckland" }, { "start_time": fakeStartTimeIso, "day_id": 5, "end_time": fakeEndTimeIso, "good": [2, 2, 2, 2, 2, 2, 2, 2, 2, 2], "surf_spot_id": 1599, "surf_spot_name": "Indicators", "surf_spot_slug": "indicators", "good_average": 2, "swell_direction": 238.89, "swell_height": 2.96, "swell_period": 10.47, "wind_direction": 201.41, "wind_speed": 23.09, "timezone": "Pacific\/Auckland" }], "last_update": 1657735060 }
        ).as('favoritesGoodTimes');

        // Add favorite
        cy.getBySel('home-near-spots-forecast-list')
            .find('[data-test="surf-spot-preview"]')
            .first()
            .find('[data-test="favorite-add-button"]')
            .click()
            .wait('@favoritesGoodTimes', { timeout: 20000 });

        // No good times section should be visible and with 4 good times displayed.
        cy.getBySel('home-favorites-forecast-good-times').should('be.visible');
        cy.getBySel('home-favorites-forecast-good-times').children().should('have.length', 4);

        // Click on show more button.
        cy.getBySel('list-show-more-button').first().click();

        // 5 good times are displayed.
        cy.getBySel('home-favorites-forecast-good-times').children().should('have.length', 5);
    });

    // Pro user logged, adds a favorite, has good times but in the past
    it('pro user favorites has past good times', () => {

        // Fake times the good times.
        const fakeStartTime = new Date();
        const fakeEndTime = new Date();
        fakeStartTime.setDate(fakeStartTime.getDate() - 2);
        fakeEndTime.setDate(fakeEndTime.getDate() - 1);
        const fakeStartTimeIso = fakeStartTime.toISOString();
        const fakeEndTimeIso = fakeEndTime.toISOString();

        cy.viewport(1000, 1300);

        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Pro user logins.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

        // Hero section.
        cy.getBySel('home-hero').should('not.exist');

        // Empty favorites.
        cy.getBySel('home-favorites-forecast-no-favs').should('be.visible');

        // Search the near spots.
        cy.intercept(
            'GET',
            'https://rest-api.mondosurf.local.com/wp-json/mondo_surf_api/v1/near-spots-forecast/*/*/*'
        ).as('nearsApi');

        // Near spots section.
        // Clicks on the button if it is present in the page.
        cy.getBySel('home-near-spots-forecast-cta').then(($btn) => {
            if ($btn) {
                cy.log('Button is there!');
                cy.getBySel('home-near-spots-forecast-cta').should('be.visible');
                cy.getBySel('home-near-spots-forecast-cta').click({ timeout: 30000 });
            } else {
                cy.log('Button is NOT there!');
            }
        });

        // Waits for the API to retrieve the near spots.
        cy.wait('@nearsApi', { timeout: 20000 }).then((response) => {
            cy.getBySel('home-near-spots-forecast-results').should('be.visible');
            cy.getBySel('home-near-spots-forecast-list').should('be.visible');
        });

        // Favorites good times.
        cy.intercept(
            'GET',
            'https://rest-api.mondosurf.local.com/wp-json/mondo_surf_api/v1/user-favourites-forecast?access_token=*&device_id=*&platform=*',
            { "good_times": [{ "start_time": fakeStartTimeIso, "day_id": 0, "end_time": fakeEndTimeIso, "good": [1], "surf_spot_id": 1599, "surf_spot_name": "Indicators", "surf_spot_slug": "indicators", "good_average": 1, "swell_direction": 237.34, "swell_height": 1.6, "swell_period": 7.04, "wind_direction": 116.88, "wind_speed": 18.54, "timezone": "Pacific\/Auckland" }, { "start_time": fakeStartTimeIso, "day_id": 1, "end_time": fakeEndTimeIso, "good": [2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 1], "surf_spot_id": 1599, "surf_spot_name": "Indicators", "surf_spot_slug": "indicators", "good_average": 1.3636363636363635, "swell_direction": 225.98, "swell_height": 1.4, "swell_period": 8.99, "wind_direction": 196.34, "wind_speed": 26.47, "timezone": "Pacific\/Auckland" }, { "start_time": fakeStartTimeIso, "day_id": 2, "end_time": fakeEndTimeIso, "good": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], "surf_spot_id": 1599, "surf_spot_name": "Indicators", "surf_spot_slug": "indicators", "good_average": 1, "swell_direction": 238.1, "swell_height": 1.8, "swell_period": 7.01, "wind_direction": 234.99, "wind_speed": 34.58, "timezone": "Pacific\/Auckland" }, { "start_time": fakeStartTimeIso, "day_id": 3, "end_time": fakeEndTimeIso, "good": [1, 1, 1, 1], "surf_spot_id": 1599, "surf_spot_name": "Indicators", "surf_spot_slug": "indicators", "good_average": 1, "swell_direction": 233.01, "swell_height": 1.87, "swell_period": 6.46, "wind_direction": 239.84, "wind_speed": 25.18, "timezone": "Pacific\/Auckland" }, { "start_time": fakeStartTimeIso, "day_id": 5, "end_time": fakeEndTimeIso, "good": [2, 2, 2, 2, 2, 2, 2, 2, 2, 2], "surf_spot_id": 1599, "surf_spot_name": "Indicators", "surf_spot_slug": "indicators", "good_average": 2, "swell_direction": 238.89, "swell_height": 2.96, "swell_period": 10.47, "wind_direction": 201.41, "wind_speed": 23.09, "timezone": "Pacific\/Auckland" }], "last_update": 1657735060 }
        ).as('favoritesGoodTimes');

        // Add favorite
        cy.getBySel('home-near-spots-forecast-list')
            .find('[data-test="surf-spot-preview"]')
            .first()
            .find('[data-test="favorite-add-button"]')
            .click()
            .wait('@favoritesGoodTimes', { timeout: 20000 });

        // No good times section should be visible.
        cy.getBySel('home-favorites-forecast-no-good-times').should('be.visible');
    });
});
