export const metadata = {
  title: "Control de comida | Dashboard de eventos",
  description:
    "Consulta de consumos por servicio para trabajadores y acompañantes.",
};

export default function ComidaLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f5ef]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[330px] bg-[#14320f]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-40 -top-52 h-[520px] w-[520px] rounded-full border-[90px] border-[#e2b808]/10"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute left-0 top-[280px] h-20 w-1/3 rounded-r-full bg-[#e2b808]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}