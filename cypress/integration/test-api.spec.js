describe('Store App', () => {
  it('Should login page can be opened', () => {
    cy.visit('localhost:3000/auth/login')
  })

  it('A user can be register', () => {
    cy.visit('localhost:3000/auth/register')
    cy.get('#name').type('User')
    cy.get('#last_name').type('Testing')
    cy.get('#username').type('UserTest1')
    cy.get('#password').type('passwordtesting123')
    cy.get('#phone').type('20202020')
    cy.get('#address').type('Cll 1 # 0 - 0')
    cy.get('#store_name').type('Store Test 1')
    cy.get('#test-button-register').click()
  })

  it('A user can`t be duplicated', () => {
    cy.visit('localhost:3000/auth/register')
    cy.register({
      name: 'The User',
      last_name: 'Testing',
      username: 'UserTesting',
      password: 'passwordtesting123',
      phone: '000000000',
      address: 'Kr 0 # 0 - 0',
      store_name: 'Store Test',
    })
  })

  it('A user can be login', () => {
    cy.visit('localhost:3000/auth/login')
    cy.get('#username').type('UserTesting')
    cy.get('#password').type('passwordtesting123')
    cy.get('#test-button-login').click()
  })

  it('Should validate the token Sesion', () => {
    cy.login({ username: 'UserTesting', password: 'passwordtesting123' })
  })

  it('A user can create a category', () => {
    cy.visit('localhost:3000/auth/login')
    cy.get('#username').type('UserTesting')
    cy.get('#password').type('passwordtesting123')
    cy.get('#test-button-login').click()
    cy.contains('Tablero')
    cy.contains('Crear Categoría').click()
    cy.contains('Crea una Categoría')
    cy.get('#name').type('Category - 1')
    cy.get('#test-button-category').click()
    cy.contains('Disponible')
  })

  it('A supplier can be created', () => {
    cy.visit('localhost:3000/auth/login')
    cy.get('#username').type('UserTesting')
    cy.get('#password').type('passwordtesting123')
    cy.get('#test-button-login').click()
    cy.contains('Tablero')
    cy.contains('Crear proveedor').click()
    cy.get('#name').type('Supplier')
    cy.get('#lastname').type('Test 2')
    cy.get('#phone').type('10101111')
    cy.get('#test-button-supplier').click()
  })

  it('Should be not create a supplier duplicated for the same store', () => {
    cy.visit('localhost:3000/auth/login')
    cy.get('#username').type('UserTesting')
    cy.get('#password').type('passwordtesting123')
    cy.get('#test-button-login').click()
    cy.contains('Tablero')
    cy.contains('Crear proveedor').click()
    cy.get('#name').type('Supplier')
    cy.get('#lastname').type('Test')
    cy.get('#phone').type('10101010')
    cy.get('#test-button-supplier').click()
  })
  it('A Product can be created', () => {
    cy.visit('localhost:3000/auth/login')
    cy.get('#username').type('UserTesting')
    cy.get('#password').type('passwordtesting123')
    cy.get('#test-button-login').click()
    cy.contains('Tablero')
    cy.contains('Crear producto').click()
    cy.contains('Crea productos')
    cy.get('#category').select('Category').should('have.value', '17')
    cy.get('#supplier').contains('Supplier Test').click({ force: true })
    cy.get('#name').type('Product Test')
    cy.get('#unit_cost').type(1000)
    cy.get('#quantity').type(1)
    cy.get('#unit_price').type(2500)
    cy.get('#button-test-product').click()
  })

  it('Should create clients in the store', () => {
    cy.login({ username: 'UserTesting', password: 'passwordtesting123' })
    cy.request({
      method: 'POST',
      url: 'http://localhost:4000/client/create-client',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('glob_token')}`,
      },
      body: {
        name: 'Client',
        lastname: 'Test',
        phone: '0000000',
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
    cy.visit('localhost:3000/admin/clients')
  })
  it('Should sales page can be opened', () => {
    cy.visit('localhost:3000/auth/login')
    cy.get('#username').type('UserTesting')
    cy.get('#password').type('passwordtesting123')
    cy.get('#test-button-login').click()
    cy.contains('Tablero')
    cy.get('#test-sales').click()
  })
  it('Must create payments towards debts', () => {
    expect(false).to.eq(false)
  })
  it('Should clients page can be opened', () => {
    expect(false).to.eq(false)
  })
  it('Should show push notifications in the store', () => {
    expect(false).to.eq(false)
  })
  it.only('Should create sales in the store', () => {
    expect(false).to.eq(false)
  })
})
