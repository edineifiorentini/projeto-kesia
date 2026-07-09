# WuzAPI local

A WuzAPI foi instalada como clone raso em `infra/wuzapi/source`.

Quando o Docker estiver instalado, suba a stack com:

```bash
pnpm wuzapi:up
```

Serviços:

- WuzAPI REST: `http://localhost:8080`
- RabbitMQ Management: `http://localhost:15672`
- PostgreSQL interno para sessões WhatsApp

Principais variáveis em `.env`:

- `WUZAPI_ADMIN_TOKEN`
- `WUZAPI_INSTANCE_NAME`
- `WUZAPI_SESSION_TOKEN`
- `WUZAPI_WEBHOOK_URL`
- `WUZAPI_GLOBAL_ENCRYPTION_KEY`
- `WUZAPI_WEBHOOK_SECRET`
- `WUZAPI_POSTGRES_PASSWORD`

Depois de subir a WuzAPI, crie/conecte uma sessão WhatsApp e salve o token de sessão em `WUZAPI_SESSION_TOKEN`.

No Docker Desktop para Windows, use `WUZAPI_WEBHOOK_URL=http://host.docker.internal:3000/api/webhooks/wuzapi` para entregar os eventos ao app Next.js local.
