describe('Surf Spot Forecast', () => {
    it('successfully loads', () => {
        cy.visit('/'); // change URL to match your dev URL

        // Clicks the Iubenda cookie banner.
        cy.iubenda();

        // Click on countries button.
        cy.getBySel('countries-tab-bar').click();

        // Click on Italy.
        cy.getBySel('country-preview-title').contains('Italy').click();

        // Click on Tuscany.
        cy.getBySel('region-preview-title').contains('Tuscany').click();

        // Click on Lillatro.
        cy.getBySel('surf-spot-preview-title').contains('Lillatro').click();

        // Click on Lillatro Info tab.
        cy.getBySel('surf-spot-tab-info').click();

        cy.getBySel('surf-spot-info-direction').should('contain', 'A-frame');
    });
});
