/// <reference types= "cypress"/>

describe('Consulta de usuário', () => {
    let usuarioCadastrado
  
    beforeEach(() => {
      cy.request('DELETE', 'https://raromdb-3c39614e42d4.herokuapp.com/api/users', { force: true })
  
      cy.request({
        method: 'POST',
        url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users',
        body: {
          nome: 'Samuel Souza',
          email: 'samuel@qa@gmail.com',
          senha: 'teste'
        }
      }).then(response => {
        usuarioCadastrado = response.body.user
      })
    })
  
    it('Deve consultar um usuário cadastrado com sucesso', () => {
      cy.request({
        method: 'GET',
        url: `https://raromdb-3c39614e42d4.herokuapp.com/api/users/${usuarioCadastrado._id}`
      }).then(response => {
        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('user')
        expect(response.body.user).to.deep.equal(usuarioCadastrado)
      })
    })
  })