# Migration Verification Template

## Run Information
- Environment:
- Operator:
- Timestamp:
- Source Mongo DB:
- Target Supabase Project:

## Commands
```bash
npm run db:migrate:data
npm run db:migrate:verify
```

## Expected Report Files
- `migration-reports/mongo-to-postgres-<timestamp>.json`
- `migration-reports/verification-<timestamp>.json`

## Checklist
- [ ] Migration script completed without runtime errors.
- [ ] Verification script completed without runtime errors.
- [ ] Source and destination counts reviewed.
- [ ] FK integrity checks are all zero.
- [ ] Duplicate favorites check is zero.
- [ ] Sample record spot-check passed.

## Counts (copy from report)
| Table | Mongo | Postgres |
|---|---:|---:|
| users |  |  |
| accounts |  |  |
| listings |  |  |
| reservations |  |  |
| favorites | n/a |  |

## FK Integrity (must be 0)
- orphanAccounts:
- orphanListings:
- orphanReservationsByUser:
- orphanReservationsByListing:
- orphanFavoritesByUser:
- orphanFavoritesByListing:

## Skipped Rows (if any)
- accounts skipped:
- listings skipped:
- reservations skipped:
- favorites skipped:

## Sign-off
- [ ] Engineering sign-off
- [ ] Product/operations sign-off
