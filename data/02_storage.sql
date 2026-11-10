-- =====================================================================
-- Haltev AI (demo) — 02_storage.sql
-- Private bucket for customer payment screenshots.
-- Files are only read on the server (secret key) and shown to admin
-- through short-lived signed URLs.
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-proofs',
  'payment-proofs',
  false,
  5242880,                                   -- 5 MB
  array['image/png','image/jpeg','image/webp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
