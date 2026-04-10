# Tasks

## Database & Schema Fixes (before adding complexity)

- [ ] Switch PK from UUIDv4 (`gen_random_uuid()`) to `bigint generated always as identity` or UUIDv7 (`uuid_generate_v7()`) — avoids index fragmentation
- [ ] Decide on RLS strategy: implement `auth.uid()`-based policies or remove RLS until auth is added
- [ ] Add `ALTER TABLE public.exercises FORCE ROW LEVEL SECURITY` so owner/superuser doesn't bypass policies
- [ ] Remove unnecessary `pgcrypto` extension (`gen_random_uuid()` is built-in since Postgres 13)
- [ ] Use `EXECUTE FUNCTION` instead of deprecated `EXECUTE PROCEDURE` in trigger definition
- [ ] When adding auth policies, wrap functions in `(select auth.uid())` for RLS performance

## App Code Fixes

- [ ] Narrow `select("*")` to specific columns in exercises list, detail, and edit pages
