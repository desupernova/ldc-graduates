import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import CynefinSVG from "./CynefinSVGNuevo";
import ScrollyTelling from "./ScrollyTelling";
import Trivia from "./Trivia";

export default function StartScreen() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const scrollyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const triviaRef = useRef<HTMLDivElement>(null);
  const [playCount, setPlayCount] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isInTrivia, setIsInTrivia] = useState(false);
  
  // Obtener el basePath para construir rutas correctas
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const getAssetPath = (path: string) => {
    // Si la ruta ya empieza con /, no agregar basePath duplicado
    if (path.startsWith('/')) {
      return basePath ? `${basePath}${path}` : path;
    }
    return basePath ? `${basePath}/${path}` : `/${path}`;
  };

  // Detectar cuando el usuario está en la trivia y detectar scroll hacia arriba
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Verificar si estamos en la sección de trivia
      if (triviaRef.current) {
        const triviaRect = triviaRef.current.getBoundingClientRect();
        const isCurrentlyInTrivia = triviaRect.top < window.innerHeight && triviaRect.bottom > 0;
        
        if (isCurrentlyInTrivia && !isInTrivia) {
          setIsInTrivia(true);
        } else if (!isCurrentlyInTrivia && isInTrivia) {
          setIsInTrivia(false);
        }
        
        // Si estamos en la trivia y el usuario hace scroll hacia arriba,
        // reproducir el video (solo si no está reproduciéndose actualmente)
        if (isCurrentlyInTrivia && currentScrollY < lastScrollY) {
          const video = videoRef.current;
          if (video && (video.paused || video.ended)) {
            // Reproducir el video si está pausado o terminado
            video.play();
          }
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, isInTrivia]);

  // Controlar las reproducciones del video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      // Solo contar reproducciones automáticas (las primeras 2)
      // No contar la reproducción adicional por scroll
      if (playCount < 2) {
        const newCount = playCount + 1;
        setPlayCount(newCount);
        
        if (newCount < 2) {
          // Reproducir de nuevo si aún no hemos alcanzado el límite de 2
          video.play();
        }
        // Si newCount >= 2, el video se detiene automáticamente
      }
    };

    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [playCount]);

  useEffect(() => {
    const handleParallax = () => {
      // Solo aplicar parallax en desktop (md breakpoint: 768px)
      const isDesktop = window.innerWidth >= 768;
      
      if (!parallaxRef.current) return;
      
      // En mobile, asegurarse de que no haya transform y salir temprano
      if (!isDesktop) {
        parallaxRef.current.style.transform = '';
        parallaxRef.current.style.willChange = '';
        return;
      }
      
      // Solo ejecutar parallax en desktop
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
        parallaxRef.current.style.willChange = 'transform';
      } else if (elementTop >= windowHeight) {
        // Resetear cuando el elemento está arriba del viewport
        parallaxRef.current.style.transform = `translateY(0px)`;
      }
    };

    // Inicializar: resetear transform en mobile al montar
    if (parallaxRef.current && window.innerWidth < 768) {
      parallaxRef.current.style.transform = '';
      parallaxRef.current.style.willChange = '';
    }

    handleParallax();
    window.addEventListener("scroll", handleParallax, { passive: true });
    window.addEventListener("resize", handleParallax, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleParallax);
      window.removeEventListener("resize", handleParallax);
    };
  }, []);

  return (
    <>
      <div className="relative w-full h-screen md:overflow-x-hidden">
        {/* Imagen de fondo */}
        <div className="hidden md:block absolute inset-0 w-full h-full z-0">
          <Image
            src={getAssetPath("/hero-bg.png")}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* SVG full width */}
        <div className="relative z-10 md:h-full w-full h-[70%] bg-ldc-gray overflow-visible py-12">

          <div className="block md:hidden absolute inset-0 w-full z-0 h-full">
            <Image
              src={getAssetPath("/hero-bg-mobile.png")}
              alt="Background"
              fill
              className="object-cover overflow-visible"
              priority
            />
          </div>
          <CynefinSVG className="h-[70%] md:h-full" />

        </div>
      </div>

      {/* Sección de contenido explicativo */}
      <div className="md:mt-0 mt-[-30vh] w-full py-16 relative z-10">
        <div 
            ref={parallaxRef} 
            className="max-w-[1200px] mx-auto px-4 relative"
            style={{ zIndex: 1000 }}
          >
          {/* Título */}
          <h1 className="text-[88px] font-serif leading-[72px] mb-24 px-12 block">
            La gestión <br/>
            no es sencilla
          </h1>

          {/* Contenedor blanco con SVG y texto */}
          <div
            className="md:bg-white rounded-[24px] px-12 md:px-8 md:py-16 flex gap-4 mb-[40vh]"
          >
            {/* SVG - 1/3 del ancho */}
            <div className="md:block hidden w-1/3 flex-shrink-0">
              <Image src={"cynefin-esquema-blanco.png"}
                width={250} height={250} alt="Esquema Cynefin" className="mx-auto w-full px-12 py-12" />

            </div>

            {/* Texto explicativo - 2/3 del ancho */}
            <div className="w-full md:w-2/3 text-[18px] leading-relaxed my-auto md:pr-20">
              <p className="italic">
              Te invitamos a un espacio donde podrás fortalecer tus habilidades para <b>planificar, estimar y gestionar</b> de manera efectiva. 
              En este taller  vas a adquirir tecnicas y herramientas para impulsar proyectos en diferentes tipos de contextos, desarrollando competencias para responder a necesidades cambiantes.  
              <br/>
              <br/>
              Pero cuando hablamos de <b>contextos</b>… ¿a qué nos referimos exactamente? ¿Cómo se supone qué adoptemos nuestro estilo de gestion de acuerdo a cada entorno? Podemos darte algunas pistas para ir entrenando tu capacidad. <br/><br/>El <b>marco Cynefin</b>,  desarrollado por Dave Snowden,  nos propone una visualización sencilla y esquemática.
              </p>
            </div>

          </div>

        </div>


        <div className="relative">

          <h1 className="text-[88px] text-center font-serif leading-[72px] mb-24 px-12 block relative z-10">
            Marco <br />
            <i>Cynefin.</i>
          </h1>

          <p className="text-[18px] leading-relaxed my-auto italic md:px-0 px-12 max-w-[800px] text-center mx-auto">A la hora de gestionar, podemos encontrarnos en distintos tipos de dominios: inclusive dentro de LDC, existen proyectos qué exigen enfoques diferenciados de acuerdo al contexto. 
          </p>

          {/* Contenedor de scrollytelling con 4 secciones */}
          <div ref={scrollyRef}>
            <ScrollyTelling />
          </div>

          {/* Fondo sticky que scrollea con el contenido y luego se queda fijo en la parte inferior */}
          

          <div className="flex gap-8 max-w-[1100px] mx-auto mb-32 mt-[50vh]">
            {/* Texto explicativo - 2/3 del ancho */}
            <div className="w-2/3 text-[18px] leading-relaxed my-auto">
              <p className="italic">
                Ahora bien: en la vida real <b>no siempre es tan fácil darse cuenta en qué dominio estamos</b>. Por eso te proponemos ver algunos ejemplos y, de paso, poner a prueba tu mirada con una pequeña trivia.<br /><br />
                A continuacion vas a encontrar <b>seis proyectos distintos</b>. Tu desafío es identificar en qué dominio se ubica cada uno. 
              </p>
            </div>
            <div className="w-1/3 flex-shrink-0 p-10">
              <video 
                ref={videoRef}
                autoPlay 
                muted 
                playsInline
              >
                <source src={getAssetPath("/instrucciones.webm")} type="video/webm" />
                <source src={getAssetPath("/instrucciones.mp4")} type="video/mp4" /> 
              </video>
            </div>
          </div>

          {/* Componente de Trivia */}
          <div ref={triviaRef}>
            <Trivia />
          </div>

        </div>
      </div>
    </>
  );
}

