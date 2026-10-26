
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
