# Tasks

## Database & Schema Fixes (before adding complexity)

1. [ ] Switch PK from UUIDv4 (`gen_random_uuid()`) to `bigint generated always as identity` or UUIDv7 (`uuid_generate_v7()`) — avoids index fragmentation
2. [ ] Decide on RLS strategy: implement `auth.uid()`-based policies or remove RLS until auth is added
3. [ ] Add `ALTER TABLE public.exercises FORCE ROW LEVEL SECURITY` so owner/superuser doesn't bypass policies
4. [ ] Remove unnecessary `pgcrypto` extension (`gen_random_uuid()` is built-in since Postgres 13)
5. [ ] Use `EXECUTE FUNCTION` instead of deprecated `EXECUTE PROCEDURE` in trigger definition
6. [ ] When adding auth policies, wrap functions in `(select auth.uid())` for RLS performance

## App Code Fixes

7. [ ] Narrow `select("*")` to specific columns in exercises list, detail, and edit pages

## UX Improvements

8. [ ] Mejorar la UI de búsqueda unificando texto y tags en un solo componente intuitivo (`FilterableList`)
