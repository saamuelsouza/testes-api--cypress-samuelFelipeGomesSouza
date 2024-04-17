/// <reference types= "cypress"/>

describe("Cenários de testes do recurso Users", () => {
  const { faker } = require("@faker-js/faker");
  const urlBase = "https://raromdb-3c39614e42d4.herokuapp.com/api";
  const headers = {
    authorization: "",
  };
  const nomeFilme = `${faker.person.firstName()} ${faker.person.lastName()} parte ${Math.floor(
    Math.random() * 10
  )}`;

  describe("GET - /api/movies - List movies", () => {
    it("Deve consultar a lista de filmes com sucesso sem autenticação", () => {
      cy.request({
        method: "GET",
        url: `${urlBase}/movies`,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(Array.isArray(response.body)).to.equal(true);

        if (response.body.length > 0) {
          expect(response.body[0]).to.have.property("id");
          expect(typeof response.body[0].id).to.equal("number");
          expect(response.body[0]).to.have.property("title");
          expect(typeof response.body[0].title).to.equal("string");
          expect(response.body[0]).to.have.property("genre");
          expect(typeof response.body[0].genre).to.equal("string");
          expect(response.body[0]).to.have.property("description");
          expect(typeof response.body[0].description).to.equal("string");
          expect(response.body[0]).to.have.property("totalRating");
          expect(response.body[0]).to.have.property("durationInMinutes");
          expect(typeof response.body[0].durationInMinutes).to.equal("number");
          expect(response.body[0]).to.have.property("releaseYear");
          expect(typeof response.body[0].releaseYear).to.equal("number");
        }
      });
    });
    it("Deve consultar a lista de filmes com sucesso ordenadas por rating", () => {
      // Ratting está sempre null, indica um possível erro na API
      cy.request({
        method: "GET",
        url: `${urlBase}/movies?sort=true`,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(Array.isArray(response.body)).to.equal(true);

        if (response.body.length > 0) {
          expect(response.body[0]).to.have.property("id");
          expect(typeof response.body[0].id).to.equal("number");
          expect(response.body[0]).to.have.property("title");
          expect(typeof response.body[0].title).to.equal("string");
          expect(response.body[0]).to.have.property("genre");
          expect(typeof response.body[0].genre).to.equal("string");
          expect(response.body[0]).to.have.property("description");
          expect(typeof response.body[0].description).to.equal("string");
          expect(response.body[0]).to.have.property("totalRating");
          expect(response.body[0]).to.have.property("durationInMinutes");
          expect(typeof response.body[0].durationInMinutes).to.equal("number");
          expect(response.body[0]).to.have.property("releaseYear");
          expect(typeof response.body[0].releaseYear).to.equal("number");
        }
      });
    });
  });

  describe("POST - /api/movies - Create a new movie", () => {
    it("Pre-requisito: Deve criar um usuário para execução dos demais testes", () => {
      // Criar usuário para execução de testes
      const password = faker.internet.password({ length: 12 });
      const email = faker.internet.email();
      const nome = `${faker.person.firstName()} ${faker.person.lastName()}`;

      // Criar usuário para seguir com os testes
      cy.request("POST", `${urlBase}/users`, {
        name: nome,
        email: email,
        password: password,
      }).then((response) => {
        // Faz o login
        cy.request("POST", `${urlBase}/auth/login`, {
          email: email,
          password: password,
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property("accessToken");
          headers.authorization = `Bearer ${response.body.accessToken}`;

          // Altera perfil para Admin
          cy.request({
            method: "PATCH",
            url: `${urlBase}/users/admin`,
            headers: headers,
          }).then((response) => {
            expect(response.status).to.equal(204);
          });
        });
      });
    });

    it("Deve criar um novo filme com sucesso mesmo que com o título repetido", () => {
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
    });

    it("Deve retornar erro quando o campo releaseYear for nulo", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: nomeFilme,
          genre: "ação",
          description: faker.lorem.paragraph(),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: null,
        },
        failOnStatusCode: false,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal(
          "releaseYear must be a number conforming to the specified constraints"
        );
      });
    });

    it("Deve retornar erro quando o campo releaseYear for vazio", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: nomeFilme,
          genre: "ação",
          description: faker.lorem.paragraph(),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: "",
        },
        failOnStatusCode: false,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal(
          "releaseYear must be a number conforming to the specified constraints"
        );
      });
    });

    it("Deve retornar erro quando o campo releaseYear for diferente de valor numérico", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: nomeFilme,
          genre: "ação",
          description: faker.lorem.paragraph(),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: "abc",
        },
        failOnStatusCode: false,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal(
          "releaseYear must be a number conforming to the specified constraints"
        );
      });
    });

    it("Deve retornar erro quando durationInMinutes for diferente de numérico", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: nomeFilme,
          genre: "ação",
          description: faker.lorem.paragraph(),
          durationInMinutes: "abc",
          releaseYear: Math.floor(Math.random() * 2024),
        },
        failOnStatusCode: false,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal(
          "durationInMinutes must be a number conforming to the specified constraints"
        );
      });
    });

    it("Deve retornar erro quando o campo durationInMinutes for nulo", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: nomeFilme,
          genre: "ação",
          description: faker.lorem.paragraph(),
          durationInMinutes: null,
          releaseYear: Math.floor(Math.random() * 2024),
        },
        failOnStatusCode: false,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal(
          "durationInMinutes must be a number conforming to the specified constraints"
        );
      });
    });

    it("Deve retornar erro quando o campo durationInMinutes for vazio", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: nomeFilme,
          genre: "ação",
          description: faker.lorem.paragraph(),
          durationInMinutes: "",
          releaseYear: Math.floor(Math.random() * 2024),
        },
        failOnStatusCode: false,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal(
          "durationInMinutes must be a number conforming to the specified constraints"
        );
      });
    });

    it("Deve retornar erro caso o campo title tenha menos que 1 caracter", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: "",
          genre: "ação",
          description: faker.lorem.paragraph(),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: Math.floor(Math.random() * 2024),
        },
        failOnStatusCode: false,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal(
          "title must be longer than or equal to 1 characters"
        );
      });
    });

    it("Deve retornar mensagem de sucesso caso o campo title tenha 1 caracter", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: faker.string.alpha(1),
          genre: "ação",
          description: faker.lorem.paragraph(),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: Math.floor(Math.random() * 2024),
        },
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(201);
      });
    });

    it("Deve retornar mensagem de sucesso caso o campo title tenha entre 1 e 100 caracteres", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: faker.string.alpha(98),
          genre: "ação",
          description: faker.lorem.paragraph(),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: Math.floor(Math.random() * 2024),
        },
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(201);
      });
    });

    it("Deve retornar sucesso caso o campo title tenha 100 caracteres", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: faker.string.alpha(100),
          genre: "ação",
          description: faker.lorem.paragraph(),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: Math.floor(Math.random() * 2024),
        },
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(201);
      });
    });

    it("Deve retornar erro caso o campo title tenham mais de 100 caracteres", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: faker.string.alpha(101),
          genre: "ação",
          description: faker.lorem.paragraph(),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: Math.floor(Math.random() * 2024),
        },
        failOnStatusCode: false,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal(
          "title must be shorter than or equal to 100 characters"
        );
      });
    });

    it("Deve retornar erro caso o campo genre tenha menos que 1 caracter", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: faker.string.alpha(100),
          genre: "",
          description: faker.lorem.paragraph(),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: Math.floor(Math.random() * 2024),
        },
        failOnStatusCode: false,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal(
          "genre must be longer than or equal to 1 characters"
        );
      });
    });

    it("Deve retornar mensagem de sucesso caso o campo genre tenha 1 caracter", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: faker.string.alpha(100),
          genre: "a",
          description: faker.lorem.paragraph(),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: Math.floor(Math.random() * 2024),
        },
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(201);
      });
    });

    it("Deve retornar mensagem de sucesso caso o campo genre tenha entre 1 e 100 caracteres", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: faker.string.alpha(100),
          genre: faker.string.alpha(98),
          description: faker.lorem.paragraph(),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: Math.floor(Math.random() * 2024),
        },
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(201);
      });
    });

    it("Deve retornar sucesso caso o campo genre tenha 100 caracteres", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: faker.string.alpha(100),
          genre: faker.string.alpha(100),
          description: faker.lorem.paragraph(),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: Math.floor(Math.random() * 2024),
        },
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(201);
      });
    });

    it("Deve retornar erro caso o campo genre tenham mais de 100 caracteres", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: faker.string.alpha(100),
          genre: faker.string.alpha(101),
          description: faker.lorem.paragraph(),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: Math.floor(Math.random() * 2024),
        },
        failOnStatusCode: false,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal(
          "genre must be shorter than or equal to 100 characters"
        );
      });
    });

    it("Deve retornar erro caso o campo description tenha menos que 1 caracter", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: faker.string.alpha(100),
          genre: faker.string.alpha(100),
          description: "",
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: Math.floor(Math.random() * 2024),
        },
        failOnStatusCode: false,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal(
          "description must be longer than or equal to 1 characters"
        );
      });
    });

    it("Deve retornar mensagem de sucesso caso o campo description tenha 1 caracter", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: faker.string.alpha(100),
          genre: faker.string.alpha(100),
          description: faker.string.alpha(1),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: Math.floor(Math.random() * 2024),
        },
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(201);
      });
    });

    it("Deve retornar mensagem de sucesso caso o campo description tenha entre 1 e 500 caracteres", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: faker.string.alpha(100),
          genre: faker.string.alpha(100),
          description: faker.string.alpha(498),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: Math.floor(Math.random() * 2024),
        },
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(201);
      });
    });

    it("Deve retornar sucesso caso o campo description tenha 500 caracteres", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: faker.string.alpha(100),
          genre: faker.string.alpha(100),
          description: faker.string.alpha(500),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: Math.floor(Math.random() * 2024),
        },
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(201);
      });
    });

    it("Deve retornar erro caso o campo description tenham mais de 500 caracteres", () => {
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: faker.string.alpha(100),
          genre: faker.string.alpha(100),
          description: faker.string.alpha(501),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: Math.floor(Math.random() * 2024),
        },
        failOnStatusCode: false,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message[0]).to.equal(
          "description must be shorter than or equal to 500 characters"
        );
      });
    });
  });

  describe('GET - /api/movies/search - Search movie"', () => {
    //TODO: Verificar qual o Bug informado no discord e criar os testes para validação
    it("Deve buscar um filme com sucesso sem autenticação", () => {
      cy.request({
        method: "GET",
        url: `${urlBase}/movies/search?title=${nomeFilme}`,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(Array.isArray(response.body)).to.equal(true);

        if (response.body.length > 0) {
          expect(response.body[0]).to.have.property("id");
          expect(typeof response.body[0].id).to.equal("number");
          expect(response.body[0]).to.have.property("title");
          expect(typeof response.body[0].title).to.equal("string");
          expect(response.body[0]).to.have.property("genre");
          expect(typeof response.body[0].genre).to.equal("string");
          expect(response.body[0]).to.have.property("description");
          expect(typeof response.body[0].description).to.equal("string");
          expect(response.body[0]).to.have.property("totalRating");
          expect(response.body[0]).to.have.property("durationInMinutes");
          expect(typeof response.body[0].durationInMinutes).to.equal("number");
          expect(response.body[0]).to.have.property("releaseYear");
          expect(typeof response.body[0].releaseYear).to.equal("number");
        }
      });
    });

    it("Deve permitir consultas sem indicar o title do filme", () => {
      //Existe diferença entre o Swagger e o comportamento da API
      //O Swagger obriga a utilização do title do filme, porém a API permite consulta sem indicação do title

      cy.request({
        method: "GET",
        url: `${urlBase}/movies/search?title=`,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(Array.isArray(response.body)).to.equal(true);

        if (response.body.length > 0) {
          expect(response.body[0]).to.have.property("id");
          expect(typeof response.body[0].id).to.equal("number");
          expect(response.body[0]).to.have.property("title");
          expect(typeof response.body[0].title).to.equal("string");
          expect(response.body[0]).to.have.property("genre");
          expect(typeof response.body[0].genre).to.equal("string");
          expect(response.body[0]).to.have.property("description");
          expect(typeof response.body[0].description).to.equal("string");
          expect(response.body[0]).to.have.property("totalRating");
          expect(response.body[0]).to.have.property("durationInMinutes");
          expect(typeof response.body[0].durationInMinutes).to.equal("number");
          expect(response.body[0]).to.have.property("releaseYear");
          expect(typeof response.body[0].releaseYear).to.equal("number");
        }
      });
    });
  });

  describe("GET - /api/movies/{Id} - Find movie", () => {
    it("Deve encontrar um movie existente por Id", () => {
      const nomeFilme = faker.string.alpha(100);
      let filme;

      // Criar um filme
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: nomeFilme,
          genre: faker.string.alpha(100),
          description: faker.string.alpha(500),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: Math.floor(Math.random() * 2024),
        },
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(201);

        // Buscar o filme criado para obter o id
        cy.request({
          method: "GET",
          url: `${urlBase}/movies/search?title=${nomeFilme}`,
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(Array.isArray(response.body)).to.equal(true);

          if (response.body.length > 0) {
            expect(response.body[0]).to.have.property("id");
            expect(typeof response.body[0].id).to.equal("number");
            expect(response.body[0]).to.have.property("title");
            expect(typeof response.body[0].title).to.equal("string");
            expect(response.body[0]).to.have.property("genre");
            expect(typeof response.body[0].genre).to.equal("string");
            expect(response.body[0]).to.have.property("description");
            expect(typeof response.body[0].description).to.equal("string");
            expect(response.body[0]).to.have.property("totalRating");
            expect(response.body[0]).to.have.property("durationInMinutes");
            expect(typeof response.body[0].durationInMinutes).to.equal(
              "number"
            );
            expect(response.body[0]).to.have.property("releaseYear");
            expect(typeof response.body[0].releaseYear).to.equal("number");

            filme = response.body[0];

            // Buscar filme por id
            cy.request({
              method: "GET",
              url: `${urlBase}/movies/${filme.id}`,
            }).then((response) => {
              expect(response.status).to.equal(200);

              expect(response.body).to.have.property("id");
              expect(typeof response.body.id).to.equal("number");

              expect(response.body).to.have.property("title");
              expect(typeof response.body.title).to.equal("string");

              expect(response.body).to.have.property("genre");
              expect(typeof response.body.genre).to.equal("string");

              expect(response.body).to.have.property("description");
              expect(typeof response.body.description).to.equal("string");

              expect(response.body).to.have.property("durationInMinutes");
              expect(typeof response.body.durationInMinutes).to.equal("number");

              expect(response.body).to.have.property("releaseYear");
              expect(typeof response.body.releaseYear).to.equal("number");

              expect(response.body).to.have.property("criticScore");
              expect(typeof response.body.criticScore).to.equal("number");

              expect(response.body).to.have.property("audienceScore");
              expect(typeof response.body.audienceScore).to.equal("number");

              expect(Array.isArray(response.body.reviews)).to.equal(true);
            });
          }
        });
      });
    });

    it("Deve retornar o payload vazio quando o Id de movie for inexistente", () => {
      cy.request({
        method: "GET",
        url: `${urlBase}/movies/${new Date().getTime()}`,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.equal("");
      });
    });

    it("Deve retornar erro quando o Id for uma string não numérica", () => {
      cy.request({
        method: "GET",
        url: `${urlBase}/movies/asd`,
        failOnStatusCode: false,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Validation failed (numeric string is expected)"
        );
      });
    });

    it("Deve retornar erro quando o Id for nulo", () => {
      cy.request({
        method: "GET",
        url: `${urlBase}/movies/null`,
        failOnStatusCode: false,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Validation failed (numeric string is expected)"
        );
      });
    });

    it("Deve retornar erro quando o Id for vazio", () => {
      cy.request({
        method: "GET",
        url: `${urlBase}/movies/%20`,
        failOnStatusCode: false,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Validation failed (numeric string is expected)"
        );
      });
    });
  });

  describe("DELETE - /api/movies/{id} - Delete movie", () => {
    it("Deve deletar um movie existente por Id", () => {
      const nomeFilme = faker.string.alpha(100);
      let filme;

      // Criar um filme
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: nomeFilme,
          genre: faker.string.alpha(100),
          description: faker.string.alpha(500),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: Math.floor(Math.random() * 2024),
        },
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(201);

        // Buscar o filme criado para obter o id
        cy.request({
          method: "GET",
          url: `${urlBase}/movies/search?title=${nomeFilme}`,
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(Array.isArray(response.body)).to.equal(true);

          if (response.body.length > 0) {
            expect(response.body[0]).to.have.property("id");
            expect(typeof response.body[0].id).to.equal("number");
            expect(response.body[0]).to.have.property("title");
            expect(typeof response.body[0].title).to.equal("string");
            expect(response.body[0]).to.have.property("genre");
            expect(typeof response.body[0].genre).to.equal("string");
            expect(response.body[0]).to.have.property("description");
            expect(typeof response.body[0].description).to.equal("string");
            expect(response.body[0]).to.have.property("totalRating");
            expect(response.body[0]).to.have.property("durationInMinutes");
            expect(typeof response.body[0].durationInMinutes).to.equal(
              "number"
            );
            expect(response.body[0]).to.have.property("releaseYear");
            expect(typeof response.body[0].releaseYear).to.equal("number");

            filme = response.body[0];

            // Remover o filme por ID
            cy.request({
              method: "DELETE",
              url: `${urlBase}/movies/${filme.id}`,
              headers: headers,
            }).then((response) => {
              expect(response.status).to.equal(204);
            });
          }
        });
      });
    });

    it("Deve retornar sucesso ao excluir movie já excluído", () => {
      const nomeFilme = faker.string.alpha(100);
      let filme;

      // Criar um filme
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: nomeFilme,
          genre: faker.string.alpha(100),
          description: faker.string.alpha(500),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: Math.floor(Math.random() * 2024),
        },
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(201);

        // Buscar o filme criado para obter o id
        cy.request({
          method: "GET",
          url: `${urlBase}/movies/search?title=${nomeFilme}`,
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(Array.isArray(response.body)).to.equal(true);

          if (response.body.length > 0) {
            expect(response.body[0]).to.have.property("id");
            expect(typeof response.body[0].id).to.equal("number");
            expect(response.body[0]).to.have.property("title");
            expect(typeof response.body[0].title).to.equal("string");
            expect(response.body[0]).to.have.property("genre");
            expect(typeof response.body[0].genre).to.equal("string");
            expect(response.body[0]).to.have.property("description");
            expect(typeof response.body[0].description).to.equal("string");
            expect(response.body[0]).to.have.property("totalRating");
            expect(response.body[0]).to.have.property("durationInMinutes");
            expect(typeof response.body[0].durationInMinutes).to.equal(
              "number"
            );
            expect(response.body[0]).to.have.property("releaseYear");
            expect(typeof response.body[0].releaseYear).to.equal("number");

            filme = response.body[0];

            // Remover o filme por ID
            cy.request({
              method: "DELETE",
              url: `${urlBase}/movies/${filme.id}`,
              headers: headers,
            }).then((response) => {
              expect(response.status).to.equal(204);

              // Remover o filme por ID novamente
              cy.request({
                method: "DELETE",
                url: `${urlBase}/movies/${filme.id}`,
                headers: headers,
              }).then((response) => {
                expect(response.status).to.equal(204);
              });
            });
          }
        });
      });
    });

    it("Deve retornar erro caso o Id de movie não seja numérico", () => {
      cy.request({
        method: "DELETE",
        url: `${urlBase}/movies/abc`,
        failOnStatusCode: false,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Validation failed (numeric string is expected)"
        );
      });
    });

    it("Deve retornar um erro caso o Id de movie não seja informado", () => {
      cy.request({
        method: "DELETE",
        url: `${urlBase}/movies/`,
        failOnStatusCode: false,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal("Cannot DELETE /api/movies/");
      });
    });
  });

  describe("PUT - /api/movies/{id} - Update movie", () => {
    let filme;

    it("Pre-requisito: Criar um Filme", () => {
      const nomeFilme = faker.string.alpha(100);
      // Criar um filme
      cy.request({
        method: "POST",
        url: `${urlBase}/movies`,
        body: {
          title: nomeFilme,
          genre: faker.string.alpha(100),
          description: faker.string.alpha(500),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: Math.floor(Math.random() * 2024),
        },
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(201);

        // Buscar o filme criado para obter o id
        cy.request({
          method: "GET",
          url: `${urlBase}/movies/search?title=${nomeFilme}`,
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(Array.isArray(response.body)).to.equal(true);

          if (response.body.length > 0) {
            expect(response.body[0]).to.have.property("id");
            expect(typeof response.body[0].id).to.equal("number");
            expect(response.body[0]).to.have.property("title");
            expect(typeof response.body[0].title).to.equal("string");
            expect(response.body[0]).to.have.property("genre");
            expect(typeof response.body[0].genre).to.equal("string");
            expect(response.body[0]).to.have.property("description");
            expect(typeof response.body[0].description).to.equal("string");
            expect(response.body[0]).to.have.property("totalRating");
            expect(response.body[0]).to.have.property("durationInMinutes");
            expect(typeof response.body[0].durationInMinutes).to.equal(
              "number"
            );
            expect(response.body[0]).to.have.property("releaseYear");
            expect(typeof response.body[0].releaseYear).to.equal("number");

            filme = response.body[0];
          }
        });
      });
    });

    it("Deve atualizar um movie existente", () => {
      cy.request({
        method: "PUT",
        url: `${urlBase}/movies/${filme.id}`,
        body: {
          title: faker.string.alpha(100),
          genre: faker.string.alpha(100),
          description: faker.string.alpha(500),
          durationInMinutes: Math.floor(Math.random() * 180),
          releaseYear: Math.floor(Math.random() * 2024),
        },
        headers: headers,
      });
    });

    it("Deve retornar erro caso o Id de movie não seja numérico", () => {
      cy.request({
        method: "PUT",
        url: `${urlBase}/movies/abc`,
        failOnStatusCode: false,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Validation failed (numeric string is expected)"
        );
      });
    });

    it("Deve retornar um erro caso o Id de movie não seja informado", () => {
      cy.request({
        method: "PUT",
        url: `${urlBase}/movies/`,
        failOnStatusCode: false,
        headers: headers,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal("Cannot PUT /api/movies/");
      });
    });
  });
});