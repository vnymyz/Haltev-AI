-- =====================================================================
-- Haltev AI (demo) — 01_schema.sql
-- Run in Supabase Dashboard → SQL Editor, in this order:
--   01_schema.sql → 02_storage.sql → 03_seed.sql
-- To start over: 99_reset.sql, then run all three again.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Catalog
-- ---------------------------------------------------------------------
create table if not exists programs (
  id            serial primary key,
  slug          text unique not null,
  name          text not null,
  category      text not null check (category in
                  ('bootcamp','course','office','kids','fundamentals','private')),
  mode          text not null default 'online_offline'
                  check (mode in ('online','offline','online_offline')),
  sessions_info text,
  url           text,
  summary       text,
  is_active     boolean not null default true
);

-- One row per purchasable package of a program.
-- package: weekday | weekend | regular | intensive | bundling | standard
create table if not exists program_prices (
  id           serial primary key,
  program_id   int not null references programs(id) on delete cascade,
  package      text not null check (package in
                 ('weekday','weekend','regular','intensive','bundling','standard')),
  price        int not null,          -- current (promo) price in Rupiah
  normal_price int,                   -- crossed-out price, context only
  note         text,
  unique (program_id, package)
);

create table if not exists tutors (
  id         serial primary key,
  name       text not null,
  expertise  text[] not null default '{}',
  bio        text
);

create table if not exists batches (
  id           serial primary key,
  program_id   int not null references programs(id) on delete cascade,
  tutor_id     int references tutors(id) on delete set null,
  batch_no     int,
  day_type     text not null check (day_type in ('weekday','weekend','after_office')),
  days         text not null,              -- e.g. 'Mon–Tue–Wed'
  start_date   date,
  end_date     date,
  time_start   time not null,
  time_end     time not null,
  mode         text not null default 'online_offline'
                 check (mode in ('online','offline','online_offline')),
  capacity     int not null default 5,     -- semi-private: 3–5 students
  seats_taken  int not null default 0,
  check (seats_taken >= 0 and seats_taken <= capacity)
);
create index if not exists batches_program_idx on batches(program_id);

-- ---------------------------------------------------------------------
-- Customers & sales
-- ---------------------------------------------------------------------
create table if not exists leads (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  email            text,
  phone            text,
  interest_program text,
  preferred_days   text,   -- 'Mon–Tue–Wed' | 'Wed–Thu–Fri' | 'Sat & Sun'
  preferred_time   text,   -- '09:00–12:00' | '13:00–16:00' | '15:30–18:00' | '18:30–21:00'
  class_type       text,   -- 'public' | 'private'
  method           text,   -- 'online' | 'offline'
  source           text,   -- how they heard about Haltev
  promo_code       text,
  notes            text,
  status           text not null default 'new'
                     check (status in ('new','contacted','registered','paid','lost')),
  owner_id         text,   -- anonymous browser id (links lead to chat)
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create unique index if not exists leads_email_uq on leads (lower(email)) where email is not null;
create unique index if not exists leads_phone_uq on leads (phone) where phone is not null;

create index if not exists leads_owner_idx on leads(owner_id);

create table if not exists registrations (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references leads(id) on delete cascade,
  program_id  int  not null references programs(id),
  batch_id    int  references batches(id),   -- null = flexible schedule (private / fundamentals)
  schedule_note text,
  package     text not null,
  price       int  not null,
  status      text not null default 'pending_payment'
                check (status in ('pending_payment','confirmed','cancelled')),
  created_at  timestamptz not null default now()
);

create table if not exists invoices (
  id               uuid primary key default gen_random_uuid(),
  number           text unique not null,          -- HLV-YYYYMMDD-XXXX
  registration_id  uuid not null references registrations(id) on delete cascade,
  amount           int  not null,
  status           text not null default 'unpaid'
                     check (status in ('unpaid','pending_verification','paid','rejected')),
  due_at           timestamptz not null default (now() + interval '2 days'),
  paid_at          timestamptz,
  created_at       timestamptz not null default now()
);

create table if not exists payment_proofs (
  id              uuid primary key default gen_random_uuid(),
  invoice_id      uuid not null references invoices(id) on delete cascade,
  file_path       text not null,           -- path in storage bucket 'payment-proofs'
  extracted_json  jsonb,                   -- what the AI read from the screenshot
  amount_match    boolean,
  merchant_match  boolean,
  ai_note         text,
  review_status   text not null default 'pending'
                    check (review_status in ('pending','approved','rejected')),
  reviewed_by     text,
  reviewed_at     timestamptz,
  uploaded_at     timestamptz not null default now()
);

create table if not exists chat_sessions (
  id          text primary key,             -- chat id (client generated)
  owner_id    text not null,                -- anonymous browser id
  title       text,
  lead_id     uuid references leads(id) on delete set null,
  messages    jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- (index) chat sessions per browser
-- ---------------------------------------------------------------------
create index if not exists chat_sessions_owner_idx on chat_sessions(owner_id, updated_at desc);

-- ---------------------------------------------------------------------
-- Atomic seat booking (prevents overbooking a 5-seat batch)
-- ---------------------------------------------------------------------
create or replace function book_seat(p_batch_id int)
returns boolean
language plpgsql
as $$
declare
  updated int;
begin
  update batches
     set seats_taken = seats_taken + 1
   where id = p_batch_id
     and seats_taken < capacity;
  get diagnostics updated = row_count;
  return updated = 1;
end;
$$;

create or replace function release_seat(p_batch_id int)
returns void
language sql
as $$
  update batches set seats_taken = greatest(seats_taken - 1, 0) where id = p_batch_id;
$$;

-- ---------------------------------------------------------------------
-- Security: the app only talks to the DB from the server with the
-- SECRET key (bypasses RLS). Enable RLS with no policies so the public
-- (publishable/anon) key cannot read customer data.
-- ---------------------------------------------------------------------
alter table programs        enable row level security;
alter table program_prices  enable row level security;
alter table tutors          enable row level security;
alter table batches         enable row level security;
alter table leads           enable row level security;
alter table registrations   enable row level security;
alter table invoices        enable row level security;
alter table payment_proofs  enable row level security;
alter table chat_sessions   enable row level security;
