import { useState } from "react";
import { supabase } from "./supabase";
import { documentosSocios, bannersSocios } from "./recursosSocios";

export default function SociosPage({ Nav, Footer, Seo, useWebConfig }) {
  const [recursos, setRecursos] = useState([]);
  const [errorBiblioteca, setErrorBiblioteca] = useState("");
  const [descargando, setDescargando] = useState(null);
  const [codigo, setCodigo] = useState("");
  const [socio, setSocio] = useState(null);
  const [foto, setFoto] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [copiado, setCopiado] = useState("");
  const config = useWebConfig();
  const enlace = socio ? "https://oexni.com/prealerta/" + socio.identificador : "";
  const whatsapp = "https://wa.me/" + (config.whatsapp || "50557067044") + "?text=" + encodeURIComponent(socio ? "Hola OEX, soy " + socio.nombre + ". Mi código de socio es " + socio.identificador.toUpperCase() + ". Quisiera solicitar mi informe de recomendaciones." : "Hola OEX, quisiera información sobre el programa de socios.");
  const ingresar = async e => {
    e.preventDefault(); setError(""); setCargando(true);
    try {
      const valor = codigo.trim().toLowerCase();
      if (!/^[a-z0-9_-]{1,64}$/.test(valor)) throw new Error("Revisa tu código de socio.");
      const { data, error: fallo } = await supabase.from("socios_recomendacion_publicos").select("nombre,identificador,foto_path").eq("identificador", valor).maybeSingle();
      if (fallo) throw new Error("No pudimos validar el código. Intenta nuevamente.");
      if (!data) throw new Error("No encontramos un socio activo con ese código. Confírmalo con OEX.");
      setFoto(null);
      if (data.foto_path) {
        try { const { data: imagen } = await supabase.storage.from("socios-oex").createSignedUrl(data.foto_path, 3600); setFoto(imagen?.signedUrl || null); } catch { /* Iniciales como alternativa. */ }
      }
      setSocio(data);
      setRecursos([]); setErrorBiblioteca("");
      try {
        const { data: materiales, error: falloMateriales } = await supabase.from("socios_recursos").select("id,titulo,descripcion,tipo,formato,archivo_path,nombre_archivo").eq("activo", true).order("creado_en", { ascending: false });
        if (falloMateriales) throw falloMateriales;
        const lista = await Promise.all((materiales || []).map(async material => {
          const { data: url } = await supabase.storage.from("socios-recursos").createSignedUrl(material.archivo_path, 3600);
          return { ...material, url: url?.signedUrl };
        }));
        setRecursos(lista);
      } catch { setErrorBiblioteca("No pudimos cargar la biblioteca. Recarga la página para intentarlo nuevamente."); }
    } catch (err) { setError(err.message); }
    finally { setCargando(false); }
  };
  const cerrarSesion = () => {
    setSocio(null); setCodigo(""); setFoto(null); setCopiado("");
    setRecursos([]); setErrorBiblioteca(""); setError(""); setDescargando(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const copiar = async (texto, etiqueta) => {
    try { await navigator.clipboard.writeText(texto); setCopiado(etiqueta); }
    catch { setCopiado("No se pudo copiar. Selecciona el texto y cópialo manualmente."); }
  };
  const descargar = async material => {
    setDescargando(material.id); setErrorBiblioteca("");
    try {
      const { data, error } = await supabase.storage.from("socios-recursos").download(material.archivo_path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement("a"); a.href = url; a.download = material.nombre_archivo;
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch { setErrorBiblioteca("No pudimos descargar el archivo. Intenta nuevamente."); }
    finally { setDescargando(null); }
  };
  return <div className="page guidesPage sociosPage">
    <Seo title="Recursos para Socios OEX" description="Banners, guías y recursos del Programa de Recomendaciones OEX." path="/socios" />
    <Nav subtitle="Socios OEX" />
    <main className="guidesWrap sociosWrap">
      {!socio ? <section className="sociosIngreso">
        <div className="miniBadge">Socios OEX</div><h1>Todo para recomendar OEX</h1>
        <p>Ingresa tu código para encontrar banners, guías y tu enlace personal.</p>
        <form onSubmit={ingresar}><label htmlFor="codigo-socio">Código de socio</label><input id="codigo-socio" required maxLength={64} autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="Escribe tu código" value={codigo} onChange={e => setCodigo(e.target.value)} disabled={cargando} />
          {error && <p role="alert" className="sociosError">{error}</p>}<button className="primaryCta" disabled={cargando}>{cargando ? "Validando…" : "Acceder a recursos"}</button>
        </form><p>¿No tienes tu código? <a href={whatsapp} target="_blank" rel="noreferrer">Consulta con OEX</a>.</p>
      </section> : <>
        <header className="sociosBienvenida">
          <div className="sociosIdentidad">{foto ? <img src={foto} alt="" onError={() => setFoto(null)} /> : <span className="sociosIniciales">{socio.nombre.split(" ").slice(0, 2).map(p => p[0]).join("")}</span>}<div><span className="miniBadge">Socio OEX · {socio.identificador.toUpperCase()}</span><h1>Hola, {socio.nombre.split(" ")[0]}</h1><p>Comparte, recomienda y encuentra aquí tus materiales.</p></div></div>
          <button type="button" className="navButton" onClick={cerrarSesion} disabled={cargando || descargando !== null}>Cerrar sesión</button>
        </header>
        <section className="sociosEnlace"><h2>Tu enlace de recomendación</h2><p>Compártelo junto con tus publicaciones para identificar a tus clientes.</p><div><input readOnly aria-label="Tu enlace personal" value={enlace} onFocus={e => e.target.select()} /><button className="primaryCta" onClick={() => copiar(enlace, "Enlace copiado")}>Copiar enlace</button></div>{copiado && <p role="status">{copiado}</p>}</section>
        {errorBiblioteca && <p className="sociosError" role="alert">{errorBiblioteca}</p>}
        {recursos.length > 0 && <section><h2>Biblioteca OEX</h2><p>Materiales publicados por el equipo OEX para tus recomendaciones.</p><div className="guidesGrid sociosBanners">{recursos.map(material => <article className="guideCard" key={material.id}>
          {/\.(png|jpg|webp)$/.test(material.archivo_path) && material.url && <img src={material.url} alt={material.titulo} />}
          <h3>{material.titulo}</h3><p>{material.descripcion}</p><small>{material.tipo === "banner" ? ({post:"Post / publicación",historia:"Historia / estado",horizontal:"Banner horizontal"}[material.formato] || "Banner") : ({guia:"Guía",reglamento:"Reglamento",otro:"Material"})[material.tipo]}</small>
          <button className="guideReadLink" disabled={descargando === material.id} onClick={() => descargar(material)}>{descargando === material.id ? "Descargando…" : "Descargar archivo"}</button>
        </article>)}</div></section>}
        <h2>Banners para compartir</h2><p>Descarga el formato que necesitas y acompáñalo con tu enlace personal.</p>
        <section className="guidesGrid sociosBanners">{[
          ["publicacion", "Publicación", "1080 × 1080"], ["historia", "Historia / estado", "1080 × 1920"], ["horizontal", "Banner horizontal", "1200 × 630"],
        ].map(([slug, nombre, medida]) => { const imagen = "data:image/png;base64," + bannersSocios.find(b => b.slug === slug).base64; return <article className="guideCard" key={slug}><img src={imagen} alt={"Banner OEX para " + nombre.toLowerCase()} /><h3>{nombre}</h3><p>{medida}</p><a className="guideReadLink" href={imagen} download={"OEX-" + slug + ".png"}>Descargar banner PNG</a></article>; })}</section>
        <h2>Guías y respuestas</h2><section className="guidesGrid">{documentosSocios.map(d => <article className="guideCard" key={d.nombre}><h3>{d.titulo}</h3><p>{d.descripcion}</p><a className="guideReadLink" href={"data:application/pdf;base64," + d.base64} download={d.nombre}>Descargar PDF</a></article>)}
          <article className="guideCard"><h3>Preguntas frecuentes</h3><p>Compras asistidas, tracking, prealerta y entrega de paquetes.</p><a className="guideReadLink" href="/guias/preguntas-frecuentes-compras-online-compra-asistida">Ver preguntas frecuentes</a></article>
        </section>
        <section className="sociosEnlace"><h2>Un texto listo para compartir</h2><p className="sociosTexto">Compra en Estados Unidos y recibe tus paquetes en Nicaragua con OEX. Hay envíos aéreos y marítimos para Managua y Ometepe. Confirma tu tarifa con OEX y registra tu tracking desde mi enlace: {enlace}</p><button className="navButton" onClick={() => copiar("Compra en Estados Unidos y recibe tus paquetes en Nicaragua con OEX. Hay envíos aéreos y marítimos para Managua y Ometepe. Confirma tu tarifa con OEX y registra tu tracking desde mi enlace: " + enlace, "Texto copiado")}>Copiar texto</button></section>
        <aside className="guidesCta"><div><h2>Solicita tu informe</h2><p>Escríbenos para recibir tu reporte de clientes, comisiones, cortes y pagos. OEX te lo enviará directamente.</p></div><a href={whatsapp} className="greenCta" target="_blank" rel="noreferrer">Solicitar mi informe</a></aside>
      </>}
    </main><Footer />
  </div>;
}
