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
  const headers = {
    authorization: "",
  };

  describe("POST - /api/users - Create user", () => {
    it("Deve criar um novo usuário", () => {
      cy.request("POST", `${urlBase}/users`, {
        name: usuario.name,
        email: usuario.email,
        password: usuario.password,
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal(usuario.name);
        expect(response.body.email).to.equal(usuario.email);
        expect(response.body).to.have.property("id");
        expect(typeof response.body.id).to.equal("number");
        expect(response.body).to.have.property("name");
        expect(typeof response.body.name).to.equal("string");
        expect(response.body).to.have.property("email");
        expect(typeof response.body.email).to.equal("string");
        expect(response.body).to.have.property("type");
        expect(typeof response.body.type).to.equal("number");
        expect(response.body).to.have.property("active");
        expect(typeof response.body.active).to.equal("boolean");
        usuario.id = response.body.id;
      });
    });

    it("Pré requisito: Deve autenticar e fazer login com sucesso", () => {
      cy.request("POST", `${urlBase}/auth/login`, {
        email: usuario.email,
        password: usuario.password,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("accessToken");
        headers.authorization = `Bearer ${response.body.accessToken}`;
      });
    });

    it("Pré requisito: Deve alterar o tipo de usuário para admin", () => {
      //Somente usuarios admin possuem permissão para remover outros usuários
      cy.request({
        method: "PATCH",
        url: `${urlBase}/users/admin`,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(204);
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
          name: "",
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
          password: "",
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
      cy.request({
        method: "GET",
        url: `${urlBase}/users`,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(Array.isArray(response.body)).to.equal(true);
        if (response.body.length > 0) {
          expect(response.body[0]).to.have.property("id");
          expect(typeof response.body[0].id).to.equal("number");
          expect(response.body[0]).to.have.property("name");
          expect(typeof response.body[0].name).to.equal("string");
          expect(response.body[0]).to.have.property("email");
          expect(typeof response.body[0].email).to.equal("string");
          expect(response.body[0]).to.have.property("type");
          expect(typeof response.body[0].type).to.equal("number");
          expect(response.body[0]).to.have.property("active");
          expect(typeof response.body[0].active).to.equal("boolean");
        }
      });
    });

    it("Ao pesquisar não deve exibir usuários deletados", () => {
      let novoUsuario;
      let nome = `${faker.person.firstName()} ${faker.person.lastName()}`;
      let email = faker.internet.email();
      let password = faker.internet.password({ length: 12 });

      cy.request("POST", `${urlBase}/users`, {
        name: nome,
        email: email,
        password: password,
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal(nome);
        expect(response.body.email).to.equal(email);
        expect(response.body).to.have.property("id");
        expect(typeof response.body.id).to.equal("number");
        expect(response.body).to.have.property("name");
        expect(typeof response.body.name).to.equal("string");
        expect(response.body).to.have.property("email");
        expect(typeof response.body.email).to.equal("string");
        expect(response.body).to.have.property("type");
        expect(typeof response.body.type).to.equal("number");
        expect(response.body).to.have.property("active");
        expect(typeof response.body.active).to.equal("boolean");
        novoUsuario = response.body;

        cy.request({
          method: "DELETE",
          url: `${urlBase}/users/${novoUsuario.id}`,
          headers: headers,
        }).then((response) => {
          expect(response.status).to.equal(204);

          cy.request({
            method: "GET",
            url: `${urlBase}/users`,
            headers: headers,
          }).then((response) => {
            expect(response.status).to.equal(200);
            expect(Array.isArray(response.body)).to.equal(true);
            if (response.body.length > 0) {
              expect(response.body[0]).to.have.property("id");
              expect(typeof response.body[0].id).to.equal("number");
              expect(response.body[0]).to.have.property("name");
              expect(typeof response.body[0].name).to.equal("string");
              expect(response.body[0]).to.have.property("email");
              expect(typeof response.body[0].email).to.equal("string");
              expect(response.body[0]).to.have.property("type");
              expect(typeof response.body[0].type).to.equal("number");
              expect(response.body[0]).to.have.property("active");
              expect(typeof response.body[0].active).to.equal("boolean");
            }

            const usuarioExiste = response.body.find(
              (x) => x.id == novoUsuario.id
            );
            expect(usuarioExiste).to.equal(undefined);
          });
        });
      });
    });
  });

  describe("GET - /api/users/{id} - Find user", () => {
    it("Deve encontrar um usuário existente por Id", () => {
      cy.request({
        method: "GET",
        url: `${urlBase}/users/${usuario.id}`,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(usuario.name);
        expect(response.body.email).to.equal(usuario.email);
        expect(response.body).to.have.property("id");
        expect(typeof response.body.id).to.equal("number");
        expect(response.body).to.have.property("name");
        expect(typeof response.body.name).to.equal("string");
        expect(response.body).to.have.property("email");
        expect(typeof response.body.email).to.equal("string");
        expect(response.body).to.have.property("type");
        expect(typeof response.body.type).to.equal("number");
        expect(response.body).to.have.property("active");
        expect(typeof response.body.active).to.equal("boolean");
        expect(response.body.id).to.equal(usuario.id);
      });
    });

    it("Deve retornar o payload vazio quando o Id de usuário for inexistente", () => {
      cy.request({
        method: "GET",
        url: `${urlBase}/users/${new Date().getTime()}`,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.equal("");
      });
    });
  });

  describe("DELETE - /api/users/{id} - Delete user", () => {
    let novoUsuario;

    it("Deve deletar um usuário existente por Id", () => {
      let nome = `${faker.person.firstName()} ${faker.person.lastName()}`;
      let email = faker.internet.email();
      let password = faker.internet.password({ length: 12 });

      cy.request("POST", `${urlBase}/users`, {
        name: nome,
        email: email,
        password: password,
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal(nome);
        expect(response.body.email).to.equal(email);
        expect(response.body).to.have.property("id");
        expect(typeof response.body.id).to.equal("number");
        expect(response.body).to.have.property("name");
        expect(typeof response.body.name).to.equal("string");
        expect(response.body).to.have.property("email");
        expect(typeof response.body.email).to.equal("string");
        expect(response.body).to.have.property("type");
        expect(typeof response.body.type).to.equal("number");
        expect(response.body).to.have.property("active");
        expect(typeof response.body.active).to.equal("boolean");
        novoUsuario = response.body;

        cy.request({
          method: "DELETE",
          url: `${urlBase}/users/${novoUsuario.id}`,
          headers: headers,
        }).then((response) => {
          expect(response.status).to.equal(204);
        });
      });
    });

    it("Deve retornar sucesso ao excluir usuário já excluído", () => {
      cy.request({
        method: "DELETE",
        url: `${urlBase}/users/${novoUsuario.id}`,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(204);
      });
    });

    it("Deve retornar erro caso o Id de usuário não seja numérico", () => {
      cy.request({
        method: "DELETE",
        url: `${urlBase}/users/a`,
        headers: headers,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Validation failed (numeric string is expected)"
        );
      });
    });

    it("Deve retornar um erro caso o Id de usuário não seja informado", () => {
      cy.request({
        method: "DELETE",
        url: urlBase + "/users/%20",
        headers: headers,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Validation failed (numeric string is expected)"
        );
      });
    });
  });

  describe("PUT - /api/users/{id} - Update user", () => {
    it("Deve atualizar um usuário existente", () => {
      let nome = `${faker.person.firstName()} ${faker.person.lastName()}`;

      cy.request({
        method: "PUT",
        url: `${urlBase}/users/${usuario.id}`,
        body: {
          name: nome,
          password: usuario.password,
        },
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(nome);
        expect(response.body.email).to.equal(usuario.email);
        expect(response.body).to.have.property("id");
        expect(typeof response.body.id).to.equal("number");
        expect(response.body).to.have.property("name");
        expect(typeof response.body.name).to.equal("string");
        expect(response.body).to.have.property("email");
        expect(typeof response.body.email).to.equal("string");
        expect(response.body).to.have.property("type");
        expect(typeof response.body.type).to.equal("number");
        expect(response.body).to.have.property("active");
        expect(typeof response.body.active).to.equal("boolean");
      });
    });

    it("Deve retornar erro caso o Id de usuário não seja numérico", () => {
      let nome = `${faker.person.firstName()} ${faker.person.lastName()}`;

      cy.request({
        method: "PUT",
        url: `${urlBase}/users/abc`,
        body: {
          name: nome,
          password: usuario.password,
        },
        headers: headers,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Validation failed (numeric string is expected)"
        );
      });
    });

    it("Deve retornar um erro caso o Id de usuário não seja informado", () => {
      let nome = `${faker.person.firstName()} ${faker.person.lastName()}`;

      cy.request({
        method: "PUT",
        url: `${urlBase}/users/%20`,
        body: {
          name: nome,
          password: usuario.password,
        },
        headers: headers,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Validation failed (numeric string is expected)"
        );
      });
    });

    it("Deve retornar erro caso o nome tenha menos que 1 caracter", () => {
      cy.request({
        method: "PUT",
        url: `${urlBase}/users/${usuario.id}`,
        body: {
          name: "",
          password: usuario.password,
        },
        headers: headers,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal(
          "name must be longer than or equal to 1 characters"
        );
      });
    });

    it("Deve retornar mensagem de sucesso caso o nome tenha 1 caracter", () => {
      let nome = `${faker.string.alpha(1)})}`;

      cy.request({
        method: "PUT",
        url: `${urlBase}/users/${usuario.id}`,
        body: {
          name: nome,
          password: usuario.password,
        },
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(nome);
        expect(response.body.email).to.equal(usuario.email);
        expect(response.body).to.have.property("id");
        expect(typeof response.body.id).to.equal("number");
        expect(response.body).to.have.property("name");
        expect(typeof response.body.name).to.equal("string");
        expect(response.body).to.have.property("email");
        expect(typeof response.body.email).to.equal("string");
        expect(response.body).to.have.property("type");
        expect(typeof response.body.type).to.equal("number");
        expect(response.body).to.have.property("active");
        expect(typeof response.body.active).to.equal("boolean");
      });
    });

    it("Deve retornar mensagem de sucesso caso o nome tenha entre 1 e 100 caracteres", () => {
      let nome = `${faker.string.alpha(Math.floor(Math.random() * 100))})}`;

      cy.request({
        method: "PUT",
        url: `${urlBase}/users/${usuario.id}`,
        body: {
          name: nome,
          password: usuario.password,
        },
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(nome);
        expect(response.body.email).to.equal(usuario.email);
        expect(response.body).to.have.property("id");
        expect(typeof response.body.id).to.equal("number");
        expect(response.body).to.have.property("name");
        expect(typeof response.body.name).to.equal("string");
        expect(response.body).to.have.property("email");
        expect(typeof response.body.email).to.equal("string");
        expect(response.body).to.have.property("type");
        expect(typeof response.body.type).to.equal("number");
        expect(response.body).to.have.property("active");
        expect(typeof response.body.active).to.equal("boolean");
      });
    });

    it("Deve retornar sucesso caso o nome tenha 100 caracteres", () => {
      let nome = `${faker.string.alpha(100)}`;

      cy.request({
        method: "PUT",
        url: `${urlBase}/users/${usuario.id}`,
        body: {
          name: nome,
          password: usuario.password,
        },
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(nome);
        expect(response.body.email).to.equal(usuario.email);
        expect(response.body).to.have.property("id");
        expect(typeof response.body.id).to.equal("number");
        expect(response.body).to.have.property("name");
        expect(typeof response.body.name).to.equal("string");
        expect(response.body).to.have.property("email");
        expect(typeof response.body.email).to.equal("string");
        expect(response.body).to.have.property("type");
        expect(typeof response.body.type).to.equal("number");
        expect(response.body).to.have.property("active");
        expect(typeof response.body.active).to.equal("boolean");
      });
    });

    it("Deve retornar erro caso o nome tenham mais de 100 caracteres", () => {
      let nome = `${faker.string.alpha(101)}`;
      cy.request({
        method: "PUT",
        url: `${urlBase}/users/${usuario.id}`,
        body: {
          name: nome,
          password: usuario.password,
        },
        headers: headers,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal(
          "name must be shorter than or equal to 100 characters"
        );
      });
    });
  });

  describe("PATCH - /api/users/apply - promote user to critic", () => {
    it("Deve promover um usuário logado para perfil crítico", () => {
      cy.request({
        method: "PATCH",
        url: `${urlBase}/users/apply`,
        body: {},
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(204);
      });
    });

    it("Deve retornar mensagem de erro caso o usuário não esteja logado", () => {
      cy.request({
        method: "PATCH",
        url: `${urlBase}/users/apply`,
        body: {},
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
      });
    });
  });

  describe("PATCH - /api/users/admin - promote user to admin", () => {
    it("Deve promover um usuário logado para perfil admin", () => {
      cy.request({
        method: "PATCH",
        url: `${urlBase}/users/admin`,
        body: {},
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(204);
      });
    });

    it("Deve retornar mensagem de erro caso o usuário não esteja logado", () => {
      cy.request({
        method: "PATCH",
        url: `${urlBase}/users/admin`,
        body: {},
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
      });
    });
  });

  describe("PATCH - /api/users/inactivate - Inactivate user", () => {
    it("Deve promover um usuário logado para perfil inactivate", () => {
      let nome = `${faker.person.firstName()} ${faker.person.lastName()}`;
      let email = faker.internet.email();
      let password = faker.internet.password({ length: 12 });

      // Criar usuário
      cy.request("POST", `${urlBase}/users`, {
        name: nome,
        email: email,
        password: password,
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal(nome);
        expect(response.body.email).to.equal(email);
        expect(response.body).to.have.property("id");
        expect(typeof response.body.id).to.equal("number");
        expect(response.body).to.have.property("name");
        expect(typeof response.body.name).to.equal("string");
        expect(response.body).to.have.property("email");
        expect(typeof response.body.email).to.equal("string");
        expect(response.body).to.have.property("type");
        expect(typeof response.body.type).to.equal("number");
        expect(response.body).to.have.property("active");
        expect(typeof response.body.active).to.equal("boolean");

        // Fazer login
        cy.request("POST", `${urlBase}/auth/login`, {
          email: email,
          password: password,
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property("accessToken");

          // Inativar usuário
          cy.request({
            method: "PATCH",
            url: `${urlBase}/users/inactivate`,
            body: {},
            headers: { authorization: `Bearer ${response.body.accessToken}` },
          }).then((response) => {
            expect(response.status).to.equal(204);
          });
        });
      });
    });

    it("Deve retornar mensagem de erro caso o usuário não esteja logado", () => {
      cy.request({
        method: "PATCH",
        url: `${urlBase}/users/inactivate`,
        body: {},
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
      });
    });
  });

  describe("POST - /api/users/review - Review a movie", () => {
    let filme;

    it("Deve enviar uma revisão para um filme existente", () => {
      let nomeFilme = `${faker.person.firstName()} ${faker.person.lastName()} parte ${Math.floor(
        Math.random() * 10
      )}`;

      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: nomeFilme,
          genre: "ação",
          description: faker.lorem.paragraph(),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: Math.floor(Math.random() * 2024),
        },
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(201);
      });

      // Buscar o ID do filme recém criado
      cy.request({
        method: "GET",
        url: `${urlBase}/movies/search?title=${nomeFilme}`,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body[0]).to.have.property("id");
        expect(typeof response.body[0].id).to.equal("number");

        filme = response.body[0];

        // Enviar review
        cy.request({
          method: "POST",
          url: `${urlBase}/users/review`,
          body: {
            movieId: filme.id,
            score: 3,
            reviewText: faker.lorem.paragraph(),
          },
          headers: headers,
        }).then((response) => {
          expect(response.status).to.equal(201);
        });
      });
    });

    it("Deve retornar erro caso o Id do filme seja inexistente", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/users/review`,
        body: {
          movieId: new Date().getTime(),
          score: 3,
          reviewText: faker.lorem.paragraph(),
        },
        headers: headers,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.body.message).to.equal("Movie not found");
      });
    });

    it("Deve retornar erro caso o score não seja informado", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/users/review`,
        body: {
          movieId: new Date().getTime(),
          score: "%20",
          reviewText: faker.lorem.paragraph(),
        },
        headers: headers,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.body.message[0]).to.equal(
          "score must be a number conforming to the specified constraints"
        );
      });
    });

    it("Deve retornar erro caso o score seja menor que 1", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/users/review`,
        body: {
          movieId: new Date().getTime(),
          score: 0,
          reviewText: faker.lorem.paragraph(),
        },
        headers: headers,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.body.message).to.equal(
          "Score should be between 1 and 5"
        );
      });
    });

    it("Deve retornar mensagem de sucesso caso o score seja igual a 1", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/users/review`,
        body: {
          movieId: filme.id,
          score: 1,
          reviewText: faker.lorem.paragraph(),
        },
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(201);
      });
    });

    it("Deve retornar mensagem de sucesso caso o score esteja entre 1 e 5", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/users/review`,
        body: {
          movieId: filme.id,
          score: 4,
          reviewText: faker.lorem.paragraph(),
        },
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(201);
      });
    });

    it("Deve retornar mensagem de sucesso caso o score seja igual a 5", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/users/review`,
        body: {
          movieId: filme.id,
          score: 5,
          reviewText: faker.lorem.paragraph(),
        },
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(201);
      });
    });

    it("Deve retornar erro caso o score seja maior do que 5", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/users/review`,
        body: {
          movieId: new Date().getTime(),
          score: 6,
          reviewText: faker.lorem.paragraph(),
        },
        headers: headers,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.body.message).to.equal(
          "Score should be between 1 and 5"
        );
      });
    });
  });

  describe("GET - /api/users/review/all - List reviews", () => {
    it("Deve obter todas as reviews do usuário autenticado", () => {
      cy.request({
        method: "GET",
        url: `${urlBase}/users/review/all`,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(Array.isArray(response.body)).to.equal(true);
        if (response.body.length > 0) {
          expect(response.body[0]).to.have.property("id");
          expect(typeof response.body[0].id).to.equal("number");
          expect(response.body[0]).to.have.property("movieId");
          expect(typeof response.body[0].movieId).to.equal("number");
          expect(response.body[0]).to.have.property("movieTitle");
          expect(typeof response.body[0].movieTitle).to.equal("string");
          expect(response.body[0]).to.have.property("reviewText");
          expect(typeof response.body[0].reviewText).to.equal("string");
          expect(response.body[0]).to.have.property("reviewType");
          expect(typeof response.body[0].reviewType).to.equal("number");
          expect(response.body[0]).to.have.property("score");
          expect(typeof response.body[0].score).to.equal("number");
        }
      });
    });

    it("Deve retornar erro caso usuário não esteja autenticado", () => {
      cy.request({
        method: "GET",
        url: `${urlBase}/users/review/all`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
      });
    });

    it("Deve retornar erro caso usuário seja inativo", () => {
      let nome = `${faker.person.firstName()} ${faker.person.lastName()}`;
      let email = faker.internet.email();
      let password = faker.internet.password({ length: 12 });
      let headerUsuarioInativo =
        // Criar usuário
        cy
          .request("POST", `${urlBase}/users`, {
            name: nome,
            email: email,
            password: password,
          })
          .then((response) => {
            expect(response.status).to.equal(201);
            expect(response.body.name).to.equal(nome);
            expect(response.body.email).to.equal(email);
            expect(response.body).to.have.property("id");
            expect(typeof response.body.id).to.equal("number");
            expect(response.body).to.have.property("name");
            expect(typeof response.body.name).to.equal("string");
            expect(response.body).to.have.property("email");
            expect(typeof response.body.email).to.equal("string");
            expect(response.body).to.have.property("type");
            expect(typeof response.body.type).to.equal("number");
            expect(response.body).to.have.property("active");
            expect(typeof response.body.active).to.equal("boolean");

            // Fazer login
            cy.request("POST", `${urlBase}/auth/login`, {
              email: email,
              password: password,
            }).then((response) => {
              expect(response.status).to.equal(200);
              expect(response.body).to.have.property("accessToken");

              headerUsuarioInativo = {
                authorization: `Bearer ${response.body.accessToken}`,
              };

              // Inativar usuário
              cy.request({
                method: "PATCH",
                url: `${urlBase}/users/inactivate`,
                body: {},
                headers: headerUsuarioInativo,
              }).then((response) => {
                expect(response.status).to.equal(204);

                // Retornar erro: usuário inativado
                cy.request({
                  method: "GET",
                  url: `${urlBase}/users/review/all`,
                  headers: headerUsuarioInativo,
                  failOnStatusCode: false,
                }).then((response) => {
                  expect(response.status).to.equal(401);
                });
              });
            });
          });
    });
  });
});
