describe('Store App', () =>{
  beforeEach(() =>{
    cy.visit('http://localhost:3000/auth/login')
    cy.contains('Sign In')
    
  })
  it('A category can be created',() =>{
    cy.get('#username').type('usertest')
    cy.get('#password').type('passwor')
    cy.get('#form-login-button').click()
    cy.contains('Tablero')
    cy.contains('Crear Categoría').click()
    cy.contains('Crea una Categoría')
    cy.get('#name-category').type('Test Category')
    cy.get('#button-create-category').click()
  })
})