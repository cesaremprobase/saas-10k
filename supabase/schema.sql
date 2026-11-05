-- ==============================================================================
-- TIKSHIP: SCHEMA OFICIAL DE BASE DE DATOS SUPABASE
-- Ejecutar en: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Tabla de Pedidos de Despacho (Orders)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null,
  courier text not null default 'SHALOM',
  delivery_type text not null default 'AGENCIA',
  delivery_address text,
  delivery_district text,
  delivery_reference text,
  recipient_name text not null,
  recipient_doc_type text not null default 'DNI',
  recipient_doc_number text not null,
  recipient_phone text not null,
  destination_department text not null,
  destination_province text not null,
  destination_agency text not null,
  package_content text not null default 'Prendas de Vestir',
  package_quantity integer not null default 1,
  payment_condition text not null default 'PAGO_EN_DESTINO',
  notes text,
  operator_name text,
  seller_phone text,
  created_by_email text,
  created_by_id text,
  status text not null default 'validated',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Activar Row Level Security (RLS)
alter table public.orders enable row level security;

-- 3. Políticas de Seguridad (RLS Policies):
-- Permitir que cualquier persona (anónimo o cliente desde el link público) inserte su pedido
create policy "Cualquier persona puede registrar pedidos publicos"
  on public.orders for insert
  with check (true);

-- Permitir que los usuarios autenticados o la tienda lean y gestionen los pedidos
create policy "Lectura publica y administracion de pedidos"
  on public.orders for select
  using (true);

create policy "Actualizacion de pedidos"
  on public.orders for update
  using (true);

create policy "Eliminacion de pedidos"
  on public.orders for delete
  using (true);

-- 4. Índice para búsquedas rápidas por celular y número de guía
create index if not exists idx_orders_recipient_phone on public.orders(recipient_phone);
create index if not exists idx_orders_order_number on public.orders(order_number);

