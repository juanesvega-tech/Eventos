
"use client";

function formatearFecha(fecha) {
  if (!fecha) return "—";

  const partes = String(fecha).slice(0, 10).split("-");

  return partes.length === 3
    ? `${partes[2]}/${partes[1]}/${partes[0]}`
    : String(fecha);
}

export default function TablaDetalle({ registros = [] }) {
  return (
    <section className="seccion">
      <h3>Listado detallado</h3>

      <p className="subtitulo">
        {registros.length.toLocaleString("es-CO")} registros
      </p>

      {registros.length === 0 ? (
        <p className="vacio">No hay registros para mostrar.</p>
      ) : (
        <div className="contenedor-tabla">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Servicio</th>
                <th>Tipo</th>
                <th>Documento</th>
                <th>Nombre</th>
              </tr>
            </thead>

            <tbody>
              {registros.map((fila, index) => (
                <tr
                  key={`${fila.documento}-${fila.codigo}-${fila.fecha}-${index}`}
                >
                  <td>{formatearFecha(fila.fecha)}</td>
                  <td>{fila.servicio || "—"}</td>
                  <td>{fila.tipo || "—"}</td>
                  <td>{fila.documento || "—"}</td>
                  <td>{fila.nombre || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .seccion {
          margin-top: 20px;
          padding: 20px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
        }

        h3 {
          margin: 0;
          color: #111827;
          font-size: 17px;
        }

        .subtitulo,
        .vacio {
          color: #6b7280;
          font-size: 13px;
        }

        .contenedor-tabla {
          overflow-x: auto;
          margin-top: 18px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 13px;
        }

        th,
        td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          white-space: nowrap;
        }

        th {
          background: #f9fafb;
          color: #374151;
        }

        td {
          color: #4b5563;
        }

        tbody tr:hover {
          background: #f9fafb;
        }
      `}</style>
    </section>
  );
}
