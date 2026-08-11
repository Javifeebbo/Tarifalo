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

-- Comparator qualifying fields, added to match the richer form on the real
-- tarifalo.com /comparador pages (tipo de cliente, nº de personas,
-- superficie, compañía actual). All nullable — existing rows and other
-- sources (newsletter, lead_magnet) never set these.
alter table leads add column if not exists customer_type text
  check (customer_type is null or customer_type in ('particular', 'empresa'));
alter table leads add column if not exists household_size text;
alter table leads add column if not exists surface_m2 text;
alter table leads add column if not exists current_company text;

drop table if exists example_tariffs;

-- Lead routing engine: companies (B2B clients who "buy" leads) + campaigns
-- (their targeting rules against the qualifying fields already collected on
-- ComparadorForm) + lead_assignments (audit trail of which campaign/company
-- won each lead and why). All FICTITIOUS — no real partner companies or
-- data source exist yet (see PRODUCT.md's no-fabrication rule). The
-- targeting/matching logic itself is real and functional; only the
-- underlying companies, prices and quotas are placeholders.

create table if not exists companies (
  id serial primary key,
  slug text not null unique,
  name text not null,
  illustrative boolean not null default true
);

create table if not exists campaigns (
  id serial primary key,
  company_id integer not null references companies (id),
  tariff_type text not null check (tariff_type in ('luz', 'gas', 'luz_gas', 'solar')),
  label text not null,
  monthly_price numeric not null,
  -- targeting rules; null/empty means "no restriction on this criterion".
  -- Value vocab matches ComparadorForm.tsx exactly (CUSTOMER_TYPE_OPTIONS,
  -- HOUSEHOLD_SIZE_OPTIONS, SURFACE_OPTIONS) so matching is a plain string
  -- comparison, not a parsed range.
  customer_types text[],
  household_sizes text[],
  surface_m2_options text[],
  postal_code_prefixes text[],
  -- current_company on leads is free text (see ComparadorForm's plain input,
  -- not a dropdown) — excluded_company_names is matched case/accent-
  -- insensitively, see matching.ts normalizeCompanyName().
  excluded_company_names text[],
  -- routing weight: higher priority_tier wins first; within a tier,
  -- assignment is weighted round-robin by priority_weight
  priority_tier integer not null default 1,
  priority_weight integer not null default 1,
  daily_quota integer not null default 10,
  assigned_count integer not null default 0,
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  active boolean not null default true,
  illustrative boolean not null default true
);

create index if not exists campaigns_tariff_type_idx on campaigns (tariff_type) where active;

create table if not exists lead_assignments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid not null references leads (id),
  campaign_id integer references campaigns (id),
  company_id integer references companies (id),
  rank integer not null,
  is_winner boolean not null default false,
  reason text not null,
  illustrative boolean not null default true
);

create index if not exists lead_assignments_lead_id_idx on lead_assignments (lead_id);

insert into companies (slug, name) values
  ('endesa', 'Endesa'),
  ('iberdrola', 'Iberdrola'),
  ('naturgy', 'Naturgy'),
  ('holaluz', 'Holaluz'),
  ('repsol', 'Repsol'),
  ('fenie-energia', 'Feníe Energía'),
  ('imagina', 'Imagina'),
  ('podo', 'Podo'),
  ('edp', 'EDP'),
  ('plenitude', 'Plenitude')
on conflict (slug) do nothing;

insert into campaigns (
  company_id, tariff_type, label, monthly_price,
  customer_types, household_sizes, surface_m2_options, postal_code_prefixes, excluded_company_names,
  priority_tier, priority_weight, daily_quota
)
select c.id, v.tariff_type, v.label, v.monthly_price,
  v.customer_types, v.household_sizes, v.surface_m2_options, v.postal_code_prefixes, v.excluded_company_names,
  v.priority_tier, v.priority_weight, v.daily_quota
from (values
  ('endesa', 'luz', 'Endesa One Luz', 39.90, array['particular']::text[], array['1','2','3']::text[], null::text[], array['28','45','13']::text[], array['endesa']::text[], 2, 3, 8),
  ('endesa', 'luz', 'Endesa One Luz Familiar', 46.50, array['particular']::text[], array['4','5+']::text[], null::text[], array['28','45','13']::text[], array['endesa']::text[], 2, 2, 5),
  ('iberdrola', 'luz', 'Iberdrola Plan Estable', 41.20, null, null, null, null, array['iberdrola']::text[], 2, 3, 10),
  ('holaluz', 'luz', 'Holaluz 100% Verde', 43.00, array['particular']::text[], null, null, null, array['holaluz']::text[], 1, 2, 6),
  ('naturgy', 'luz', 'Naturgy Tarifa Fija 12 Meses', 40.10, null, null, null, null, array['naturgy']::text[], 1, 2, 10),
  ('imagina', 'luz', 'Imagina Solar Hogar', 44.75, array['particular']::text[], null, array['Menos de 60 m²', '60–90 m²']::text[], null, array['imagina']::text[], 1, 1, 4),
  ('repsol', 'gas', 'Repsol Gas Confort', 31.40, null, null, null, null, array['repsol']::text[], 2, 3, 8),
  ('naturgy', 'gas', 'Naturgy Gas Estable', 29.90, null, null, null, null, array['naturgy']::text[], 2, 2, 10),
  ('podo', 'gas', 'Podo Gas Plana', 33.10, array['particular']::text[], null, null, null, array['podo']::text[], 1, 2, 6),
  ('edp', 'gas', 'EDP Gas Eficiente', 30.75, null, null, null, null, array['edp']::text[], 1, 1, 6),
  ('endesa', 'luz_gas', 'Endesa One Dual', 68.90, array['particular']::text[], null, null, array['28','45','13']::text[], array['endesa']::text[], 2, 3, 6),
  ('iberdrola', 'luz_gas', 'Iberdrola Dual Estable', 71.50, null, null, null, null, array['iberdrola']::text[], 1, 2, 6),
  ('plenitude', 'luz_gas', 'Plenitude Dual Flexible', 66.20, array['particular', 'empresa']::text[], null, null, null, array['plenitude']::text[], 1, 1, 5),
  ('fenie-energia', 'luz_gas', 'Feníe Dual Negocio', 74.00, array['empresa']::text[], null, null, null, array['fenie-energia']::text[], 2, 2, 4),
  ('imagina', 'solar', 'Imagina Autoconsumo Hogar', 45.00, array['particular']::text[], null, array['90–120 m²', 'Más de 120 m²']::text[], null, array['imagina']::text[], 1, 1, 4),
  ('edp', 'solar', 'EDP Solar Comunidad', 49.90, null, null, null, null, array['edp']::text[], 1, 1, 3)
) as v(company_slug, tariff_type, label, monthly_price, customer_types, household_sizes, surface_m2_options, postal_code_prefixes, excluded_company_names, priority_tier, priority_weight, daily_quota)
join companies c on c.slug = v.company_slug
on conflict do nothing;
