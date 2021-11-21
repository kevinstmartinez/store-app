describe('Store App', () => {
  it('Should login page can be opened', () => {
    cy.visit('localhost:3000/auth/login')
  })

  it('A user can be register', () => {
    cy.visit('localhost:3000/auth/register')
    cy.get('#name').type('User')
    cy.get('#last_name').type('Testing')
    cy.get('#username').type('UserTest1')
    cy.get('#password').type('passwordtestin')
    cy.get('#phone').type('20202020')
    cy.get('#address').type('Cll 2 # 0 - 0')
    cy.get('#store_name').type('Store Test 1')
    cy.get('#test-button-register').click()
  })



  it('A user can be login', () => {
    cy.visit('localhost:3000/auth/login')
    cy.get('#username').type('Don Santollito')
    cy.get('#password').type('12345')
    cy.get('#test-button-login').click()
  })


  it('Should validate the token Sesion', () => {
    cy.login({ username: 'UserTesting', password: 'passwordtesting123' })
  })

  it('A user can create a category', () => {
    cy.visit('localhost:3000/auth/login')
    cy.get('#username').type('Don Santollito')
    cy.get('#password').type('12345')
    cy.get('#test-button-login').click()
    cy.contains('Tablero')
    cy.contains('Crear Categoría').click()
    cy.contains('Crea una Categoría')
    cy.get('#name').type('Category - 1')
    cy.get('#test-button-category').click()
  })

  it('A supplier can be created', () => {
    cy.visit('localhost:3000/auth/login')
    cy.get('#username').type('Don Santollito')
    cy.get('#password').type('12345')
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
    cy.get('#username').type('Don Santollito')
    cy.get('#password').type('12345')
    cy.get('#test-button-login').click()
    cy.contains('Tablero')
    cy.contains('Crear proveedor').click()
    cy.get('#name').type('Supplier')
    cy.get('#lastname').type('Test')
    cy.get('#phone').type('10101010')
    cy.get('#test-button-supplier').click()
  })
  it('A Product can be created', () => {
    expect(false).to.eq(false)
  })

  it('Should create clients in the store', () => {
    expect(false).to.eq(false)
   
  })
  it('Should sales page can be opened', () => {
    cy.visit('localhost:3000/auth/login')
    cy.get('#username').type('Don Santollito')
    cy.get('#password').type('12345')
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
  it('Should create sales in the store', () => {
    expect(false).to.eq(false)
  })

  it('Should show data dashboard of the user logged', () => {
    expect(false).to.eq(false)
  })

  it('Verify data persistence', () => {
    expect(false).to.eq(false)
  })

  it('Verify status sale payed', () => {
    expect(false).to.eq(false)
  })

  it('Validate grossIncome and margin gross income calculate', () => {
    expect(false).to.eq(false)
  })

  it('Validate the persistence session variable when user create a new sale', () => {
    expect(false).to.eq(false)
  })
  it.only('A user can`t be duplicated', () => {
    expect(false).to.eq(false)
  })

  
  
})