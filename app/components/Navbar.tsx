"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

        // Si scrolleamos hacia abajo, ocultar
        // Si scrolleamos hacia arriba, mostrar
        if (currentScrollY < lastScrollY) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-[56px] bg-white shadow-md transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="h-full max-w-[1100px] mx-auto px-4 flex items-center justify-between">
        <p className="text-lg">
          Agendá <span className="text-ldc-simple">la fecha del taller</span>
        </p>

        <p className="text-xl text-ldc-complejo mr-6">LDC<span className="text-ldc-simple">.</span></p>

        <a
          href="https://dew1-share.percipio.com/cd/iP5G-fvHd"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-ldc-simple hover:opacity-90 text-white px-6 py-2 rounded-xs transition-opacity duration-200 font-medium"
        >
          Agendar el evento
        </a>
      </div>
    </nav>
  );
}

