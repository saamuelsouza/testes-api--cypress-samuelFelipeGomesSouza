/// <reference types= "cypress"/>

describe('Consulta de Filmes', () => {
    it('Deve retornar uma lista de filmes', () => {
      cy.request('GET', 'https://raromdb-3c39614e42d4.herokuapp.com/api/movies').then(response => {
        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('movies').to.be.an('array').that.is.not.empty
      })
    })
  
    it('Deve retornar detalhes de um filme específico', () => {
      cy.request('GET', 'https://raromdb-3c39614e42d4.herokuapp.com/api/movies').then(response => {
        const movies = response.body.movies
        const filmeAleatorio = movies[Math.floor(Math.random() * movies.length)] // Escolhe um filme aleatório da lista
  
        cy.request('GET', `https://raromdb-3c39614e42d4.herokuapp.com/api/movies/${filmeAleatorio._id}`).then(response => {
          expect(response.status).to.equal(200)
          expect(response.body).to.have.property('movie').to.deep.equal(filmeAleatorio)
        })
      })
    })
  
    it('Não deve retornar detalhes de um filme inexistente', () => {
      cy.request('GET', 'https://raromdb-3c39614e42d4.herokuapp.com/api/movies/filmeInexistente', { failOnStatusCode: false }).then(response => {
        expect(response.status).to.equal(404)
        expect(response.body).to.have.property('error', 'Movie not found')
      })
    })
  })