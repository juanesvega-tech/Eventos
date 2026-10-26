
import { getConnection, sql } from "@/lib/sqlserver.js";

export async function obtenerConsumosComida(programacionNro) {
  const pool = await getConnection();

  const resultado = await pool
    .request()
    .input(
      "ProgramacionNro",
      sql.Decimal(10, 0),
      Number(programacionNro)
    )
    .query(`
      ;WITH ConsumosBase AS (
        SELECT DISTINCT
          re.ProgramacionNro,
          LTRIM(RTRIM(rec.RegistrosConsumosTipo)) AS TipoConsumo,
          LTRIM(RTRIM(rec.TipoServiciosCodigo)) AS CodigoServicio,
          LTRIM(RTRIM(ts.TipoServiciosNombre)) AS NombreServicio,
          CAST(rec.RegistrosConsumosFec AS DATE) AS FechaConsumo,
          CASE
            WHEN LTRIM(RTRIM(rec.RegistrosConsumosTipo)) = 'PRINCIPAL'
              THEN LTRIM(RTRIM(re.PersonasDocumento))
            WHEN LTRIM(RTRIM(rec.RegistrosConsumosTipo)) = 'INVITADO'
              THEN LTRIM(RTRIM(rea.RegistrosAcompDocum))
          END AS DocumentoPersona
        FROM dbo.RegistrosEventoConsumos AS rec
        INNER JOIN dbo.RegistrosEvento AS re
          ON re.RegistrosEventoNro = rec.RegistrosEventoNro
        INNER JOIN dbo.TipoServicios AS ts
          ON LTRIM(RTRIM(ts.TipoServiciosCodigo)) =
             LTRIM(RTRIM(rec.TipoServiciosCodigo))
        LEFT JOIN dbo.RegistrosEventoAcomp AS rea
          ON rea.RegistrosEventoNro = rec.RegistrosEventoNro
        WHERE re.ProgramacionNro = @ProgramacionNro
          AND LTRIM(RTRIM(rec.RegistrosConsumosTipo))
              IN ('PRINCIPAL', 'INVITADO')
          AND (
            LTRIM(RTRIM(rec.RegistrosConsumosTipo)) = 'PRINCIPAL'
            OR rea.RegistrosAcompDocum IS NOT NULL
          )
      ),
      PersonasUnicas AS (
        SELECT DISTINCT
          ProgramacionNro,
          TipoConsumo,
          CodigoServicio,
          NombreServicio,
          FechaConsumo,
          DocumentoPersona
        FROM ConsumosBase
        WHERE DocumentoPersona IS NOT NULL
          AND DocumentoPersona <> ''
      )
      SELECT
        CodigoServicio,
        NombreServicio,
        SUM(
          CASE
            WHEN TipoConsumo = 'PRINCIPAL' THEN 1
            ELSE 0
          END
        ) AS Trabajadores,
        SUM(
          CASE
            WHEN TipoConsumo = 'INVITADO' THEN 1
            ELSE 0
          END
        ) AS Acompanantes
      FROM PersonasUnicas
      GROUP BY
        CodigoServicio,
        NombreServicio
      ORDER BY NombreServicio;
    `);

  const serviciosBase = resultado.recordset.map((fila) => ({
    codigo: fila.CodigoServicio,
    nombre: fila.NombreServicio,
    trabajadores: Number(fila.Trabajadores),
    acompanantes: Number(fila.Acompanantes),
  }));

  function calcularResumen(servicios) {
    const total = servicios.reduce(
      (suma, servicio) => suma + servicio.cantidad,
      0
    );

    return {
      total,
      servicios: servicios.map((servicio) => ({
        ...servicio,
        porcentaje:
          total > 0
            ? Number(
                ((servicio.cantidad / total) * 100).toFixed(2)
              )
            : 0,
      })),
    };
  }

  const trabajadores = calcularResumen(
    serviciosBase.map((servicio) => ({
      codigo: servicio.codigo,
      nombre: servicio.nombre,
      cantidad: servicio.trabajadores,
    }))
  );

  const acompanantes = calcularResumen(
    serviciosBase.map((servicio) => ({
      codigo: servicio.codigo,
      nombre: servicio.nombre,
      cantidad: servicio.acompanantes,
    }))
  );

  const general = calcularResumen(
    serviciosBase.map((servicio) => ({
      codigo: servicio.codigo,
      nombre: servicio.nombre,
      cantidad: servicio.trabajadores + servicio.acompanantes,
    }))
  );

  return {
    trabajadores,
    acompanantes,
    general,
  };
}

