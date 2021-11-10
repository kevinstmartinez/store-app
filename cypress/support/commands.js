Cypress.Commands.add('login',({username, password}) =>{
  cy.request('POST', 'http://localhost:4000/auth/login', {
    username,
    password
  }).then(response =>{
    localStorage.getItem('glob_token', JSON.stringify(response.body))
  })
})

Cypress.Commands.add('register',({name, last_name, username, password, phone, address, store_name}) =>{
  cy.request('POST', 'http://localhost:4000/auth/register', {
    name,
    last_name,
    username,
    password,
    phone,
    address,
    store_name
  })
    .then(response => {
      expect(response.Body.message).to.eq('That store is already in use, please validate the info.')
    })
})