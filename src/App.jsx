import React, { useEffect, useRef, useState } from "react";
import logo from "./assets/logo.png";
import { supabase } from "./supabase";
import { Package, Plane, Ship, TowerControl, Warehouse, Truck as TruckLucide, Store, Check as CheckLucide, CheckCircle2 } from "lucide-react";

// Anima una sección hacia arriba/opacidad cuando entra en pantalla.
// Respeta prefers-reduced-motion (ver styles.css).
function Reveal({ children, className = "", as: Tag = "div", ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${visible ? "revealIn" : ""} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

// ---- Iconos (SVG propios, trazo fino, en vez de emoji) ----
function Icon({ children, size = 20, ...rest }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

const IconWhatsapp = (p) => (
  <Icon {...p}><path d="M3 21l1.5-4.5A8 8 0 1 1 8.5 19.5L3 21z" /><path d="M8.5 9.5c0 3 2.5 5.5 5.5 5.5.6 0 1-.5.8-1l-.6-1.4c-.2-.4-.6-.6-1-.4l-.8.3a4 4 0 0 1-2.4-2.4l.3-.8c.2-.4 0-.8-.4-1L8.9 8.4c-.5-.2-1 .2-1 .8" /></Icon>
);
const IconPin = (p) => (
  <Icon {...p}><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.4" /></Icon>
);
const IconBox = (p) => (
  <Icon {...p}><path d="M21 8l-9-4-9 4 9 4 9-4z" /><path d="M3 8v8l9 4 9-4V8" /><path d="M12 12v8" /></Icon>
);
const IconTruck = (p) => (
  <Icon {...p}><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" /></Icon>
);
const IconCart = (p) => (
  <Icon {...p}><circle cx="9" cy="20" r="1.3" /><circle cx="18" cy="20" r="1.3" /><path d="M3 4h2l2.4 12.2a1.6 1.6 0 0 0 1.6 1.3h8a1.6 1.6 0 0 0 1.6-1.3L20.5 8H6" /></Icon>
);
const IconBag = (p) => (
  <Icon {...p}><path d="M6 8h12l1 12H5L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></Icon>
);
const IconChat = (p) => (
  <Icon {...p}><path d="M4 5h16v11H8l-4 4V5z" /></Icon>
);
const IconSearch = (p) => (
  <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.4-3.4" /></Icon>
);
const IconArrowRight = (p) => (
  <Icon {...p}><path d="M4 12h16" /><path d="M13 5l7 7-7 7" /></Icon>
);
const IconMenu = (p) => (
  <Icon {...p}><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></Icon>
);
const IconClose = (p) => (
  <Icon {...p}><path d="M6 6l12 12" /><path d="M18 6L6 18" /></Icon>
);
const IconPlus = (p) => (
  <Icon {...p}><path d="M12 5v14" /><path d="M5 12h14" /></Icon>
);
const IconFacebook = (p) => (
  <Icon {...p}><path d="M14 9h3V6h-3a3 3 0 0 0-3 3v2H9v3h2v6h3v-6h2.5l.5-3H14V9z" /></Icon>
);
const IconInstagram = (p) => (
  <Icon {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" /></Icon>
);
const IconCheck = (p) => (
  <Icon {...p}><path d="M4 12l5 5L20 6" /></Icon>
);

const MIAMI_ADDRESS = {
  address: "6619 NW 84th Ave",
  city: "Miami",
  state: "Florida",
  zip: "33166",
  phone: "+1 7867277487"
};

const STORES = [
  { name: "Amazon", file: "amazon.png" },
  { name: "SHEIN", file: "shein.png" },
  { name: "TEMU", file: "temu.png" },
  { name: "Walmart", file: "walmart.png" },
  { name: "eBay", file: "ebay.png" },
  { name: "Nike", file: "nike.png" },
  { name: "Adidas", file: "adidas.png" },
  { name: "Zara", file: "zara.png" }
];

const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/OExni",
  instagram: "https://www.instagram.com/oex.ni"
};

// Tarifas estándar (solo informativas, no calculadora interactiva)
const TARIFAS = [
  { destino: "Ometepe", tipo: "Marítimo", precio: 3, tiempo: "17 a 20 días hábiles" },
  { destino: "Ometepe", tipo: "Aéreo", precio: 7.5, tiempo: "4 a 6 días hábiles" },
  { destino: "Managua", tipo: "Marítimo", precio: 2.5, tiempo: "16 a 19 días hábiles" },
  { destino: "Managua", tipo: "Aéreo", precio: 6.5, tiempo: "3 a 5 días hábiles" }
];

const DESTINOS = ["Ometepe", "Managua"];
const TIPOS_ENVIO = ["Marítimo", "Aéreo"];

export default function App() {
  const path = window.location.pathname;

  if (path === "/prealerta") {
    return <PrealertaPage />;
  }

  if (path === "/rastreo") {
    return <RastreoPage />;
  }

  if (path === "/politicas") {
    return <PoliticasPage />;
  }

  return <LandingPage />;
}

function useWebConfig() {
  const [config, setConfig] = useState({
    whatsapp: "50557067044"
  });

  useEffect(() => {
    const cargarConfig = async () => {
      const { data, error } = await supabase
        .from("configuracion_web")
        .select("clave, valor, activo")
        .eq("activo", true);

      if (error || !data) return;

      const nuevo = {};
      data.forEach((item) => {
        nuevo[item.clave] = item.valor;
      });

      setConfig((prev) => ({ ...prev, ...nuevo }));
    };

    cargarConfig();
  }, []);

  return config;
}

function LandingPage() {
  const config = useWebConfig();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [nombreDireccion, setNombreDireccion] = useState("");
  const [tipoDireccion, setTipoDireccion] = useState("MAR");
  const [copiado, setCopiado] = useState("");

  const nombreEjemplo = nombreDireccion.trim() || "Juan Pérez";
  const whatsappUrl = `https://wa.me/${config.whatsapp || "50557067044"}`;
  const firstNameOex = tipoDireccion === "MAR" ? "OEX MAR" : "OEX AEREO";
  const lastNameOex = nombreEjemplo;

  const copiar = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiado(label);
      setTimeout(() => setCopiado(""), 1800);
    } catch {
      alert("No se pudo copiar. Puedes seleccionarlo manualmente.");
    }
  };

  const copiarDireccionCompleta = async () => {
    const texto = `First Name (Nombre): ${firstNameOex}
Last Name (Apellido): ${lastNameOex}
Address (Dirección): ${MIAMI_ADDRESS.address}
City (Ciudad): ${MIAMI_ADDRESS.city}
State (Estado): ${MIAMI_ADDRESS.state}
ZIP Code (Código Postal): ${MIAMI_ADDRESS.zip}
Phone Number (Teléfono): ${MIAMI_ADDRESS.phone}`;

    await copiar("Dirección completa", texto);
  };

  return (
    <div className="page">
      <nav className="topNav">
        <a className="brand" href="/">
          <img src={logo} className="brandLogo" alt="OEX - OMETEPE EXPRESS" />
          <div>
            <strong>OEX </strong>
            <span>Envíos de USA a Nicaragua</span>
          </div>
        </a>

        <button
          className="menuToggle"
          type="button"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuAbierto}
        >
          {menuAbierto ? <IconClose size={20} /> : <IconMenu size={20} />}
        </button>

        <div className={`navLinks ${menuAbierto ? "navLinksOpen" : ""}`}>
          <a onClick={() => setMenuAbierto(false)} href="#inicio">Inicio</a>
          <a onClick={() => setMenuAbierto(false)} href="/rastreo">Rastrear paquete</a>
          <a onClick={() => setMenuAbierto(false)} href="#tarifas">Tarifas</a>
          <a onClick={() => setMenuAbierto(false)} href="/politicas">Políticas</a>
          <a onClick={() => setMenuAbierto(false)} href="#contacto">Contacto</a>
          <a onClick={() => setMenuAbierto(false)} href="/prealerta" className="mobilePrealerta"><IconBox size={16} /> Prealertar</a>
        </div>

        <div className="navActions">
          <a className="direccionNav" href="#direccion"><IconPin size={16} /> Dirección OEX</a>
          <a className="prealertNav" href="/prealerta"><IconBox size={16} /> Prealertar</a>
          <a className="whatsappNav" href={whatsappUrl} target="_blank" rel="noreferrer">
            <IconWhatsapp size={16} /> WhatsApp
          </a>
        </div>
      </nav>

      <header id="inicio" className="heroNew">
        <div className="heroContent">
          <div className="heroCopy">
            <div className="miniBadge">Miami, USA → Managua y , Nicaragua</div>
            <h1>
              Compra en <span>Estados Unidos</span>,<br />
              recibe en <span>Nicaragua</span>
            </h1>
            <p className="heroDescription">
              Te damos una dirección en Miami, tú compras como siempre y nosotros
              nos encargamos de traer tu paquete hasta tu puerta.
            </p>

            <div className="heroBenefits">
              <Benefit icon={<IconPin size={18} />} title="Dirección gratis en Miami" />
              <Benefit icon={<IconTruck size={18} />} title="Entrega en Ometepe y Managua" />
              <Benefit icon={<IconBag size={18} />} title="Compra asistida, sin tarjeta" />
            </div>

            <div className="heroActions">
              <a href="#direccion" className="primaryCta"><IconPin size={17} /> Obtener dirección OEX</a>
              <a href={`${whatsappUrl}?text=Hola,%20quiero%20cotizar%20un%20envío%20con%20OEX`} target="_blank" rel="noreferrer" className="secondaryCta"><IconWhatsapp size={17} /> Cotizar por WhatsApp</a>
            </div>

            <SocialLinks />
          </div>

          <div className="heroVisual">
            <div className="routeCard">
              <div className="routeCardTop">
                <span className="routeCardTag">Tiempo de tránsito</span>
                <h3>Miami → Nicaragua</h3>
              </div>

              <div className="routeLine">
                <span className="routeDot routeDotStart" />
                <span className="routeDash" />
                <span className="routeDot routeDotEnd" />
              </div>
              <div className="routeCities">
                <span>Miami</span>
                <span>Managua · Ometepe </span>
              </div>

              <div className="routeOptions">
                <div className="routeOption">
                  <div className="routeOptionIcon"><Plane size={18} strokeWidth={1.8} /></div>
                  <div>
                    <b>Aéreo</b>
                    <p>Managua 3–5 · Ometepe 4–6</p>
                  </div>
                </div>
                <div className="routeOption">
                  <div className="routeOptionIcon"><Ship size={18} strokeWidth={1.8} /></div>
                  <div>
                    <b>Marítimo</b>
                    <p>Managua 16–19 · Ometepe 17–20</p>
                  </div>
                </div>
              </div>

              <a href="/prealerta" className="panelCta">Registrar mi tracking <IconArrowRight size={16} /></a>
            </div>
          </div>
        </div>
      </header>

      <main>
        <TrackingTeaser />

        <section id="como-funciona" className="section compactSection">
          <Reveal className="threePanelGrid">
            <div className="whitePanel">
              <SectionMiniTitle title="¿Cómo funciona?" />
              <div className="stepsGraphic">
                <MiniStep number="1" icon={<IconCart size={24} />} title="Compra online" text="Amazon, SHEIN, Temu, Walmart o cualquier tienda." />
                <MiniStep number="2" icon={<IconBox size={24} />} title="Envía a nuestra dirección" text="Usa tu dirección personalizada OEX MAR o OEX AEREO + tu nombre." />
                <MiniStep number="3" icon={<IconTruck size={24} />} title="Recibe en Nicaragua" text="Nos encargamos del traslado y te avisamos por WhatsApp cuando esté listo para retirar." />
              </div>
              <a href="/prealerta" className="orangeButton">Solicitar más información <IconArrowRight size={16} /></a>
            </div>

            <div className="darkPanel">
              <h3>¿Por qué elegir OEX?</h3>
              <WhyItem icon={<IconBag size={20} />} title="Compras asistidas" text="Te ayudamos a comprar si no tienes tarjeta o es tu primera vez." />
              <WhyItem icon={<IconBox size={20} />} title="Rastreo en tiempo real" text="Puedes seguir el estado de tu paquete en todo momento a través de web de manera fácil y rápida." />
              <WhyItem icon={<IconChat size={20} />} title="Atención personalizada" text="Soporte directo por WhatsApp, todos los días." />
              <WhyItem icon={<IconPin size={20} />} title="Presencia local" text="Atención en Ometepe y logística en Managua." />
            </div>
          </Reveal>
        </section>

        <section id="tiendas" className="section storeBand">
          <div className="sectionTitle">
            <span>Tiendas populares</span>
            <h2>Compra en tus tiendas favoritas</h2>
          </div>

          <Reveal className="storeGrid">
            {STORES.map((store) => (
              <div className="storeLogo" key={store.name}>
                <img
                  src={`/stores/${store.file}`}
                  alt={store.name}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling.style.display = "block";
                  }}
                />
                <span className="storeTextFallback">{store.name}</span>
              </div>
            ))}

            <div className="storeLogo moreStores">
              ¡Y muchas más!
            </div>
          </Reveal>
        </section>

        <section id="direccion" className="section addressSection">
          <div className="sectionTitle addressIntroTitle">
            <span>Dirección en Miami</span>
            <h2>¿Primera vez comprando con nosotros?</h2>
            <p>Genera tu dirección OEX y cópiala en segundos.</p>
          </div>

          <Reveal className="addressGrid addressGridV2">
            <div className="addressForm card">
              <label>
                Nombre y apellido del cliente
                <input
                  value={nombreDireccion}
                  onChange={(e) => setNombreDireccion(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                />
              </label>

              <label>
                Tipo de envío
                <select value={tipoDireccion} onChange={(e) => setTipoDireccion(e.target.value)}>
                  <option value="MAR">Marítimo</option>
                  <option value="AEREO">Aéreo</option>
                </select>
              </label>

              <div className="notice">
                Copia estos datos exactamente como aparecen para que podamos identificar correctamente tu paquete.
              </div>
            </div>

            <div className="addressCard card">
              <div className="addressModeBadge">
                {tipoDireccion === "MAR" ? <Ship size={15} strokeWidth={1.8} /> : <Plane size={15} strokeWidth={1.8} />}
                {tipoDireccion === "MAR" ? "Envío Marítimo" : "Envío Aéreo"}
              </div>

              <div className="addressRows">
                <CopyLine label="First Name (Nombre)" value={firstNameOex} onCopy={copiar} />
                <CopyLine label="Last Name (Apellido)" value={lastNameOex} onCopy={copiar} />
                <CopyLine label="Address (Dirección)" value={MIAMI_ADDRESS.address} onCopy={copiar} />
                <CopyLine label="City (Ciudad)" value={MIAMI_ADDRESS.city} onCopy={copiar} />
                <CopyLine label="State (Estado)" value={MIAMI_ADDRESS.state} onCopy={copiar} />
                <CopyLine label="ZIP Code (Código Postal)" value={MIAMI_ADDRESS.zip} onCopy={copiar} />
                <CopyLine label="Phone Number (Teléfono)" value={MIAMI_ADDRESS.phone} onCopy={copiar} />
              </div>

              <button className="copyAllButton" onClick={copiarDireccionCompleta}>
                <IconBox size={17} /> Copiar todos los datos
              </button>

              {copiado && <div className="copied">{copiado} copiado</div>}
            </div>
          </Reveal>
        </section>

        <section id="tarifas" className="section ratesSection">
          <div className="sectionTitle">
            <span>Tarifas</span>
            <h2>Nuestras tarifas estándar</h2>
            <p>Precio por libra según destino y tipo de envío. Para compras especiales, escríbenos por WhatsApp.</p>
          </div>

          <Reveal>
            <RatesTable whatsapp={config.whatsapp || "50557067044"} />
          </Reveal>
        </section>

        <section className="section policyTeaser">
          <div className="policyTeaserBox">
            <div>
              <span>Compra informada</span>
              <h2>Revisa nuestras políticas antes de comprar</h2>
              <p>Queremos que tengas claridad sobre tallas, daños, responsabilidad de compras, tiempos estimados y retiro de paquetes.</p>
            </div>
            <a href="/politicas" className="secondaryCta">Ver políticas de servicio</a>
          </div>
        </section>

        <section id="fecha" className="section dateSection">
          <div className="sectionTitle">
            <span>Fecha estimada</span>
            <h2>Calcula tu fecha aproximada</h2>
            <p>El conteo inicia una vez recibamos tu paquete en nuestra bodega de Miami.</p>
          </div>

          <Reveal>
            <DeliveryCalculator />
          </Reveal>
        </section>

        <section id="preguntas" className="section faqSection">
          <div className="sectionTitle">
            <span>Preguntas frecuentes</span>
            <h2>Resuelve tus dudas antes de comprar</h2>
          </div>

          <Reveal className="faqGrid">
            <Faq question="¿Cuánto tarda en llegar mi paquete?" answer="Desde que recibimos en Miami: Managua tarda de 3 a 5 días hábiles por vía aérea o de 16 a 19 por vía marítima; Ometepe tarda de 4 a 6 días hábiles por vía aérea o de 17 a 20 por vía marítima." />
            <Faq question="¿Entregan en toda Nicaragua?" answer="Trabajamos Ometepe y Managua. Otros destinos pueden coordinarse por WhatsApp." />
            <Faq question="¿Compran por mí en las tiendas?" answer="Sí, podemos ayudarte con compra asistida. Para SHEIN hay opciones específicas de financiamiento." />
            <Faq question="¿Cómo registro mi tracking?" answer="Ingresa a la sección Prealertar, escribe tus datos y agrega uno o varios tracking numbers." />
            <Faq question="¿Necesito tarjeta de crédito?" answer="No necesariamente. Si necesitas ayuda, puedes solicitar compra asistida por WhatsApp." />
            <Faq question="¿Cómo elijo bien mi talla?" answer="Revisa siempre la guía de tallas de la tienda y compara tus medidas en centímetros. No te guíes solo por S, M, L o XL, porque cada tienda puede manejar medidas diferentes." />
            <Faq question="¿Qué pasa si el producto viene en otra talla o diferente?" answer="Si fue compra asistida y verificamos que el error fue nuestro, te damos respaldo 100%. Si fue una compra hecha por ti mismo, la responsabilidad por talla, color, modelo o elección del producto la asumes tú." />
            <Faq question="¿Qué pasa si el producto viene dañado?" answer="Se revisa el caso para determinar si el daño ocurrió durante el envío o si la tienda entregó el producto así. Te orientamos con la evidencia disponible, pero la respuesta final puede depender de la tienda o courier." />
            <Faq question="¿Qué pasa si la tienda pierde mi paquete?" answer="Te orientamos con la información disponible, pero la responsabilidad inicial del despacho depende de la tienda o courier." />
            <Faq question="¿Qué es el tracking y dónde puedo encontrarlo?" answer="El tracking o número de seguimiento es el código que permite consultar el estado y recorrido de tu paquete. Si realizaste la compra por tu cuenta, puedes encontrarlo en el correo de confirmación o envío que te proporciona la tienda, o directamente en tu cuenta de la tienda. Si no lo encuentras, podemos orientarte sobre dónde buscarlo."/>
          </Reveal>
        </section>

        <section id="contacto" className="section finalCtaNew">
          <div>
            <h2>¿Listo para comprar en Estados Unidos?</h2>
            <p>Estamos aquí para ayudarte en todo el proceso.</p>
          </div>
          <a href="https://wa.me/50557067044" target="_blank" rel="noreferrer" className="greenCta">
            <IconWhatsapp size={17} /> Escríbenos por WhatsApp
          </a>
        </section>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

// Pipeline real de OEX — idéntico al que usa el CRM
// (src/utils/estadosEnvio.js). Se replica aquí en la landing porque son
// dos proyectos separados; si algún día cambia el pipeline en el CRM,
// hay que actualizarlo también aquí. IMPORTANTE: los nombres de cada
// parada deben ser EXACTOS a los que guarda el CRM en la columna
// `estado`, o la línea de tiempo no encuentra el paso actual y no se
// dibuja (pasa esto si se usa "Managua"/"Tránsito OEX" en vez de
// "Nicaragua"/"Bodega OEX").
const PIPELINE_COMUN = ["Miami", "Tránsito NI", "Nicaragua", "Bodega OEX"];
const PIPELINE_MANAGUA = [...PIPELINE_COMUN, "Tránsito Managua", "Punto UNI", "Jardines de Veracruz", "Entregado"];
const PIPELINE_OMETEPE = [...PIPELINE_COMUN, "Tránsito Ometepe", "Ometepe", "Entregado"];
const estadosPorDestino = (destino) => (destino === "Managua" ? PIPELINE_MANAGUA : PIPELINE_OMETEPE);

// Ícono por parada — igual que en el pipeline del CRM: "Tránsito NI" usa
// avión o barco según el tipo de envío, el resto es fijo por palabra clave.
// Usa los mismos íconos de lucide-react que el CRM, para que se vean
// idénticos en los dos lados.
function iconoDePaso(paso, tipoEnvio) {
  const esAereo = (tipoEnvio || "").toLowerCase().includes("aére") || (tipoEnvio || "").toLowerCase().includes("aere");

  if (paso === "Entregado") return CheckCircle2;
  if (paso === "Miami") return Package;
  if (paso === "Tránsito NI") return esAereo ? Plane : Ship;
  if (paso === "Nicaragua") return TowerControl;
  if (paso === "Bodega OEX") return Warehouse;
  if (paso === "Tránsito Managua") return TruckLucide;
  if (paso.startsWith("Tránsito")) return Ship;
  return Store; // punto de entrega final (Punto UNI, Jardines de Veracruz, Ometepe...)
}

// Línea de tiempo horizontal del pipeline — se abre al hacer clic en un
// tracking de la lista de resultados por código de cliente, y también se
// muestra directo cuando la búsqueda es por número de tracking.
function formatearFechaCorta(fecha) {
  if (!fecha) return null;
  try {
    return new Date(fecha).toLocaleDateString("es-NI", { day: "numeric", month: "short" });
  } catch {
    return null;
  }
}

// ===== Fecha estimada de llegada =====
//
// Rango de días hábiles esperado según destino + tipo de envío. Días
// hábiles = lunes a viernes — a propósito NO se descuentan feriados,
// para no depender de un calendario que hay que actualizar cada año.
const RANGOS_ENTREGA = {
  Managua: { "Aéreo": [3, 5], "Marítimo": [16, 19] },
  Ometepe: { "Aéreo": [4, 6], "Marítimo": [17, 20] }
};

function sumarDiasHabiles(fechaInicio, cantidadDias) {
  const fecha = new Date(fechaInicio);
  let sumados = 0;
  while (sumados < cantidadDias) {
    fecha.setDate(fecha.getDate() + 1);
    const dia = fecha.getDay(); // 0 = domingo, 6 = sábado
    if (dia !== 0 && dia !== 6) sumados++;
  }
  return fecha;
}

function calcularRangoLlegada(fechaMiami, destino, tipoEnvio) {
  if (!fechaMiami) return null;
  const porDestino = RANGOS_ENTREGA[destino] || RANGOS_ENTREGA.Ometepe;
  const [minDias, maxDias] = porDestino[tipoEnvio] || porDestino["Marítimo"];
  return {
    desde: sumarDiasHabiles(fechaMiami, minDias),
    hasta: sumarDiasHabiles(fechaMiami, maxDias)
  };
}

// El conteo arranca desde que el paquete entró a "Miami" — el primer
// paso real del pipeline. Se busca esa fecha en `historial` (más
// preciso); si el backend todavía no manda historial, se usa
// `fechaRegistro` como respaldo — en la práctica es la misma fecha,
// porque todo tracking nace en Miami al registrarse.
//
// No se muestra nada si ya está "Entregado" (la estimación ya no aporta
// nada ahí) o si no se pudo determinar ninguna fecha de partida.
function EstimacionLlegada({ estado, destino, tipoEnvio, fechaRegistro, historial }) {
  if (estado === "Entregado") return null;

  const fechaMiami = (historial || []).find((h) => h && h.estado === "Miami")?.fecha || fechaRegistro;
  const rango = calcularRangoLlegada(fechaMiami, destino, tipoEnvio);
  if (!rango) return null;

  const opciones = { day: "numeric", month: "short" };
  const desdeTxt = rango.desde.toLocaleDateString("es-NI", opciones);
  const hastaTxt = rango.hasta.toLocaleDateString("es-NI", opciones);
  const textoRango = desdeTxt === hastaTxt ? desdeTxt : `${desdeTxt} – ${hastaTxt}`;

  return (
    <div className="trackingResultRow">
      <span>Llegada estimada</span>
      <b>{textoRango}</b>
    </div>
  );
}

// `historial` es opcional: un arreglo [{ estado, fecha }] con la fecha en
// que el paquete entró a cada parada. Si el backend todavía no lo envía
// (requiere una función/RPC nueva en Supabase), la línea de tiempo se ve
// igual que antes, solo sin fechas debajo de cada punto.
function PipelineTimeline({ estado, destino, tipoEnvio, historial }) {
  const pasos = estadosPorDestino(destino);
  const idxActual = pasos.indexOf(estado);
  if (idxActual === -1) return null;

  const fechaPorPaso = {};
  (historial || []).forEach((h) => {
    if (h && h.estado) fechaPorPaso[h.estado] = h.fecha;
  });

  return (
    <div className="pipelineTimeline" role="list" aria-label="Progreso del envío">
      {pasos.map((paso, i) => {
        const IconoPaso = iconoDePaso(paso, tipoEnvio);
        const completado = i < idxActual;
        const actual = i === idxActual;
        const fecha = formatearFechaCorta(fechaPorPaso[paso]);
        return (
          <div key={paso} role="listitem" className={`pipelineStep ${completado ? "pipelineDone" : ""} ${actual ? "pipelineNow" : ""}`}>
            <div className="pipelineDot">
              <IconoPaso size={14} strokeWidth={2} />
              {completado && (
                <span className="pipelineCheckBadge">
                  <CheckLucide size={10} strokeWidth={3.5} />
                </span>
              )}
            </div>
            <span className="pipelineLabel">{paso}</span>
            {(completado || actual) && fecha && <span className="pipelineDate">{fecha}</span>}
          </div>
        );
      })}
    </div>
  );
}


// Banner corto en la landing que invita a ir a la página de rastreo
// dedicada (/rastreo), en vez de tener el buscador completo embebido aquí.
function TrackingTeaser() {
  return (
    <section className="section trackingSection">
      <Reveal className="trackingBox trackingTeaser card">
        <div className="trackingBoxCopy">
          <span className="trackingEyebrow">Rastreo</span>
          <h2>¿Dónde va tu paquete?</h2>
          <p>Consulta tu tracking individual o ingresa con tu código de cliente y mira el estado de todos tus envíos activos.</p>
        </div>
        <a href="/rastreo" className="primaryCta trackingTeaserCta">
          <IconSearch size={17} /> Rastrear mi paquete
        </a>
      </Reveal>
    </section>
  );
}

function TrackingLookup({ standalone = false }) {
  const [modo, setModo] = useState("tracking"); // "tracking" | "cliente"
  const [valor, setValor] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState("");

  // Modo tracking: un solo resultado.
  const [resultado, setResultado] = useState(null);
  // Modo cliente: lista de trackings + cuál está expandido con su timeline.
  const [resultados, setResultados] = useState(null);
  const [abierto, setAbierto] = useState(null);

  const cambiarModo = (nuevoModo) => {
    setModo(nuevoModo);
    setValor("");
    setError("");
    setResultado(null);
    setResultados(null);
    setAbierto(null);
  };

  const buscar = async (e) => {
    e.preventDefault();
    const texto = valor.trim();
    if (!texto) return;

    setBuscando(true);
    setError("");
    setResultado(null);
    setResultados(null);
    setAbierto(null);

    try {
      if (modo === "tracking") {
        const { data, error: err } = await supabase.rpc("buscar_tracking", { p_tracking: texto });
        if (err) {
          console.error("Error buscando tracking:", err);
          setError("No pudimos consultar el estado. Intenta nuevamente.");
          return;
        }
        if (!data || data.length === 0) {
          setError("No encontramos ese número de tracking. Verifica que esté bien escrito o consúltanos por WhatsApp.");
          return;
        }
        setResultado(data[0]);
      } else {
        const { data, error: err } = await supabase.rpc("buscar_trackings_por_codigo_cliente", { p_codigo: texto });
        if (err) {
          console.error("Error buscando por código de cliente:", err);
          setError("No pudimos consultar tus envíos. Intenta nuevamente.");
          return;
        }
        if (!data || data.length === 0) {
          setError("No encontramos envíos activos con ese código. Verifica que esté bien escrito o consúltanos por WhatsApp.");
          return;
        }
        setResultados(data);
      }
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error inesperado. Intenta nuevamente.");
    } finally {
      setBuscando(false);
    }
  };

  const enviosActivos = (resultados || []).filter((r) => r.estado !== "Prealertado");
  const prealertados = (resultados || []).filter((r) => r.estado === "Prealertado");

  return (
    <section id="rastreo" className={`section trackingSection ${standalone ? "trackingSectionPage" : ""}`}>
      <Reveal className="trackingBox card">
        <div className="trackingBoxCopy">
          <span className="trackingEyebrow">Rastreo</span>
          <h2>¿Dónde va tu paquete?</h2>
          <p>Busca un paquete por su tracking o consulta todos tus envíos con tu código de cliente.</p>
        </div>

        <div className="trackingModeToggle" role="tablist" aria-label="Buscar por">
          <button type="button" role="tab" aria-selected={modo === "tracking"} className={modo === "tracking" ? "trackingModeActive" : ""} onClick={() => cambiarModo("tracking")}>
            Por tracking
          </button>
          <button type="button" role="tab" aria-selected={modo === "cliente"} className={modo === "cliente" ? "trackingModeActive" : ""} onClick={() => cambiarModo("cliente")}>
            Por código de cliente
          </button>
        </div>

        <form className="trackingForm" onSubmit={buscar}>
          <input
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder={modo === "tracking" ? "Ej. 1Z999AA10123456784" : "Ej. XXXXX"}
            aria-label={modo === "tracking" ? "Número de tracking" : "Código de cliente"}
          />
          <button type="submit" className="primaryCta" disabled={buscando}>
            {buscando ? "Buscando..." : <><IconSearch size={17} /> {modo === "tracking" ? "Rastrear" : "Ver mis envíos"}</>}
          </button>
        </form>

        {error && <div className="notice trackingError">{error}</div>}

        {resultado && (
          <div className="trackingResult">
            <div className="trackingResultRow">
              <span>Tracking</span>
              <b>{resultado.tracking}</b>
            </div>
            <div className="trackingResultRow">
              <span>Estado</span>
              <b className="trackingStatusPill">{resultado.estado}</b>
            </div>
            <div className="trackingResultRow">
              <span>Destino</span>
              <b>{resultado.destino}</b>
            </div>
            <div className="trackingResultRow">
              <span>Tipo de envío</span>
              <b>{resultado.tipo_envio}</b>
            </div>
            <div className="trackingResultRow">
              <span>Registrado</span>
              <b>
                {resultado.fecha
                  ? new Date(resultado.fecha).toLocaleDateString("es-NI", { day: "numeric", month: "long", year: "numeric" })
                  : "—"}
              </b>
            </div>
            <EstimacionLlegada estado={resultado.estado} destino={resultado.destino} tipoEnvio={resultado.tipo_envio} fechaRegistro={resultado.fecha} historial={resultado.historial} />
            <PipelineTimeline estado={resultado.estado} destino={resultado.destino} tipoEnvio={resultado.tipo_envio} historial={resultado.historial} />
          </div>
        )}

        {resultados && (
          <div className="trackingResultsList">
            {resultados[0]?.cliente_nombre && (
              <p className="trackingGreeting">Hola, {resultados[0].cliente_nombre.split(" ")[0]} 👋 Este es el estado de tus envíos:</p>
            )}

            {enviosActivos.length > 0 ? (
              enviosActivos.map((r) => {
                const expandido = abierto === r.tracking;
                return (
                  <div key={r.tracking} className={`trackingResultCard ${expandido ? "trackingResultCardOpen" : ""}`}>
                    <button
                      type="button"
                      className="trackingResultCardHead"
                      onClick={() => setAbierto(expandido ? null : r.tracking)}
                      aria-expanded={expandido}
                    >
                      <div className="trackingResultCardInfo">
                        <b>{r.tracking}</b>
                        <span>{r.destino} · {r.tipo_envio}</span>
                      </div>
                      <b className="trackingStatusPill">{r.estado}</b>
                      <IconArrowRight size={16} className={`trackingResultChevron ${expandido ? "trackingResultChevronOpen" : ""}`} />
                    </button>
                    {expandido && (
                      <div className="trackingResultCardBody">
                        <EstimacionLlegada estado={r.estado} destino={r.destino} tipoEnvio={r.tipo_envio} fechaRegistro={r.fecha} historial={r.historial} />
                        <PipelineTimeline estado={r.estado} destino={r.destino} tipoEnvio={r.tipo_envio} historial={r.historial} />
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="trackingEmpty">No tienes envíos activos en este momento.</p>
            )}

            {prealertados.length > 0 && (
              <details className="prealertedDropdown">
                <summary>
                  <span>Trackings prealertados</span>
                  <b>{prealertados.length}</b>
                </summary>
                <ul>
                  {prealertados.map((r) => (
                    <li key={r.tracking}>{r.tracking}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}
      </Reveal>
    </section>
  );
}

function RatesTable({ whatsapp }) {
  return (
    <div className="ratesTableWrap card">
      <div className="ratesGrid">
        {TARIFAS.map((tarifa) => (
          <div className="rateCard" key={`${tarifa.destino}-${tarifa.tipo}`}>
            <div className="rateCardHead">
              <span className="rateDestino">{tarifa.destino}</span>
              <span className="rateTipo">{tarifa.tipo === "Aéreo" ? <Plane size={14} strokeWidth={1.8} /> : <Ship size={14} strokeWidth={1.8} />} {tarifa.tipo}</span>
            </div>
            <div className="ratePrice">
              <strong>${tarifa.precio.toFixed(2)}</strong>
              <small>por libra</small>
            </div>
            <div className="rateTime">{tarifa.tiempo}</div>
          </div>
        ))}
      </div>

      <div className="notice">
        Sin redondeos de peso. El costo final se calcula con el peso real recibido en Managua.
      </div>

      <a
        className="blueButton"
        href={`https://wa.me/${whatsapp}?text=Hola,%20quiero%20cotizar%20un%20env%C3%ADo%20con%20OEX`}
        target="_blank"
        rel="noreferrer"
      >
        <IconWhatsapp size={17} /> Cotizar por WhatsApp
      </a>
    </div>
  );
}

function DeliveryCalculator() {
  const [fechaBodega, setFechaBodega] = useState("");
  const [destino, setDestino] = useState("Managua");
  const [tipoEnvio, setTipoEnvio] = useState("Aéreo");

  const [min, max] = RANGOS_ENTREGA[destino][tipoEnvio];
  const rango = {
    min,
    max,
    label: `${min} a ${max} días hábiles aproximados`
  };

  const formatearFecha = (fecha) => {
    return fecha.toLocaleDateString("es-NI", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const sumarDiasHabiles = (fecha, dias) => {
    const resultado = new Date(fecha);
    let agregados = 0;

    while (agregados < dias) {
      resultado.setDate(resultado.getDate() + 1);
      const dia = resultado.getDay();

      if (dia !== 0 && dia !== 6) {
        agregados++;
      }
    }

    return resultado;
  };

  const fechaMin = fechaBodega
    ? sumarDiasHabiles(new Date(fechaBodega + "T12:00:00"), rango.min)
    : null;

  const fechaMax = fechaBodega
    ? sumarDiasHabiles(new Date(fechaBodega + "T12:00:00"), rango.max)
    : null;

  return (
    <div className="calculatorGrid">
      <div className="calculatorCard card">
        <label>
          Fecha en que recibimos tu paquete en bodega Miami
          <input
            type="date"
            value={fechaBodega}
            onChange={(e) => setFechaBodega(e.target.value)}
          />
        </label>

        <label>
          Destino
          <select value={destino} onChange={(e) => setDestino(e.target.value)}>
            <option value="Managua">Managua</option>
            <option value="Ometepe">Ometepe</option>
          </select>
        </label>

        <label>
          Tipo de envío
          <select value={tipoEnvio} onChange={(e) => setTipoEnvio(e.target.value)}>
            <option value="Aéreo">Aéreo</option>
            <option value="Marítimo">Marítimo</option>
          </select>
        </label>

        <div className="notice">
          Las fechas son aproximadas. El conteo inicia una vez recibamos tu paquete en Miami.
        </div>
      </div>

      <div className="calculatorResult">
        <span>Resultado estimado</span>
        <h3>{tipoEnvio} · {destino}</h3>

        {!fechaBodega ? (
          <p>Selecciona la fecha en que recibimos tu paquete.</p>
        ) : (
          <>
            <p className="estimateRange">{rango.label}</p>
            <div className="dateBox">
              <small>Fecha aproximada entre:</small>
              <strong>{formatearFecha(fechaMin)}</strong>
              <strong>{formatearFecha(fechaMax)}</strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Benefit({ icon, title }) {
  return (
    <div className="benefit">
      <span>{icon}</span>
      <b>{title}</b>
    </div>
  );
}

function SectionMiniTitle({ title }) {
  return <h3 className="panelTitle">{title}</h3>;
}

function MiniStep({ number, icon, title, text }) {
  return (
    <div className="miniStep">
      <span className="stepNumber">{number}</span>
      <div className="miniIcon">{icon}</div>
      <b>{title}</b>
      <p>{text}</p>
    </div>
  );
}

function WhyItem({ icon, title, text }) {
  return (
    <div className="whyItem">
      <span>{icon}</span>
      <div>
        <b>{title}</b>
        <p>{text}</p>
      </div>
    </div>
  );
}

function Faq({ question, answer }) {
  return (
    <details className="faqItem">
      <summary>{question}</summary>
      <p>{answer}</p>
    </details>
  );
}

function CopyLine({ label, value, onCopy }) {
  return (
    <div className="copyLine">
      <div>
        <span>{label}</span>
        <b>{value}</b>
      </div>
      <button type="button" onClick={() => onCopy(label, value)}>Copiar</button>
    </div>
  );
}

function SocialLinks() {
  return (
    <div className="socialLinks">
      <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noreferrer"><IconFacebook size={15} /> Facebook</a>
      <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer"><IconInstagram size={15} /> Instagram</a>
    </div>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      className="floatingWhatsApp"
      href="https://wa.me/50557067044?text=Hola,%20necesito%20ayuda%20con%20Ometepe%20Express"
      target="_blank"
      rel="noreferrer"
      aria-label="Escríbenos por WhatsApp"
    >
      <IconWhatsapp size={26} />
    </a>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <img src={logo} className="footerLogo" alt="Ometepe Express" />
        <p>Tu mejor opción para compras en Estados Unidos con  envíos a Managua y Ometepe .</p>
      </div>

      <div>
        <b>Contacto</b>
        <p>WhatsApp: 505 57067044</p>
        <p>Ometepe · Managua</p>
        <div className="footerSocials">
          <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noreferrer"><IconFacebook size={15} /> Facebook</a>
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer"><IconInstagram size={15} /> Instagram</a>
        </div>
      </div>

      <div>
        <b>OEX |  Managua - Ometepe </b>
        <p>Compras y paquetería USA a Nicaragua</p>
        <p><a href="/politicas">Políticas de servicio</a></p>
        <p>Ometepe Express 2026</p>
      </div>
    </footer>
  );
}

function crearTrackingVacio() {
  return {
    codigo: "",
    remitente: "",
    destino: "Ometepe",
    tipoEnvio: "Marítimo"
  };
}

// Normaliza un número de WhatsApp de Nicaragua: acepta que lo escriban
// con o sin el código 505 (con espacios, guiones o +), y siempre guarda
// el mismo formato "505########" para que el equipo pueda buscarlo o
// contactarlo sin ambigüedad.
function normalizarWhatsapp(valor) {
  const soloDigitos = (valor || "").replace(/\D/g, "");
  if (!soloDigitos) return "";
  if (soloDigitos.startsWith("505") && soloDigitos.length > 8) return soloDigitos;
  return `505${soloDigitos}`;
}

// Título de sección del formulario con un ícono en círculo de color —
// le da un punto de color a cada bloque en vez de solo texto en navy.
function FormSectionTitle({ icon, tone = "coral", children }) {
  const Icono = icon;
  return (
    <h2 className="formSectionTitle">
      <span className={`formSectionIcon formSectionIcon-${tone}`}><Icono size={15} /></span>
      {children}
    </h2>
  );
}

function PrealertaPage() {
  const [tipoCliente, setTipoCliente] = useState("nuevo");
  const [codigoCliente, setCodigoCliente] = useState("");
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [trackings, setTrackings] = useState([crearTrackingVacio()]);
  const [nota, setNota] = useState("");
  const [aceptaPoliticas, setAceptaPoliticas] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  const cambiarTracking = (index, campo, valor) => {
    const copia = [...trackings];
    copia[index] = { ...copia[index], [campo]: valor };
    setTrackings(copia);
  };

  const agregarTracking = () => setTrackings([...trackings, crearTrackingVacio()]);

  const eliminarTracking = (index) => {
    if (trackings.length === 1) return setTrackings([crearTrackingVacio()]);
    setTrackings(trackings.filter((_, i) => i !== index));
  };

  const registrar = async (e) => {
    e.preventDefault();
    setMensaje("");

    const trackingsCompletos = trackings.filter((t) => t.codigo.trim());

    if (tipoCliente === "nuevo" && !nombre.trim()) return setMensaje("Escribe tu nombre completo.");
    if (!whatsapp.trim()) return setMensaje("Escribe tu número de WhatsApp, con o sin el 505.");
    if (trackingsCompletos.length === 0) return setMensaje("Agrega al menos un tracking.");

    const trackingIncompleto = trackingsCompletos.find((t) => !t.remitente.trim());
    if (trackingIncompleto) return setMensaje("Indica el remitente o plataforma donde compraste cada tracking.");

    if (!aceptaPoliticas) return setMensaje("Debes aceptar las políticas del servicio.");

    try {
      setEnviando(true);

      const registros = trackingsCompletos.map((t) => ({
        cliente: tipoCliente === "nuevo" ? nombre.trim() : null,
        contacto: normalizarWhatsapp(whatsapp),
        cliente_codigo: tipoCliente === "existente" && codigoCliente.trim() ? codigoCliente.trim().toUpperCase() : null,
        destino: t.destino,
        tipo_envio: t.tipoEnvio,
        courier: t.remitente.trim(),
        tracking: t.codigo.trim(),
        nota: nota.trim(),
        estado: "Prealertado",
        fecha: new Date().toISOString()
      }));

      const { error } = await supabase
        .from("tracking_registros")
        .insert(registros);

      if (error) {
        console.error("Error guardando prealerta:", error);
        setMensaje("No pudimos registrar tu paquete. Intenta nuevamente o escríbenos por WhatsApp.");
        return;
      }

      setMensaje("✅ Prealerta recibida. Gracias por registrar tu paquete. Revisaremos la información y te contactaremos por WhatsApp.");

      setTipoCliente("nuevo");
      setCodigoCliente("");
      setNombre("");
      setWhatsapp("");
      setTrackings([crearTrackingVacio()]);
      setNota("");
      setAceptaPoliticas(false);
    } catch (error) {
      console.error(error);
      setMensaje("Ocurrió un error inesperado. Intenta nuevamente o escríbenos por WhatsApp.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="page formPage">
      <nav className="topNav simpleNav">
        <a className="brand" href="/">
          <img src={logo} className="brandLogo" alt="OEX" />
          <div>
            <strong>OEX</strong>
            <span>Prealerta de paquetes</span>
          </div>
        </a>

        <a href="/" className="navButton">Volver al inicio</a>
      </nav>

      <main className="prealertaWrap">
        <section className="prealertaIntro">
          <div className="miniBadge">Prealerta</div>
          <h1>Registra tu paquete</h1>
          <p>
            Completa la información para que podamos identificar tu paquete cuando llegue a nuestra bodega en Miami.
          </p>

          <div className="notice">
            Registra el Tracking Number. Al enviarlo, tu prealerta llegará directamente a nuestro sistema.
          </div>
        </section>

        <form className="formCard largeForm" onSubmit={registrar}>
          <FormSectionTitle icon={IconCheck} tone="coral">¿Ya eres cliente OEX?</FormSectionTitle>

          <div className="clientTypeToggle">
            <button
              type="button"
              className={tipoCliente === "nuevo" ? "clientTypeActive" : ""}
              onClick={() => setTipoCliente("nuevo")}
            >
              <IconBag size={16} /> Cliente nuevo
            </button>
            <button
              type="button"
              className={tipoCliente === "existente" ? "clientTypeActive" : ""}
              onClick={() => setTipoCliente("existente")}
            >
              <IconCheck size={16} /> Ya soy cliente
            </button>
          </div>

          {tipoCliente === "existente" && (
            <label>
              Código de cliente (opcional)
              <input
                value={codigoCliente}
                onChange={(e) => setCodigoCliente(e.target.value)}
                placeholder="Ej. XXXXX"
                autoCapitalize="characters"
                autoComplete="off"
              />
              <small className="helpText">
                Si lo tienes a la mano nos ayuda a encontrarte más rápido, pero no es obligatorio — con tu WhatsApp es suficiente.
              </small>
            </label>
          )}

          <FormSectionTitle icon={IconBag} tone="orange">Datos personales</FormSectionTitle>

          {tipoCliente === "nuevo" && (
            <label>
              Nombre y apellido (obligatorio)
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Juan Pérez" />
            </label>
          )}

          <label>
            WhatsApp (obligatorio)
            <input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Ej. 57067044 o 50557067044"
              inputMode="tel"
              required
            />
            <small className="helpText">
              Puedes escribirlo con o sin el 505 adelante. Lo usamos para{" "}
              {tipoCliente === "nuevo" ? "vincular tu cuenta de cliente y " : ""}
              avisarte del estado de tu paquete.
            </small>
          </label>

          <FormSectionTitle icon={IconBox} tone="green">Tus trackings</FormSectionTitle>

          <div className="trackingCards">
            {trackings.map((t, index) => (
              <div className="trackingCard" key={index}>
                <div className="trackingCardHead">
                  <span className="trackingCardBadge">Tracking {index + 1}</span>
                  <button type="button" onClick={() => eliminarTracking(index)}>Eliminar</button>
                </div>

                <label>
                  Número de tracking
                  <input
                    value={t.codigo}
                    onChange={(e) => cambiarTracking(index, "codigo", e.target.value)}
                    placeholder="Ej. 1Z999AA10123456784"
                  />
                </label>

                <label>
                  Remitente o plataforma donde compró
                  <input
                    value={t.remitente}
                    onChange={(e) => cambiarTracking(index, "remitente", e.target.value)}
                    placeholder="Ej. Amazon, SHEIN, Temu, Walmart..."
                    list="remitentes-sugeridos"
                  />
                </label>

                <div className="twoColumns">
                  <label>
                    Destino
                    <select value={t.destino} onChange={(e) => cambiarTracking(index, "destino", e.target.value)}>
                      {DESTINOS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Tipo de envío
                    <select value={t.tipoEnvio} onChange={(e) => cambiarTracking(index, "tipoEnvio", e.target.value)}>
                      {TIPOS_ENVIO.map((tp) => (
                        <option key={tp} value={tp}>{tp}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <datalist id="remitentes-sugeridos">
            {STORES.map((store) => (
              <option key={store.name} value={store.name} />
            ))}
          </datalist>

          <button type="button" className="ghostButton" onClick={agregarTracking}>
            <IconPlus size={15} /> Agregar otro tracking
          </button>

          <label>
            Nota (opcional)
            <textarea
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Ej. Compra de ropa, caja pequeña, viene a mi nombre, etc."
            />
          </label>

          <label className="check">
            <input
              type="checkbox"
              checked={aceptaPoliticas}
              onChange={(e) => setAceptaPoliticas(e.target.checked)}
            />
            <span>He leído y acepto las <a href="/politicas" target="_blank" rel="noreferrer">políticas del servicio</a>.</span>
          </label>

          {mensaje && <div className="message">{mensaje}</div>}

          {mensaje.startsWith("✅") && (
            <div className="successCard">
              <h3>Tu prealerta fue registrada</h3>
              <p>Ahora nuestro equipo podrá identificar tu paquete cuando llegue a Miami.</p>
              <a href="https://wa.me/50557067044" target="_blank" rel="noreferrer">
                Consultar por WhatsApp
              </a>
            </div>
          )}

          <button className="submitButton" disabled={enviando}>
            {enviando ? "Registrando..." : <><IconBox size={17} /> Registrar mi paquete</>}
          </button>
        </form>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

function InstallAppButton() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [esIos, setEsIos] = useState(false);
  const [instalada, setInstalada] = useState(false);

  useEffect(() => {
    const enModoApp =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    setInstalada(enModoApp);
    setEsIos(/iphone|ipad|ipod/i.test(window.navigator.userAgent) && !enModoApp);

    const guardarPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    const confirmarInstalacion = () => {
      setInstalada(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", guardarPrompt);
    window.addEventListener("appinstalled", confirmarInstalacion);

    return () => {
      window.removeEventListener("beforeinstallprompt", guardarPrompt);
      window.removeEventListener("appinstalled", confirmarInstalacion);
    };
  }, []);

  if (instalada || (!installPrompt && !esIos)) return null;

  const instalar = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      await installPrompt.userChoice;
      setInstallPrompt(null);
      return;
    }

    alert("En iPhone: toca Compartir y luego “Agregar a pantalla de inicio”.");
  };

  return (
    <button type="button" className="installAppButton" onClick={instalar}>
      <IconBox size={17} /> Instalar app de rastreo
    </button>
  );
}

function RastreoPage() {
  return (
    <div className="page formPage">
      <nav className="topNav simpleNav">
        <a className="brand" href="/">
          <img src={logo} className="brandLogo" alt="OEX" />
          <div>
            <strong>OEX</strong>
            <span>Rastreo de paquetes</span>
          </div>
        </a>

        <a href="/" className="navButton">← Inicio</a>
      </nav>

      <main className="prealertaWrap">
        <div className="trackingQuickActions">
          <a href="/prealerta" className="prealertQuickButton">
            <IconPlus size={17} /> Prealertar tracking nuevo
          </a>
          <InstallAppButton />
        </div>
        <TrackingLookup standalone />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

function PoliticasPage() {
  return (
    <div className="page policyPage">
      <nav className="topNav simpleNav">
        <a className="brand" href="/">
          <img src={logo} className="brandLogo" alt="OEX" />
          <div>
            <strong>OEX | Ometepe Express</strong>
            <span>Políticas de servicio</span>
          </div>
        </a>

        <a href="/" className="navButton">Volver al inicio</a>
      </nav>

      <main className="policyWrap">
        <section className="policyHero">
          <div className="miniBadge">Claridad antes de comprar</div>
          <h1>Políticas de servicio OEX</h1>
          <p>Estas condiciones nos ayudan a brindarte un servicio más ordenado, claro y responsable. Recomendamos leerlas antes de realizar compras o prealertar paquetes.</p>
        </section>

        <section className="policyGridFull">
          <PolicyBlock title="Tallas y medidas" text="Antes de comprar ropa, calzado o accesorios, revisa la guía de tallas de la tienda y compara tus medidas en centímetros. No recomendamos elegir únicamente por S, M, L o XL. No somos responsables por elecciones incorrectas." />
          <PolicyBlock title="Compras asistidas" text="Cuando OEX realiza una compra asistida y se presenta algún inconveniente, verificamos si el error es atribuible a nuestro equipo. Si así fuera, te brindamos respaldo del 100% y asumimos la responsabilidad por dicho error." />
          <PolicyBlock title="Compras realizadas por el cliente" text="Si el cliente realiza la compra por su cuenta, la responsabilidad sobre talla, color, modelo, cantidad, dirección colocada o selección del producto corresponde al cliente." />
          <PolicyBlock title="Productos dañados" text="Si un producto llega dañado, se revisará el caso para determinar si el daño ocurrió durante el envío o si la tienda lo entregó en ese estado. Se solicitará evidencia como fotos, factura, empaque y tracking." />
          <PolicyBlock title="Tiempos de entrega" text="Los tiempos son aproximados. El conteo inicia cuando el paquete es recibido en Miami. Para evitar retrasos, recomendamos elegir el método de envío adecuado según tus necesidades y prealertar tu compra." />
          <PolicyBlock title="Peso final y cobro" text="El costo final se calcula con el peso real recibido en Managua. El peso mostrado por la tienda o etiquetas de proveedores logísticos puede variar." />
          <PolicyBlock title="Artículos restringidos" text="No transportamos productos ilegales,  explosivos, vapes y accesorios de vapeo, medicamentos controlados, cámaras ocultas, armas, dinero en efectivo, sustancias peligrosas o artículos prohibidos por aduana. El envío de estos artículos puede ocasionar retención o decomiso. OEX no es responsable por pérdidas derivadas por incumplimiento." />
          <PolicyBlock title="Pagos y entrega" text="Todo saldo pendiente debe cancelarse antes de la entrega del paquete. Puede solicitarse referencia bancaria o comprobante de pago." />
          <PolicyBlock title="Reclamos" text="Cualquier reclamo debe notificarse lo antes posible después de recibir el paquete, idealmente dentro de las primeras 16 horas." />
          <PolicyBlock title="Privacidad" text="Los datos proporcionados en formularios, prealertas o mensajes se utilizan únicamente para gestionar compras, envíos y seguimiento operativo." />
        </section>

        <div className="policyFinal">
          <h2>¿Tienes dudas antes de comprar?</h2>
          <p>Escríbenos y te ayudamos a entender el proceso antes de realizar tu pedido.</p>
          <a href="https://wa.me/50557067044" target="_blank" rel="noreferrer" className="greenCta"><IconWhatsapp size={17} /> Consultar por WhatsApp</a>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

function PolicyBlock({ title, text }) {
  return (
    <article className="policyBlock">
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}