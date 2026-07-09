# Projeto Kesia

Sistema multi-tenant para gestão de salões, barbearias e profissionais de beleza. O MVP cobre agenda, clientes, profissionais, serviços, comandas, financeiro, estoque, marketing, relatórios, configurações, página pública de agendamento e portal do cliente.

## Stack

- Next.js App Router, React, TypeScript e Tailwind CSS
- Prisma 7 com PostgreSQL
- Zod para validação server-side
- RBAC em `src/lib/auth`
- i18n em `src/lib/i18n/dictionaries.ts` com `pt-BR` padrão, `en-US` e `es-ES`
- Vitest para regras críticas de negócio

## Setup

```bash
pnpm install
cp .env.example .env
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Credencial demo criada pelo seed:

```text
edineif@gmail.com
@135LuccaDutra
```

Essas credenciais tambem podem ser configuradas no `.env`:

```bash
ADMIN_EMAIL="edineif@gmail.com"
ADMIN_PASSWORD="@135LuccaDutra"
```

## Rotas principais

- `/`: site/LP publico da Késia Dutra Cabeleireira.
- `/login`: login do painel administrativo.
- `/admin`: painel administrativo protegido por cookie de sessao.
- `/admin/settings`: configuracoes do salao e integracoes.
- `/booking/kesia-dutra-cabeleireira`: pagina publica de agendamento.
- `/portal`: portal publico do cliente.

## Scripts

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm db:studio
```

## Estrutura

- `prisma/schema.prisma`: modelo relacional multi-tenant com usuários, papéis, permissões, clientes, profissionais, serviços, agenda, comandas, pagamentos, comissões, estoque, marketing, avaliações, auditoria e configurações.
- `prisma/seed.ts`: dados demo da Késia Dutra Cabeleireira.
- `src/app`: rotas do dashboard, módulos do MVP, APIs, booking público e portal do cliente.
- `src/components`: shell, cards, badges, páginas de módulo e configurações.
- `src/lib/domain`: regras testáveis de agenda, comissões, pagamentos e estoque.
- `src/lib/integrations`: abstrações para Mercado Pago, Google Calendar, WuzAPI, WhatsApp/e-mail.
- `infra/wuzapi`: instalação local da WuzAPI com Docker Compose, PostgreSQL e RabbitMQ.

## UI e personalização

O projeto está preparado para `shadcn/ui` e React Bits:

- `components.json`: configuração do CLI para adicionar componentes em `src/components/ui`.
- `src/lib/utils.ts`: helper `cn()` com `clsx` e `tailwind-merge`.
- `src/app/globals.css`: tokens de tema, dark mode, radius e `tw-animate-css`.

Principais libs instaladas para a fase visual:

- UI base: Radix UI, `class-variance-authority`, `tailwind-merge`, `next-themes`, `sonner`.
- Formulários: `react-hook-form` e `@hookform/resolvers`.
- Painel: `@tanstack/react-table`, `recharts`, `react-day-picker`, `date-fns`.
- Interações: `motion` e `@dnd-kit`.

Para adicionar um componente React Bits depois, use o comando indicado na página do componente. Exemplo:

```bash
pnpm dlx shadcn@latest add @react-bits/BlurText-TS-TW
```

## Configurações do salão

No painel, acesse `Configurações` para preencher:

- Nome do salão
- Nome do responsável
- CNPJ/CPF, telefone, WhatsApp e e-mail
- CEP, rua, número, complemento, bairro, cidade e estado

O schema Prisma também possui campos para responsável, e-mail e endereço completo no model `Business`.

## Integrações

### Mercado Pago

Preencha no `.env`:

```bash
PAYMENT_PROVIDER="mercado_pago"
MERCADO_PAGO_ACCESS_TOKEN=""
MERCADO_PAGO_PUBLIC_KEY=""
MERCADO_PAGO_WEBHOOK_SECRET=""
```

Endpoint preparado:

```text
POST /api/integrations/mercado-pago/preferences
POST /api/webhooks/mercado-pago
```

### Google Calendar

Preencha no `.env`:

```bash
GOOGLE_CALENDAR_CLIENT_ID=""
GOOGLE_CALENDAR_CLIENT_SECRET=""
GOOGLE_CALENDAR_REDIRECT_URI="http://localhost:3000/api/integrations/google-calendar/callback"
GOOGLE_CALENDAR_ID="primary"
```

Endpoint preparado:

```text
POST /api/integrations/google-calendar/events
GET /api/integrations/google-calendar/callback
```

### WhatsApp com WuzAPI

A WuzAPI foi instalada em `infra/wuzapi/source`. Para subir a stack, instale Docker e rode:

```bash
pnpm wuzapi:up
```

Preencha no `.env`:

```bash
WHATSAPP_PROVIDER="wuzapi"
WUZAPI_BASE_URL="http://localhost:8080"
WUZAPI_WEBHOOK_URL="http://host.docker.internal:3000/api/webhooks/wuzapi"
WUZAPI_ADMIN_TOKEN="change-me-admin-token"
WUZAPI_INSTANCE_NAME="kesia-dutra-cabeleireira"
WUZAPI_SESSION_TOKEN="kesia-dutra-whatsapp-session-token"
WUZAPI_GLOBAL_ENCRYPTION_KEY="change-me-32-byte-encryption-key"
WUZAPI_WEBHOOK_SECRET="change-me-wuzapi-webhook-secret-32chars"
WUZAPI_POSTGRES_PASSWORD="wuzapi-local-password"
```

Quando a WuzAPI roda em Docker no Windows, `host.docker.internal` permite que o container envie webhooks para o app Next.js rodando em `localhost:3000`.

No painel administrativo, acesse `Configurações > Integrações > WhatsApp com WuzAPI` para criar a instância padrão, conectar a sessão, gerar o QR Code e solicitar um novo QR Code quando a leitura expirar.

Endpoints preparados:

```text
POST /api/integrations/wuzapi/messages
POST /api/webhooks/wuzapi
```

## Decisões do MVP

- A interface é exibida em português do Brasil por padrão.
- Textos de UI ficam nos dicionários de tradução; dados de demonstração simulam conteúdo vindo do banco.
- Integrações de WhatsApp e pagamentos estão abstraídas para troca posterior por WhatsApp Cloud API, Mercado Pago, Pagar.me ou Stripe.
- A API de agendamento demonstra validação server-side e checagem de permissão; persistência real deve conectar Prisma nos handlers conforme o ambiente de banco.
- Comissões são calculadas somente depois de pagamento confirmado.
- Estoque diminui em venda de produto e já há função para consumo interno por serviço.

## GitHub Pages

O workflow `.github/workflows/pages.yml` publica uma previa estatica da LP em GitHub Pages usando o caminho `/projeto-kesia/`.

```bash
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/projeto-kesia pnpm build
NEXT_PUBLIC_BASE_PATH=/projeto-kesia pnpm pages:export
```

O painel administrativo, APIs, Mercado Pago, Google Calendar e WuzAPI precisam de hospedagem com servidor Node.js para funcionar online.

## Próximos passos naturais

1. Conectar os handlers à camada Prisma real.
2. Adicionar Auth.js, Clerk ou Supabase Auth para fluxo completo de senha e reset.
3. Implementar drag-and-drop real na agenda.
4. Integrar WhatsApp Cloud API e pagamentos online.
5. Expandir cobertura de testes para checkout e permissões sensíveis.
