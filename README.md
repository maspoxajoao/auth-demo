# Sistema de Autenticação (Auth Demo)

Este projeto nasceu de uma curiosidade prática: entender o que realmente acontece por trás de um botão de "Entrar com Google" e como funciona o fluxo completo de uma tela de login.

Em vez de apenas desenhar a interface, o objetivo foi construir a infraestrutura completa de autenticação no front-end, lidando com rotas protegidas, tratamento de erros, comunicação com backend as a service e configurações de deploy em produção.

## Tecnologias Utilizadas

- **React.js:** Biblioteca principal para a construção da interface.
- **TypeScript:** Adicionado para garantir tipagem estática, segurança no desenvolvimento e um código mais previsível.
- **SCSS:** Utilizado para a estilização, permitindo um CSS mais estruturado e modular.
- **Supabase:** Plataforma Backend as a Service (BaaS) escolhida para gerenciar o banco de dados e a autenticação (E-mail/Senha e OAuth com Google).
- **Vercel:** Plataforma de hospedagem para a publicação do projeto.
- **Yarn:** Adotado como gerenciador de pacotes no lugar do npm padrão. A decisão de utilizar o Yarn foi tomada para garantir uma resolução de dependências mais ágil e um processo de build mais consistente, características que aceleraram os testes de deploy.

## Desafios Resolvidos e Aprendizados

O maior valor deste projeto não está na interface finalizada, mas nos problemas de engenharia e infraestrutura que surgiram ao longo do desenvolvimento. Abaixo, documento as principais decisões e soluções arquitetadas:

### 1. Tratamento de Erros e Experiência do Usuário

A API não devolve mensagens prontas para o usuário final. Foi necessário criar uma camada de interceptação no front-end para capturar os códigos de erro do Supabase (como credenciais inválidas ou e-mails já cadastrados) e convertê-los em mensagens de interface claras e objetivas.

### 2. Segurança e Proteção de Rotas

A segurança de uma Single Page Application (SPA) vai além de esconder elementos visuais. Foi implementado um componente de validação que intercepta o acesso às rotas internas. Se o usuário tentar acessar a rota "/dashboard" sem um token de sessão válido, ele é imediatamente redirecionado para a tela inicial.

### 3. Limites de Infraestrutura (Rate Limiting)

Durante os testes de cadastro tradicional por e-mail, a aplicação passou a retornar o erro 429 (Too Many Requests). A investigação revelou que o serviço de e-mail integrado do Supabase possui um limite global de envios por hora em planos gratuitos.

- **A decisão:** Para ambientes de teste contínuos, focamos no fluxo OAuth (Google Auth), que opera sob regras de limite diferentes. Em um cenário real de produção, a documentação aponta a necessidade de integrar um provedor SMTP customizado para contornar essa trava.

### 4. Roteamento em Produção (Erro 404 na Vercel)

Após o deploy, a navegação via links funcionava perfeitamente, mas atualizar a página na rota "/dashboard" resultava em um erro 404.

- **A causa:** O servidor da Vercel tentava encontrar um arquivo físico chamado "dashboard", mas toda a aplicação é gerenciada pelo arquivo index.html (comportamento padrão do React Router).
- **A solução:** Criação de um arquivo de configuração "vercel.json" na raiz do projeto, instruindo o servidor a redirecionar todas as requisições de rotas para o index.html, devolvendo o controle da navegação para o React.

### 5. Configuração de Callbacks e Redirecionamentos

Logo após implementar a autenticação pelo Google na versão de produção, o Supabase estava redirecionando o usuário de volta para a porta local (localhost:3000), resultando em falha de acesso. A solução exigiu configurações nas variáveis de ambiente e no painel do Supabase, definindo a URL principal da Vercel como a "Site URL" oficial e cadastrando os caminhos corretos na lista de redirecionamentos permitidos.

### 6. Rigor de Compilação do TypeScript

Durante as esteiras de deploy, o processo de build foi interrompido por erros de compilação. O TypeScript identificou imports declarados (como a importação padrão do React) que não estavam sendo utilizados no código. Isso forçou uma revisão para manter os arquivos completamente limpos antes que o código pudesse ir ao ar.

## Como rodar este projeto localmente

Caso queira clonar este repositório e testar em sua própria máquina, siga os passos abaixo.

1. Clone o repositório:

```bash
git clone https://github.com/maspoxajoao/auth-demo.git

```

2. Acesse a pasta do projeto:

```bash
cd auth-demo

```

3. Instale as dependências usando Yarn:

```bash
yarn install

```

4. Configure as variáveis de ambiente:
   Crie um arquivo chamado ".env.local" na raiz do projeto e insira as credenciais do seu projeto Supabase:

```text
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui

```

5. Inicie o servidor de desenvolvimento:

```bash
yarn run dev

```

## Acesso em Produção

O projeto encontra-se hospedado e funcional. Para testar, recomendo utilizar o método "Continuar com o Google" devido às políticas de limite de e-mails descritas na seção de aprendizados.

Acesse: [https://auth-demo-62pq.vercel.app/](https://auth-demo-62pq.vercel.app/)
