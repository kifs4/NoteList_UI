describe('Workspace Flow', () => {
  beforeEach(() => {
    // Instead of logging in via UI for every test, we can mock the localStorage/Redux 
    // or just assume we have a test user on the backend.
    // For this test, we'll try to do a real login if possible, or intercept.
    // Assuming backend is running, let's login via API to get token.
    cy.request({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/login/',
      body: {
        username: 'test@example.com', // Need a real seed user on backend, or we intercept
        password: 'password123'
      },
      failOnStatusCode: false
    }).then((resp) => {
      if (resp.status === 200) {
        window.localStorage.setItem('token', resp.body.token);
      }
    });
  });

  it('should load workspace and allow creating a note', () => {
    // Mocking the backend if real login fails or just to be safe
    cy.intercept('GET', 'http://127.0.0.1:8000/api/notes/', {
      statusCode: 200,
      body: [{ id: 1, title: 'Test Note', description: 'Test Desc', user: { id: 1 } }]
    }).as('getNotes');

    // Simulate login in Redux by setting localStorage and forcing state if needed, 
    // but the app uses Redux. If the app rehydrates from localStorage, we are good.
    // If not, we can just intercept the login call.
    cy.visit('/workspace');

    // It might redirect to login if Redux state is empty. 
    // So let's test the UI by actually logging in.
    cy.visit('/login');
    cy.intercept('POST', 'http://127.0.0.1:8000/api/login/', {
      statusCode: 200,
      body: { user: { id: 1, email: 'test@example.com', is_staff: false }, token: 'fake-token' }
    }).as('login');

    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.contains('Увійти').click();

    cy.wait('@login');
    cy.url().should('include', '/workspace');

    // Check notes are loaded
    cy.wait('@getNotes');
    cy.contains('Test Note').should('be.visible');

    // Create Note
    cy.intercept('POST', 'http://127.0.0.1:8000/api/notes/', {
      statusCode: 201,
      body: { id: 2, title: 'New Cypress Note', description: 'Created by Cypress' }
    }).as('createNote');

    cy.get('input[placeholder="Заголовок нотатки"]').type('New Cypress Note');
    cy.get('textarea[placeholder="Текст..."]').type('Created by Cypress');
    cy.contains('Записати в базу бекенду').click();

    cy.wait('@createNote');
  });
});
