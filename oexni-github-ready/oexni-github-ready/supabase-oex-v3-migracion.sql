-- =========================================================
-- OEX V3 - MIGRACIÓN
-- Ejecuta esto DESPUÉS de supabase-oex-v2.sql, en el SQL
-- Editor de Supabase. Es seguro correrlo varias veces.
--
-- Qué hace:
-- 1) Elimina códigos de descuento (ya no se usan en la web)
-- 2) Elimina la barra/ticker de promociones (se quitó del sitio)
-- 3) Actualiza tracking_registros: quita la foto/factura,
--    agrega remitente, código de cliente y tipo de cliente,
--    y permite destino/tipo de envío por cada tracking
--    (esto último ya existía a nivel de fila, ahora se
--    completa desde el formulario por cada tracking)
-- 4) Crea una función pública para la barra de rastreo de
--    la landing (el cliente solo ve tracking/estado/destino/
--    tipo de envío/fecha de ese tracking puntual, nunca la
--    lista completa ni datos de otros clientes)
-- =========================================================


-- ============================
-- 1) CÓDIGOS DE DESCUENTO — eliminar
-- ============================
drop table if exists codigos_descuento cascade;


-- ============================
-- 2) BARRA / TICKER DE PROMOCIONES — eliminar
-- ============================
drop table if exists promociones_barra cascade;
drop table if exists ticker_mensajes cascade;

-- Limpia las claves de configuración que alimentaban el ticker
delete from configuracion_web where clave in ('promo_activa', 'promo_barra');


-- ============================
-- 3) TRACKING_REGISTROS — actualizar estructura
-- ============================

-- Quita la columna de archivo/factura (ya no se sube foto)
alter table tracking_registros drop column if exists archivo;

-- Remitente o plataforma donde compró (Amazon, SHEIN, Temu, etc.) por tracking
alter table tracking_registros add column if not exists remitente text;

-- Código de cliente, solo si marcó "ya soy cliente"
alter table tracking_registros add column if not exists codigo_cliente text;

-- Tipo de cliente: 'nuevo' o 'existente'
alter table tracking_registros add column if not exists tipo_cliente text default 'nuevo';

-- Índice para buscar rápido por tracking desde la barra de rastreo pública
create index if not exists idx_tracking_registros_tracking on tracking_registros (tracking);

-- Índice para buscar por código de cliente desde el CRM
create index if not exists idx_tracking_registros_codigo_cliente on tracking_registros (codigo_cliente);


-- ============================
-- 4) STORAGE — ya no se suben fotos/facturas
-- ============================
drop policy if exists "permitir subir prealertas publicas" on storage.objects;

-- Nota: el bucket "prealertas" no se elimina automáticamente por seguridad
-- (podría tener archivos históricos). Si quieres borrarlo, hazlo manualmente
-- desde Supabase → Storage una vez confirmes que ya no lo necesitas.


-- ============================
-- 5) BARRA DE RASTREO PÚBLICA
-- ============================
-- Función segura: el cliente solo puede consultar UN tracking a la vez
-- por su número exacto. No expone nombre, contacto ni ningún otro dato
-- personal, y no permite listar todos los registros.
create or replace function buscar_tracking(p_tracking text)
returns table (
  tracking text,
  estado text,
  destino text,
  tipo_envio text,
  fecha timestamptz,
  actualizado_en timestamptz
)
language sql
security definer
set search_path = public
as $$
  select tracking, estado, destino, tipo_envio, fecha, actualizado_en
  from tracking_registros
  where tracking ilike p_tracking
  order by actualizado_en desc
  limit 1;
$$;

revoke all on function buscar_tracking(text) from public;
grant execute on function buscar_tracking(text) to anon, authenticated;