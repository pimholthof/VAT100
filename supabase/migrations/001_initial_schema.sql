-- ============================================================================
-- VAT100 — Initial Database Schema
-- Migration: 001_initial_schema.sql
-- ============================================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================================
-- PROFILES — extends Supabase Auth (auth.users)
-- Stores business/studio information for each authenticated user.
-- ============================================================================
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  studio_name text,            -- e.g. "Maya Kowalski Studio"
  kvk_number  text,
  btw_number  text,
  address     text,
  city        text,
  postal_code text,
  iban        text,
  bic         text,
  created_at  timestamptz not null default now()
);

comment on table public.profiles is 'User profile extending Supabase Auth with business details.';

-- ============================================================================
-- CLIENTS — customer/company records per user
-- ============================================================================
create table public.clients (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  name         text not null,   -- bedrijfsnaam
  contact_name text,
  email        text,
  address      text,
  city         text,
  postal_code  text,
  kvk_number   text,
  created_at   timestamptz not null default now()
);

comment on table public.clients is 'Client/company records belonging to a user.';

-- ============================================================================
-- INVOICES — invoice headers
-- ============================================================================
create table public.invoices (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  client_id       uuid not null references public.clients(id) on delete restrict,
  invoice_number  text not null,           -- e.g. "0031"
  status          text not null default 'draft'
                    check (status in ('draft', 'sent', 'paid', 'overdue')),
  issue_date      date not null default current_date,
  due_date        date,
  sent_via        text check (sent_via in ('email', 'peppol', 'both')),
  subtotal_ex_vat numeric(10,2) not null default 0,
  vat_amount      numeric(10,2) not null default 0,
  total_inc_vat   numeric(10,2) not null default 0,
  notes           text,
  created_at      timestamptz not null default now()
);

comment on table public.invoices is 'Invoice headers with status tracking and VAT totals.';

-- ============================================================================
-- INVOICE_LINES — line items per invoice
-- ============================================================================
create table public.invoice_lines (
  id          uuid primary key default uuid_generate_v4(),
  invoice_id  uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity    numeric(10,2) not null default 1,
  unit        text check (unit in ('uren', 'dagen', 'stuks')),
  rate        numeric(10,2) not null default 0,
  amount      numeric(10,2) not null default 0,
  sort_order  integer not null default 0
);

comment on table public.invoice_lines is 'Individual line items belonging to an invoice.';

-- ============================================================================
-- RECEIPTS — expense receipts (bonnen) with optional AI processing
-- ============================================================================
create table public.receipts (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  vendor_name    text,
  amount_ex_vat  numeric(10,2),
  vat_amount     numeric(10,2),
  amount_inc_vat numeric(10,2),
  vat_rate       numeric(5,2),
  category       text,
  receipt_date   date,
  storage_path   text,           -- path in Supabase Storage
  ai_processed   boolean not null default false,
  created_at     timestamptz not null default now()
);

comment on table public.receipts is 'Expense receipts (bonnen) with VAT details and optional AI-extracted data.';

-- ============================================================================
-- INDEXES
-- ============================================================================
create index idx_invoices_user_id    on public.invoices(user_id);
create index idx_invoices_status     on public.invoices(status);
create index idx_invoices_issue_date on public.invoices(issue_date);

create index idx_receipts_user_id      on public.receipts(user_id);
create index idx_receipts_receipt_date on public.receipts(receipt_date);

create index idx_invoice_lines_invoice_id on public.invoice_lines(invoice_id);

create index idx_clients_user_id on public.clients(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Profiles
alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles_delete_own"
  on public.profiles for delete
  using (id = auth.uid());

-- Clients
alter table public.clients enable row level security;

create policy "clients_select_own"
  on public.clients for select
  using (user_id = auth.uid());

create policy "clients_insert_own"
  on public.clients for insert
  with check (user_id = auth.uid());

create policy "clients_update_own"
  on public.clients for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "clients_delete_own"
  on public.clients for delete
  using (user_id = auth.uid());

-- Invoices
alter table public.invoices enable row level security;

create policy "invoices_select_own"
  on public.invoices for select
  using (user_id = auth.uid());

create policy "invoices_insert_own"
  on public.invoices for insert
  with check (user_id = auth.uid());

create policy "invoices_update_own"
  on public.invoices for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "invoices_delete_own"
  on public.invoices for delete
  using (user_id = auth.uid());

-- Invoice Lines (access via invoice ownership)
alter table public.invoice_lines enable row level security;

create policy "invoice_lines_select_own"
  on public.invoice_lines for select
  using (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_lines.invoice_id
        and invoices.user_id = auth.uid()
    )
  );

create policy "invoice_lines_insert_own"
  on public.invoice_lines for insert
  with check (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_lines.invoice_id
        and invoices.user_id = auth.uid()
    )
  );

create policy "invoice_lines_update_own"
  on public.invoice_lines for update
  using (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_lines.invoice_id
        and invoices.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_lines.invoice_id
        and invoices.user_id = auth.uid()
    )
  );

create policy "invoice_lines_delete_own"
  on public.invoice_lines for delete
  using (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_lines.invoice_id
        and invoices.user_id = auth.uid()
    )
  );

-- Receipts
alter table public.receipts enable row level security;

create policy "receipts_select_own"
  on public.receipts for select
  using (user_id = auth.uid());

create policy "receipts_insert_own"
  on public.receipts for insert
  with check (user_id = auth.uid());

create policy "receipts_update_own"
  on public.receipts for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "receipts_delete_own"
  on public.receipts for delete
  using (user_id = auth.uid());
