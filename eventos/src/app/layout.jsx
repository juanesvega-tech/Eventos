
import "./globals.css";

export const metadata = {
  title: "Dashboard de eventos",
  description:
    "Panel de estadísticas de inscripción y acompañantes de eventos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
