describe('Authentication Flow', () => {
  it('should allow user to visit login page', () => {
    cy.visit('/login');
    cy.contains('Вхід в систему').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
  });

  it('should show error on invalid login', () => {
    cy.intercept('POST', 'http://127.0.0.1:8000/api/login/', {
      statusCode: 400,
      body: { error: 'Невірний email або пароль' }
    }).as('loginFail');

    cy.visit('/login');
    cy.get('input[type="email"]').type('nonexistent@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.contains('Увійти').click();

    cy.wait('@loginFail');
    cy.contains('Невірний email або пароль').should('be.visible');
  });

  it('should navigate to register page and submit form', () => {
    cy.visit('/register');
    cy.contains('Створення акаунту').should('be.visible');

    const randomEmail = `test_${Date.now()}@example.com`;

    cy.get('input[type="text"]').type('Test User');
    cy.get('input[type="email"]').type(randomEmail);
    cy.get('input[type="password"]').type('TestPass123!');
    cy.get('select').select('Чоловіча');
    cy.get('input[type="date"]').type('2000-01-01');

    cy.intercept('POST', 'http://127.0.0.1:8000/api/register/', {
      statusCode: 201,
      body: { success: true }
    }).as('registerSuccess');

    cy.contains('Зареєструватись').click();

    cy.wait('@registerSuccess');
  });
});