export async function obtenerDetalleConsumosComida(
  programacionNro,
  tipoDetalle
) {
  const pool = await getConnection();

  const resultado = await pool
    .request()
    .input(
      "ProgramacionNro",
      sql.Decimal(10, 0),
      Number(programacionNro)
    )
    .input("TipoDetalle", sql.NVarChar(20), tipoDetalle)
    .query(`
      ;WITH DetalleBase AS (
        SELECT
          LTRIM(RTRIM(rec.RegistrosConsumosTipo)) AS TipoConsumo,
          LTRIM(RTRIM(ts.TipoServiciosCodigo)) AS CodigoServicio,
          LTRIM(RTRIM(ts.TipoServiciosNombre)) AS NombreServicio,
          CASE
            WHEN LTRIM(RTRIM(rec.RegistrosConsumosTipo)) = 'PRINCIPAL'
              THEN LTRIM(RTRIM(re.PersonasDocumento))
            WHEN LTRIM(RTRIM(rec.RegistrosConsumosTipo)) = 'INVITADO'
              THEN LTRIM(RTRIM(rea.RegistrosAcompDocum))
          END AS DocumentoPersona,
          CASE
            WHEN LTRIM(RTRIM(rec.RegistrosConsumosTipo)) = 'PRINCIPAL'
              THEN p.PersonasNombresComp
            WHEN LTRIM(RTRIM(rec.RegistrosConsumosTipo)) = 'INVITADO'
              THEN rea.RegistrosAcompNombre
          END AS NombrePersona,
          rec.RegistrosConsumosFec AS FechaConsumo
        FROM dbo.RegistrosEventoConsumos AS rec
        INNER JOIN dbo.RegistrosEvento AS re
          ON re.RegistrosEventoNro = rec.RegistrosEventoNro
        INNER JOIN dbo.TipoServicios AS ts
          ON LTRIM(RTRIM(ts.TipoServiciosCodigo)) =
             LTRIM(RTRIM(rec.TipoServiciosCodigo))
        LEFT JOIN dbo.Personas AS p
          ON LTRIM(RTRIM(p.PersonasDocumento)) =
             LTRIM(RTRIM(re.PersonasDocumento))
        LEFT JOIN dbo.RegistrosEventoAcomp AS rea
          ON rea.RegistrosEventoNro = rec.RegistrosEventoNro
        WHERE re.ProgramacionNro = @ProgramacionNro
          AND LTRIM(RTRIM(rec.RegistrosConsumosTipo))
              IN ('PRINCIPAL', 'INVITADO')
          AND (
            @TipoDetalle = 'general'
            OR (
              @TipoDetalle = 'trabajadores'
              AND LTRIM(RTRIM(rec.RegistrosConsumosTipo)) = 'PRINCIPAL'
            )
            OR (
              @TipoDetalle = 'acompanantes'
              AND LTRIM(RTRIM(rec.RegistrosConsumosTipo)) = 'INVITADO'
            )
          )
          AND (
            LTRIM(RTRIM(rec.RegistrosConsumosTipo)) = 'PRINCIPAL'
            OR rea.RegistrosAcompDocum IS NOT NULL
          )
      )
      SELECT
        TipoConsumo,
        CodigoServicio,
        NombreServicio,
        DocumentoPersona,
        MAX(NombrePersona) AS NombrePersona,
        CAST(FechaConsumo AS DATE) AS FechaConsumo
      FROM DetalleBase
      WHERE DocumentoPersona IS NOT NULL
        AND DocumentoPersona <> ''
      GROUP BY
        TipoConsumo,
        CodigoServicio,
        NombreServicio,
        DocumentoPersona,
        CAST(FechaConsumo AS DATE)
      ORDER BY
        CAST(FechaConsumo AS DATE),
        NombreServicio,
        TipoConsumo,
        DocumentoPersona;
    `);

  return resultado.recordset.map((fila) => ({
    tipo: String(fila.TipoConsumo).trim(),
    codigo: String(fila.CodigoServicio).trim(),
    servicio: String(fila.NombreServicio).trim(),
    documento: String(fila.DocumentoPersona).trim(),
    nombre: fila.NombrePersona
      ? String(fila.NombrePersona).trim()
      : "",
    fecha: fila.FechaConsumo,
  }));
}
