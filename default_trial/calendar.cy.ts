import { downloadFile } from 'cypress-downloadfile/lib/addPlugin';
require('cypress-downloadfile/lib/downloadFileCommand');

describe('Calendar', () => {
    const freeEmail = 'free@mailinator.com';
    const freeName = 'Free user';
    const newEmail = 'new@mailinator.com';
    const newName = 'New user';
    const proEmail = 'pro@mailinator.com';
    const proName = 'Pro user';
    const trialEmail = 'trial@mailinator.com';
    const trialName = 'Trial user';

    // User is not allowed to use calendar
    it("not logged user can't use calendar", () => {
        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Click on good times tab.
        cy.getBySel('surf-spot-tab-good-times').click();

        // Click on the calendar button
        cy.getBySel('surf-spot-forecast-calendar-banner').click();

        // The login shows up.
        cy.getBySel('auth-email-form').should('be.visible');
    });

    // Free user has no access to calendar
    it("free user can't use calendar", () => {
        // Click on user in the tab bar to login.
        cy.getBySel('home-pro-cta-already-member').click();

        // Free user login
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Click on good times tab.
        cy.getBySel('surf-spot-tab-good-times').click();

        // Click on the calendar button
        cy.getBySel('surf-spot-forecast-calendar-banner').click();

        // The login shows up.
        cy.getBySel('trial-modal').should('be.visible');
    });

    // Pro user has access to calendar
    it('pro user accesses calendar', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('home-pro-cta-already-member').click();

        // Pro user login
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Click on good times tab.
        cy.getBySel('surf-spot-tab-good-times').click();

        // Click on the calendar button
        cy.getBySel('surf-spot-forecast-calendar-banner').click();

        // Calendar modal shows up.
        cy.getBySel('get-calendar-url-ready').should('be.visible');
    });

    // Trial user has access to calendar
    it('trial user accesses calendar', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('home-pro-cta-already-member').click();

        // Trial user login
        cy.login(trialEmail, trialName, Cypress.env('demo_users_password'));

        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Click on good times tab.
        cy.getBySel('surf-spot-tab-good-times').click();

        // Click on the calendar button
        cy.getBySel('surf-spot-forecast-calendar-banner').click();

        // Calendar modal shows up.
        cy.getBySel('get-calendar-url-ready').should('be.visible');
    });

    // New user registers an account anb starts the Trial to access the calendar
    it('new user starts trial to use calendar', () => {
        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Click on good times tab.
        cy.getBySel('surf-spot-tab-good-times').click();

        // Click on the calendar button
        cy.getBySel('surf-spot-forecast-calendar-banner').click();

        // New user login
        cy.register(newEmail, newName, Cypress.env('demo_users_password'));

        // Click on trial modal CTA.
        cy.getBySel('trial-modal-cta').click();

        // Calendar modal shows up.
        cy.getBySel('get-calendar-url-ready').should('be.visible');
    });

    // Free user starts the Trial to access the calendar
    it('free user starts trial to use calendar', () => {
        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Click on good times tab.
        cy.getBySel('surf-spot-tab-good-times').click();

        // Click on the calendar button
        cy.getBySel('surf-spot-forecast-calendar-banner').click();

        // Free user login
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // Click on trial modal CTA.
        cy.getBySel('trial-modal-cta').click();

        // Calendar modal shows up.
        cy.getBySel('get-calendar-url-ready').should('be.visible');
    });

    // Pro user copies the calendar URL and download file
    it('calendar url copy', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Pro user login.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

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
        // Not working if the page is not on focus.
        // cy.checkToast('data-test-toast-calendar-url-copied');

        // Check if toast appears
        cy.checkToast('data-test-toast-favorite-added');

        // Favorite button is active
        cy.getBySel('favorite-remove-button').should('exist');

        // Click on test url fo download file
        cy.getBySel('get-calendar-url-test-url')
            .invoke('attr', 'href')
            .then((href) => {
                cy.downloadAndCheck(href, 'calendar.ics');
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

        // Pro user login.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

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
        cy.getBySel('email-calendar-url-name').contains(proName);
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

        // Pro user login.
        cy.login(proEmail, proName, Cypress.env('demo_users_password'));

        // Go to lillatro page.
        cy.searchAndGoToSpotPage('lillat');

        // Add to favorite.
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
    it('home calendar not logged user', () => {
        // Click on first calendar banner
        cy.getBySel('home-banners-calendar-banner').first().click();

        // Auth form should be visible
        cy.getBySel('auth-email-form').should('exist');
    });

    // Calendar banner in homepage for pro user
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
});
