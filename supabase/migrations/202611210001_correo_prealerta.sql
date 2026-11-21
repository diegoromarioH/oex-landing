alter table public.tracking_registros
  add column if not exists correo_cliente text;

alter table public.tracking_registros
  add constraint tracking_registros_correo_cliente_valido check (
    correo_cliente is null or (
      char_length(correo_cliente) <= 254
      and correo_cliente ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
    )
  );

create or replace function public.guardar_correo_cliente_al_confirmar()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update public.clientes
  set correo = new.correo_cliente
  where id = new.cliente_id
    and coalesce(btrim(correo), '') = '';
  return new;
end;
$$;

revoke execute on function public.guardar_correo_cliente_al_confirmar() from public, anon, authenticated;

create trigger guardar_correo_cliente_al_confirmar
after update of estado on public.tracking_registros
for each row
when (
  old.estado = 'Prealertado'
  and new.estado = 'Miami'
  and new.cliente_id is not null
  and new.correo_cliente is not null
)
execute function public.guardar_correo_cliente_al_confirmar();
