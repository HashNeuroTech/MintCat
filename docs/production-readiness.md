# MintCat Production Readiness

## Required infrastructure

- Supabase Postgres
- Supabase Storage bucket: `mintcat-media`
- Public domain with HTTPS
- Cron / scheduler for `/api/federation/process-queue`
- Error monitoring (Sentry recommended)
- Log aggregation
- Database backups

## SQL to run

1. `../supabase/mintcat_federation_schema.sql`
2. `../supabase/mintcat_media_poll_migration.sql`
3. `../supabase/mintcat_storage_policies.sql`
4. `../supabase/mintcat_moderation_schema.sql`

## Environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ORACAT_BASE_URL`
- `ORACAT_QUEUE_TOKEN`
- `ORACAT_MEDIA_BUCKET`
- `ORACAT_LINK_PREVIEW_ALLOWLIST`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM`
- `SENTRY_DSN`
- `NEXT_PUBLIC_SENTRY_DSN`
- `LOG_LEVEL`
- `BACKUP_WEBHOOK_URL`

## Operations checklist

- Configure scheduler to call `/api/federation/process-queue`
- Add uptime checks for `/api/ops/health`
- Set alerts for queue failures and 5xx spikes
- Enable storage lifecycle / abuse review
- Add SMTP / transactional email provider
- Review privacy policy and terms before launch
- Review [deployment-templates.md](./deployment-templates.md) for Vercel cron, SMTP, Sentry, and backup setup
