export const WHATSAPP_OEX = "50557067044";

export function enlaceWhatsApp(numero, mensaje) {
  const telefono = String(numero || "").replace(/\D/g, "") || WHATSAPP_OEX;
  return `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
}

export const mensajesWhatsApp = {
  inicio: "Hola, OEx. Les escribo desde oexni.com.\n\nNecesito ayuda con (envío, compra asistida o rastreo):\nMi destino (Managua u Ometepe):\nMi consulta:",
  cotizacion: "Hola, OEx. Quiero cotizar un envío desde Miami a Nicaragua.\n\nDestino (Managua u Ometepe):\nModalidad (aérea o marítima):\nProducto o enlace de la tienda:\nPeso aproximado en libras (si lo conozco):",
  compra: "Hola, OEx. Quisiera cotizar una compra asistida.\n\nTienda (SHEIN, Amazon o Temu):\nEnlace del producto o carrito:\nCantidad, talla y color (si aplica):\nMonto de la compra en USD:\nDestino (Managua u Ometepe):",
  rastreo: "Hola, OEx. Necesito ayuda para rastrear un paquete.\n\nNúmero de tracking o código de cliente:\n¿Qué necesito revisar?",
  prealerta: "Hola, OEx. Tengo una consulta sobre cómo registrar mi prealerta.\n\nNúmero de tracking (si ya lo tengo):\nMi consulta:",
  prealertaRegistrada: "Hola, OEx. Ya registré mi prealerta en oexni.com y quisiera hacer una consulta.\n\nNúmero de tracking:\nMi consulta:",
  politicas: "Hola, OEx. Tengo una consulta sobre las políticas del servicio.\n\nTema (entrega, compra, artículos restringidos u otro):\nMi pregunta:",
  guias: "Hola, OEx. Estoy revisando sus guías para comprar en Estados Unidos.\n\n¿Qué quiero comprar o enviar?\nDestino (Managua u Ometepe):\nMi pregunta:"
};
