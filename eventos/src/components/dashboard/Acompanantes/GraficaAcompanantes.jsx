"use client";

export default function GraficaAcompanantes({
  conAcompanante = 0,
  sinAcompanante = 0,
}) {
  const total = conAcompanante + sinAcompanante;

  const porcentajeCon =
    total > 0 ? (conAcompanante / total) * 100 : 0;

  const porcentajeSin =
    total > 0 ? (sinAcompanante / total) * 100 : 0;

  const gradiente =
    total > 0
      ? `conic-gradient(#2563eb 0% ${porcentajeCon}%, #d1d5db ${porcentajeCon}% 100%)`
      : "#e5e7eb";

  const numero = (valor) =>
    Number(valor).toLocaleString("es-CO");

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_3px_12px_rgba(15,23,42,0.03)] sm:p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <span className="text-[11px] font-extrabold tracking-[1.4px] text-blue-600">
            ANÁLISIS DE ACOMPAÑANTES
          </span>

          <h2 className="my-2 text-2xl font-bold leading-tight text-gray-900">
            Porcentaje de acompañantes
          </h2>

          <p className="text-sm leading-[1.6] text-slate-500">
            A que tienen acompañantes registrados frente a asistentes que no
            tienen.
          </p>
        </div>

        <span className="flex shrink-0 items-center gap-2 text-xs text-emerald-700">
          <span
            className="size-2 rounded-full bg-emerald-600"
            aria-hidden="true"
          />
          Actualización cada 5 segundos
        </span>
      </header>

      {/* En móvil es vertical; desde md pasa a horizontal */}
      <div className="flex flex-col items-center gap-8 py-8 md:flex-row md:justify-center md:gap-12">
        <div
          className="grid aspect-square w-[190px] shrink-0 place-items-center rounded-full sm:w-[210px] md:w-[230px]"
          style={{ background: gradiente }}
          role="img"
          aria-label={`Con acompañante ${porcentajeCon.toFixed(
            1
          )} por ciento, sin acompañante ${porcentajeSin.toFixed(
            1
          )} por ciento`}
        >
          <div className="flex aspect-square w-[120px] flex-col items-center justify-center rounded-full bg-white px-3 text-center sm:w-[132px] md:w-[145px]">
            <strong className="text-[28px] font-bold leading-none text-blue-950 md:text-[30px]">
              {total > 0 ? "100%" : "0%"}
            </strong>

            <span className="mt-2 text-xs leading-4 text-slate-500">
              Asistentes analizados
            </span>
          </div>
        </div>

        {/* Leyenda */}
        <div className="flex w-full min-w-0 flex-col gap-6 md:max-w-xl md:flex-1">
          <div className="grid grid-cols-[14px_minmax(0,1fr)_auto] items-center gap-3">
            <span
              className="size-3.5 rounded-full bg-blue-600"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <strong className="block text-[15px] font-bold leading-5 text-gray-800">
                Con acompañante
              </strong>

              <p className="mt-1 text-[13px] text-slate-500">
                {numero(conAcompanante)} asistentes
              </p>
            </div>

            <b className="whitespace-nowrap text-right text-xl font-bold text-blue-700 sm:text-[22px]">
              {porcentajeCon.toFixed(1)}%
            </b>
          </div>

          <div className="grid grid-cols-[14px_minmax(0,1fr)_auto] items-center gap-3">
            <span
              className="size-3.5 rounded-full bg-gray-300"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <strong className="block text-[15px] font-bold leading-5 text-gray-800">
                Sin acompañante
              </strong>

              <p className="mt-1 text-[13px] text-slate-500">
                {numero(sinAcompanante)} asistentes
              </p>
            </div>

            <b className="whitespace-nowrap text-right text-xl font-bold text-blue-700 sm:text-[22px]">
              {porcentajeSin.toFixed(1)}%
            </b>
          </div>
        </div>
      </div>

      <p className="m-0 rounded-lg bg-blue-50 px-3.5 py-3 text-sm leading-[1.6] text-blue-700">
        Los porcentajes se calculan sobre los asistentes analizados, no sobre la
        suma de asistentes y acompañantes.
      </p>
    </section>
  );
}