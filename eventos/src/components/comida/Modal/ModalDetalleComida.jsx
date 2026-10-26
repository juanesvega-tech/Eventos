"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import GraficaBarras from "@/components/comida/Modal/GraficaBarras";

function formatearFecha(fecha) {
  if (!fecha) return "";

  const partes = String(fecha).slice(0, 10).split("-");

  return partes.length === 3
    ? `${partes[2]}/${partes[1]}/${partes[0]}`
    : String(fecha);
}

export default function ModalDetalleComida({
  titulo,
  programacionNro,
  tipoDetalle,
  onCerrar,
}) {
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controlador = new AbortController();

    async function cargar() {
      setCargando(true);
      setError("");

      try {
        const parametros = new URLSearchParams({
          programacionNro: String(programacionNro),
          detalle: tipoDetalle,
        });

        const respuesta = await fetch(
          `/api/comida?${parametros.toString()}`,
          {
            cache: "no-store",
            signal: controlador.signal,
          },
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.success) {
          throw new Error(
            resultado.message || "No se pudo cargar el detalle.",
          );
        }

        setRegistros(
          Array.isArray(resultado.data) ? resultado.data : [],
        );
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(
            e.message || "Error al cargar los registros.",
          );
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false);
        }
      }
    }

    cargar();

    return () => controlador.abort();
  }, [programacionNro, tipoDetalle]);

  function exportarExcel() {
    if (!registros.length) return;

    const filas = registros.map((fila) => ({
      Fecha: formatearFecha(fila.fecha),
      Servicio: fila.servicio || "",
      Tipo: fila.tipo || "",
      Documento: fila.documento || "",
      Nombre: fila.nombre || "",
    }));

    const hoja = XLSX.utils.json_to_sheet(filas);

    hoja["!cols"] = [
      { wch: 14 },
      { wch: 28 },
      { wch: 20 },
      { wch: 22 },
      { wch: 35 },
    ];

    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      libro,
      hoja,
      "Detalle de consumos",
    );

    XLSX.writeFile(
      libro,
      `detalle_consumos_${tipoDetalle}_${programacionNro}.xlsx`,
    );
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/70 p-2 backdrop-blur-sm sm:p-4"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) {
          onCerrar();
        }
      }}
    >
      <section
        className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/20 bg-white shadow-[0_30px_100px_-20px_rgba(0,0,0,0.55)] sm:rounded-3xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-detalle"
      >
        {/* Encabezado */}
        <header className="relative flex shrink-0 items-center justify-between gap-4 overflow-hidden border-b border-slate-100 bg-white px-4 py-4 sm:px-7 sm:py-5">
          <div className="pointer-events-none absolute -right-16 -top-24 size-52 rounded-full bg-blue-100/70 blur-3xl" />

          <div className="relative flex min-w-0 items-center gap-3.5">
            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 sm:size-12">
              <svg
                aria-hidden="true"
                className="size-5.5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M8 7h8M8 12h8m-8 5h5M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </div>

            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h2
                  id="titulo-detalle"
                  className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl"
                >
                  Detalle de {titulo}
                </h2>

                <span className="hidden rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 ring-1 ring-inset ring-blue-600/15 sm:inline-flex">
                  Detallado
                </span>
              </div>

              <p className="text-xs text-slate-500 sm:text-sm">
                Programación N.º{" "}
                <strong className="font-semibold text-slate-700">
                  {programacionNro}
                </strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 transition-all duration-200 hover:rotate-90 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-4 focus:ring-slate-100"
            onClick={onCerrar}
            aria-label="Cerrar modal"
          >
            <svg
              aria-hidden="true"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </header>

        {/* Contenido */}
        <main className="min-h-0 flex-1 overflow-y-auto bg-slate-50/70 px-4 py-5 sm:px-7 sm:py-6">
          {cargando ? (
            <div className="grid min-h-80 place-items-center">
              <div className="text-center">
                <div className="relative mx-auto mb-5 size-14">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-100" />

                  <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />

                  <div className="absolute inset-3 rounded-full bg-blue-50" />
                </div>

                <p className="font-semibold text-slate-700">
                  Cargando registros
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Estamos consultando el detalle de consumos.
                </p>
              </div>
            </div>
          ) : error ? (
            <div
              className="flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm sm:p-5"
              role="alert"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-red-600 shadow-sm ring-1 ring-red-200">
                <svg
                  aria-hidden="true"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 9v4m0 4h.01M10.3 4.3 2.7 17.5A2 2 0 0 0 4.4 20h15.2a2 2 0 0 0 1.7-2.5L13.7 4.3a2 2 0 0 0-3.4 0Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                </svg>
              </span>

              <div>
                <strong className="block text-sm font-bold">
                  No se pudo cargar la información
                </strong>

                <p className="mt-1 text-sm leading-relaxed text-red-600">
                  {error}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Acciones */}
              <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                    <svg
                      aria-hidden="true"
                      className="size-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M8 7h8M8 12h8m-8 5h5M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                      />
                    </svg>
                  </span>

                  <div>
                    <strong className="block text-lg font-extrabold tabular-nums text-slate-900">
                      {registros.length.toLocaleString("es-CO")}
                    </strong>

                    <span className="text-xs font-medium text-slate-400">
                      Registros disponibles
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={exportarExcel}
                  disabled={registros.length === 0}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/25 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                >
                  <svg
                    aria-hidden="true"
                    className="size-4.5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>

                  Exportar Excel
                </button>
              </div>

              <GraficaBarras registros={registros} />
            </>
          )}
        </main>

        {/* Pie */}
        <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-slate-100 bg-white px-4 py-3.5 sm:px-7 sm:py-4">
          <p className="hidden text-xs text-slate-400 sm:block">
            Haz clic fuera de esta ventana para cerrarla.
          </p>

          <button
            type="button"
            onClick={onCerrar}
            className="ml-auto rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
          >
            Cerrar
          </button>
        </footer>
      </section>
    </div>
  );
}