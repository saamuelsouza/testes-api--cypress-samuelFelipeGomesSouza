/// <reference types= "cypress"/>

describe("Autenticação e Login", () => {
  const { faker } = require("@faker-js/faker");
  const urlBase = "https://raromdb-3c39614e42d4.herokuapp.com/api";
  const usuario = {
    id: 0,
    email: "",
    password: "",
  };
  const headers = {
    authorization: "",
  };

  it("Deve criar um usuário para execução dos demais testes", () => {
    // Criar usuário para execução de testes
    const password = faker.internet.password({ length: 12 });
    const email = faker.internet.email();
    const nome = `${faker.person.firstName()} ${faker.person.lastName()}`;
    cy.request("POST", `${urlBase}/users`, {
      name: nome,
      email: email,
      password: password,
    }).then((response) => {
      usuario.id = response.body.id;
      usuario.email = response.body.email;
      usuario.password = password;
    });
  });

  it("Deve autenticar e fazer login com sucesso", () => {
    cy.request("POST", `${urlBase}/auth/login`, {
      email: usuario.email,
      password: usuario.password,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("accessToken");
      headers.authorization = `Bearer ${response.body.accessToken}`;
    });
  });

  it("Não deve fazer login com credenciais inválidas", () => {
    cy.request({
      method: "POST",
      url: `${urlBase}/auth/login`,
      body: {
        email: usuario.email,
        password: "temquedarruim123",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(401);
      expect(response.body).to.have.property("error", "Unauthorized");
    });
  });

  it("Deve alterar o tipo de usuário para admin", () => {
    //Somente usuarios admin possuem permissão para remover outros usuários
    cy.request({
      method: "PATCH",
      url: `${urlBase}/users/admin`,
      headers: headers,
    }).then((response) => {
      expect(response.status).to.equal(204);
    });
  });

  it('Não deve ser possível autenticar usuário inativo', () => {
    //TODO: Escrever teste
  });

  it("Deve remover o usuário da base de dados", () => {
    //Limpar base de usuários desnecessários
    cy.request({
      method: "DELETE",
      url: `${urlBase}/users/${usuario.id}`,
      headers: headers,
    }).then((response) => {
      expect(response.status).to.equal(204);
    });
  });
});
