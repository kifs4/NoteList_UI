describe('Navigation Flow', () => {
  it('should navigate between public pages via navbar', () => {
    cy.visit('/');
    // Should redirect to login since not authenticated
    cy.url().should('include', '/login');

    cy.contains('Про додаток').click();
    cy.url().should('include', '/about');
    cy.contains('NoteList App').should('be.visible');

    cy.contains('Реєстрація').click();
    cy.url().should('include', '/register');
    cy.contains('Створення акаунту').should('be.visible');

    cy.contains('Вхід').click();
    cy.url().should('include', '/login');
  });
});
