"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Si estamos en el top, ocultar
      if (currentScrollY === 0) {
        setIsVisible(false);
      } 
      // Si scrolleamos hacia abajo, mostrar
      else if (currentScrollY > lastScrollY) {
        setIsVisible(true);
      }
      // Si scrolleamos hacia arriba, ocultar
      else if (currentScrollY < lastScrollY) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-[44px] md:h-[56px] bg-white shadow-md transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="h-full max-w-[1100px] mx-auto px-4 flex items-center justify-between">
        <p className="text-lg hidden md:block">
          Agendá <span className="text-ldc-simple">la fecha del taller</span>
        </p>

        <p className="text-lg md:text-xl text-ldc-complejo md:mr-6">LDC<span className="text-ldc-simple">.</span></p>

        <a
          href="https://dew1-share.percipio.com/cd/iP5G-fvHd"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-ldc-simple hover:opacity-90 text-white md:px-6 md:py-2 px-3 py-1.5 rounded-xs transition-opacity duration-200 font-medium flex items-center justify-center"
          aria-label="Agendar el evento"
        >
          <span className="hidden md:inline">Agendar el evento</span>
          <svg 
            className="md:hidden w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </a>
      </div>
    </nav>
  );
}

