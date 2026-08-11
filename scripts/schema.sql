-- Lead capture + illustrative tariff comparator schema.
-- example_tariffs is seed/reference data only — every row is illustrative,
-- never presented as a real, currently-available offer (see PRODUCT.md).

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null check (source in ('newsletter', 'comparador')),
  email text not null,
  name text,
  phone text,
  tariff_type text check (tariff_type in ('luz', 'gas', 'luz_gas', 'solar')),
  postal_code text,
  monthly_bill_estimate numeric,
  consent boolean not null default false
);

create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_email_idx on leads (email);

-- Lead magnet ("Guía ahorro luz" PDF, /guia-ahorro-luz): reuses the same
-- leads table rather than a parallel one. Widens the source check and adds
-- an optional campaign tag so future lead magnets don't need another
-- migration each time. Idempotent so re-running this file against an
-- already-migrated database is safe.
alter table leads drop constraint if exists leads_source_check;
alter table leads add constraint leads_source_check
  check (source in ('newsletter', 'comparador', 'lead_magnet'));
alter table leads add column if not exists campaign text;

create table if not exists example_tariffs (
  id serial primary key,
  tariff_type text not null check (tariff_type in ('luz', 'gas', 'luz_gas', 'solar')),
  label text not null,
  monthly_price numeric not null,
  illustrative boolean not null default true,
  unique (tariff_type, label)
);

insert into example_tariffs (tariff_type, label, monthly_price) values
('luz', 'Ejemplo tarifa Luz A', 38.50),
('luz', 'Ejemplo tarifa Luz B', 41.20),
('gas', 'Ejemplo tarifa Gas A', 29.90),
('gas', 'Ejemplo tarifa Gas B', 33.10),
('luz_gas', 'Ejemplo combinada A', 62.40),
('luz_gas', 'Ejemplo combinada B', 68.00),
('solar', 'Ejemplo autoconsumo A', 45.00)
on conflict (tariff_type, label) do nothing;
