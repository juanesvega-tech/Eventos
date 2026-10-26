
"use client";

import { useEffect, useState } from "react";
import GraficaPersonas from "@/components/dashboard/GraficaPersonas";

const inicial = {
  invitados: 0,
  acompanantes: 0,
  totalPersonas: 0,
};

function formatearNumero(valor) {
  return Number(valor ?? 0).toLocaleString("es-CO");
}

export default function ContadorPersonas({ programacionNro }) {
  const [historial, setHistorial] = useState([]);
  const [estadisticas, setEstadisticas] = useState(inicial);
  const [error, setError] = useState("");
  const [actualizadoEn, setActualizadoEn] = useState("");

  useEffect(() => {
    let activo = true;
    let consultando = false;
    let controlador = null;
    let secuencia = 0;

    setHistorial([]);
    setEstadisticas(inicial);
    setError("");
    setActualizadoEn("");

    if (!programacionNro) {
      return undefined;
    }

    async function consultar() {
      if (consultando || !activo) return;

      consultando = true;
      controlador = new AbortController();

      try {
        const respuesta = await fetch(
          `/api/registros?programacionNro=${encodeURIComponent(
            programacionNro
          )}`,
          {
            cache: "no-store",
            signal: controlador.signal,
          }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.success) {
          throw new Error(
            resultado.message ||
              "No se pudieron consultar los registros."
          );
        }

        if (!activo) return;

        const invitados = Number(resultado.data?.invitados ?? 0);
        const acompanantes = Number(
          resultado.data?.acompanantes ?? 0
        );
        const total = Number(
          resultado.data?.total ?? invitados + acompanantes
        );

        const ahora = new Date();

        setEstadisticas({
          invitados,
          acompanantes,
          totalPersonas: total,
        });

        setActualizadoEn(
          resultado.actualizadoEn || ahora.toISOString()
        );

        // Agregar un punto nuevo en cada consulta exitosa,
        // aunque las cantidades no hayan cambiado.
        secuencia += 1;

        setHistorial((anterior) => {
          const nuevoPunto = {
            id: secuencia,
            hora: ahora.toLocaleTimeString("es-CO", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            }),
            invitados,
            acompanantes,
            total,
          };

          // Mantener solo los últimos 60 puntos.
          // Al llenarse, sale el más antiguo por la izquierda.
          return [...anterior, nuevoPunto].slice(-60);
        });

        setError("");
      } catch (err) {
        if (activo && err.name !== "AbortError") {
          setError(err.message || "Error de conexión.");
        }
      } finally {
        consultando = false;
      }
    }

    consultar();

    const intervalo = setInterval(consultar, 1000);

    return () => {
      activo = false;
      clearInterval(intervalo);
      controlador?.abort();
    };
  }, [programacionNro]);

  if (!programacionNro) {
    return (
      <section className="contador-vacio">
        Selecciona una programación para consultar los registros.
      </section>
    );
  }

  return (
    <section className="contador-panel">
      <header className="contador-encabezado">
        <div>
          <span className="contador-etiqueta">
            CONTROL DE REGISTROS
          </span>

          <h2>Personas registradas</h2>

          <p>Consulta de datos cada segundo</p>
        </div>

        <span
          className={`estado-actualizacion ${
            error ? "estado-error" : ""
          }`}
        >
          <span className="estado-punto" />
          {error ? "Error de conexión" : "Monitoreo activo"}
        </span>
      </header>

      {error && (
        <p className="contador-error" role="alert">
          {error}
        </p>
      )}

      <div className="contador-grid">
        <article className="contador-tarjeta invitados">
          <div className="contador-tarjeta-icono">👥</div>
          <p>Invitados registrados</p>
          <strong>
            {formatearNumero(estadisticas.invitados)}
          </strong>
          <span>Documentos únicos de invitados</span>
        </article>

        <article className="contador-tarjeta acompanantes">
          <div className="contador-tarjeta-icono">🤝</div>
          <p>Acompañantes registrados</p>
          <strong>
            {formatearNumero(estadisticas.acompanantes)}
          </strong>
          <span>Documentos únicos de acompañantes</span>
        </article>

        <article className="contador-tarjeta total">
          <div className="contador-tarjeta-icono">📊</div>
          <p>Total de personas</p>
          <strong>
            {formatearNumero(estadisticas.totalPersonas)}
          </strong>
          <span>Invitados + acompañantes</span>
        </article>
      </div>

      <GraficaPersonas historial={historial} />

      <footer className="contador-pie">
        <span>
          {actualizadoEn
            ? `Última actualización: ${new Date(
                actualizadoEn
              ).toLocaleTimeString("es-CO")}`
            : "Esperando datos"}
        </span>

        <span>Consulta cada segundo</span>
      </footer>
    </section>
  );
}

