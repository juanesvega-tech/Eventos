"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SelectorEvento from "@/components/layout/SelectorEvento";
import ContadorPersonas from "@/components/dashboard/RegistroPersonas/ContadorPersonas";
import ResumenAcompanantes from "@/components/dashboard/Acompanantes/ResumenAcompanantes";

import Image from "next/image";

export default function Home() {
  const [eventos, setEventos] = useState([]);
  const [programacion, setProgramacion] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarEventos() {
      try {
        const respuesta = await fetch("/api/eventos", {
          cache: "no-store",
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.success) {
          throw new Error(resultado.message || "Error al cargar eventos");
        }

        setEventos(resultado.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargarEventos();
  }, []);

  const evento = eventos.find(
    (item) => String(item.ProgramacionNro) === programacion
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#eef3e9]">
      {/* Fondo superior */}
      <div
        className="absolute inset-x-0 top-0 h-[340px] bg-[#14320f]"
        aria-hidden="true"
      />

      {/* Decoración de fondo */}
      <div
        className="pointer-events-none absolute -right-40 -top-48 h-[500px] w-[500px] rounded-full border-[90px] border-[#e2b808]/10"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Encabezado */}
        <header className="mb-8 flex items-start justify-between gap-8 text-white">
          <div>
            <p className="mb-3 text-xs font-extrabold tracking-[0.22em] text-[#e2b808]">
              PANEL DE CONTROL
            </p>

            <h1 className="max-w-3xl text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              Dashboard de eventos
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
              Controla los Asistentes, acompañantes y servicios de cada evento.
            </p>
          </div>

          <div className="hidden w-32 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/95 p-3 shadow-[0_12px_35px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:flex lg:w-40">
            <Image
              src="/images/logo-palmas.png"
              alt="Palmas del Cesar"
              width={300}
              height={273}
              priority
              className="h-auto w-full object-contain"
            />
          </div>
        </header>

        {/* Módulos */}
        <section
          aria-label="Módulos del dashboard"
          className="mb-7 grid max-w-md grid-cols-1 gap-4"
        >
          <Link
            href="/comida"
            className="group flex min-h-32 items-center gap-4 rounded-2xl border border-white/40 bg-white p-5 text-[#172114] no-underline shadow-[0_18px_50px_rgba(8,26,5,0.18)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(8,26,5,0.24)] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#e2b808]"
          >
            <span
              className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#14320f] text-[#e2b808]"
              aria-hidden="true"
            >
              <svg
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M7 3v7M4.5 3v4.5A2.5 2.5 0 0 0 7 10m0 0v11M16 3v18m0-18c2.4 1.8 3.5 4.1 3.5 6.8 0 2.2-1.3 3.7-3.5 4.2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-[10px] font-extrabold tracking-[0.16em] text-[#8a7000]">
                SERVICIOS
              </span>

              <strong className="text-lg font-bold text-[#14320f]">
                Comida
              </strong>

              <span className="text-sm leading-5 text-slate-500">
                Consulta los consumos y porcentajes por tipo de servicio.
              </span>
            </span>

            <span
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f3f5ef] text-[#14320f] transition-colors group-hover:bg-[#e2b808]"
              aria-hidden="true"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="m9 18 6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </section>

        {/* Estado de carga */}
        {cargando && (
          <div
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm font-medium text-slate-600 shadow-sm"
            role="status"
          >
            <span
              className="h-5 w-5 animate-spin rounded-full border-[3px] border-[#14320f]/15 border-t-[#e2b808]"
              aria-hidden="true"
            />
            Cargando eventos...
          </div>
        )}

        {/* Estado de error */}
        {error && (
          <div
            className="flex flex-col gap-1 rounded-2xl border border-red-200 border-l-4 border-l-red-700 bg-white p-5 text-red-800 shadow-sm"
            role="alert"
          >
            <strong className="text-sm font-bold">
              No pudimos cargar los eventos
            </strong>
            <span className="text-sm">{error}</span>
          </div>
        )}

        {!cargando && !error && (
          <div className="grid gap-6">
            {/* Selector */}
            <section className="rounded-3xl border border-[#dce4d8] bg-white p-5 shadow-[0_8px_30px_rgba(20,50,15,0.06)] sm:p-7">
              <div className="mb-6 flex items-center gap-4">
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#e2b808] text-xs font-black text-[#14320f]"
                  aria-hidden="true"
                >
                  01
                </span>

                <div>
                  <h2 className="text-xl font-bold text-[#14320f]">
                    Selecciona un evento
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Elige la programación que deseas consultar.
                  </p>
                </div>
              </div>

              <SelectorEvento
                eventos={eventos}
                eventoSeleccionado={programacion}
                onSeleccionar={setProgramacion}
              />
            </section>

            {/* Evento seleccionado */}
            {evento && (
              <section className="relative overflow-hidden rounded-3xl bg-[#14320f] p-6 text-white shadow-[0_14px_34px_rgba(20,50,15,0.16)] sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-7 sm:pl-9">
                <div
                  className="absolute inset-y-0 left-0 w-2 bg-[#e2b808]"
                  aria-hidden="true"
                />

                <div>
                  <p className="text-[10px] font-extrabold tracking-[0.18em] text-[#e2b808]">
                    EVENTO ACTIVO
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-white">
                    {evento.EventosNombre}
                  </h2>
                </div>

                <div className="mt-6 grid gap-5 sm:mt-0 sm:grid-cols-2 sm:gap-10">
                  <p className="grid gap-1">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-white/50">
                      Lugar
                    </span>
                    <strong className="text-sm font-semibold text-white">
                      {evento.LugarEventosNombre || "Sin lugar asignado"}
                    </strong>
                  </p>

                  <p className="grid gap-1">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-white/50">
                      Programación
                    </span>
                    <strong className="text-sm font-semibold text-white">
                      {String(evento.ProgramacionNro)}
                    </strong>
                  </p>
                </div>
              </section>
            )}

            <ContadorPersonas programacionNro={programacion} />
            <ResumenAcompanantes programacionNro={programacion} />
          </div>
        )}
      </div>
    </main>
  );
}