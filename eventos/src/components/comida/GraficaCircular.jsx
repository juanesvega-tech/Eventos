"use client";

import { useMemo, useState } from "react";
import ModalDetalleComida from "@/components/comida/ModalDetalleComida";

const COLORES = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#9333ea",
  "#0891b2",
  "#e11d48",
  "#64748b",
  "#ea580c",
];

export default function GraficaCircular({
  titulo,
  descripcion,
  servicios = [],
  total = 0,
  programacionNro,
  tipoDetalle,
}) {
  const [modalAbierto, setModalAbierto] = useState(false);

  const gradiente = useMemo(() => {
    if (!servicios.length || Number(total) === 0) {
      return "#e5e7eb";
    }

    let acumulado = 0;

    const segmentos = servicios.map((servicio, index) => {
      const porcentaje = Number(servicio.porcentaje) || 0;
      const inicio = acumulado;

      acumulado += porcentaje;

      return `${COLORES[index % COLORES.length]} ${inicio}% ${acumulado}%`;
    });

    return `conic-gradient(${segmentos.join(", ")})`;
  }, [servicios, total]);

  return (
    <>
      <section className="relative min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_20px_60px_-28px_rgba(15,23,42,0.3)]">
        {/* Decoración de fondo */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 size-52 rounded-full bg-indigo-50 blur-3xl" />

        {/* Encabezado */}
        <div className="relative border-b border-slate-100 px-5 py-6 sm:px-7">
          <div className="flex items-start gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <svg
                aria-hidden="true"
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 3a9 9 0 1 0 9 9h-9V3Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
                <path
                  d="M15 3.6A9 9 0 0 1 20.4 9H15V3.6Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                  {titulo}
                </h2>

                {servicios.length > 0 && (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-inset ring-emerald-600/15">
                    {servicios.length} servicios
                  </span>
                )}
              </div>

              {descripcion && (
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  {descripcion}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="relative px-5 py-7 sm:px-7">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            {/* Gráfica circular */}
            <div className="flex shrink-0 flex-col items-center">
              <div className="relative grid size-48 place-items-center sm:size-52 md:size-44">
                <div className="absolute inset-0 rounded-full bg-slate-200/60 blur-lg" />

                <div
                  className="relative grid size-full place-items-center rounded-full shadow-[0_14px_35px_-15px_rgba(15,23,42,0.4)] transition-transform duration-300 hover:scale-[1.02]"
                  style={{ background: gradiente }}
                  role="img"
                  aria-label={`Gráfica circular de ${titulo}`}
                >
                  <div className="grid size-[64%] place-items-center rounded-full border border-slate-100 bg-white shadow-inner">
                    <div className="text-center">
                      <strong className="block max-w-28 truncate text-2xl font-extrabold tracking-tight tabular-nums text-slate-900 sm:text-3xl md:text-2xl">
                        {Number(total).toLocaleString("es-CO")}
                      </strong>

                      <span className="mt-0.5 block text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        Total
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <span className="size-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                Distribución de consumos
              </div>
            </div>

            {/* Leyenda */}
            <div className="w-full min-w-0 flex-1">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Detalle por servicio
                </span>

                {servicios.length > 0 && (
                  <span className="text-xs font-medium text-slate-400">
                    Porcentaje
                  </span>
                )}
              </div>

              {servicios.length === 0 ? (
                <div className="grid min-h-40 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-8 text-center">
                  <div>
                    <span className="mx-auto mb-3 grid size-11 place-items-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200/70">
                      <svg
                        aria-hidden="true"
                        className="size-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 3a9 9 0 1 0 9 9h-9V3Z"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                        />
                      </svg>
                    </span>

                    <p className="text-sm font-semibold text-slate-600">
                      No hay consumos registrados
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      La distribución aparecerá cuando existan datos.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {servicios.map((servicio, index) => (
                    <div
                      className="group flex items-center gap-3 rounded-2xl border border-transparent bg-slate-50/80 px-3.5 py-3 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-sm"
                      key={`${servicio.codigo}-${index}`}
                    >
                      <span
                        className="size-3 shrink-0 rounded-md shadow-sm ring-2 ring-white"
                        style={{
                          background: COLORES[index % COLORES.length],
                        }}
                      />

                      <div className="min-w-0 flex-1">
                        <strong className="block truncate text-sm font-semibold text-slate-700">
                          {servicio.nombre}
                        </strong>

                        <p className="mt-0.5 text-xs tabular-nums text-slate-400">
                          {Number(servicio.cantidad || 0).toLocaleString(
                            "es-CO",
                          )}{" "}
                          consumos
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <strong className="text-sm font-bold tabular-nums text-slate-700">
                          {Number(servicio.porcentaje || 0)}%
                        </strong>

                        <div className="mt-1 h-1.5 w-14 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(
                                Number(servicio.porcentaje) || 0,
                                100,
                              )}%`,
                              background:
                                COLORES[index % COLORES.length],
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botón */}
          <button
            type="button"
            className="group mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
            disabled={!programacionNro || !tipoDetalle}
            onClick={() => setModalAbierto(true)}
          >
            <svg
              aria-hidden="true"
              className="size-4.5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
              <circle
                cx="12"
                cy="12"
                r="2.5"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>

            Ver detallado

            <svg
              aria-hidden="true"
              className="size-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="m9 18 6-6-6-6"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
      </section>

      {modalAbierto && (
        <ModalDetalleComida
          titulo={titulo}
          programacionNro={programacionNro}
          tipoDetalle={tipoDetalle}
          onCerrar={() => setModalAbierto(false)}
        />
      )}
    </>
  );
}
