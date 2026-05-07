# Conta Plus Web

Frontend web do Conta Plus, construído com Next.js Pages Router. Ele consome a API do backend, usa sessão via cookie `httpOnly` e publica a interface principal em `https://contaplus.app.br`.

## Stack

- Next.js 15
- React 18
- Sass + Tailwind configurado
- Axios
- Chart.js / React Google Charts
- PM2 em produção

## Ambiente

Crie o `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Variáveis:

- `NEXT_PUBLIC_API_URL`: URL base da API backend.
- `NEXT_PUBLIC_MEASUREMENT_ID`: Google Analytics, quando usado.

Exemplo local:

```env
NEXT_PUBLIC_API_URL="http://localhost:3008"
NEXT_PUBLIC_MEASUREMENT_ID=""
```

Exemplo produção:

```env
NEXT_PUBLIC_API_URL="https://api.contaplus.app.br"
NEXT_PUBLIC_MEASUREMENT_ID="G-XXXXXXXXXX"
```

## Sessão E API

O login não grava JWT pelo JavaScript do browser. O fluxo atual é:

- `POST /api/auth/signin`: rota server-side do Next chama o backend e grava o cookie `@nextauth.token` como `httpOnly`.
- `POST /api/auth/logout`: limpa o cookie de autenticação.
- `/api/backend/*`: proxy server-side do Next para chamadas feitas pelo browser. Ele lê o cookie `httpOnly` e injeta `Authorization: Bearer`.
- SSR continua podendo chamar o backend diretamente, lendo o cookie no servidor.

Esse desenho reduz exposição do JWT no browser e mantém as telas existentes usando o mesmo cliente Axios.

## Rodando Localmente

```bash
npm install
npm run dev
```

Aplicação local:

```text
http://localhost:3000
```

Se a porta 3000 já estiver ocupada, o Next pode subir em outra porta. Ajuste `CORS_ORIGINS` no backend para incluir a porta usada.

## Qualidade

```bash
npm run build
```

O build atual passa. Ainda existem warnings conhecidos de lint sobre hooks e links internos; eles devem ser tratados em um item próprio.

## Produção

A produção atual usa clone do projeto no servidor, build local, PM2 para manter o processo ativo, Nginx como reverse proxy e Cloudflare apontando `contaplus.app.br`.

Fluxo sugerido para atualizar:

```bash
cd /caminho/conta-plus-view
git pull origin main
npm install
npm run build:deploy
pm2 restart conta-plus-view
pm2 save
```

**Importante:** depois de remover dependências (por exemplo `nookies`) ou mudar rotas/API, use sempre `npm run build:deploy` (ou apague manualmente `.next` antes do `next build`). Se o diretório `.next` for antigo, o servidor pode tentar carregar módulos que não existem mais no `package.json`.

Primeira execução com PM2:

```bash
pm2 start npm --name conta-plus-view -- run start
pm2 save
```

Verificações úteis:

```bash
pm2 status
pm2 logs conta-plus-view
curl http://localhost:3000
```

O Nginx deve encaminhar `https://contaplus.app.br` para a porta onde o Next está rodando. O Cloudflare cuida do DNS e da camada pública do domínio.

## Resolução de problemas

### `Cannot find module 'nookies'`

O código atual não usa mais `nookies`. Esse erro quase sempre significa que o servidor está rodando um build antigo em `.next`.

No servidor:

```bash
cd /opt/fontes/conta-plus-view   # ou o caminho do seu clone
git pull origin main
npm install
rm -rf .next
npm run build
pm2 restart conta-plus-view
```

Ou, a partir desta versão, use `npm run build:deploy`, que remove `.next` antes do `next build`.

## Checklist De Deploy

- `NEXT_PUBLIC_API_URL` aponta para a API pública correta.
- Backend permite a origem web em `CORS_ORIGINS`.
- Build do frontend passou antes do restart.
- PM2 está com processo online.
- Login foi testado depois do deploy, validando cookie `httpOnly` e proxy `/api/backend/*`.

## Versionamento

Cada item fechado gera:

1. Bump de versão em `package.json` e `package-lock.json`.
2. Commit com a mudança.
3. Tag anotada no formato `vX.Y.Z`.
4. Push da branch `main`.
5. Push da tag.

Exemplo:

```bash
npm version 2.0.3 --no-git-tag-version
git add -A
git commit -m "chore: release web v2.0.3 docs"
git tag -a v2.0.3 -m "Web v2.0.3"
git push origin main
git push origin v2.0.3
```
