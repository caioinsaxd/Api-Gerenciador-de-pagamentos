Bem-vindo(a) ao Teste Prático Back-end BeTalent!

Este enunciado está disponível de duas formas:
- no GitHub, onde é mais agradável de ler (há formatação de código etc.);
- abaixo, nesta descrição, onde não há formatação de código e outros recursos mais avançados

📋 Sobre o teste
Este teste foi estruturado em níveis progressivos de complexidade, permitindo que você demonstre suas habilidades de acordo com sua experiência. Você pode optar por implementar um ou mais níveis, e sua avaliação será baseada na qualidade do código e funcionalidades implementadas em cada nível escolhido.

🎯 O Desafio
O Teste consiste em estruturar uma API RESTful conectada a um banco de dados e a duas APIs de terceiros. Trata-se de um sistema gerenciador de pagamentos multi-gateway. Ao realizar uma compra, deve-se tentar realizar a cobrança junto aos gateways, seguindo a ordem de prioridade definida. Caso o primeiro gateway dê erro, deve-se fazer a tentativa no segundo gateway. Se algum gateway retornar sucesso, não deve ser informado erro no retorno da API. Deve ser levada em consideração a facilidade de adicionar novos gateways de forma simples e modular.

Frameworks Aceitos
- Adonis 5 ou superior (Node.js)
- Laravel 10 ou superior (PHP)

📊 Níveis de Implementação

Nível 1
Escolha esse nível se você se considera iniciante ou júnior, por exemplo:
- Valor da compra vem direto pela API
- Gateways sem autenticação

Nível 2
Escolha esse nível se você é júnior experiente ou pleno, por exemplo:
- Valor da compra vem do produto e suas quantidades calculada via back
- Gateways com autenticação

Nível 3
Escolha esse nível se você é um pleno ou sênior, por exemplo:
- Valor da compra vem de múltiplos produtos e suas quantidades selecionadas e calculada via back
- Gateways com autenticação
- Usuários tem roles:
  - ADMIN - faz tudo
  - MANAGER - pode gerenciar produtos e usuários
  - FINANCE - pode gerenciar produtos e realizar reembolso
  - USER - pode o resto que não foi citado
- Uso de TDD
- Docker compose com MySQL, aplicação e mock dos gateways

🗄️ Estrutura do Banco de Dados
O banco de dados deve ser estruturado à sua escolha, mas minimamente deve conter:

users:
- email
- password
- role

gateways:
- name
- is_active
- priority

clients:
- name
- email

products:
- name
- amount

transaction_products:
- transaction_id
- product_id
- quantity

transactions:
- client
- gateway
- external_id
- status
- amount
- card_last_numbers
- [product_id, quantity] (exclusivo do nível 2)

🛣️ Rotas do Sistema

Rotas Públicas
- Realizar o login
- Realizar uma compra informando o produto

Rotas Privadas
- Ativar/desativar um gateway
- Alterar a prioridade de um gateway
- CRUD de usuários com validação por roles
- CRUD de produtos com validação por roles
- Listar todos os clientes
- Detalhe do cliente e todas suas compras
- Listar todas as compras
- Detalhes de uma compra
- Realizar reembolso de uma compra junto ao gateway com validação por roles

🔧 Requisitos Técnicos Obrigatórios
- MySQL como banco de dados
- Respostas devem ser em JSON
- ORM para gestão do banco (Eloquent, Lucid, Knex, Bookshelf etc.)
- Validação de dados (VineJS, etc.)
- README detalhado com:
  - Requisitos
  - Como instalar e rodar o projeto
  - Detalhamento de rotas
  - Outras informações relevantes
- Implementar TDD
- Docker compose com mysql, aplicação e mock dos gateways

🔌 Multi-Gateways
Para auxiliar no desenvolvimento, disponibilizamos uma Collection para você usar em ferramentas de sua preferência. O JSON também está no GitHub.

Rodando os mocks
Com autenticação:
docker run -p 3001:3001 -p 3002:3002 matheusprotzen/gateways-mock

Sem autenticação:
docker run -p 3001:3001 -p 3002:3002 -e REMOVE_AUTH='true' matheusprotzen/gateways-mock

O Gateway 1 ficará disponível em http://localhost:3001 e o Gateway 2 em http://localhost:3002.

Gateway 1 (http://localhost:3001)

Login
POST /login
Body:
{
"email": "dev@betalent.tech",
"token": "FEC9BB078BF338F464F96B48089EB498"
}

Autenticação das seguintes rotas deve ser feito usando o Bearer token retornado da rota de login.

Listagem das transações
GET /transactions

Criação de uma transação
POST /transactions
Body:
{
"amount": 1000,
"name": "tester",
"email": "tester@email.com",
"cardNumber": "5569000000006063",
"cvv": "010"
}

Onde:
- amount: valor da compra em centavos
- name: nome do comprador
- email: email do comprador
- cardNumber: número do cartão (16 dígitos)
- cvv: cvv do cartão (ao usar cvv 100 ou 200 vai ser retornado um erro simulando dados inválidos do cartão)

Reembolso de uma transação
POST /transactions/:id/charge_back

Onde:
- :id: id da transação

Gateway 2 (http://localhost:3002)
Autenticação das seguintes rotas deve ser feito usando os seguintes dados nos headers:
- Gateway-Auth-Token=tk_f2198cc671b5289fa856
- Gateway-Auth-Secret=3d15e8ed6131446ea7e3456728b1211f

Listagem das transações
GET /transacoes

Criação de uma transação
POST /transacoes
Body:
{
"valor": 1000,
"nome": "tester",
"email": "tester@email.com",
"numeroCartao": "5569000000006063",
"cvv": "010"
}

Onde:
- valor: valor da compra em centavos
- nome: nome do comprador
- email: email do comprador
- numeroCartao: número do cartão (16 dígitos)
- cvv: cvv do cartão, ao usar cvv 200 ou 300 vai ser retornado um erro simulando dados inválidos do cartão

Reembolso de uma transação
POST /transacoes/reembolso
Body:
{
"id": "3d15e8ed-6131-446e-a7e3-456728b1211f"
}

Onde:
- id: id da transação

📝 Critérios de Avaliação
Serão critérios para avaliação da solução fornecida:Lógica de programação
- Organização do projeto
- Legibilidade do código
- Validação necessária dos dados
- Forma adequada de utilização dos recursos
- Seguimento dos padrões especificados
- Tratamento dos dados sensíveis corretamente
- Clareza na documentação

⏰ Considerações Finais
Caso não consiga completar o teste até o prazo definido:
- Garanta que tudo que foi construído esteja em funcionamento
- Relate no README quais foram as dificuldades encontradas
- Documente o que foi implementado e o que ficou pendente

📤 Envio da Solução
O projeto deverá ser hospedado em um repositório no seu GitHub. O link do repositório deverá ser fornecido por meio deste formulário. Não serão aceitos links de projetos enviados por outros meios.

Boa sorte! 🍀