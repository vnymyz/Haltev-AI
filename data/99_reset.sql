-- =====================================================================
-- Haltev AI (demo) — 99_reset.sql
-- ⚠️ Deletes ALL Haltev AI tables and data. Use only to rerun the demo.
-- Uploaded screenshots: empty the 'payment-proofs' bucket in
-- Dashboard → Storage (Supabase blocks deleting storage objects via SQL).
-- Then run 01_schema.sql → 02_storage.sql → 03_seed.sql again.
-- =====================================================================

drop table if exists chat_sessions   cascade;
drop table if exists payment_proofs  cascade;
drop table if exists invoices        cascade;
drop table if exists registrations   cascade;
drop table if exists leads           cascade;
drop table if exists batches         cascade;
drop table if exists tutors          cascade;
drop table if exists program_prices  cascade;
drop table if exists programs        cascade;
drop function if exists book_seat(int);
drop function if exists release_seat(int);
