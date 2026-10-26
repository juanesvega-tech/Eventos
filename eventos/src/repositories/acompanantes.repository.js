import { getConnection, sql } from "../lib/sqlserver.js";

export async function obtenerResumenAcompanantes(programacionNro) {
  const pool = await getConnection();

  const resultado = await pool
    .request()
    .input("ProgramacionNro", sql.Decimal(10, 0), programacionNro)
    .query(`
      WITH Invitados AS (
        SELECT DISTINCT
          LTRIM(RTRIM(r.PersonasDocumento)) AS Documento
        FROM dbo.RegistrosEvento AS r
        WHERE r.ProgramacionNro = @ProgramacionNro
          AND LTRIM(RTRIM(r.PersonasDocumento)) <> ''
      ),
      InvitadosConAcompanante AS (
        SELECT DISTINCT
          LTRIM(RTRIM(r.PersonasDocumento)) AS Documento
        FROM dbo.RegistrosEvento AS r
        INNER JOIN dbo.RegistrosEventoAcomp AS a
          ON a.RegistrosEventoNro = r.RegistrosEventoNro
        WHERE r.ProgramacionNro = @ProgramacionNro
          AND LTRIM(RTRIM(r.PersonasDocumento)) <> ''
          AND LTRIM(RTRIM(a.RegistrosAcompDocum)) <> ''
      )
      SELECT
        COUNT(*) AS TotalInvitados,
        COUNT(c.Documento) AS ConAcompanante,
        COUNT(*) - COUNT(c.Documento) AS SinAcompanante
      FROM Invitados AS i
      LEFT JOIN InvitadosConAcompanante AS c
        ON c.Documento = i.Documento;
    `);

  const fila = resultado.recordset[0];

  return {
    totalInvitados: Number(fila.TotalInvitados),
    conAcompanante: Number(fila.ConAcompanante),
    sinAcompanante: Number(fila.SinAcompanante),
  };
}