/// <reference types= "cypress"/>

describe("Cenários de testes do campo Users", () => {
  describe("POST - /api/users - Create user", () => {
    it("Deve criar um novo usuário", () => {
      //podemos usar o it já criado em autenticação?
      const novoUsuario = {
        name: "",
        email: "",
        password: "teste123",
      };

      /*cy.request('POST', 'https://raromdb-3c39614e42d4.herokuapp.com/api/users', novoUsuario)
        .then((response) => {
          // Verificar o status 201 (sucesso)
          expect(response.status).to.equal(201);
          expect(response.body.name).to.equal(novoUsuario.name);
          expect(response.body.email).to.equal(novoUsuario.email);
        });*/
    });
  });
  describe("GET - /api/users - List users", () => {
    it("Deve listar os usuários existentes", () => {
      /*cy.request('GET', 'https://raromdb-3c39614e42d4.herokuapp.com/api/users')
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('').and.to.be.an('');
      });*/
    });
  });

  describe("GET - /api/users/{id} - Find user", () => {
    it("Deve encontrar um usuário existente", () => {
      /*cy.request('GET', `https://raromdb-3c39614e42d4.herokuapp.com/api/users/${userId}`)
        .then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.id).to.equal(userId);
        });*/
    });
  });

  describe("DELETE - /api/users/{id} - Delete user", () => {
    it("Deve deletar um usuário existente", () => {
      // podemos usar o trecho de código da autenticação
      /*cy.request('DELETE', `https://raromdb-3c39614e42d4.herokuapp.com/api/users/${userId}`)
        .then((response) => {
          expect(response.status).to.equal(200);
        });*/
    });
  });

  describe("PUT - /api/users/{id} - Update user", () => {
    it("Deve atualizar um usuário existente", () => {
      // Inserir dados atualizados?
      const atualizarDados = {
        name: "",
        email: "blablabla.email@example.com",
        password: "12345",
      };
      /*cy.request('PUT', `https://raromdb-3c39614e42d4.herokuapp.com/api/users/${userId}`, atualizarDados)
        .then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.name).to.equal(atualizarDados.name);
          expect(response.body.email).to.equal(atualizarDados.email);
        });*/
    });
  });

  describe("PATCH - /api/users/apply - promote user to critic", () => {
    it("Deve promover um usuário existente para perfil crítico", () => {
      // Dados atualizados do usuário
      const dadosParciais = {
        name: "",
      };

      /*cy.request('PATCH', `https://raromdb-3c39614e42d4.herokuapp.com/api/users/${userId}`, dadosParciais)
        .then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.name).to.equal(dadosParciais.name);
          expect(response.body.email).to.not.be.undefined;
        });*/
    });
  });

  describe("PATCH - /api/users/admin - promote user to admin", () => {
    it("Deve atualizar parcialmente um usuário administrador", () => {
      // Dados atualizados do usuário
      const dadosAdmin = {
        name: "",
      };

      // Envie uma solicitação PATCH para atualizar parcialmente o usuário administrador pelo ID
      /*cy.request('PATCH', `https://raromdb-3c39614e42d4.herokuapp.com/api/users/${adminUserId}`, dadosAdmin)
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(dadosAdmin.name);
        expect(response.body.email).to.not.be.undefined;
        expect(response.body.isAdmin).to.be.true; // o status de admin não mudou?
      });*/
    });
  });

  describe("PATCH - /api/users/inactivate - Inactivate user", () => {
    it("Deve desativar um usuário existente usando PATCH", () => {
      // Dados para desativar o usuário
      const dadoInexistente = {
        isActive: false,
      };

      // Envie uma solicitação PATCH para desativar o usuário pelo ID
      /*cy.request('PATCH', `https://raromdb-3c39614e42d4.herokuapp.com/api/users/${userId}`, dadoInexistente)
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.isActive).to.be.false;
      });*/
    });
  });

  describe("POST - /api/users/review - Review a movie", () => {
    it("Deve enviar uma revisão para um usuário existente usando POST", () => {
      const dadosReview = {
        userId: 5,
        rating: 4,
        comment: "blablabla!",
      };
    });
  });

  describe("GET - /api/users/review/all - List reviews", () => {
    it("Deve obter todas as revisões de usuários existentes usando GET", () => {
      /*cy.request('GET', 'https://raromdb-3c39614e42d4.herokuapp.com/api/users/review/all')
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('');
        if (response.body.length > 0) {
          const review = response.body[0];
          expect(review).to.have.property('Id');
        }
      });*/
    });
  });
});
