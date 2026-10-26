
import { getConnection } from "../lib/sqlserver.js";

export async function listarProgramaciones() {
  const pool = await getConnection();

  const resultado = await pool.request().query(`
    SELECT
      p.ProgramacionNro,
      p.EventosNro,
      e.EventosNombre,
      p.ProgramacionDesde,
      p.ProgramacionHasta,
      p.ProgramacionEstado,
      p.ProgramacionAcompa,
      p.LugarEventosNro,
      l.LugarEventosNombre
    FROM dbo.Programacion AS p
    INNER JOIN dbo.Eventos AS e
      ON e.EventosNro = p.EventosNro
      AND e.EmpresaCodigo = p.EmpresaCodigo
    LEFT JOIN dbo.LugarEventos AS l
      ON l.LugarEventosNro = p.LugarEventosNro
      AND l.EmpresaCodigo = p.EmpresaCodigo
    ORDER BY p.ProgramacionDesde DESC;
  `);

  return resultado.recordset;
}
