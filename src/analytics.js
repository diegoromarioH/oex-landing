import { supabase } from "./supabase";

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
  const clave = "oex_web_session_id";
  let id = localStorage.getItem(clave);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(clave, id);
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
  if (!EVENTOS_VALIDOS.has(evento)) return;
  try {
    await supabase.from("eventos_web").insert({
      evento,
      pagina: window.location.pathname.slice(0, 300) || "/",
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
