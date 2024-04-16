/// <reference types= "cypress"/>

describe('Criação de usuário', () => {
    const dadosUsuario = {
      nome: 'Samuel Souza',
      email: 'samuel@qa@gmail.com',
      senha: 'teste'
    }
  
    beforeEach(() => {
      cy.request('DELETE', 'https://raromdb-3c39614e42d4.herokuapp.com/api/users', { force: true })
    })
  
    it('Deve criar um novo usuário com sucesso', () => {
      cy.request({
        method: 'POST',
        url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users',
        body: dadosUsuario
      }).then(response => {
        expect(response.status).to.equal(201)
        expect(response.body).to.have.property('user')
        expect(response.body.user).to.have.property('name', dadosUsuario.nome)
        expect(response.body.user).to.have.property('email', dadosUsuario.email)
      })
    })
  
    it('Não deve criar um usuário com email inválido', () => {
      const emailInvalido = 'emailinvalido.com'
  
      cy.request({
        method: 'POST',
        url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users',
        body: { ...dadosUsuario, email: emailInvalido },
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.equal(400)
        expect(response.body).to.have.property('error', 'Invalid email format')
      })
    })
  
    it('Não deve criar um usuário com email já existente', () => {
      cy.request({
        method: 'POST',
        url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users',
        body: dadosUsuario
      })
  
      cy.request({
        method: 'POST',
        url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users',
        body: dadosUsuario,
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.equal(400)
        expect(response.body).to.have.property('error', 'Email already in use')
      })
    })
  })
  