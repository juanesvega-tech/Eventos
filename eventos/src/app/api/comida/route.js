
import {
  obtenerConsumosComida,
  obtenerDetalleConsumosComida,
} from "@/repositories/comida.repository.js";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const programacionNro = searchParams.get("programacionNro");
    const tipoDetalle = searchParams.get("detalle");

    if (!programacionNro || !/^\d+$/.test(programacionNro)) {
      return Response.json(
        {
          success: false,
          message: "Debes seleccionar una programación válida.",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    if (tipoDetalle) {
      const tiposValidos = [
        "trabajadores",
        "acompanantes",
        "general",
      ];

      if (!tiposValidos.includes(tipoDetalle)) {
        return Response.json(
          {
            success: false,
            message: "El tipo de detalle no es válido.",
          },
          {
            status: 400,
            headers: { "Cache-Control": "no-store" },
          }
        );
      }

      const data = await obtenerDetalleConsumosComida(
        programacionNro,
        tipoDetalle
      );

      return Response.json(
        { success: true, data },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const data = await obtenerConsumosComida(programacionNro);

    return Response.json(
      { success: true, data },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Error consultando comida:", error);

    return Response.json(
      {
        success: false,
        message: "No fue posible consultar los consumos de comida.",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
