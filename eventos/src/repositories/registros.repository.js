
import { getConnection, sql } from "../lib/sqlserver.js";

export async function obtenerConteoRegistros(programacionNro) {
  const pool = await getConnection();

  const resultado = await pool
    .request()
    .input("ProgramacionNro", sql.Decimal(18, 0), programacionNro)
    .query(`
      SELECT
        (
          SELECT COUNT(DISTINCT LTRIM(RTRIM(r.PersonasDocumento)))
          FROM dbo.RegistrosEvento AS r
          WHERE r.ProgramacionNro = @ProgramacionNro
            AND LTRIM(RTRIM(r.PersonasDocumento)) <> ''
        ) AS Invitados,

        (
          SELECT COUNT(DISTINCT LTRIM(RTRIM(a.RegistrosAcompDocum)))
          FROM dbo.RegistrosEventoAcomp AS a
          INNER JOIN dbo.RegistrosEvento AS r
            ON r.RegistrosEventoNro = a.RegistrosEventoNro
          WHERE r.ProgramacionNro = @ProgramacionNro
            AND LTRIM(RTRIM(a.RegistrosAcompDocum)) <> ''
        ) AS Acompanantes;
    `);

  const fila = resultado.recordset[0];
  const invitados = Number(fila.Invitados);
  const acompanantes = Number(fila.Acompanantes);

  return {
    invitados,
    acompanantes,
    total: invitados + acompanantes,
  };
  
}

export async function obtenerDetalleRegistros(programacionNro) {
  const pool = await getConnection();

  const resultado = await pool
    .request()
    .input("ProgramacionNro", sql.Decimal(18, 0), Number(programacionNro))
    .query(`
      ;WITH Principales AS (
        SELECT
          LTRIM(RTRIM(r.PersonasDocumento)) AS Documento,
          MAX(LTRIM(RTRIM(p.PersonasNombresComp))) AS Nombre
        FROM dbo.RegistrosEvento AS r
        LEFT JOIN dbo.Personas AS p
          ON LTRIM(RTRIM(p.PersonasDocumento)) =
             LTRIM(RTRIM(r.PersonasDocumento))
        WHERE r.ProgramacionNro = @ProgramacionNro
          AND LTRIM(RTRIM(r.PersonasDocumento)) <> ''
        GROUP BY LTRIM(RTRIM(r.PersonasDocumento))
      ),
      Acompanantes AS (
        SELECT
          LTRIM(RTRIM(a.RegistrosAcompDocum)) AS Documento,
          MAX(LTRIM(RTRIM(a.RegistrosAcompNombre))) AS Nombre
        FROM dbo.RegistrosEventoAcomp AS a
        INNER JOIN dbo.RegistrosEvento AS r
          ON r.RegistrosEventoNro = a.RegistrosEventoNro
        WHERE r.ProgramacionNro = @ProgramacionNro
          AND LTRIM(RTRIM(a.RegistrosAcompDocum)) <> ''
        GROUP BY LTRIM(RTRIM(a.RegistrosAcompDocum))
      )
      SELECT
        'PRINCIPAL' AS Tipo,
        Documento,
        COALESCE(Nombre, '') AS Nombre
      FROM Principales

      UNION ALL

      SELECT
        'INVITADO' AS Tipo,
        Documento,
        COALESCE(Nombre, '') AS Nombre
      FROM Acompanantes

      ORDER BY Nombre, Documento;
    `);

  return resultado.recordset.map((fila) => ({
    tipo: fila.Tipo,
    documento: fila.Documento,
    nombre: fila.Nombre,
  }));
}