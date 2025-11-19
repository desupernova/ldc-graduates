import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

// Función para obtener la URL base completa
function getBaseUrl() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://desupernova.github.io";
  return `${siteUrl}${basePath}`;
}

const baseUrl = getBaseUrl();

// Construir URL absoluta de la imagen OG
const ogImageUrl = `${baseUrl}/og-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "La gestión no es sencilla | LDC Graduates",
  description: "Te invitamos a fortalecer tu capacidad para planificar, estimar y gestionar de manera efectiva. Adquirí técnicas y herramientas para impulsar proyectos en diferentes tipos de contextos, desarrollando competencias para responder a necesidades cambiantes.",
  keywords: ["gestión", "Cynefin", "proyectos", "planificación", "LDC", "capacitación"],
  authors: [{ name: "LDC" }],
  openGraph: {
    type: "website",
    url: baseUrl,
    title: "La gestión no es sencilla | LDC Graduates",
    description: "Te invitamos a fortalecer tu capacidad para planificar, estimar y gestionar de manera efectiva. Adquirí técnicas y herramientas para impulsar proyectos en diferentes tipos de contextos.",
    siteName: "LDC Graduates",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "LDC Graduates - La gestión no es sencilla",
      },
    ],
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "La gestión no es sencilla | LDC Graduates",
    description: "Te invitamos a fortalecer tu capacidad para planificar, estimar y gestionar de manera efectiva. Adquirí técnicas y herramientas para impulsar proyectos en diferentes tipos de contextos.",
    images: [ogImageUrl],
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  
  // Construir las rutas de las fuentes con el basePath
  // Asegurarse de que la ruta siempre empiece con / y no tenga dobles barras
  const fontBasePath = basePath ? `${basePath}/georgia-2` : "/georgia-2";
  
  return (
    <html lang="es">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'Georgia';
              src: url('${fontBasePath}/georgia.ttf') format('truetype');
              font-weight: 400;
              font-style: normal;
              font-display: swap;
            }
            
            @font-face {
              font-family: 'Georgia';
              src: url('${fontBasePath}/georgiab.ttf') format('truetype');
              font-weight: 700;
              font-style: normal;
              font-display: swap;
            }
            
            @font-face {
              font-family: 'Georgia';
              src: url('${fontBasePath}/georgiai.ttf') format('truetype');
              font-weight: 400;
              font-style: italic;
              font-display: swap;
            }
            
            @font-face {
              font-family: 'Georgia';
              src: url('${fontBasePath}/georgiaz.ttf') format('truetype');
              font-weight: 700;
              font-style: italic;
              font-display: swap;
            }
          `
        }} />
      </head>
      <body
        className="antialiased"
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
