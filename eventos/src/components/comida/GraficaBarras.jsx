"use client";

import { useMemo } from "react";

function obtenerFecha(fecha) {
  if (!fecha) return "";

  return String(fecha).slice(0, 10);
}

function formatearFecha(fecha) {
  const partes = fecha.split("-");

  if (partes.length !== 3) return fecha;

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export default function GraficaBarras({ registros = [] }) {
  const datos = useMemo(() => {
    const agrupados = {};

    registros.forEach((registro) => {
      const fecha = obtenerFecha(registro.fecha);

      if (!fecha) return;

      if (!agrupados[fecha]) {
        agrupados[fecha] = {
          fecha,
          cantidad: 0,
        };
      }

      agrupados[fecha].cantidad += 1;
    });

    return Object.values(agrupados).sort((a, b) =>
      a.fecha.localeCompare(b.fecha),
    );
  }, [registros]);

  const maximo = Math.max(
    1,
    ...datos.map((dato) => dato.cantidad),
  );

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_20px_60px_-28px_rgba(15,23,42,0.3)]">
      {/* Decoración de fondo */}
      <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-blue-100/70 blur-3xl" />

      {/* Encabezado */}
      <div className="relative flex flex-col gap-5 border-b border-slate-100 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
            <svg
              aria-hidden="true"
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 20V10m7 10V4m7 16v-7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold tracking-tight text-slate-900">
                Consumos por fecha
              </h3>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-inset ring-emerald-600/15">
                Actualizado
              </span>
            </div>

            <p className="text-sm text-slate-500">
              Cantidad de registros agrupados por día
            </p>
          </div>
        </div>

        {/* Total de registros */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 sm:min-w-36">
          <span className="grid size-9 place-items-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/70">
            <svg
              aria-hidden="true"
              className="size-4.5"
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
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Total
            </span>

            <strong className="text-xl font-extrabold tabular-nums text-slate-900">
              {registros.length.toLocaleString("es-CO")}
            </strong>
          </div>
        </div>
      </div>

      {/* Estado vacío */}
      {datos.length === 0 ? (
        <div className="grid min-h-72 place-items-center px-6 py-12 text-center">
          <div>
            <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
              <svg
                aria-hidden="true"
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 20V10m7 10V4m7 16v-7"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
              </svg>
            </span>

            <p className="font-semibold text-slate-700">
              No hay datos para graficar
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Los consumos aparecerán aquí cuando haya registros.
            </p>
          </div>
        </div>
      ) : (
        <div className="px-4 pb-6 pt-8 sm:px-8 sm:pb-8">
          {/* Información superior */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Cantidad
            </span>

            <span className="text-xs text-slate-400">
              Máximo:{" "}
              <b className="text-slate-600">
                {maximo.toLocaleString("es-CO")}
              </b>
            </span>
          </div>

          {/* Gráfica */}
          <div className="relative">
            {/* Líneas guía */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-56"
            >
              {[0, 1, 2, 3].map((linea) => (
                <div
                  key={linea}
                  className="absolute inset-x-0 border-t border-dashed border-slate-200"
                  style={{
                    top: `${linea * 33.33}%`,
                  }}
                />
              ))}
            </div>

            {/* Barras */}
            <div className="flex min-h-64 items-end gap-3 overflow-x-auto border-b border-slate-200 pb-0 pt-2 [scrollbar-color:#cbd5e1_transparent] sm:gap-5">
              {datos.map((dato) => (
                <div
                  key={dato.fecha}
                  className="group relative flex h-64 min-w-14 flex-1 flex-col items-center justify-end"
                >
                  {/* Valor flotante */}
                  <span className="mb-2 rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-bold tabular-nums text-white opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100">
                    {dato.cantidad.toLocaleString("es-CO")}
                  </span>

                  {/* Fondo de la barra */}
                  <div className="flex h-48 w-9 items-end overflow-hidden rounded-t-xl bg-slate-100/80 ring-1 ring-inset ring-slate-200/70 sm:w-11">
                    {/* Barra */}
                    <div
                      className="relative min-h-1 w-full rounded-t-xl bg-gradient-to-t from-blue-600 via-blue-500 to-cyan-400 shadow-[0_-6px_18px_rgba(59,130,246,0.25)] transition-all duration-500 ease-out group-hover:brightness-110"
                      style={{
                        height: `${(dato.cantidad / maximo) * 100}%`,
                      }}
                    >
                      <span className="absolute inset-x-1 top-1 h-px rounded-full bg-white/40" />
                    </div>
                  </div>

                  {/* Fecha */}
                  <span className="mt-3 pb-1 text-[10px] font-medium tabular-nums text-slate-500 sm:text-[11px]">
                    {formatearFecha(dato.fecha)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Leyenda */}
          <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
            <span className="size-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
            Registros diarios
          </div>
        </div>
      )}
    </section>
  );
}