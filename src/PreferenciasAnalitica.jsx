import { useEffect, useRef, useState } from "react";
import { guardarPreferenciaAnalitica, leerPreferenciaAnalitica } from "./analytics";

const ABRIR_PREFERENCIAS = "oex:abrir-preferencias-analitica";

export function AbrirPreferenciasAnalitica() {
  return <button className="privacyFooterButton" type="button"
    onClick={() => window.dispatchEvent(new Event(ABRIR_PREFERENCIAS))}>
    Preferencias de cookies y analítica
  </button>;
}

export function PreferenciasAnalitica() {
  const [mostrar, setMostrar] = useState(() => !leerPreferenciaAnalitica());
  const region = useRef(null);
  const disparador = useRef(null);

  useEffect(() => {
    const abrir = () => {
      disparador.current = document.activeElement;
      setMostrar(true);
      requestAnimationFrame(() => region.current?.focus());
    };
    window.addEventListener(ABRIR_PREFERENCIAS, abrir);
    return () => window.removeEventListener(ABRIR_PREFERENCIAS, abrir);
  }, []);

  if (!mostrar) return null;

  const elegir = (preferencia) => {
    guardarPreferenciaAnalitica(preferencia);
    setMostrar(false);
    disparador.current?.focus();
    disparador.current = null;
  };

  return (
    <aside className="privacyBanner" tabIndex={-1} ref={region} aria-labelledby="privacy-banner-title">
      <div>
        <h2 id="privacy-banner-title">Tu privacidad en OEx</h2>
        <p>Podés permitir estadísticas de uso. Rastreo y Prealerta funcionan con cualquiera de las dos opciones. <a href="/privacidad">Ver aviso de privacidad</a>.</p>
      </div>
      <div className="privacyBannerActions">
        <button type="button" onClick={() => elegir("rechazada")}>Rechazar analítica</button>
        <button type="button" onClick={() => elegir("aceptada")}>Aceptar analítica</button>
      </div>
    </aside>
  );
}
