
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
          r.RegistrosEventoNro,
          LTRIM(RTRIM(r.PersonasDocumento)) AS Documento,
          MAX(LTRIM(RTRIM(p.PersonasNombresComp))) AS Nombre
        FROM dbo.RegistrosEvento AS r
        LEFT JOIN dbo.Personas AS p
          ON LTRIM(RTRIM(p.PersonasDocumento)) =
             LTRIM(RTRIM(r.PersonasDocumento))
        WHERE r.ProgramacionNro = @ProgramacionNro
          AND LTRIM(RTRIM(r.PersonasDocumento)) <> ''
        GROUP BY
          r.RegistrosEventoNro,
          LTRIM(RTRIM(r.PersonasDocumento))
      ),
      Acompanantes AS (
        SELECT
          a.RegistrosEventoNro,
          LTRIM(RTRIM(a.RegistrosAcompDocum)) AS Documento,
          MAX(LTRIM(RTRIM(a.RegistrosAcompNombre))) AS Nombre
        FROM dbo.RegistrosEventoAcomp AS a
        INNER JOIN dbo.RegistrosEvento AS r
          ON r.RegistrosEventoNro = a.RegistrosEventoNro
        WHERE r.ProgramacionNro = @ProgramacionNro
          AND LTRIM(RTRIM(a.RegistrosAcompDocum)) <> ''
        GROUP BY
          a.RegistrosEventoNro,
          LTRIM(RTRIM(a.RegistrosAcompDocum))
      )
      SELECT
        p.RegistrosEventoNro,
        p.Documento AS PrincipalDocumento,
        p.Nombre AS PrincipalNombre,
        a.Documento AS InvitadoDocumento,
        a.Nombre AS InvitadoNombre
      FROM Principales p
      LEFT JOIN Acompanantes a
        ON a.RegistrosEventoNro = p.RegistrosEventoNro

      UNION ALL

      SELECT
        a.RegistrosEventoNro,
        '' AS PrincipalDocumento,
        '' AS PrincipalNombre,
        a.Documento AS InvitadoDocumento,
        a.Nombre AS InvitadoNombre
      FROM Acompanantes a
      WHERE NOT EXISTS (
        SELECT 1
        FROM Principales p
        WHERE p.RegistrosEventoNro = a.RegistrosEventoNro
      )
      ORDER BY RegistrosEventoNro;
    `);

  return resultado.recordset;
}