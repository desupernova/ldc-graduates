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
        

        <p className="text-lg md:text-xl text-ldc-complejo md:mr-6">LDC<span className="text-ldc-simple">.</span></p>

      </div>
    </nav>
  );
}

