import { supabase } from "./supabase";

const CLAVE_PREFERENCIA = "oex_analitica_v1";
const CLAVE_SESION = "oex_web_session_id";
let preferenciaTemporal = null;

export function leerPreferenciaAnalitica() {
  try {
    return localStorage.getItem(CLAVE_PREFERENCIA) || preferenciaTemporal;
  } catch {
    return preferenciaTemporal;
  }
}

export function guardarPreferenciaAnalitica(preferencia) {
  preferenciaTemporal = preferencia;
  try {
    localStorage.setItem(CLAVE_PREFERENCIA, preferencia);
    if (preferencia === "rechazada") localStorage.removeItem(CLAVE_SESION);
  } catch {
    // La elección sigue vigente durante esta visita.
  }
}

const EVENTOS_VALIDOS = new Set([
  "pagina_vista",
  "guia_vista",
  "whatsapp_click",
  "tracking_busqueda",
  "prealerta_inicio",
  "prealerta_enviada",
  "app_instalar_click",
  "app_instalada"
]);

function obtenerSesionId() {
  let id = localStorage.getItem(CLAVE_SESION);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(CLAVE_SESION, id);
  }
  return id;
}

function dispositivo() {
  const ancho = window.innerWidth;
  if (ancho < 768) return "movil";
  if (ancho < 1100) return "tablet";
  return "computadora";
}

function referenciaSegura() {
  if (!document.referrer) return null;
  try {
    return new URL(document.referrer).hostname.slice(0, 180);
  } catch {
    return null;
  }
}

export async function registrarEvento(evento, datos = {}) {
  if (!EVENTOS_VALIDOS.has(evento) || leerPreferenciaAnalitica() !== "aceptada") return;
  try {
    await supabase.from("eventos_web").insert({
      evento,
      pagina: window.location.pathname.replace(/^\/prealerta\/[^/]+.*$/, "/prealerta").slice(0, 300) || "/",
      sesion_id: obtenerSesionId(),
      origen: "oexni.com",
      dispositivo: dispositivo(),
      referencia: referenciaSegura(),
      datos
    });
  } catch (error) {
    // La analítica nunca debe interrumpir rastreo, prealertas o navegación.
    console.debug("[OEX analítica]", error);
  }
}
