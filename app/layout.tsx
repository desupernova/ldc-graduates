import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Trivia Challenge",
  description: "Pon a prueba tus conocimientos con nuestras preguntas de trivia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className="antialiased"
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
