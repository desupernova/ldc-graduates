import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import CynefinSVG from "./CynefinSVG";
import ScrollyBGTop from "./ScrollyBGTop";
import ScrollyCirculo from "./ScrollyCirculo";
import ScrollyTelling from "./ScrollyTelling";
import Trivia from "./Trivia";

export default function StartScreen() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const scrollyRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleParallax = () => {
      if (parallaxRef.current) {
        const rect = parallaxRef.current.getBoundingClientRect();
        const elementTop = rect.top;
        const windowHeight = window.innerHeight;
        const elementHeight = rect.height;

        // Calcular el offset parallax cuando el elemento está en el viewport
        // El elemento se mueve más lento que el scroll (efecto parallax)
        if (elementTop < windowHeight && elementTop > -elementHeight) {
          // Factor de velocidad parallax: 0.4 significa que se mueve al 40% de la velocidad del scroll
          const offset = (windowHeight - elementTop) * 0.2;
          parallaxRef.current.style.transform = `translateY(${offset}px)`;
        } else if (elementTop >= windowHeight) {
          // Resetear cuando el elemento está arriba del viewport
          parallaxRef.current.style.transform = `translateY(0px)`;
        }
      }
    };

    handleParallax();
    window.addEventListener("scroll", handleParallax, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleParallax);
    };
  }, []);

  return (
    <>
      <div className="flex items-center justify-center max-w-screen h-screen overflow-x-hidden">
        <CynefinSVG />
      </div>

      {/* Sección de contenido explicativo */}
      <div className="w-full py-16 relative z-10">
        <div className="max-w-[1200px] mx-auto px-4">
          {/* Título */}
          <h1 className="text-[88px] font-serif leading-[72px] mb-0 px-12 block">
            La gestión <br/>
            no es sencilla
          </h1>

          {/* Contenedor blanco con SVG y texto */}
          <div
            ref={parallaxRef}
            className="bg-white rounded-[24px] p-8 flex gap-8 relative z-10 will-change-transform mb-[40vh]"
          >
            {/* SVG - 1/3 del ancho */}
            <div className="w-1/3 flex-shrink-0">
              <Image src={"cynefin-esquema-blanco.png"}
                width={250} height={250} alt="Esquema Cynefin" className="mx-auto w-full px-12 py-12" />

            </div>

            {/* Texto explicativo - 2/3 del ancho */}
            <div className="w-2/3 text-[18px] leading-relaxed my-auto">
              <p className="italic">
              Te invitamos a fortalecer tu capacidad para planificar, estimar y gestionar de manera efectiva.  En esta sesion, vas a adquirir técnicas y herramientas para impulsar proyectos en diferentes tipos de contextos, desarrollando competencias para responder a necesidades cambiantes. 
              <br/>
              <br/>
              A la hora de gestionar podemos encontrarnos en distintos tipos de entornos: inclusive dentro de LDC, existen distintos proyectos qué exigen enfoques diferenciados de acuerdo al contexto. 
              <br/><br/>
              El marco Cynefin,  desarrollado por Dave Snowden,  nos propone una visualización sencilla y esquemática para empezar a pensar nuestra estrategia:
              </p>
            </div>

          </div>

        </div>


        <div className="relative">
          {/* Fondo sticky que scrollea con el título y luego se queda fijo */}
          <div
            className="sticky top-0 left-0 right-0 z-0 pointer-events-none"
            style={{
              height: '30vh'
            }}
          >
            <div
              className="w-full"
              style={{
                transform: 'translateY(-60%)', // Desplazar hacia arriba para mostrar el 30% inferior
                height: '100vh',
                width: '100%'
              }}
            >
              <ScrollyBGTop className="mx-auto w-full" style={{ height: '100vh', width: '100%' }} />
            </div>
          </div>

          {/* <div
            ref={bottomSectionRef}
            className={`  
              ${isBottomSticky ? 'sticky top-0 ' : 'sticky bottom-0 mb-[300vh]'} 
              left-0 right-0 z-0 pointer-events-none`}

            // className={`${isBottomSticky ? 'absolute bottom-0' : 'sticky bottom-0'} top-0 left-0 right-0 z-0 pointer-events-none`}
            style={{
              height: '30vh'
            }}
          >
            <div
              className="w-full flex justify-end"
              style={{
                transform: 'translateY(60%)', // Desplazar hacia abajo para mostrar el 30% superior
                height: '100vh',
                width: '100%'
              }}
            >
              <ScrollyBGBottom
                className=""
                style={{ width: '50%', marginRight: 'auto' }}
              />
            </div>
          </div> */}

          <h1 className="text-[88px] text-center font-serif leading-[72px] mb-24 px-12 block relative z-10">
            Marco <br />
            <i>Cynefin.</i>
          </h1>

          {/* Contenedor de scrollytelling con 4 secciones */}
          <div ref={scrollyRef}>
            <ScrollyTelling />
          </div>

          {/* Fondo sticky que scrollea con el contenido y luego se queda fijo en la parte inferior */}
          

          <div className="flex gap-8 max-w-[1100px] mx-auto mb-40">
            {/* Texto explicativo - 2/3 del ancho */}
            <div className="w-2/3 text-[18px] leading-relaxed my-auto">
              <p className="italic">
                Ahora bien: en la vida real, no siempre resulta tan simple determinar en qué dominio nos encontramos. <br /><br />
                Veamos algunos ejemplos, y de paso, entrenemos tu capacidad para reconocerlos a través de una pequeña trivia. <br /><br />
              </p>
            </div>
            <div className="w-1/3 flex-shrink-0">
              <Image src={"cynefin-esquema-blanco.png"}
                width={250} height={250} alt="Esquema Cynefin" className="mx-auto w-full px-12 py-12" />

            </div>
          </div>

          {/* Componente de Trivia */}
          <Trivia />

        </div>
      </div>
    </>
  );
}

