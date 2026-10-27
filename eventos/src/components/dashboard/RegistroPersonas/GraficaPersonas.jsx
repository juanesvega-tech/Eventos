
"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function GraficaPersonas({ historial = [] }) {
  const datos = historial.map((punto, index) => ({
    ...punto,
    posicion: index,
  }));

  const formatoNumero = (valor) =>
    new Intl.NumberFormat("es-CO").format(Number(valor ?? 0));

  return (
    <div
      style={{
        width: "100%",
        height: 430,
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={datos}
          margin={{ top: 18, right: 24, left: 12, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="5 5"
            stroke="#e2e8f0"
            vertical={false}
          />

          <XAxis
            dataKey="posicion"
            type="number"
            domain={["dataMin", "dataMax"]}
            allowDataOverflow
            tickFormatter={(valor) =>
              datos[Math.round(valor)]?.hora ?? ""
            }
            tick={{ fill: "#64748b", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
            minTickGap={35}
            interval="preserveStartEnd"
          />

          <YAxis
            type="number"
            domain={[0, (maximo) => Math.max(10, Math.ceil(maximo * 1.1))]}
            tickFormatter={formatoNumero}
            tick={{ fill: "#64748b", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={58}
          />

          <Tooltip
            labelFormatter={(valor) =>
              `Hora: ${datos[Math.round(Number(valor))]?.hora ?? ""}`
            }
            formatter={(valor, nombre) => [
              formatoNumero(valor),
              nombre,
            ]}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
            }}
          />

          <Legend
            verticalAlign="top"
            align="left"
            wrapperStyle={{ paddingBottom: 18 }}
          />

          <Line
            type="monotone"
            dataKey="invitados"
            name="Asistentes"
            stroke="#2563eb"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5 }}
            isAnimationActive
            animationDuration={850}
            animationEasing="linear"
            connectNulls
          />

          <Line
            type="monotone"
            dataKey="acompanantes"
            name="Acompañantes"
            stroke="#16a34a"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5 }}
            isAnimationActive
            animationDuration={850}
            animationEasing="linear"
            connectNulls
          />

          <Line
            type="monotone"
            dataKey="total"
            name="Total de personas"
            stroke="#9333ea"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5 }}
            isAnimationActive
            animationDuration={850}
            animationEasing="linear"
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
