"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";

// Obtener el basePath para construir rutas correctas
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const getAssetPath = (path: string) => {
  // Si la ruta ya empieza con /, no agregar basePath duplicado
  if (path.startsWith('/')) {
    return basePath ? `${basePath}${path}` : path;
  }
  return basePath ? `${basePath}/${path}` : `/${path}`;
};

interface TriviaResultsProps {
  finalScore: number;
  totalQuestions: number;
  resultsText: string;
}

export default function TriviaResults({
  finalScore,
  totalQuestions,
  resultsText,
}: TriviaResultsProps) {
  const scoreTitleRef = useRef<HTMLHeadingElement>(null);

  // Scroll automático al título de puntuación cuando se monta el componente
  useEffect(() => {
    if (scoreTitleRef.current) {
      // Pequeño delay para asegurar que el DOM se haya actualizado
      setTimeout(() => {
        scoreTitleRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, []);

  return (
    <div className="relative">
      <Image
        src={getAssetPath("/puntuacion-left.png")}
        alt="Ilustración"
        height={300}
        width={250}
        className="hidden md:block object-cover absolute top-0 left-0"
      />

      <div className="max-w-[900px] mx-auto mt-48 relative flex flex-col md:flex-row justify-between px-9 md:px-0">
        <div className="w-full md:w-2/3">
          {/* Versión móvil */}
          <h2 ref={scoreTitleRef} className="block md:hidden text-[88px] leading-[72px] mb-12">
            Sacaste{" "}
            <span className="text-ldc-simple">
              {finalScore}/{totalQuestions}
            </span>
            {" "}puntos
          </h2>
          {/* Versión desktop */}
          <h2 className="hidden md:block text-[88px] leading-[88px] mb-8 ">
            Tu puntuación fue de{" "}
            <span className="text-ldc-simple">
              {finalScore}/{totalQuestions}
            </span>
            !
          </h2>
        </div>
        <div className="hidden md:block w-1/3">
          <Image
            src={getAssetPath("/puntuacion.png")}
            alt="Ilustración"
            height={500}
            width={500}
            className="object-contain transform translate-x-[-25%]"
          />
        </div>
      </div>
    </div>
  );
}

