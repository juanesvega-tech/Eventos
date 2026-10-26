"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SelectorEvento from "@/components/layout/SelectorEvento";
import GraficaCircular from "@/components/comida/GraficaCircular";
import GraficaCostos from "@/components/comida/GraficaCostos";

const RESUMEN_VACIO = {
  trabajadores: { servicios: [], total: 0 },
  acompanantes: { servicios: [], total: 0 },
  general: { servicios: [], total: 0 },
};

export default function ComidaPage() {
  const [eventos, setEventos] = useState([]);
  const [programacion, setProgramacion] = useState("");
  const [resumen, setResumen] = useState(RESUMEN_VACIO);
  const [cargandoEventos, setCargandoEventos] = useState(true);
  const [cargandoComida, setCargandoComida] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false;

    async function cargarEventos() {
      try {
        const respuesta = await fetch("/api/eventos", {
          cache: "no-store",
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.success) {
          throw new Error(
            resultado.message || "No fue posible cargar las programaciones."
          );
        }

        if (cancelado) return;

        const lista = resultado.data || [];
        setEventos(lista);

        if (lista.length > 0) {
          setProgramacion(String(lista[0].ProgramacionNro));
        }
      } catch (err) {
        if (!cancelado) {
          setError(err.message || "Error al cargar las programaciones.");
        }
      } finally {
        if (!cancelado) {
          setCargandoEventos(false);
        }
      }
    }

    cargarEventos();

    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    if (!programacion) {
      setResumen(RESUMEN_VACIO);
      return;
    }

    let cancelado = false;

    async function cargarConsumos() {
      try {
        setCargandoComida(true);

        const respuesta = await fetch(
          `/api/comida?programacionNro=${encodeURIComponent(programacion)}`,
          { cache: "no-store" }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.success) {
          throw new Error(
            resultado.message || "No fue posible consultar los consumos."
          );
        }

        if (!cancelado) {
          setResumen(resultado.data);
          setError("");
        }
      } catch (err) {
        if (!cancelado) {
          setError(err.message || "Error al cargar las gráficas.");
        }
      } finally {
        if (!cancelado) {
          setCargandoComida(false);
        }
      }
    }

    cargarConsumos();

    const intervalo = setInterval(cargarConsumos, 5000);

    return () => {
      cancelado = true;
      clearInterval(intervalo);
    };
  }, [programacion]);

  const evento = eventos.find(
    (item) => String(item.ProgramacionNro) === programacion
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Encabezado */}
      <header className="mb-8 text-white">
        <Link
          href="/"
          className="group mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white no-underline backdrop-blur-sm transition hover:border-[#e2b808]/60 hover:bg-[#e2b808] hover:text-[#14320f] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#e2b808]"
        >
          <svg
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M19 12H5m6-6-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          Volver al dashboard
        </Link>

        <div className="flex items-start justify-between gap-8">
          <div>
            <p className="mb-3 text-xs font-extrabold tracking-[0.22em] text-[#e2b808]">
              MÓDULO DE ALIMENTACIÓN
            </p>

            <h1 className="max-w-3xl text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              Control de comida
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/65 sm:text-base">
              Consumos por tipo de servicio, separados entre trabajadores,
              acompañantes y el total general.
            </p>
          </div>

          <div
            className="hidden h-16 w-16 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/10 text-[#e2b808] backdrop-blur-sm sm:grid"
            aria-hidden="true"
          >
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 3v7M4.5 3v4.5A2.5 2.5 0 0 0 7 10m0 0v11M16 3v18m0-18c2.4 1.8 3.5 4.1 3.5 6.8 0 2.2-1.3 3.7-3.5 4.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </header>

      {/* Cargando programaciones */}
      {cargandoEventos && (
        <div
          className="flex items-center gap-3 rounded-2xl border border-white/50 bg-white p-5 text-sm font-medium text-slate-600 shadow-[0_15px_45px_rgba(20,50,15,0.16)]"
          role="status"
        >
          <span
            className="h-5 w-5 animate-spin rounded-full border-[3px] border-[#14320f]/15 border-t-[#e2b808]"
            aria-hidden="true"
          />
          Cargando programaciones...
        </div>
      )}

      {/* Selector y detalle del evento */}
      {!cargandoEventos && eventos.length > 0 && (
        <section className="mb-6 overflow-hidden rounded-3xl border border-[#dce4d8] bg-white shadow-[0_15px_45px_rgba(20,50,15,0.12)]">
          <div className="border-b border-[#dce4d8] bg-[#fafbf8] p-5 sm:p-7">
            <div className="mb-5 flex items-center gap-4">
              <span
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#e2b808] text-xs font-black text-[#14320f]"
                aria-hidden="true"
              >
                01
              </span>

              <div>
                <h2 className="text-lg font-bold text-[#14320f] sm:text-xl">
                  Selecciona la programación
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Consulta los consumos asociados al evento.
                </p>
              </div>
            </div>

            <SelectorEvento
              eventos={eventos}
              eventoSeleccionado={programacion}
              onSeleccionar={setProgramacion}
            />
          </div>

          {evento && (
            <div className="relative grid gap-6 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-7">
              <div
                className="absolute inset-y-0 left-0 w-1.5 bg-[#e2b808]"
                aria-hidden="true"
              />

              <div className="pl-2">
                <p className="text-[10px] font-extrabold tracking-[0.18em] text-[#8a7000]">
                  EVENTO ACTIVO
                </p>

                <h2 className="mt-2 text-xl font-bold text-[#14320f] sm:text-2xl">
                  {evento.EventosNombre}
                </h2>
              </div>

              <div className="grid gap-4 pl-2 sm:grid-cols-2 sm:gap-8 sm:pl-0">
                <p className="grid gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Lugar
                  </span>
                  <strong className="text-sm font-semibold text-slate-700">
                    {evento.LugarEventosNombre || "Sin lugar asignado"}
                  </strong>
                </p>

                <p className="grid gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Programación
                  </span>
                  <strong className="text-sm font-semibold text-slate-700">
                    {String(evento.ProgramacionNro)}
                  </strong>
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Error */}
      {error && (
        <div
          className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 border-l-4 border-l-red-700 bg-red-50 p-4 text-sm text-red-800 shadow-sm"
          role="alert"
        >
          <svg
            className="mt-0.5 h-5 w-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 9v4m0 4h.01M10.3 4.3 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span>{error}</span>
        </div>
      )}

      {/* Sin programaciones */}
      {!cargandoEventos && eventos.length === 0 && !error && (
        <div className="rounded-2xl border border-dashed border-[#14320f]/25 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
          No hay programaciones disponibles.
        </div>
      )}

      {/* Gráficas */}
      {programacion && (
        <>
          <div className="mb-4 flex justify-end">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dce4d8] bg-white px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm">
              <span
                className={`h-2 w-2 rounded-full ${
                  cargandoComida
                    ? "animate-pulse bg-[#e2b808]"
                    : "bg-[#14320f]"
                }`}
                aria-hidden="true"
              />

              {cargandoComida
                ? "Cargando consumos..."
                : "Actualización automática cada 5 segundos"}
            </div>
          </div>

          <div className="grid gap-6">
            <GraficaCircular
              titulo="1. Consumo de trabajadores"
              descripcion="Trabajadores únicos por servicio."
              servicios={resumen.trabajadores.servicios}
              total={resumen.trabajadores.total}
              programacionNro={programacion}
              tipoDetalle="trabajadores"
            />

            <GraficaCircular
              titulo="2. Consumo de acompañantes"
              descripcion="Acompañantes relacionados con los registros de consumo."
              servicios={resumen.acompanantes.servicios}
              total={resumen.acompanantes.total}
              programacionNro={programacion}
              tipoDetalle="acompanantes"
            />

            <GraficaCircular
              titulo="3. Consumo general"
              descripcion="Trabajadores y acompañantes por servicio."
              servicios={resumen.general.servicios}
              total={resumen.general.total}
              programacionNro={programacion}
              tipoDetalle="general"
            />

            <GraficaCostos programacionNro={programacion} />
          </div>
        </>
      )}
    </main>
  );
}
