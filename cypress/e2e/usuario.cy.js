/// <reference types= "cypress"/>

describe("Cenários de testes do recurso Users", () => {
  const { faker } = require("@faker-js/faker");
  const urlBase = "https://raromdb-3c39614e42d4.herokuapp.com/api";
  const usuario = {
    id: 0,
    name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    email: faker.internet.email(),
    type: 0,
    active: true,
    password: faker.internet.password({ length: 12 }),
  };

  describe("POST - /api/users - Create user", () => {
    let responseNovoUsuario;

    it("Deve criar um novo usuário", () => {
      cy.request("POST", `${urlBase}/users`, {
        name: usuario.name,
        email: usuario.email,
        password: usuario.password,
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal(usuario.name);
        expect(response.body.email).to.equal(usuario.email);
        expect(typeof response.body.id).to.equal("number");
        expect(typeof response.body.name).to.equal("string");
        expect(typeof response.body.email).to.equal("string");
        expect(typeof response.body.type).to.equal("number");
        expect(typeof response.body.active).to.equal("boolean");
      });
    });

    it("Não deve criar usuário com email repetido", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/users`,
        body: {
          name: usuario.name,
          email: usuario.email,
          password: usuario.password,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(409);
        expect(response.body.message).to.equal("Email already in use");
      });
    });

    it("Não deve criar usuário com email inválido", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/users`,
        body: {
          name: usuario.name,
          email: "testedosamuelArrobagmailpontocom",
          password: usuario.password,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal("email must be an email");
      });
    });

    it("Não deve criar usuário com email vazio", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/users`,
        body: {
          name: usuario.name,
          email: "",
          password: usuario.password,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal(
          "email must be longer than or equal to 1 characters"
        );
      });
    });

    it("Não deve criar usuário com email nulo", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/users`,
        body: {
          name: usuario.name,
          email: null,
          password: usuario.password,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal(
          "email must be longer than or equal to 1 characters"
        );
      });
    });

    it("Não deve criar usuário com nome vazio", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/users`,
        body: {
          name: '',
          email: faker.internet.email(),
          password: usuario.password,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal(
          "name must be longer than or equal to 1 characters"
        );
      });
    });

    it("Não deve criar usuário com nome nulo", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/users`,
        body: {
          name: null,
          email: faker.internet.email(),
          password: usuario.password,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal(
          "name must be longer than or equal to 1 characters"
        );
      });
    });

    it("Não deve criar usuário com nome maior do que 100 caracteres", () => {
       cy.request({
        method: "POST",
        url: `${urlBase}/users`,
        body: {
          name: `${faker.person.firstName()} ${faker.string.alpha(101)}`,
          email: faker.internet.email(),
          password: usuario.password,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal(
          "name must be shorter than or equal to 100 characters"
        );
      });
    });

    it("Não deve criar usuário com password maior do que 12 caracteres", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/users`,
        body: {
          name: usuario.name,
          email: faker.internet.email(),
          password: faker.internet.password({ length: 13 }),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal(
          "password must be shorter than or equal to 12 characters"
        );
      });
    });

    it("Não deve criar usuário com password vazio", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/users`,
        body: {
          name: usuario.name,
          email: faker.internet.email(),
          password: '',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal(
          "password must be longer than or equal to 6 characters"
        );
      });
    });

    it("Não deve criar usuário com password nulo", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/users`,
        body: {
          name: usuario.name,
          email: faker.internet.email(),
          password: null,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal(
          "password must be longer than or equal to 6 characters"
        );
      });
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

    it("Ao pesquisar não deve exibir usuários deletados", () => {});
  });

  describe("GET - /api/users/{id} - Find user", () => {
    it("Deve encontrar um usuário existente por Id", () => {
      /*cy.request('GET', `https://raromdb-3c39614e42d4.herokuapp.com/api/users/${userId}`)
        .then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.id).to.equal(userId);
        });*/
    });

    it("Deve retornar o payload vazio quando o Id de usuário for inexistente", () => {});
  });

  describe("DELETE - /api/users/{id} - Delete user", () => {
    it("Deve deletar um usuário existente por Id", () => {
      // podemos usar o trecho de código da autenticação
      /*cy.request('DELETE', `https://raromdb-3c39614e42d4.herokuapp.com/api/users/${userId}`)
        .then((response) => {
          expect(response.status).to.equal(200);
        });*/
    });

    it("Deve retornar sucesso ao excluir usuário já excluído", () => {});

    it("Deve retornar erro caso o Id de usuário não seja numérico", () => {});

    it("Deve retornar um erro caso o Id de usuário não seja informado", () => {});
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
      it("Deve retornar erro caso o Id de usuário não seja numérico", () => {});

      it("Deve retornar um erro caso o Id de usuário não seja informado", () => {});

      it("Deve retornar erro caso o nome tenha menos que 1 caracter", () => {});

      it("Deve retornar mensagem de sucesso caso o nome tenha 1 caracter", () => {});

      it("Deve retornar mensagem de sucesso caso o nome tenha entre 1 e 100 caracteres", () => {});

      it("Deve retornar sucesso caso o nome tenha 100 caracteres", () => {});

      it("Deve retornar erro caso o nome tenham mais de 100 caracteres", () => {});
    });
  });

  describe("PATCH - /api/users/apply - promote user to critic", () => {
    it("Deve promover um usuário logado para perfil crítico", () => {
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

    it("Deve retornar mensagem de erro caso o usuário não esteja logado", () => {});
  });

  describe("PATCH - /api/users/admin - promote user to admin", () => {
    it("Deve promover um usuário logado para perfil admin", () => {
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

    it("Deve retornar mensagem de erro caso o usuário não esteja logado", () => {});
  });

  describe("PATCH - /api/users/inactivate - Inactivate user", () => {
    it("Deve promover um usuário logado para perfil inactivate", () => {
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

    it("Deve retornar mensagem de erro caso o usuário não esteja logado", () => {});
  });

  describe("POST - /api/users/review - Review a movie", () => {
    it("Deve enviar uma revisão para um filme existente", () => {
      const dadosReview = {
        userId: 5,
        rating: 4,
        comment: "blablabla!",
      };
    });

    it("Deve retornar erro caso o Id do filme seja inexistente", () => {});

    it("Deve retornar erro caso o score não seja informado", () => {});

    it("Deve retornar erro caso o score seja menor que 1", () => {});
    it("Deve retornar mensagem de sucesso caso o score seja igual a 1", () => {});

    it("Deve retornar mensagem de sucesso caso o score esteja entre 1 e 5", () => {});

    it("Deve retornar mensagem de sucesso caso o score seja igual a 5", () => {});

    it("Deve retornar erro caso o score seja maior do que 5", () => {});
  });

  describe("GET - /api/users/review/all - List reviews", () => {
    it("Deve obter todas as reviews do usuário autenticado", () => {
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

    it("Deve retornar erro caso usuário não esteja autenticado", () => {});

    it("Deve retornar erro caso usuário seja inativo", () => {});
  });
});
