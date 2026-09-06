# OEX Landing V3

Sitio en React + Vite con Supabase. Incluye SEO, Open Graph, dirección en Miami,
barra de rastreo pública, tarifas estándar, calculadora de fecha estimada y
formulario de prealerta.

## Instalar

npm install
npm run dev

## Publicar en Hostinger desde GitHub

1. Sube este proyecto a un repositorio privado de GitHub.
2. En Hostinger, conecta ese repositorio desde la opción de despliegue con GitHub.
3. Configura:
   - Comando de instalación: `npm ci`
   - Comando de build: `npm run build`
   - Directorio de salida: `dist`
   - Versión de Node.js: `22`
4. Agrega en Hostinger las variables de entorno indicadas en `.env.example`.
5. Publica el proyecto y asigna los dominios `oexni.com` y `www.oexni.com`.

No subas `.env`, `node_modules` ni `dist` al repositorio; Hostinger genera
`dist` durante cada despliegue.

## Supabase

La landing utiliza `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. Usa
únicamente la clave pública/publishable del proyecto; nunca una `service_role`.

1. Si es una instalación nueva, ejecuta `supabase-oex-v2.sql` en el SQL Editor.
2. Ejecuta `supabase-oex-v3-migracion.sql` (seguro de correr varias veces).
   Este último script:
   - Elimina las tablas `codigos_descuento`, `promociones_barra` y `ticker_mensajes` (ya no se usan).
   - Actualiza `tracking_registros`: quita la columna `archivo` (ya no se sube foto/factura)
     y agrega `remitente`, `codigo_cliente` y `tipo_cliente`.
   - Crea la función `buscar_tracking(p_tracking text)` que alimenta la barra de
     rastreo pública de la landing (solo expone tracking/estado/destino/tipo de
     envío/fecha de ese tracking puntual, nunca datos personales ni la lista completa).

## Google Analytics

En `index.html`, reemplaza `G-XXXXXXXXXX` por tu ID y descomenta el bloque.

## V3 — Cambios principales

- **Se quitaron:** códigos de descuento de influencers, la barra/ticker de
  promociones superior, la calculadora interactiva de tarifas y la subida de
  foto/factura en la prealerta.
- **Tarifas:** ahora se muestran como tabla estática (solo informativa) en
  `#tarifas`. Si cambian los precios, se editan directamente en `TARIFAS`
  dentro de `App.jsx`.
- **Barra de rastreo:** nueva sección en la landing (`#rastreo`) donde el
  cliente escribe su tracking y consulta estado, destino, tipo de envío y
  fecha de registro, vía la función `buscar_tracking` en Supabase.
- **Prealerta rediseñada:**
  - Primer campo: tipo de cliente — "Cliente nuevo" o "Ya tengo código de
    cliente" (si es existente, pide el código de cliente).
  - WhatsApp obligatorio (se usa para vincular al cliente).
  - Cada tracking ahora tiene su propio **destino**, **tipo de envío** y
    **remitente/plataforma** (Amazon, SHEIN, Temu, etc.), en vez de un único
    destino/tipo para todo el formulario.
  - Se quitó la subida de foto/factura.
- Todo el sitio (landing, prealerta y políticas) es responsivo, con menú
  hamburguesa funcional y formulario de prealerta optimizado para móvil.
- CSS reescrito y consolidado en `styles.css` (antes tenía varias capas de
  parches acumuladas de versiones anteriores).

## Notas

- No hay códigos de descuento ni barra de promociones — si en el futuro se
  quieren reactivar, habría que recrear las tablas correspondientes.
- El bucket de Storage `prealertas` no se elimina automáticamente al migrar
  (por si tiene archivos históricos); si ya no lo necesitas, bórralo
  manualmente desde Supabase → Storage.
