# Supabase Postgres Cutover Runbook

## Scope
Migrate this app from MongoDB to Supabase Postgres while keeping NextAuth + Prisma.

## Preconditions
1. Supabase project provisioned and reachable.
2. `DATABASE_URL` for Supabase Postgres is ready.
3. `MONGODB_MIGRATION_URI` and `MONGODB_MIGRATION_DB` point to source MongoDB.
4. Mongo backup taken (`mongodump`) and checksum recorded.
5. App version with Postgres schema and favorites join-table refactor is deployed.

## Deployment Inputs
- `DATABASE_URL`
- `DB_MIGRATION_READ_ONLY`
- `MONGODB_MIGRATION_URI` (scripts only)
- `MONGODB_MIGRATION_DB` (scripts only)

## Dry Run
1. Apply schema to a non-prod Supabase instance.
2. Run `npm run db:migrate:data`.
3. Run `npm run db:migrate:verify`.
4. Confirm reports in `migration-reports/` have zero FK orphans.

## Production Cutover
1. Pre-cutover
- Deploy this code to production.
- Keep `DB_MIGRATION_READ_ONLY="false"`.

2. Enter maintenance mode (write freeze)
- Set `DB_MIGRATION_READ_ONLY="true"` and redeploy/restart.
- Verify write endpoints return HTTP 503.

3. Final sync
- Run `npm run db:migrate:data` against production Mongo + Supabase.
- Run `npm run db:migrate:verify`.
- Confirm:
  - counts are within expected tolerance,
  - FK orphan checks are zero,
  - duplicate favorites are zero.

4. Switch DB
- Set `DATABASE_URL` to Supabase Postgres in production runtime.
- Run `npx prisma migrate deploy`.
- Restart application.

5. Post-switch validation
- Credentials sign-in works.
- Google/Facebook sign-in works.
- Listings load.
- Favorite toggle works.
- Reservation create/cancel works.

6. Exit maintenance mode
- Set `DB_MIGRATION_READ_ONLY="false"`.
- Restart app.

## Rollback
1. Set `DB_MIGRATION_READ_ONLY="true"`.
2. Revert application release to pre-migration build.
3. Restore prior Mongo `DATABASE_URL` runtime config.
4. Restart app and validate critical flows.
5. Keep migration reports for root cause analysis before retry.

## Notes
- Data migration script preserves existing Mongo IDs in Postgres IDs.
- New records after cutover use Prisma `cuid()` defaults.
