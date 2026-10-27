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
    <section className="tarjeta">
      <header className="encabezado">
        <div>
          <span className="etiqueta">ANÁLISIS DE ACOMPAÑANTES</span>
          <h2>Porcentaje de acompañantes</h2>
          <p>
            A que tienen acompañantes registrados frente
            a asistentes que no tienen.
          </p>
        </div>

        <span className="estado">● Actualización cada 5 segundos</span>
      </header>

      <div className="contenido">
        <div
          className="grafica"
          style={{ background: gradiente }}
          role="img"
          aria-label={`Con acompañante ${porcentajeCon.toFixed(1)} por ciento, sin acompañante ${porcentajeSin.toFixed(1)} por ciento`}
        >
          <div className="centro">
            <strong>{total > 0 ? "100%" : "0%"}</strong>
            <span>Asistentes analizados</span>
          </div>
        </div>

        <div className="leyenda">
          <div className="item">
            <span className="punto azul" />
            <div>
              <strong>Con acompañante</strong>
              <p>{numero(conAcompanante)} asistentes</p>
            </div>
            <b>{porcentajeCon.toFixed(1)}%</b>
          </div>

          <div className="item">
            <span className="punto gris" />
            <div>
              <strong>Sin acompañante</strong>
              <p>{numero(sinAcompanante)} asistentes</p>
            </div>
            <b>{porcentajeSin.toFixed(1)}%</b>
          </div>
        </div>
      </div>

      <p className="nota">
        Los porcentajes se calculan sobre los asistentes analizados,
        no sobre la suma de asistentes y acompañantes.
      </p>

      <style jsx>{`
        .tarjeta {
          margin-top: 24px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          background: white;
          box-shadow: 0 3px 12px #0f172a08;
        }

        .encabezado {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 16px;
        }

        .etiqueta {
          color: #2563eb;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.4px;
        }

        h2 {
          margin: 8px 0;
          color: #111827;
          font-size: 24px;
        }

        .encabezado p,
        .nota {
          color: #64748b;
          font-size: 14px;
          line-height: 1.6;
        }

        .estado {
          color: #047857;
          font-size: 12px;
        }

        .contenido {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 48px;
          padding: 32px 0;
        }

        .grafica {
          display: grid;
          width: 230px;
          height: 230px;
          flex-shrink: 0;
          place-items: center;
          border-radius: 50%;
        }

        .centro {
          display: flex;
          width: 145px;
          height: 145px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: white;
          text-align: center;
        }

        .centro strong {
          color: #172554;
          font-size: 30px;
        }

        .centro span {
          margin-top: 4px;
          color: #64748b;
          font-size: 12px;
        }

        .leyenda {
          display: flex;
          min-width: 260px;
          flex: 1;
          flex-direction: column;
          gap: 24px;
        }

        .item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .punto {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
          border-radius: 50%;
        }

        .azul {
          background: #2563eb;
        }

        .gris {
          background: #d1d5db;
        }

        .item div {
          flex: 1;
        }

        .item strong {
          color: #1f2937;
          font-size: 15px;
        }

        .item p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .item b {
          color: #1d4ed8;
          font-size: 22px;
        }

        .nota {
          margin: 0;
          padding: 12px 14px;
          border-radius: 8px;
          background: #eff6ff;
          color: #1d4ed8;
        }

        @media (max-width: 600px) {
          .tarjeta {
            padding: 18px;
          }

          .grafica {
            width: 190px;
            height: 190px;
          }

          .centro {
            width: 120px;
            height: 120px;
          }

          .contenido {
            gap: 28px;
          }

          .leyenda {
            min-width: 0;
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}