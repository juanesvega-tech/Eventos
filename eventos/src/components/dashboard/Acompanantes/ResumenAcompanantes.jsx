"use client";

import { useEffect, useState } from "react";
import GraficaAcompanantes from "@/components/dashboard/Acompanantes/GraficaAcompanantes";

export default function ResumenAcompanantes({ programacionNro }) {
  const [datos, setDatos] = useState({
    conAcompanante: 0,
    sinAcompanante: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!programacionNro) {
      setDatos({ conAcompanante: 0, sinAcompanante: 0 });
      setError("");
      return;
    }

    let activo = true;
    let consultando = false;
    const controlador = new AbortController();

    async function consultar() {
      if (consultando) return;
      consultando = true;

      try {
        const respuesta = await fetch(
          `/api/acompanantes/resumen?programacionNro=${encodeURIComponent(programacionNro)}`,
          {
            cache: "no-store",
            signal: controlador.signal,
          }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.success) {
          throw new Error(
            resultado.message || "No fue posible consultar los acompañantes."
          );
        }

        if (activo) {
          setDatos({
            conAcompanante: Number(resultado.data.conAcompanante ?? 0),
            sinAcompanante: Number(resultado.data.sinAcompanante ?? 0),
          });
          setError("");
        }
      } catch (err) {
        if (activo && err.name !== "AbortError") {
          setError(err.message || "Error de conexión.");
        }
      } finally {
        consultando = false;
      }
    }

    consultar();
    const intervalo = setInterval(consultar, 5000);

    return () => {
      activo = false;
      clearInterval(intervalo);
      controlador.abort();
    };
  }, [programacionNro]);

  if (!programacionNro) return null;

  return (
    <>
      {error && (
        <p role="alert" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      )}

      <GraficaAcompanantes
        conAcompanante={datos.conAcompanante}
        sinAcompanante={datos.sinAcompanante}
      />
    </>
  );
}