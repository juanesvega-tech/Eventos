
import { getConnection, sql } from "@/lib/sqlserver.js";

export async function obtenerReporteComidas(programacionNro) {
  const pool = await getConnection();

  const resultado = await pool
    .request()
    .input("programacionNro", sql.Decimal(10, 0), Number(programacionNro))
    .query(`
      ;WITH Acompanantes AS (
        SELECT
          RegistrosEventoNro,
          COUNT(*) AS CantidadAcompanantes
        FROM dbo.RegistrosEventoAcomp
        GROUP BY RegistrosEventoNro
      ),
      Consumos AS (
        SELECT
          re.RegistrosEventoNro,
          COUNT(*) AS CantidadComidas,
          SUM(COALESCE(ts.TipoServiciosValor, 0)) AS PrecioTotal
        FROM dbo.RegistrosEvento AS re
        INNER JOIN dbo.RegistrosEventoConsumos AS rec
          ON rec.RegistrosEventoNro = re.RegistrosEventoNro
        LEFT JOIN dbo.TipoServicios AS ts
          ON LTRIM(RTRIM(ts.TipoServiciosCodigo)) =
             LTRIM(RTRIM(rec.TipoServiciosCodigo))
        WHERE re.ProgramacionNro = @programacionNro
        GROUP BY re.RegistrosEventoNro
      )
      SELECT
        re.RegistrosEventoNro,
        LTRIM(RTRIM(re.PersonasDocumento)) AS DocumentoPrincipal,
        CASE
          WHEN COALESCE(a.CantidadAcompanantes, 0) > 0
            THEN 'Sí'
          ELSE 'No'
        END AS VinoConAcompanante,
        COALESCE(a.CantidadAcompanantes, 0) AS CantidadAcompanantes,
        COALESCE(c.CantidadComidas, 0) AS CantidadComidas,
        COALESCE(c.PrecioTotal, 0) AS PrecioTotal
      FROM dbo.RegistrosEvento AS re
      LEFT JOIN Acompanantes AS a
        ON a.RegistrosEventoNro = re.RegistrosEventoNro
      LEFT JOIN Consumos AS c
        ON c.RegistrosEventoNro = re.RegistrosEventoNro
      WHERE re.ProgramacionNro = @programacionNro
      ORDER BY re.RegistrosEventoNro;
    `);

  return resultado.recordset.map((fila) => ({
    RegistrosEventoNro: Number(fila.RegistrosEventoNro),
    DocumentoPrincipal: fila.DocumentoPrincipal ?? "",
    VinoConAcompanante: fila.VinoConAcompanante,
    CantidadAcompanantes: Number(fila.CantidadAcompanantes),
    CantidadComidas: Number(fila.CantidadComidas),
    PrecioTotal: Number(fila.PrecioTotal),
  }));
}
