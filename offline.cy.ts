// ! Not going back online due to known Cypress Bug
// https://www.cypress.io/blog/2020/11/12/testing-application-in-offline-network-mode/

import { goOffline, goOnline } from '../support/utils';

describe('Offline', () => {
    // Offline
    it('offline toast test', () => {
        // Goes offline
        goOffline();

        // Check if toast appears
        cy.checkToast('data-test-offline');

        cy.wait(5000);

        // Goes online
        goOnline();

        cy.wait(5000);

        // Check if toast appears
        cy.checkToast('data-test-online');
    });
});
