"use client";

export default function SelectorEvento({
  eventos = [],
  eventoSeleccionado = "",
  onSeleccionar,
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#d4dfd0] bg-[#f8faf5] p-5 shadow-[0_20px_60px_-28px_rgba(20,50,15,0.25)] sm:p-6">
      {/* Decoración */}
      <div
        className="pointer-events-none absolute -right-16 -top-20 size-48 rounded-full bg-[#e2b808]/15 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-20 -left-16 size-40 rounded-full bg-[#14320f]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative">
        {/* Encabezado */}
        <div className="mb-5 flex items-center gap-3.5">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#14320f] text-[#e2b808] shadow-lg shadow-[#14320f]/20">
            <svg
              aria-hidden="true"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M8 3v3m8-3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a2 2 0 0 1 2-2Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />

              <path
                d="M8 13h3m2 0h3m-8 4h3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.8"
              />
            </svg>
          </div>

          <div>
            <label
              htmlFor="evento"
              className="block text-base font-bold tracking-tight text-[#14320f]"
            >
              Seleccionar evento
            </label>

            <p className="mt-0.5 text-sm text-slate-500">
              Elige una programación para consultar su información.
            </p>
          </div>
        </div>

        {/* Selector */}
        <div className="relative">
          <select
            id="evento"
            value={eventoSeleccionado}
            onChange={(e) => onSeleccionar(e.target.value)}
            className="w-full appearance-none rounded-2xl border border-[#d4dfd0] bg-white py-3.5 pl-4 pr-12 text-sm font-medium text-slate-700 shadow-sm outline-none transition-all duration-200 hover:border-[#e2b808] focus:border-[#e2b808] focus:ring-4 focus:ring-[#e2b808]/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:text-base"
          >
            <option value="">Selecciona una programación</option>

            {eventos.map((evento) => (
              <option
                key={String(evento.ProgramacionNro)}
                value={String(evento.ProgramacionNro)}
              >
                {evento.EventosNombre} — Programación{" "}
                {String(evento.ProgramacionNro)}
              </option>
            ))}
          </select>

          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#14320f]">
            <svg
              aria-hidden="true"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="m7 10 5 5 5-5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </span>
        </div>

        {/* Información inferior */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1">
          <span className="flex items-center gap-2 text-xs text-slate-500">
            <span className="size-2 rounded-full bg-[#14320f] shadow-sm shadow-[#14320f]/30" />

            {eventos.length.toLocaleString("es-CO")}{" "}
            {eventos.length === 1
              ? "programación disponible"
              : "programaciones disponibles"}
          </span>

          {eventoSeleccionado && (
            <span className="rounded-full bg-[#e2b808]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#14320f] ring-1 ring-inset ring-[#e2b808]/40">
              Programación {eventoSeleccionado}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}