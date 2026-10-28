
import { NextResponse } from "next/server";
import { obtenerConteoRegistros } from "@/repositories/registros.repository.js";



export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const programacionNro = searchParams.get("programacionNro");

    if (!programacionNro || !/^\d+$/.test(programacionNro)) {
      return NextResponse.json(
        { success: false, message: "Selecciona una programación válida." },
        { status: 400 }
      );
    }

    const data = await obtenerConteoRegistros(programacionNro);

    return NextResponse.json(
      { success: true, data, actualizadoEn: new Date().toISOString() },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Error consultando registros:", error);

    return NextResponse.json(
      { success: false, message: "Error al consultar los registros." },
      { status: 500 }
    );
  }
}
