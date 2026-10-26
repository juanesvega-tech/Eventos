
import { NextResponse } from "next/server";
import { listarProgramaciones } from "@/repositories/eventos.repository";

export async function GET() {
  try {
    const programaciones = await listarProgramaciones();

    return NextResponse.json({
      success: true,
      data: programaciones,
    });
  } catch (error) {
    console.error("Error al consultar programaciones:", error);

    return NextResponse.json(
      {
        success: false,
        message: "No fue posible consultar los eventos.",
      },
      { status: 500 }
    );
  }
}


