import { NextResponse } from "next/server";
import { obtenerDetalleRegistros } from "@/repositories/registros.repository.js";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const programacionNro = searchParams.get("programacionNro");

    if (!programacionNro || !Number.isFinite(Number(programacionNro))) {
      return NextResponse.json(
        {
          success: false,
          message: "Debes seleccionar una programación válida.",
        },
        { status: 400 }
      );
    }

    const data = await obtenerDetalleRegistros(programacionNro);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error al consultar el detalle de registros:", error);

    return NextResponse.json(
      {
        success: false,
        message: "No se pudieron consultar todas las personas.",
      },
      { status: 500 }
    );
  }
}