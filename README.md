# Site ABM Experts Brasil

Site estático, pronto para o GitHub Pages, com domínio abmexpertsbrasil.com.

## Estrutura

- Páginas: `index.html`, `conteudo.html`, `comunidade.html`, `cursos.html`, `certificacao.html`, `parceiros.html`, `para-empresas.html`, `mentoria.html`, `gtm.html`, `sobre.html`, `contato.html`, `em-breve.html`, `privacidade.html`, `termos.html` e `404.html`.
- `data/agenda.json`, `data/conteudos.json`, `data/cursos.json`: o que aparece na agenda, no hub de conteúdo e na página de cursos. Edite pelo Pages CMS (abaixo).
- `assets/js/config.js`: chaves dos formulários.
- `.pages.yml`: configuração do painel de edição (Pages CMS).
- `CNAME`: domínio do site.

## 1. Subir no GitHub

1. Entre no GitHub e crie um repositório público chamado `abmexpertsbrasil-site` (botão New).
2. Na página do repositório, clique em "uploading an existing file".
3. Arraste todos os arquivos e pastas desta pasta e clique em Commit changes.
4. O arquivo `.pages.yml` começa com ponto e fica oculto no Mac e no Windows. Se ele não subir, use Add file > Create new file, dê o nome `.pages.yml` e cole o conteúdo do arquivo.

## 2. Ligar o GitHub Pages

1. No repositório: Settings > Pages.
2. Em Build and deployment, escolha Deploy from a branch, branch `main`, pasta `/ (root)`, e salve.
3. Em Custom domain, digite `abmexpertsbrasil.com` e salve.
4. Depois que o DNS propagar (passo 3), marque Enforce HTTPS.

## 3. Apontar o domínio na GoDaddy

1. GoDaddy > Meus produtos > Domínios > abmexpertsbrasil.com > DNS.
2. Apague o registro A com nome `@` que já existe (ele aponta para o site atual).
3. Crie 4 registros A, todos com nome `@`:
   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153
4. Edite (ou crie) o registro CNAME com nome `www` apontando para `SEU-USUARIO.github.io` (troque pelo seu usuário do GitHub).
5. Se o domínio estiver ligado ao construtor de sites da GoDaddy, desconecte antes.
6. A propagação leva de minutos a 24 horas.

## 4. Formulários (e-mail + WhatsApp)

Todos os formulários enviam e-mail para abmexpertsbrasil@gmail.com e um resumo no seu WhatsApp.

- E-mail (Web3Forms, gratuito até 250 envios por mês): entre em web3forms.com, informe abmexpertsbrasil@gmail.com e copie a Access Key que chega no e-mail. Cole em `assets/js/config.js`, no campo `web3formsKey`.
- WhatsApp (CallMeBot, gratuito para uso pessoal): salve o contato do CallMeBot indicado no site oficial e envie "I allow callmebot to send me messages". Ele responde com a sua APIKEY. Cole em `callmebotKey`.

Para editar o `config.js` no GitHub: abra o arquivo, clique no lápis, cole as chaves e clique em Commit changes.

## 5. Editar agenda, conteúdos e cursos (Pages CMS)

1. Entre em app.pagescms.org com a sua conta do GitHub.
2. Instale o app no repositório `abmexpertsbrasil-site`.
3. Abra o repositório no Pages CMS. Vão aparecer três áreas: Agenda de eventos, Conteúdos e Cursos.
4. Para publicar um PDF: envie o arquivo na área de mídia do Pages CMS e cole o link (ex.: `/assets/uploads/discovery.pdf`) no campo Link do framework.
5. Cada vez que você salva, o site atualiza em cerca de um minuto.

Regras automáticas:

- Eventos com data que já passou somem da agenda sozinhos. Se não houver evento futuro, o bloco da agenda some.
- Conteúdo ou curso sem link leva para a página Em breve.
- Os filtros da página Conteúdo são criados a partir dos formatos cadastrados.
