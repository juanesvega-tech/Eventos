
import { NextResponse } from "next/server";
import { obtenerReporteComidas } from "@/repositories/reporteComidas.repository.js";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const programacionNro = searchParams.get("programacionNro");

    if (!programacionNro || !/^\d+$/.test(programacionNro)) {
      return NextResponse.json(
        { success: false, message: "Programación inválida." },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    const data = await obtenerReporteComidas(programacionNro);

    return NextResponse.json(
      { success: true, data },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Error generando reporte de comidas:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error generando el reporte.",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
