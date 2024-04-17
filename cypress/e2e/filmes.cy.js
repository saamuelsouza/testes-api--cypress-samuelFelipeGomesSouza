/// <reference types= "cypress"/>

describe("Cenários de testes do recurso Movies", () => {
  describe("GET - /api/movies - List movies", () => {
    it("Deve consultar a lista de filmes com sucesso sem autenticação", () => {});

    it("Deve consultar a lista de filmes com sucesso ordenadas por rating", () => {});
  });

  describe("POST - /api/movies - Create a new movie", () => {
    it("Deve criar um novo filme com sucesso", () => {});

    it("Deve criar um novo filme com sucesso mesmo que com o título repetido", () => {});

    it("Deve retornar erro quando o campo releaseYear for nulo", () => {});

    it("Deve retornar erro quando o campo releaseYear for vazio", () => {});

    it("Deve retornar erro quando o campo releaseYear for diferente de valor numérico", () => {});

    it("Deve retornar erro quando durationInMinutes for diferente de numérico", () => {});

    it("Deve retornar erro quando o campo durationInMinutes for nulo", () => {});

    it("Deve retornar erro quando o campo durationInMinutes for vazio", () => {});

    it("Deve retornar erro caso o campo title tenha menos que 1 caracter", () => {});

    it("Deve retornar mensagem de sucesso caso o campo title tenha 1 caracter", () => {});

    it("Deve retornar mensagem de sucesso caso o campo title tenha entre 1 e 100 caracteres", () => {});

    it("Deve retornar sucesso caso o campo title tenha 100 caracteres", () => {});

    it("Deve retornar erro caso o campo title tenham mais de 100 caracteres", () => {});

    it("Deve retornar erro caso o campo genre tenha menos que 1 caracter", () => {});

    it("Deve retornar mensagem de sucesso caso o campo genre tenha 1 caracter", () => {});

    it("Deve retornar mensagem de sucesso caso o campo genre tenha entre 1 e 100 caracteres", () => {});

    it("Deve retornar sucesso caso o campo genre tenha 100 caracteres", () => {});

    it("Deve retornar erro caso o campo genre tenham mais de 100 caracteres", () => {});

    it("Deve retornar erro caso o campo description tenha menos que 1 caracter", () => {});

    it("Deve retornar mensagem de sucesso caso o campo description tenha 1 caracter", () => {});

    it("Deve retornar mensagem de sucesso caso o campo description tenha entre 1 e 100 caracteres", () => {});

    it("Deve retornar sucesso caso o campo description tenha 100 caracteres", () => {});

    it("Deve retornar erro caso o campo description tenham mais de 100 caracteres", () => {});
  });

  describe('GET - /api/movies/search - Search movie"', () => {
    //TODO: Verificar qual o Bug informado no discord e criar os testes para validação
    it("Deve consultar a lista de filmes com sucesso sem autenticação", () => {});
    it("Deve permitir consultas sem indicar o title do filme", () => {
      //Existe diferença entre o Swagger e o comportamento da API
      //O Swagger obriga a utilização do title do filme, porém a API permite consulta sem indicação do title
    });
  });

  describe("GET - /api/movies/{Id} - Find movie", () => {
    it("Deve encontrar um movie existente por Id", () => {});

    it("Deve retornar o payload vazio quando o Id de movie for inexistente", () => {});

    it("Deve retornar erro quando o Id for uma string não numérica", () => {});

    it("Deve retornar erro quando o Id for nulo", () => {});

    it("Deve retornar erro quando o Id for vazio", () => {});
  });

  describe("DELETE - /api/movies/{id} - Delete movie", () => {
    it("Deve deletar um movie existente por Id", () => {});

    it("Deve retornar sucesso ao excluir movie já excluído", () => {});

    it("Deve retornar erro caso o Id de movie não seja numérico", () => {});

    it("Deve retornar um erro caso o Id de movie não seja informado", () => {});
  });

  describe("PUT - /api/movies/{id} - Update movie", () => {
      it("Deve atualizar um movie existente", () => {});
      
      it("Deve retornar erro caso o Id de movie não seja numérico", () => {});

      it("Deve retornar um erro caso o Id de movie não seja informado", () => {});

      it("Deve retornar erro caso o title tenha menos que 1 caracter", () => {});

      it("Deve retornar erro quando o campo releaseYear for nulo", () => {});

      it("Deve retornar erro quando o campo releaseYear for vazio", () => {});

      it("Deve retornar erro quando o campo releaseYear for diferente de valor numérico", () => {});

      it("Deve retornar erro quando durationInMinutes for diferente de numérico", () => {});

      it("Deve retornar erro quando o campo durationInMinutes for nulo", () => {});

      it("Deve retornar erro quando o campo durationInMinutes for vazio", () => {});

      it("Deve retornar erro caso o campo title tenha menos que 1 caracter", () => {});

      it("Deve retornar mensagem de sucesso caso o campo title tenha 1 caracter", () => {});

      it("Deve retornar mensagem de sucesso caso o campo title tenha entre 1 e 100 caracteres", () => {});

      it("Deve retornar sucesso caso o campo title tenha 100 caracteres", () => {});

      it("Deve retornar erro caso o campo title tenham mais de 100 caracteres", () => {});

      it("Deve retornar erro caso o campo genre tenha menos que 1 caracter", () => {});

      it("Deve retornar mensagem de sucesso caso o campo genre tenha 1 caracter", () => {});

      it("Deve retornar mensagem de sucesso caso o campo genre tenha entre 1 e 100 caracteres", () => {});

      it("Deve retornar sucesso caso o campo genre tenha 100 caracteres", () => {});

      it("Deve retornar erro caso o campo genre tenham mais de 100 caracteres", () => {});

      it("Deve retornar erro caso o campo description tenha menos que 1 caracter", () => {});

      it("Deve retornar mensagem de sucesso caso o campo description tenha 1 caracter", () => {});

      it("Deve retornar mensagem de sucesso caso o campo description tenha entre 1 e 100 caracteres", () => {});

      it("Deve retornar sucesso caso o campo description tenha 100 caracteres", () => {});

      it("Deve retornar erro caso o campo description tenham mais de 100 caracteres", () => {});
    });
  });
