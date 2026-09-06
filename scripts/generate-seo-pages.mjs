import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const dist = join(process.cwd(), "dist");
const template = await readFile(join(dist, "index.html"), "utf8");
const site = "https://oexni.com";

const businessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "OEX Nicaragua",
  alternateName: "Ometepe Express",
  url: `${site}/`,
  logo: `${site}/oex-icon-512.png`,
  image: `${site}/og-image.jpg`,
  telephone: "+50557067044",
  description: "Servicio de compras y envíos desde Estados Unidos hacia Managua y Ometepe, Nicaragua.",
  areaServed: [
    { "@type": "City", name: "Managua" },
    { "@type": "Place", name: "Isla de Ometepe" }
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+50557067044",
    contactType: "customer service",
    availableLanguage: "Spanish"
  }
};

const pages = [
  {
    path: "/",
    title: "OEX Nicaragua | Envíos desde Estados Unidos a Nicaragua",
    description: "Compra en Amazon, SHEIN, Temu y más. Recibe tus paquetes en Managua u Ometepe con dirección en Miami, prealerta y rastreo OEX.",
    schema: businessSchema,
    body: `<main><h1>Envíos desde Estados Unidos a Nicaragua con OEX</h1><p>Compra en tus tiendas favoritas, usa nuestra dirección en Miami y recibe en Managua u Ometepe por vía aérea o marítima.</p><p>Consulta tarifas estándar, tiempos de entrega, prealerta y rastreo de paquetes.</p></main>`
  },
  {
    path: "/guias",
    title: "Guías para comprar en Estados Unidos y recibir en Nicaragua | OEX",
    description: "Guías de OEX sobre envíos a Nicaragua, compras en SHEIN, tracking, prealertas y modalidades aéreas o marítimas.",
    body: `<main><h1>Guías para comprar y recibir paquetes en Nicaragua</h1><p>Aprende a comprar en Estados Unidos, elegir entre envío aéreo o marítimo y prealertar tus trackings con OEX.</p></main>`
  },
  {
    path: "/guias/envios-estados-unidos-nicaragua-2026",
    title: "Envíos de Estados Unidos a Nicaragua 2026: tarifas y tiempos | OEX",
    description: "Conoce tarifas, tiempos y el proceso para enviar paquetes desde Estados Unidos a Managua y Ometepe durante 2026 con OEX.",
    category: "Envíos a Nicaragua",
    body: `<main><article><h1>Envíos de Estados Unidos a Nicaragua 2026</h1><p>Guía actualizada de tarifas, tiempos y proceso para recibir paquetes en Managua y Ometepe.</p><h2>Tarifas y destinos</h2><p>OEX ofrece envíos aéreos y marítimos desde Miami. El precio y el tiempo dependen del destino y la modalidad elegida.</p></article></main>`
  },
  {
    path: "/guias/envio-aereo-o-maritimo-nicaragua",
    title: "Envío aéreo o marítimo a Nicaragua: cuál elegir | OEX",
    description: "Compara costos, tiempos y usos del envío aéreo y marítimo desde Estados Unidos hacia Nicaragua.",
    category: "Modalidades de envío",
    body: `<main><article><h1>Envío aéreo o marítimo a Nicaragua</h1><p>Compara ambas modalidades para elegir según la urgencia, el peso y el tipo de producto.</p><h2>Diferencias principales</h2><p>El envío aéreo prioriza rapidez; el marítimo suele ser más conveniente para compras sin urgencia.</p></article></main>`
  },
  {
    path: "/guias/como-comprar-shein-nicaragua",
    title: "Cómo comprar en SHEIN desde Nicaragua paso a paso | OEX",
    description: "Aprende a comprar en SHEIN desde Nicaragua, colocar tu dirección OEX en Miami y prealertar el tracking.",
    category: "Compras en línea",
    body: `<main><article><h1>Cómo comprar en SHEIN desde Nicaragua</h1><p>Agrega tus productos, utiliza la dirección OEX en Miami, paga tu compra y registra el tracking cuando SHEIN lo proporcione.</p><h2>Recibe tu compra con OEX</h2><p>Después de prealertar, podrás consultar el avance del paquete y pagar el peso según la tarifa aplicable.</p></article></main>`
  },
  {
    path: "/guias/que-es-tracking-como-prealertarlo",
    title: "Qué es un tracking y cómo prealertarlo en OEX",
    description: "Descubre dónde encontrar el tracking de tu compra y cómo prealertarlo para identificar tu paquete en Miami.",
    category: "Rastreo y prealerta",
    body: `<main><article><h1>Qué es un tracking y cómo prealertarlo</h1><p>El tracking es el número que identifica el recorrido de tu paquete. La tienda o transportista lo entrega después del despacho.</p><h2>Cómo prealertar</h2><p>Registra el número en OEX junto con el remitente, destino y modalidad para facilitar su identificación.</p></article></main>`
  },
  {
    path: "/politicas",
    title: "Políticas de servicio | OEX Nicaragua",
    description: "Consulta las políticas de compras, envíos, pagos, reclamos, privacidad y comunicaciones de OEX Nicaragua.",
    body: `<main><h1>Políticas de servicio OEX</h1><p>Condiciones sobre compras, envíos, peso final, pagos, reclamos, privacidad y comunicaciones por WhatsApp.</p></main>`
  },
  {
    path: "/rastreo",
    title: "Rastrear paquete | OEX Nicaragua",
    description: "Consulta el estado de tus paquetes OEX por tracking o código de cliente.",
    noindex: true,
    body: `<main><h1>Rastrea tu paquete OEX</h1><p>Consulta el estado usando tu número de tracking o código de cliente.</p></main>`
  },
  {
    path: "/prealerta",
    title: "Prealertar tracking | OEX Nicaragua",
    description: "Registra tu tracking para que OEX identifique tu paquete cuando llegue a Miami.",
    noindex: true,
    body: `<main><h1>Prealerta tu tracking en OEX</h1><p>Registra tus datos y el número de seguimiento antes de que el paquete llegue a Miami.</p></main>`
  }
];

