
"use client";

const SERIES = [
  { clave: "invitados", nombre: "Invitados", color: "#2563eb" },
  { clave: "acompanantes", nombre: "Acompañantes", color: "#08916b" },
  { clave: "total", nombre: "Total personas", color: "#7c3aed" },
];

const numero = (valor) =>
  new Intl.NumberFormat("es-CO").format(Number(valor) || 0);

export default function ModalGraficaRegistros({
  abierto,
  onCerrar,
  historial = [],
  programacion,
}) {
  if (!abierto) return null;

  const ancho = 800;
  const alto = 340;
  const izquierda = 65;
  const derecha = 25;
  const arriba = 25;
  const abajo = 65;

  const anchoGrafica = ancho - izquierda - derecha;
  const altoGrafica = alto - arriba - abajo;

  const maximo = Math.max(
    1,
    ...historial.map((punto) =>
      Math.max(
        Number(punto.invitados) || 0,
        Number(punto.acompanantes) || 0,
        Number(punto.total) || 0
      )
    )
  );

  const obtenerX = (indice) =>
    izquierda +
    (historial.length <= 1
      ? anchoGrafica / 2
      : (indice / (historial.length - 1)) * anchoGrafica);

  const obtenerY = (valor) =>
    arriba + altoGrafica - (Number(valor) / maximo) * altoGrafica;

  const etiquetasY = [0, 0.25, 0.5, 0.75, 1];

  const etiquetasX = historial
    .map((punto, indice) => ({ punto, indice }))
    .filter(({ indice }) => {
      const salto = Math.max(
        1,
        Math.ceil(historial.length / 6)
      );

      return (
        indice % salto === 0 ||
        indice === historial.length - 1
      );
    });

  return (
    <div
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) onCerrar();
      }}
      style={estilos.fondo}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-grafica-registros"
        style={estilos.modal}
      >
        <header style={estilos.encabezado}>
          <div>
            <h2
              id="titulo-grafica-registros"
              style={{ margin: 0, fontSize: 22 }}
            >
              Evolución de personas registradas
            </h2>

            <p style={estilos.subtitulo}>
              Programación {programacion} · Actualización cada 5 segundos
            </p>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar gráfica"
            style={estilos.cerrar}
          >
            ×
          </button>
        </header>

        <div style={estilos.leyenda}>
          {SERIES.map((serie) => (
            <div key={serie.clave} style={estilos.itemLeyenda}>
              <span
                style={{
                  ...estilos.muestraColor,
                  background: serie.color,
                }}
              />
              {serie.nombre}
            </div>
          ))}
        </div>

        {historial.length === 0 ? (
          <p style={{ padding: 35, textAlign: "center" }}>
            Esperando el primer registro de datos...
          </p>
        ) : (
          <>
            <div style={{ width: "100%", overflowX: "auto" }}>
              <svg
                viewBox={`0 0 ${ancho} ${alto}`}
                role="img"
                aria-label="Gráfica lineal de invitados, acompañantes y total de personas registrados"
                style={{
                  width: "100%",
                  minWidth: 540,
                  display: "block",
                }}
              >
                {etiquetasY.map((fraccion) => {
                  const valor = Math.round(maximo * fraccion);
                  const y = obtenerY(valor);

                  return (
                    <g key={fraccion}>
                      <line
                        x1={izquierda}
                        y1={y}
                        x2={ancho - derecha}
                        y2={y}
                        stroke="#e5e7eb"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={izquierda - 10}
                        y={y + 4}
                        textAnchor="end"
                        fill="currentColor"
                        fontSize="12"
                      >
                        {numero(valor)}
                      </text>
                    </g>
                  );
                })}

                <line
                  x1={izquierda}
                  y1={arriba}
                  x2={izquierda}
                  y2={alto - abajo}
                  stroke="#94a3b8"
                />

                <line
                  x1={izquierda}
                  y1={alto - abajo}
                  x2={ancho - derecha}
                  y2={alto - abajo}
                  stroke="#94a3b8"
                />

                {SERIES.map((serie) => {
                  const puntos = historial
                    .map(
                      (punto, indice) =>
                        `${obtenerX(indice)},${obtenerY(
                          punto[serie.clave]
                        )}`
                    )
                    .join(" ");

                  return (
                    <g key={serie.clave}>
                      {historial.length > 1 && (
                        <polyline
                          points={puntos}
                          fill="none"
                          stroke={serie.color}
                          strokeWidth="3"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />
                      )}

                      {historial.map((punto, indice) => (
                        <circle
                          key={`${serie.clave}-${indice}`}
                          cx={obtenerX(indice)}
                          cy={obtenerY(punto[serie.clave])}
                          r={historial.length > 40 ? 2 : 3.5}
                          fill={serie.color}
                        >
                          <title>
                            {`${serie.nombre}: ${numero(
                              punto[serie.clave]
                            )} · ${punto.hora}`}
                          </title>
                        </circle>
                      ))}
                    </g>
                  );
                })}

                {etiquetasX.map(({ punto, indice }) => (
                  <text
                    key={`${punto.hora}-${indice}`}
                    x={obtenerX(indice)}
                    y={alto - abajo + 22}
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="11"
                  >
                    {punto.hora}
                  </text>
                ))}

                <text
                  x={izquierda}
                  y={alto - 8}
                  fill="currentColor"
                  fontSize="12"
                >
                  Hora de consulta
                </text>
              </svg>
            </div>

            <div style={estilos.resumen}>
              {SERIES.map((serie) => {
                const ultimo = historial[historial.length - 1];

                return (
                  <article
                    key={serie.clave}
                    style={{
                      ...estilos.tarjeta,
                      borderTop: `4px solid ${serie.color}`,
                    }}
                  >
                    <span>{serie.nombre}</span>
                    <strong>{numero(ultimo[serie.clave])}</strong>
                  </article>
                );
              })}
            </div>

            <p style={estilos.nota}>
              Se muestran las últimas {historial.length} mediciones
              recogidas desde que se abrió la página.
            </p>
          </>
        )}
      </section>
    </div>
  );
}

const estilos = {
  fondo: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    background: "rgba(15, 23, 42, 0.65)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    width: "100%",
    maxWidth: 1000,
    maxHeight: "90vh",
    overflowY: "auto",
    background: "var(--card, #ffffff)",
    color: "var(--foreground, #111827)",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 20px 60px rgba(0,0,0,.25)",
  },
  encabezado: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  subtitulo: {
    color: "#64748b",
    fontSize: 14,
    marginTop: 8,
  },
  cerrar: {
    border: 0,
    background: "transparent",
    fontSize: 32,
    cursor: "pointer",
    lineHeight: 1,
    color: "inherit",
  },
  leyenda: {
    display: "flex",
    gap: 20,
    flexWrap: "wrap",
    margin: "20px 0",
  },
  itemLeyenda: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
  },
  muestraColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  resumen: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 12,
    marginTop: 20,
  },
  tarjeta: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: 14,
    borderRadius: 10,
    background: "var(--muted, #f8fafc)",
  },
  nota: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 18,
  },
};
