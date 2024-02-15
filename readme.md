# Express Boilerplate (Projeto para testes)

## This project is used to make some tests and store some code snippets.
## Este projeto é usado para fazer alguns testes e guardar alguns trechos de código.

Vale ressaltar que o objetivo deste projeto é estudos e teste de bibliotecas e ferramentas.
Hoje eu prefiro utilizar um framework "pronto" utilizo o NestJs


### Será usado o Express como biblioteca HTTP, pois quero fazer um projeto mais simples e ir integrando outros serviços como: mensageria, websockets, crons e o que mais eu achar interessante =D

O projeto vai utilizar typescript e vou seguir o exemplo de uso da propria documentação.

Também vou utilizar o docker para poder subir o projeto sem necessidade de instalar o node localmente.

Todos os serviços que for utilizar pretendo deixar dockerizado para não ter dor de cabeça na instalação.

Próximos passos

- [X] Configurar o typescript
- [X] Configurar a lib para testes
- [X] Configurar carregamento de variaveis de ambiente
- [X] Configurar o docker
- [X] Configurar o conexão como banco de dados (pretendo utilizar o mongodb e postgres futuramente)
- [X] Criar um crud simples
- [X] Criar estrutura para usar mensageria (pretendo utilizar o rabbitMQ)
    - A ideia é enfileirar um geração de um arquivo.
    - OBS1
- [ ] Configurar documentação de API 



Para rodar o projeto localmente
 - Está sendo utilizado o node 20.x
 - Logo o padrão é `npm install`
 - Depois para rodar em desenvolvimento `npm run dev`



Docker 
 - Precisa ter o docker instalado e sendo executado
 - Para rodar como produção
 - `docker build -t express-boilerplate .`
 - `docker run -dp 127.0.0.1:3000:3000 express-boilerplate`
 - Para rodar em desenvolvimento ...


OBS1 
 - Não ficou exatamente como eu gostaria mas deu para ver o funcionamento da lib e comparar com outro serviço de mensageria.
 - Outro ponto que mudaria do exemplo apresentado no site do rabbitMQ seria usar o banco para salvar as mensagens offlines.
 - O processo de uso de mensageria é relativamente simples de usar processar.