function articleSchema(page) {
  if (!page.category) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title.split(" | ")[0],
    description: page.description,
    dateModified: "2026-09-06",
    inLanguage: "es-NI",
    author: { "@type": "Organization", name: "OEX Nicaragua" },
    publisher: { "@type": "Organization", name: "OEX Nicaragua", logo: { "@type": "ImageObject", url: `${site}/oex-icon-512.png` } },
    mainEntityOfPage: `${site}${page.path}`
  };
}

function breadcrumbSchema(page) {
  if (!page.path.startsWith("/guias/")) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${site}/` },
      { "@type": "ListItem", position: 2, name: "Guías", item: `${site}/guias` },
      { "@type": "ListItem", position: 3, name: page.title.split(" | ")[0], item: `${site}${page.path}` }
    ]
  };
}

function render(page) {
  const url = `${site}${page.path}`;
  const schemas = [page.schema, articleSchema(page), breadcrumbSchema(page)].filter(Boolean);
  const jsonLd = schemas.map((schema) => `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`).join("\n    ");
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${page.title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${page.description}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${page.title}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${page.description}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:type" content="[^"]*"\s*\/>/, `<meta property="og:type" content="${page.category ? "article" : "website"}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${page.title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${page.description}" />`)
    .replace("</head>", `${page.noindex ? '<meta name="robots" content="noindex,follow" />' : ""}\n    ${jsonLd}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${page.body}</div>`);
  return html;
}

for (const page of pages) {
  const file = page.path === "/" ? join(dist, "index.html") : join(dist, page.path.slice(1), "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, render(page));
}

console.log(`Generated ${pages.length} SEO-ready HTML pages.`);
