# MintCat Deployment Templates

## 1. Required Supabase SQL

Run these in order:

1. `../supabase/mintcat_federation_schema.sql`
2. `../supabase/mintcat_media_poll_migration.sql`
3. `../supabase/mintcat_storage_policies.sql`
4. `../supabase/mintcat_moderation_schema.sql`

## 2. Recommended environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ORACAT_BASE_URL=https://mintcat.world
ORACAT_QUEUE_TOKEN=replace-with-a-long-random-secret
ORACAT_MEDIA_BUCKET=mintcat-media
ORACAT_LINK_PREVIEW_ALLOWLIST=
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=
SMTP_FROM=MintCat <noreply@mintcat.world>
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
LOG_LEVEL=info
BACKUP_WEBHOOK_URL=
```

## 3. Vercel scheduler template

If you deploy on Vercel, create `vercel.json` like this:

```json
{
  "crons": [
    {
      "path": "/api/federation/process-queue",
      "schedule": "*/2 * * * *"
    }
  ]
}
```

Then configure the cron request to send:

```text
x-oracat-queue-token: YOUR_ORACAT_QUEUE_TOKEN
```

## 4. SMTP provider template

Recommended providers:

- Resend SMTP
- Postmark
- Mailgun

Suggested transactional messages:

- account verification
- password reset
- moderation notice
- account suspension / appeal notice
- donation receipt

## 5. Sentry template

Use one DSN for server and one public DSN for client if you later add the Sentry SDK.

Suggested alert rules:

- 5xx error rate spike
- queue dead jobs > 0
- upload endpoint 4xx / 5xx spike
- preview fetch failure spike

## 6. Logging and backup

Recommended logging fields:

- request id
- actor username
- remote instance host
- queue job id
- moderation target
- upload file size

Recommended backups:

- daily Postgres backup from Supabase
- weekly Storage export
- monthly moderation export
- backup webhook to your Slack / Feishu / email

## 7. Launch checklist

- Domain and HTTPS are active
- Queue cron is active
- `/api/ops/health` returns `database: ok`
- Storage uploads succeed
- At least one moderation rule exists
- Privacy and terms pages are reviewed
- Service role key is rotated after setup
