import { NextResponse } from "next/server";
import { obtenerResumenAcompanantes } from "@/repositories/acompanantes.repository.js";



export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const programacionNro = searchParams.get("programacionNro");

    if (!programacionNro || !/^\d+$/.test(programacionNro)) {
      return NextResponse.json(
        {
          success: false,
          message: "Selecciona una programación válida.",
        },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const data = await obtenerResumenAcompanantes(programacionNro);

    return NextResponse.json(
      { success: true, data, actualizadoEn: new Date().toISOString() },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Error consultando resumen de acompañantes:", error);

    return NextResponse.json(
      {
        success: false,
        message: "No fue posible consultar el resumen de acompañantes.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}