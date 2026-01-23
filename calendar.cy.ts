// import { downloadFile } from 'cypress-downloadfile/lib/addPlugin';
require('cypress-downloadfile/lib/downloadFileCommand');

describe('Calendar', () => {
    const freeEmail = 'free@mailinator.com';
    const freeName = 'Free user';
    const newEmail = 'new@mailinator.com';
    const newName = 'New user';

    // User is not allowed to use calendar
    it("not logged user can't use calendar", () => {
        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Click on good times tab.
        cy.getBySel('surf-spot-tab-good-times').click();

        // Click on the calendar button
        cy.getBySel('surf-spot-forecast-calendar-banner').click();

        // The login shows up
        cy.getBySel('auth-email-form').should('be.visible');
    });

    // Free user has access to calendar
    it('free user accesses calendar', () => {
        if (Cypress.env('app') === "app") {
            cy.getBySel('home-pro-cta-already-member').click();
        } else {
            cy.getBySel('login-tab-bar').click();
        }

        // Free user login
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Click on good times tab
        cy.getBySel('surf-spot-tab-good-times').click();

        // Click on the calendar button
        cy.getBySel('surf-spot-forecast-calendar-banner').click();

        // Calendar modal shows up
        cy.getBySel('get-calendar-url-ready').should('be.visible');
    });

    // New user registers an account to access the calendar
    it('new user registers to use calendar', () => {
        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Click on good times tab.
        cy.getBySel('surf-spot-tab-good-times').click();

        // Click on the calendar button
        cy.getBySel('surf-spot-forecast-calendar-banner').click();

        // New user registration
        cy.register(newEmail, newName, Cypress.env('demo_users_password'));

        // Calendar modal shows up
        cy.getBySel('get-calendar-url-ready').should('be.visible');

        // Close the modal.
        cy.getBySel('modal-close').click();

        // Subscription confirmation page displayed.
        // cy.getBySel("subscription-confirmed").should("exist");
    });

    // Free user starts access the calendar
    it('free user starts trial to use calendar', () => {
        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Click on good times tab.
        cy.getBySel('surf-spot-tab-good-times').click();

        // Click on the calendar button
        cy.getBySel('surf-spot-forecast-calendar-banner').click();

        // Free user login
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Calendar modal shows up.
        cy.getBySel('get-calendar-url-ready').should('be.visible');
    });

    // Free user copies the calendar URL and download file
    it('calendar url copy', () => {
        // Intercept the calendar-url API to get the URL for download testing
        cy.intercept('POST', '**/calendar-url').as('getCalendarUrl');

        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Free user login.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Go to lillatro page.
        cy.searchAndGoToSpotPage('lillat');

        // Click on good times tab.
        cy.getBySel('surf-spot-tab-good-times').click();

        // Click on the calendar button
        cy.getBySel('surf-spot-forecast-calendar-banner').click();

        // Calendar modal shows up.
        cy.getBySel('get-calendar-url-ready').should('be.visible');

        // Click on copy button.
        cy.getBySel('get-calendar-url-copy-button').click();

        // Check if toast appears
        cy.checkToast('data-test-toast-favorite-added');

        // Favorite button is active
        cy.getBySel('favorite-remove-button').should('exist');

        // Download and check the calendar file using the intercepted API response
        cy.wait('@getCalendarUrl').then((interception) => {
            const calendarUrl = interception.response?.body?.calendar_url;
            if (calendarUrl) {
                cy.downloadAndCheck(calendarUrl, 'calendar.ics');
            }
        });
    });

    // User requests calendar URL via email.
    it('calendar url via email', () => {
        // Go to lillatro page.
        cy.searchAndGoToSpotPage('lillat');

        // Click on good times tab.
        cy.getBySel('surf-spot-tab-good-times').click();

        // Click on the calendar button
        cy.getBySel('surf-spot-forecast-calendar-banner').click();

        // Free user login.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Calendar modal shows up.
        cy.getBySel('get-calendar-url-ready').should('be.visible');

        // Click on email url button.
        cy.getBySel('get-calendar-url-email-button').click();

        // Check if toast appears
        cy.checkToast('data-test-toast-calendar-url-email-sent');

        // Check if toast appears
        cy.checkToast('data-test-toast-favorite-added');

        // Favorite button is active
        cy.getBySel('favorite-remove-button').should('exist');

        // Loads the static HTML email.
        cy.loadEmailHtml();

        // Check contents of the email.
        cy.getBySel('email-calendar-url-name').contains(freeName);
        cy.getBySel('email-calendar-url-spot-name').contains('Lillatro');

        // Downloads the calendar file.
        cy.getBySel('email-calendar-url-url').then((text) => {
            cy.downloadAndCheck(text.text(), 'calendar.ics');
        });
    });

    // Favorite check is hidden if spot already in favorite
    it('favorite check is hidden', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Free user login.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Go to lillatro page.
        cy.searchAndGoToSpotPage('lillat');

        // Add to favorite.
        cy.wait(Cypress.env('favorite_button_click_wait')); // Added to avoid the Cypress error "Cannot read properties of undefined"
        cy.getBySel('favorite-add-button').click();

        // Check if toast appears
        cy.checkToast('data-test-toast-favorite-added');

        // Click on good times tab.
        cy.getBySel('surf-spot-tab-good-times').click();

        // Click on the calendar button
        cy.getBySel('surf-spot-forecast-calendar-banner').click();

        // Checkbox to add favorite is not existing.
        cy.getBySel('get-calendar-url-checkbox').should('not.exist');
    });

    // Calendar banner in homepage for not logged user
    // Home calendar banners are currently disabled
    /*
    it('home calendar not logged user', () => {
        // Click on first calendar banner
        cy.getBySel('home-banners-calendar-banner').first().click();

        // Auth form should be visible
        cy.getBySel('auth-email-form').should('exist');
    });
    */

    // Calendar banner in homepage for pro user
    // Home calendar banners are currently disabled
    /*
    it('home calendar pro user', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Pro user login.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

        // Click on first calendar banner
        cy.getBySel('home-banners-calendar-banner').first().click();

        // Click on email url button.
        cy.getBySel('get-calendar-url-email-button').click();

        // Check if toast appears
        cy.checkToast('data-test-toast-calendar-url-email-sent');

        // Check if toast appears
        cy.checkToast('data-test-toast-favorite-added');
    });
    */
});
