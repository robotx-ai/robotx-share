# RobotX Share Agent Playbook

## Product Identity
- Primary brand/domain: `robotxshare.com` (robot service rental bookings).
- Secondary domain: `robotxstore.com` (robot sales commerce).
- `robotxstore.com` is CTA cross-link only in MVP; no shared checkout/cart/auth integration.
- Do not present this product as Airbnb, home rental, or property rental.

## Canonical Service Taxonomy
- Allowed service categories (exact labels):
  - `Showcase & Performance`
  - `Cleaning`
  - `Warehouse`
  - `Restaurant`
- Canonical slugs:
  - `showcase-performance`
  - `cleaning`
  - `warehouse`
  - `restaurant`
- No additional categories without explicit product request.

## Strict Terminology Map (Mandatory)
Use this map in user-facing copy first, then variable naming when practical and safe.

| Legacy term | Canonical term |
| --- | --- |
| listing | service |
| host | RobotX or service operator |
| guest | customer |
| home/place/property | service package or deployment |
| reservation | booking |
| per night | per day |
| AirCover | RobotX Service Assurance |

Hard rule:
- Reject PRs that introduce new Airbnb wording in user-facing copy.

## MVP Data and Architecture Guardrails
- No Prisma schema redesign in MVP rebrand phase.
- Keep existing route shapes and DB fields for compatibility.
- Reinterpret semantics in-place:
  - `Listing.category` must be one of the 4 RobotX services.
  - `Listing.price` means per-day service price.
  - `locationValue` means service coverage city/region.
- Existing fields `guestCount`, `roomCount`, and `bathroomCount` are legacy compatibility fields.
- Do not expand legacy count fields into new product concepts in MVP.
- Prefer UI/copy/validation remap over DB migration during MVP.

## Access Control Rules
- Catalog is RobotX-managed only in MVP.
- Non-admin users must not create, edit, or delete services.
- Admin gating default: `ROBOTX_ADMIN_EMAILS` environment variable (comma-separated email allowlist).
- Enforce authorization at API layer even if UI hides controls.

## Supabase Control Contract
- Codex can operate Supabase for this repo when the following environment variables are set:
  - `SUPABASE_PROJECT_REF`
  - `SUPABASE_ACCESS_TOKEN`
  - `SUPABASE_DB_PASSWORD`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL` as fallback)
- Preferred environment order:
  1. Staging first.
  2. Production only with explicit user confirmation for destructive steps.
- Allowed without extra confirmation:
  - schema introspection
  - migration planning/verification
  - non-destructive SQL checks
  - auth/storage policy inspection
- Require explicit user confirmation in task thread:
  - destructive SQL (`DROP`, `TRUNCATE`, wide `DELETE`)
  - auth/provider resets
  - storage bucket deletion
  - production changes that can impact live traffic
- Secrets policy:
  - Never print credential values in chat/log summaries.
  - Keep service-role usage server-side only.

## Routing and UX Rules
- Keep existing route skeleton in MVP (for example `/`, `/listings/[listingId]`, `/api/listings`, `/api/reservations`).
- Rebrand labels/copy first; defer route renaming.
- Ensure visible cross-link CTA to `robotxstore.com` in navbar and footer.
- Keep location/date filtering flow, but wording must describe service booking.

## Theme Color Policy (MVP)
- User-facing theme colors must be restricted to white, gray, and black.
- Replace legacy accent colors (for example rose/coral/indigo/blue) with neutral grayscale equivalents.
- Prefer centralized Tailwind/CSS tokens for neutral palette updates instead of scattered hardcoded values.
- Do not introduce non-neutral theme colors unless there is an explicit product request in the task thread.

## Definition of Done for Rebrand Tasks
- All visible Airbnb wording removed.
- Category filters show exactly 4 RobotX services.
- Non-admin cannot access create/edit/delete service flows.
- Theme colors use only white/gray/black across user-facing UI in MVP scope.
- `npm run lint` passes.
- `npm run build` passes.
- Manual smoke checklist completed (home browse, detail, booking flow, auth flow, favorites/trips/reservations pages).

## Out of Scope (MVP)
- Unified auth/cart between `robotxshare.com` and `robotxstore.com`.
- Hourly/time-slot scheduling.
- Multi-provider marketplace model.
- DB schema migration for service-specific fields.

## Working Defaults
- Booking model: date range + day rate.
- Catalog model: RobotX-managed.
- Service area model: city/region coverage.
- Any role model beyond `ROBOTX_ADMIN_EMAILS` is deferred to phase 2.
