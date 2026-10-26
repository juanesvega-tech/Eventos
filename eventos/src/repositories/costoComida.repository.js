
import { getConnection, sql } from "@/lib/sqlserver.js";

export async function obtenerCostosComida(programacionNro) {
  const pool = await getConnection();

  const resultado = await pool
    .request()
    .input(
      "programacionNro",
      sql.Decimal(10, 0),
      Number(programacionNro)
    )
    .query(`
      ;WITH ConsumosBase AS (
        SELECT
          re.ProgramacionNro,
          LTRIM(RTRIM(rec.RegistrosConsumosTipo)) AS TipoConsumo,
          LTRIM(RTRIM(rec.TipoServiciosCodigo)) AS CodigoServicio,
          CAST(rec.RegistrosConsumosFec AS DATE) AS FechaConsumo,
          CASE
            WHEN LTRIM(RTRIM(rec.RegistrosConsumosTipo)) = 'PRINCIPAL'
              THEN LTRIM(RTRIM(re.PersonasDocumento))
            WHEN LTRIM(RTRIM(rec.RegistrosConsumosTipo)) = 'INVITADO'
              THEN LTRIM(RTRIM(rea.RegistrosAcompDocum))
          END AS DocumentoPersona,
          rec.RegistrosConsumosHor AS HoraConsumo
        FROM dbo.RegistrosEventoConsumos AS rec
        INNER JOIN dbo.RegistrosEvento AS re
          ON re.RegistrosEventoNro = rec.RegistrosEventoNro
        LEFT JOIN dbo.RegistrosEventoAcomp AS rea
          ON rea.RegistrosEventoNro = rec.RegistrosEventoNro
        WHERE re.ProgramacionNro = @programacionNro
          AND LTRIM(RTRIM(rec.RegistrosConsumosTipo))
              IN ('PRINCIPAL', 'INVITADO')
          AND (
            LTRIM(RTRIM(rec.RegistrosConsumosTipo)) = 'PRINCIPAL'
            OR rea.RegistrosAcompDocum IS NOT NULL
          )
      ),
      ConsumosNumerados AS (
        SELECT
          ProgramacionNro,
          TipoConsumo,
          CodigoServicio,
          FechaConsumo,
          DocumentoPersona,
          ROW_NUMBER() OVER (
            PARTITION BY
              ProgramacionNro,
              DocumentoPersona,
              TipoConsumo,
              CodigoServicio,
              FechaConsumo
            ORDER BY HoraConsumo
          ) AS rn
        FROM ConsumosBase
        WHERE DocumentoPersona IS NOT NULL
          AND DocumentoPersona <> ''
      ),
      ConsumosValidos AS (
        SELECT
          ProgramacionNro,
          TipoConsumo,
          CodigoServicio,
          FechaConsumo,
          DocumentoPersona
        FROM ConsumosNumerados
        WHERE rn = 1
      )
      SELECT
        LTRIM(RTRIM(ts.TipoServiciosCodigo)) AS codigo,
        LTRIM(RTRIM(ts.TipoServiciosNombre)) AS servicio,
        ts.TipoServiciosValor AS valorUnitario,
        COUNT(*) AS cantidadPersonas,
        COUNT(*) * ts.TipoServiciosValor AS costoTotal,
        SUM(
          CASE
            WHEN cv.TipoConsumo = 'PRINCIPAL' THEN 1
            ELSE 0
          END
        ) AS cantidadInvitados,
        SUM(
          CASE
            WHEN cv.TipoConsumo = 'INVITADO' THEN 1
            ELSE 0
          END
        ) AS cantidadAcompanantes
      FROM ConsumosValidos AS cv
      INNER JOIN dbo.TipoServicios AS ts
        ON LTRIM(RTRIM(ts.TipoServiciosCodigo)) =
           cv.CodigoServicio
      GROUP BY
        LTRIM(RTRIM(ts.TipoServiciosCodigo)),
        LTRIM(RTRIM(ts.TipoServiciosNombre)),
        ts.TipoServiciosValor
      ORDER BY costoTotal DESC;
    `);

  const servicios = resultado.recordset.map((fila) => ({
    codigo: fila.codigo,
    servicio: fila.servicio,
    valorUnitario: Number(fila.valorUnitario),
    cantidadPersonas: Number(fila.cantidadPersonas),
    costoTotal: Number(fila.costoTotal),
    cantidadInvitados: Number(fila.cantidadInvitados),
    cantidadAcompanantes: Number(fila.cantidadAcompanantes),
  }));

  const totalPersonas = servicios.reduce(
    (suma, fila) => suma + fila.cantidadPersonas,
    0
  );

  const costoTotal = servicios.reduce(
    (suma, fila) => suma + fila.costoTotal,
    0
  );

  return {
    servicios,
    totalPersonas,
    costoTotal,
  };
}
