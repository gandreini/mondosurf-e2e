describe('Map', () => {
    it('country map', () => {
        // Click on countries button.
        cy.getBySel('countries-tab-bar').click();

        // Click on Italy.
        cy.getBySel('country-preview-title').contains('Italy').click();

        // Click on map.
        cy.getBySel('country-map').click();

        // Click on pin on the map.
        cy.get('.leaflet-interactive').first().click();

        // Click on popover.
        // ! TODO : Fix this. It fails when there's a cluster.
        // cy.get('#ms_map_popover').click();
    });
});
