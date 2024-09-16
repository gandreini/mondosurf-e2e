describe('Comments', () => {
    const freeEmail = 'free@mailinator.com';
    const freeName = 'Free user';
    const newEmail = 'new@mailinator.com';
    const newName = 'New user';
    const proEmail = 'pro@mailinator.com';
    const proName = 'Pro user';
    const trialEmail = 'trial@mailinator.com';
    const trialName = 'Trial user';
    const searchString = 'lillatr';

    // Logged in user adds a comment
    it('logged user adds a comment', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Trial user logins.
        cy.login(trialEmail, trialName, Cypress.env('demo_users_password'));

        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Click on Comments tab
        cy.getBySel('surf-spot-tab-comments').click();

        const randomComment = `Test comment ${Math.random().toString(36).substring(2, 8)}`;

        // Inputs the comment
        cy.getBySel('comment-field').clear();
        cy.getBySel('comment-field').type(randomComment);
        cy.getBySel('comment-submit').click();

        cy.getBySel('comment').first().should('exist');
        cy.getBySel('comment').first().find('.ms-comment__text').should('have.text', randomComment);
    });

    // User tries to add a comment, login, and adds the comment
    it('tries to add a comment, login, adds comment', () => {
        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Click on Comments tab
        cy.getBySel('surf-spot-tab-comments').click();

        const randomComment = `Test comment ${Math.random().toString(36).substring(2, 8)}`;

        // Inputs the comment
        cy.getBySel('comment-field').clear();
        cy.getBySel('comment-field').type(randomComment);
        cy.getBySel('comment-submit').click();

        // Email modal is displayed.
        cy.getBySel('auth-email-form').should('be.visible');

        // Free user logins.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        cy.getBySel('comment').first().should('exist');
        cy.getBySel('comment').first().find('.ms-comment__text').should('have.text', randomComment);
    });


    // Logged user deletes a comment
    it('logged user deletes a comment', () => {
        // Click on user in the tab bar to login.
        cy.getBySel('login-tab-bar').click();

        // Trial user logins.
        cy.login(trialEmail, trialName, Cypress.env('demo_users_password'));

        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Click on Comments tab
        cy.getBySel('surf-spot-tab-comments').click();

        cy.getBySel('comment-delete').first().click();
        cy.getBySel('modal-button').first().click();

        // Toast is displayed.
        cy.checkToast('data-test-toast-comment-deleted');
    });
});
