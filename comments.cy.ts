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

    // User tries to add a comment, login, and adds the comment
    it('tries to add a comment, login, adds comment and deletes it', () => {
        // Go to lillatro page
        cy.searchAndGoToSpotPage('lillat');

        // Click on Comments tab
        cy.getBySel('surf-spot-tab-comments').click();

        const randomComment = `Test comment ${Math.random().toString(36).substring(2, 8)}`;

        // Inputs the comment
        cy.getBySel('comment-field').should("exist");
        cy.wait(500);
        cy.getBySel('comment-field').type(randomComment);
        cy.getBySel('comment-submit').click();

        // Email modal is displayed.
        cy.getBySel('auth-email-form').should('be.visible');

        // Free user logins.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        cy.getBySel('comment').first().should('exist');
        cy.getBySel('comment').first().find('.ms-comment__text').should('have.text', randomComment);

        cy.getBySel('comment-delete').first().click();
        cy.getBySel('modal-button').first().click();

        // Toast is displayed.
        cy.checkToast('data-test-toast-comment-deleted');
    });

    // Logged user creates a comment, checks it in the home, and then deletes it
    it('logged creates a comment, checks in in homepage, and deletes id', () => {
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
        cy.getBySel('comment-field').should("exist");
        cy.wait(500);
        cy.getBySel('comment-field').type(randomComment);
        cy.getBySel('comment-submit').click();

        cy.getBySel('comment').first().should('exist');
        cy.getBySel('comment').first().find('.ms-comment__text').should('have.text', randomComment);

        // Check the comment in homepage
        cy.getBySel('home-tab-bar').click();
        cy.getBySel('latest-comments').should('exist');
        cy.getBySel('comment').first().find(".ms-comment__text").should('have.text', randomComment);
        cy.getBySel('comment').first().click();

        // Click on Comments tab
        cy.getBySel('surf-spot-tab-comments').click();

        cy.getBySel('comment-delete').first().click();
        cy.getBySel('modal-button').first().click();

        // Toast is displayed.
        cy.checkToast('data-test-toast-comment-deleted');
    });

    // ── Likes ────────────────────────────────────────────────────────────────

    // Regression test for the homepage like-after-login bug (fixed 2026-06-24):
    // an anonymous like on the homepage feed must show the filled state right
    // after login, WITHOUT a page refresh. Before the fix, LatestComments
    // unmounted on the login-triggered refetch and discarded the optimistic like.
    it('anonymous likes a homepage comment, logs in, and the like shows without a refresh', () => {
        cy.visit('/');
        cy.getBySel('latest-comments').should('exist');

        // Anonymous: like the first comment → the login modal opens.
        cy.getBySel('comment-like-btn').first().click();
        cy.getBySel('auth-email-form').should('be.visible');

        // Free user logs in.
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        // WITHOUT a reload, the liked state must now be reflected on the button.
        cy.getBySel('comment-like-btn').first().should('have.attr', 'aria-pressed', 'true');

        // Clean up: unlike (respect the 2s per-(user,comment) like cooldown).
        cy.wait(2500);
        cy.getBySel('comment-like-btn').first().click();
        cy.getBySel('comment-like-btn').first().should('have.attr', 'aria-pressed', 'false');
    });

    // A logged-in like toggles the button and the state survives a reload.
    it('logged user likes a comment and the state persists after reload', () => {
        cy.getBySel('login-tab-bar').click();
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        cy.searchAndGoToSpotPage('lillat');
        cy.getBySel('surf-spot-tab-comments').click();
        cy.getBySel('comment-like-btn').first().should('exist');

        // Normalize to an unliked starting state.
        cy.getBySel('comment-like-btn').first().then(($b) => {
            if ($b.attr('aria-pressed') === 'true') {
                cy.getBySel('comment-like-btn').first().click();
                cy.wait(2500);
            }
        });
        cy.getBySel('comment-like-btn').first().should('have.attr', 'aria-pressed', 'false');

        // Like it.
        cy.getBySel('comment-like-btn').first().click();
        cy.getBySel('comment-like-btn').first().should('have.attr', 'aria-pressed', 'true');

        // Survives a full reload.
        cy.reload();
        cy.getBySel('comment-like-btn').first().should('have.attr', 'aria-pressed', 'true');

        // Clean up: unlike.
        cy.wait(2500);
        cy.getBySel('comment-like-btn').first().click();
        cy.getBySel('comment-like-btn').first().should('have.attr', 'aria-pressed', 'false');
    });

    // ── Replies ──────────────────────────────────────────────────────────────

    // A reply can be submitted with the Enter key and lands in the thread.
    it('logged user replies with the Enter key and the reply appears', () => {
        cy.getBySel('login-tab-bar').click();
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        cy.searchAndGoToSpotPage('lillat');
        cy.getBySel('surf-spot-tab-comments').click();
        cy.getBySel('comment').should('exist');

        const randomReply = `Test reply ${Math.random().toString(36).substring(2, 8)}`;

        // Open the reply form on the first top-level comment.
        cy.getBySel('comment-reply-btn').first().click();
        cy.getBySel('reply-field').should('be.visible');
        cy.wait(500);

        // Enter submits — no click on the submit button.
        cy.getBySel('reply-field').type(`${randomReply}{enter}`);

        // The reply appears in the thread.
        cy.getBySel('comment').contains('.ms-comment__text', randomReply).should('exist');

        // Clean up: delete the reply we just posted.
        cy.getBySel('comment')
            .contains('.ms-comment__text', randomReply)
            .parents('[data-test="comment"]')
            .find('[data-test="comment-delete"]')
            .first()
            .click();
        cy.getBySel('modal-button').first().click();
        cy.checkToast('data-test-toast-comment-deleted');
    });

    // Deleting a top-level comment removes its replies too (hard-delete model).
    it('deleting a top-level comment also removes its replies', () => {
        cy.getBySel('login-tab-bar').click();
        cy.login(freeEmail, freeName, Cypress.env('demo_users_password'));

        cy.searchAndGoToSpotPage('lillat');
        cy.getBySel('surf-spot-tab-comments').click();

        const parentText = `Parent ${Math.random().toString(36).substring(2, 8)}`;
        const replyText = `Child ${Math.random().toString(36).substring(2, 8)}`;

        // Create a top-level comment (newest → appears first).
        cy.getBySel('comment-field').should('exist');
        cy.wait(500);
        cy.getBySel('comment-field').type(parentText);
        cy.getBySel('comment-submit').click();
        cy.getBySel('comment').contains('.ms-comment__text', parentText).should('exist');

        // Reply to it via the first (newest) comment's reply button.
        cy.getBySel('comment-reply-btn').first().click();
        cy.getBySel('reply-field').should('be.visible');
        cy.wait(500);
        cy.getBySel('reply-field').type(`${replyText}{enter}`);
        cy.getBySel('comment').contains('.ms-comment__text', replyText).should('exist');

        // Delete the parent.
        cy.getBySel('comment')
            .contains('.ms-comment__text', parentText)
            .parents('[data-test="comment"]')
            .find('[data-test="comment-delete"]')
            .first()
            .click();
        cy.getBySel('modal-button').first().click();
        cy.checkToast('data-test-toast-comment-deleted');

        // Both the parent AND its reply are gone.
        cy.getBySel('comment').contains('.ms-comment__text', parentText).should('not.exist');
        cy.getBySel('comment').contains('.ms-comment__text', replyText).should('not.exist');
    });
});
