-- CONFIGURACIÓN WEB
create table if not exists configuracion_web (
  id bigint primary key generated always as identity,
  clave text unique not null,
  valor text,
  activo boolean default true,
  actualizado_en timestamptz default now()
);

alter table configuracion_web enable row level security;

drop policy if exists "public select configuracion web" on configuracion_web;
create policy "public select configuracion web"
on configuracion_web
for select
to anon
using (activo = true);

drop policy if exists "authenticated manage configuracion web" on configuracion_web;
create policy "authenticated manage configuracion web"
on configuracion_web
for all
to authenticated
using (true)
with check (true);

insert into configuracion_web (clave, valor, activo)
values
('promo_activa', 'true', true),
('promo_barra', '🔥 PRIME DAY: tarifa especial por tiempo limitado. Pregunta por WhatsApp.', true),
('whatsapp', '50557067044', true)
on conflict (clave) do nothing;

-- CÓDIGOS DE DESCUENTO
create table if not exists codigos_descuento (
  id uuid primary key default gen_random_uuid(),
  codigo text unique not null,
  influencer text,
  tipo text default 'porcentaje',
  descuento numeric default 0,
  minimo_libras numeric default 3,
  activo boolean default true,
  fecha_expiracion date,
  creado_en timestamptz default now()
);

alter table codigos_descuento enable row level security;

drop policy if exists "public select codigos activos" on codigos_descuento;
create policy "public select codigos activos"
on codigos_descuento
for select
to anon
using (activo = true);

drop policy if exists "authenticated manage codigos" on codigos_descuento;
create policy "authenticated manage codigos"
on codigos_descuento
for all
to authenticated
using (true)
with check (true);

-- Crea códigos manualmente desde Supabase o desde el CRM.
-- No se deja ningún código público precreado en la web.

-- PREALERTAS
create table if not exists tracking_registros (
  id uuid primary key default gen_random_uuid(),
  cliente text,
  contacto text,
  destino text,
  tipo_envio text,
  tracking text not null,
  nota text,
  archivo text,
  estado text default 'Prealertado',
  fecha timestamptz default now(),
  actualizado_en timestamptz default now()
);

alter table tracking_registros enable row level security;

drop policy if exists "permitir prealertas publicas" on tracking_registros;
create policy "permitir prealertas publicas"
on tracking_registros
for insert
to anon
with check (true);

drop policy if exists "usuarios autenticados pueden ver tracking" on tracking_registros;
create policy "usuarios autenticados pueden ver tracking"
on tracking_registros
for select
to authenticated
using (true);

-- STORAGE PREALERTAS
insert into storage.buckets (id, name, public)
values ('prealertas', 'prealertas', false)
on conflict (id) do nothing;

drop policy if exists "permitir subir prealertas publicas" on storage.objects;
create policy "permitir subir prealertas publicas"
on storage.objects
for insert
to anon
with check (bucket_id = 'prealertas');


-- ============================
-- PROMOCIONES BARRA DINÁMICA
-- ============================

create table if not exists promociones_barra (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  texto text not null,
  boton text default 'Ver más',
  link text,
  activo boolean default true,
  orden integer default 1,
  fecha_inicio date,
  fecha_fin date,
  creado_en timestamptz default now(),
  actualizado_en timestamptz default now()
);

alter table promociones_barra enable row level security;

drop policy if exists "public select promociones activas" on promociones_barra;
create policy "public select promociones activas"
on promociones_barra
for select
to anon
using (activo = true);

drop policy if exists "authenticated manage promociones" on promociones_barra;
create policy "authenticated manage promociones"
on promociones_barra
for all
to authenticated
using (true)
with check (true);

insert into promociones_barra (titulo, texto, boton, link, activo, orden, fecha_inicio, fecha_fin)
values
('Prime Day', 'Del 23 al 26 de junio aprovecha ofertas en Amazon y tráelas con OEX.', 'Ver ofertas', 'https://www.amazon.com/', true, 1, '2026-06-23', '2026-06-26'),
('Fiestas de Moyogalpa', 'Compra con anticipación tus outfits, accesorios y regalos para las fiestas.', 'Cotizar', 'https://wa.me/50557067044', true, 2, null, null),
('SHEIN', 'Aprovecha descuentos en SHEIN y recibe tus compras en Nicaragua.', 'Comprar', 'https://www.shein.com/', true, 3, null, null)
on conflict do nothing;


-- ============================
-- TICKER / CINTA DINÁMICA
-- ============================

create table if not exists ticker_mensajes (
  id uuid primary key default gen_random_uuid(),
  mensaje text not null,
  activo boolean default true,
  orden integer default 1,
  fecha_inicio date,
  fecha_fin date,
  creado_en timestamptz default now(),
  actualizado_en timestamptz default now()
);

alter table ticker_mensajes enable row level security;

drop policy if exists "public select ticker activos" on ticker_mensajes;
create policy "public select ticker activos"
on ticker_mensajes
for select
to anon
using (activo = true);

drop policy if exists "authenticated manage ticker" on ticker_mensajes;
create policy "authenticated manage ticker"
on ticker_mensajes
for all
to authenticated
using (true)
with check (true);

insert into ticker_mensajes (mensaje, activo, orden, fecha_inicio, fecha_fin)
values
('🔥 PRIME DAY | 23–26 JUNIO • Aprovecha ofertas en Amazon y recíbelas con OEX', true, 1, '2026-06-23', '2026-06-26'),
('🎉 Fiestas de Moyogalpa • Compra con anticipación tus outfits, accesorios y regalos', true, 2, null, null),
('🛍️ SHEIN • Aprovecha descuentos y recibe tus compras en Nicaragua', true, 3, null, null),
('🇺🇸 Dirección en Miami disponible • Compra en tus tiendas favoritas', true, 4, null, null),
('📦 Prealerta tu tracking y recibe actualizaciones por WhatsApp', true, 5, null, null)
on conflict do nothing;