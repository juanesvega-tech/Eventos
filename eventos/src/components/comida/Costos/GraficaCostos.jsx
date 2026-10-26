"use client";

import { useEffect, useState } from "react";

const formatoPesos = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(valor) || 0);

const formatoNumero = (valor) =>
  new Intl.NumberFormat("es-CO").format(Number(valor) || 0);

export default function GraficaCostos({ programacionNro }) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!programacionNro) {
      setDatos(null);
      return;
    }

    const controlador = new AbortController();

    async function cargarCostos() {
      try {
        setCargando(true);
        setError("");

        const respuesta = await fetch(
          `/api/comida/costos?programacionNro=${encodeURIComponent(
            programacionNro,
          )}`,
          {
            cache: "no-store",
            signal: controlador.signal,
          },
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.success) {
          throw new Error(
            resultado.message ||
              "No se pudieron cargar los costos.",
          );
        }

        setDatos(resultado.data);
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(
            e.message ||
              "Ocurrió un error al cargar los costos.",
          );
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false);
        }
      }
    }

    cargarCostos();

    const intervalo = setInterval(cargarCostos, 5000);

    return () => {
      controlador.abort();
      clearInterval(intervalo);
    };
  }, [programacionNro]);

  if (!programacionNro) {
    return null;
  }

  if (cargando && !datos) {
    return (
      <section className="mt-7 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_20px_60px_-28px_rgba(15,23,42,0.3)]">
        <div className="grid min-h-72 place-items-center px-6 py-12 text-center">
          <div>
            <div className="relative mx-auto mb-5 size-14">
              <div className="absolute inset-0 rounded-full border-4 border-teal-100" />

              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-teal-600" />

              <div className="absolute inset-3 rounded-full bg-teal-50" />
            </div>

            <p className="font-semibold text-slate-700">
              Cargando costos de alimentación
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Estamos calculando la información de la programación.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error && !datos) {
    return (
      <div
        className="mt-7 flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 shadow-sm"
        role="alert"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-red-600 shadow-sm ring-1 ring-red-200">
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
            No se pudieron cargar los costos
          </strong>

          <p className="mt-1 text-sm leading-relaxed text-red-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!datos) {
    return null;
  }

  const servicios = datos.servicios || [];

  const costoMaximo = Math.max(
    ...servicios.map(
      (servicio) => Number(servicio.costoTotal) || 0,
    ),
    1,
  );

  return (
    <section className="relative mt-7 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_20px_60px_-28px_rgba(15,23,42,0.3)]">
      {/* Decoración */}
      <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-teal-100/70 blur-3xl" />

      {/* Encabezado */}
      <header className="relative flex flex-col gap-5 border-b border-slate-100 px-5 py-6 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-500/20">
            <svg
              aria-hidden="true"
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M4 7h16M7 3v4m10-4v4M6 11h4m4 0h4M6 15h4m4 0h4M6 19h4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
              <rect
                width="18"
                height="18"
                x="3"
                y="3"
                rx="3"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          </div>

          <div>
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                Costos de alimentación del evento
              </h2>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-inset ring-emerald-600/15">
                Actualizado
              </span>
            </div>

            <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
              Costos por comida según los consumos válidos de esta
              programación.
            </p>
          </div>
        </div>

        {/* Resumen del costo total */}
        <div className="relative min-w-0 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-4 text-white shadow-xl shadow-slate-900/15 sm:min-w-64">
          <div className="pointer-events-none absolute -right-5 -top-8 size-24 rounded-full bg-teal-400/20 blur-2xl" />

          <div className="relative">
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              <span className="size-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
              Costo total
            </span>

            <strong className="mt-2 block break-words text-2xl font-extrabold tracking-tight tabular-nums sm:text-[1.7rem]">
              {formatoPesos(datos.costoTotal)}
            </strong>

            <small className="mt-1.5 block text-xs text-slate-400">
              {formatoNumero(datos.totalPersonas)} consumos válidos
            </small>
          </div>
        </div>
      </header>

      <div className="relative px-5 py-6 sm:px-7 sm:py-7">
        {/* Error durante una actualización */}
        {error && (
          <div
            className="mb-5 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
            role="alert"
          >
            <svg
              aria-hidden="true"
              className="size-5 shrink-0 text-amber-600"
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

            <span>{error}</span>
          </div>
        )}

        {servicios.length === 0 ? (
          <div className="grid min-h-52 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-10 text-center">
            <div>
              <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200/70">
                <svg
                  aria-hidden="true"
                  className="size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M7 10h10M7 14h6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                </svg>
              </span>

              <p className="font-semibold text-slate-700">
                No hay consumos válidos
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Esta programación todavía no tiene costos registrados.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {servicios.map((servicio, index) => {
              const porcentaje =
                (Number(servicio.costoTotal) / costoMaximo) * 100;

              return (
                <article
                  className="group rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 transition-all duration-200 hover:border-teal-200 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 sm:p-5"
                  key={servicio.codigo}
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-teal-50 text-xs font-extrabold text-teal-700 ring-1 ring-inset ring-teal-600/10">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <strong className="truncate text-sm font-bold text-slate-800 sm:text-base">
                        {servicio.servicio}
                      </strong>
                    </div>

                    <span className="shrink-0 text-right text-sm font-extrabold tabular-nums text-slate-900 sm:text-base">
                      {formatoPesos(servicio.costoTotal)}
                    </span>
                  </div>

                  <div
                    className="h-3 w-full overflow-hidden rounded-full bg-slate-200/80 ring-1 ring-inset ring-slate-300/30"
                    role="img"
                    aria-label={`${servicio.servicio}: ${formatoPesos(
                      servicio.costoTotal,
                    )}`}
                  >
                    <div
                      className="relative h-full rounded-full bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-400 shadow-sm shadow-teal-500/30 transition-[width] duration-500 ease-out"
                      style={{ width: `${porcentaje}%` }}
                    >
                      <span className="absolute inset-x-1 top-px h-px rounded-full bg-white/40" />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <div className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-200/70">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Consumos
                      </span>

                      <strong className="mt-1 block text-xs font-bold tabular-nums text-slate-700 sm:text-sm">
                        {formatoNumero(servicio.cantidadPersonas)}
                      </strong>
                    </div>

                    <div className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-200/70">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Unitario
                      </span>

                      <strong className="mt-1 block break-words text-xs font-bold tabular-nums text-slate-700 sm:text-sm">
                        {formatoPesos(servicio.valorUnitario)}
                      </strong>
                    </div>

                    <div className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-200/70">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Invitados
                      </span>

                      <strong className="mt-1 block text-xs font-bold tabular-nums text-slate-700 sm:text-sm">
                        {formatoNumero(servicio.cantidadInvitados)}
                      </strong>
                    </div>

                    <div className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-200/70">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Acompañantes
                      </span>

                      <strong className="mt-1 block text-xs font-bold tabular-nums text-slate-700 sm:text-sm">
                        {formatoNumero(
                          servicio.cantidadAcompanantes,
                        )}
                      </strong>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}