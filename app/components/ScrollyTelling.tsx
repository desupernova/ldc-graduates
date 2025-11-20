"use client";

import { useState, useEffect, useRef } from "react";
import ScrollyCirculo from "./ScrollyCirculo";

// Obtener el basePath para construir rutas correctas
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const getAssetPath = (path: string) => {
  // Si la ruta ya empieza con /, no agregar basePath duplicado
  if (path.startsWith('/')) {
    return basePath ? `${basePath}${path}` : path;
  }
  return basePath ? `${basePath}/${path}` : `/${path}`;
};

interface TextContent {
  left: string;
  right: string;
}

const sections: TextContent[] = [
  {
    left: "",
    right: "En&nbsp;el <b>dominio&nbsp;simple</b> se&nbsp;opera con problemáticas univocas: " + 
    "la&nbsp;relación entre causa&nbsp;y&nbsp;efecto es&nbsp;lineal, y&nbsp;las soluciones son&nbsp;claras. " + 
    "<br/><br/>Los procesos mas&nbsp;eficientes en&nbsp;este dominio son&nbsp;aquellos qué especifican" + 
    " una&nbsp;serie de&nbsp;pasos realizados de&nbsp;manera repetitiva. " + 
    "Un&nbsp;protocolo de&nbsp;<b>&ldquo;mejores&nbsp;practicas&rdquo;</b>, resulta la&nbsp;mejor&nbsp;estrategia.<br/><br/>" +
    "<span class='text-ldc-simple'><b>Ejemplo:</b> la&nbsp;construccion en&nbsp;serie de&nbsp;un&nbsp;producto.</span>"

  },
  {
    left: "",
    right: "En&nbsp;el <b>dominio&nbsp;complicado</b> las&nbsp;relaciones de&nbsp;causa-efecto pero ya&nbsp;no son&nbsp;evidentes. " + 
    "<br/><br/>Hay diversas soluciones correctas para una&nbsp;misma problemática: solo <b>personas&nbsp;expertas</b>" + 
    " pueden identificarlas y&nbsp;optar por&nbsp;la&nbsp;más indicada. " + 
    "<br/><br/><span class='text-ldc-complicado'><b>Ejemplo:</b> un&nbsp;proyecto de&nbsp;optimizacion logistica en&nbsp;el&nbsp;envio&nbsp;de&nbsp;paquetes.</span>"
  },
  {
    left: "En&nbsp;el <b>dominio&nbsp;complejo</b> los&nbsp;resultados son&nbsp;impredecibles: las&nbsp;variables son&nbsp;demasiadas y/o difíciles de&nbsp;aislar, y&nbsp;no existe casuística anterior. " + 
    "<br/><br/>Este es&nbsp;el&nbsp;lugar donde priman los&nbsp;enfoques llamados <b>ágiles</b>: la&nbsp;mejor estrategia es&nbsp;realizar pequeños experimentos y&nbsp;ajustar en&nbsp;base a&nbsp;los&nbsp;resultados. " + 
    "<br/><br/><span class='text-ldc-complejo'><b>Ejemplo:</b> el&nbsp;desarrollo de&nbsp;nuevos&nbsp;productos o&nbsp;servicios en&nbsp;mercados desconocidos.</span>",
    right: ""
  },
  {
    left: "El <b>dominio&nbsp;caótico</b> es&nbsp;el&nbsp;propio de&nbsp;las&nbsp;situaciones de&nbsp;crisis, donde se&nbsp;requieren <b>respuestas&nbsp;inmediatas</b>: privilegiaremos la&nbsp;velocidad de&nbsp;las&nbsp;soluciones por&nbsp;encima de&nbsp;la&nbsp;robustez de&nbsp;las&nbsp;mismas. " + 
    "<br/><br/>No&nbsp;hay espacio para análisis exhaustivos: este es&nbsp;el&nbsp;dominio de&nbsp;personas qué tomen el&nbsp;mando y&nbsp;sepan improvisar. " + 
    "<br/><br/><b>Ejemplo:</b> una&nbsp;interrupción inesperada (un&nbsp;colapso de&nbsp;transporte) impide sacar la&nbsp;producción.",
    right: ""
  }
];

export default function ScrollyTelling() {
  const [opacities, setOpacities] = useState<number[]>([]);
  const [isFinalStep, setIsFinalStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(true);
  const [finalStepOpacity, setFinalStepOpacity] = useState(0);
  const [desordenOpacity, setDesordenOpacity] = useState(0);
  const [desordenTextOpacity, setDesordenTextOpacity] = useState(0);
  const [imagesOpacity, setImagesOpacity] = useState(1);
  const [finalTextsOpacity, setFinalTextsOpacity] = useState(0);
  const [isContainerPassed, setIsContainerPassed] = useState(false);
  const [hasReachedFinalStep, setHasReachedFinalStep] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desordenTextRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const windowHeight = window.innerHeight;
      const windowCenter = windowHeight / 2;
      const newOpacities: number[] = [];

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const containerTop = rect.top;
      const totalHeight = windowHeight * 7.2; // 720vh total: 90vh blanco + 90vh desorden + 360vh contenido + 90vh final anterior + 90vh nuevo paso final (10% más pequeño)
      
      // Paso 1 (0-90vh): Blanco - solo círculo
      const scrollProgress = (windowHeight - containerTop) / totalHeight;
      const isInFirstStep = scrollProgress < (1/8); // 90vh / 720vh = 0.125
      setIsFirstStep(isInFirstStep);
      
      // Controlar opacidad de las imágenes: bajan cuando entrás al primer paso, suben cuando salís del último
      if (isInFirstStep) {
        // Bajar opacidad gradualmente al entrar al primer paso
        const firstStepProgress = scrollProgress / (1/8);
        setImagesOpacity(Math.max(0.3, 1 - firstStepProgress * 0.7));
      } else if (scrollProgress >= (7/8)) {
        // Subir opacidad cuando salimos del último paso
        const exitProgress = (scrollProgress - (7/8)) / (1/8);
        setImagesOpacity(Math.min(1, 0.3 + exitProgress * 0.7));
      } else {
        // Mantener opacidad baja durante el scrolly
        setImagesOpacity(0.3);
      }
      
      // Paso 2 (90-180vh): Desorden - aparece y desaparece
      const isInDesordenStep = scrollProgress >= (1/8) && scrollProgress < (2/8); // 90-180vh
      if (isInDesordenStep) {
        const desordenStepProgress = (scrollProgress - (1/8)) / (1/8); // Normalizar a 0-1 dentro del paso desorden
        // Hacer que aparezca y desaparezca: aparece al inicio, desaparece al final
        const fadeInOut = Math.sin(desordenStepProgress * Math.PI);
        setDesordenOpacity(Math.max(0, fadeInOut));
        
        // Calcular opacidad del texto de Desorden basándose en su distancia al centro
        const desordenTextElement = desordenTextRef.current;
        if (desordenTextElement) {
          const textRect = desordenTextElement.getBoundingClientRect();
          const elementCenter = textRect.top + textRect.height / 2;
          const distanceFromCenter = Math.abs(elementCenter - windowCenter);
          
          const focusRange = windowHeight * 0.4;
          let textOpacity;
          
          if (distanceFromCenter < focusRange) {
            textOpacity = 1 - (distanceFromCenter / focusRange) * 0.2;
          } else {
            const extraDistance = distanceFromCenter - focusRange;
            const fadeRange = windowHeight * 0.3;
            textOpacity = Math.max(0, 0.8 - (extraDistance / fadeRange) * 0.7);
          }
          
          setDesordenTextOpacity(Math.max(0, Math.min(1, textOpacity)));
        } else {
          setDesordenTextOpacity(0);
        }
      } else {
        setDesordenOpacity(0);
        setDesordenTextOpacity(0);
      }
      
      // Detectar si estamos en el último step (después de Caótico, últimos 90vh)
      // Caótico va de 450-585vh (135vh), entonces el paso final anterior empieza en 585vh
      // El nuevo paso final empieza en 630vh (7/8)
      const isInFinalStep = scrollProgress >= (7/8); // 630vh / 720vh = 0.875
      setIsFinalStep(isInFinalStep);
      
      // Rastrear si alguna vez llegamos al paso final
      if (isInFinalStep) {
        setHasReachedFinalStep(true);
      }

      // Calcular opacidad del último step anterior (todos los títulos visibles)
      if (scrollProgress > (6.5/8) && scrollProgress < (7/8)) {
        const finalStepProgress = (scrollProgress - (6.5/8)) / (0.5/8); // Normalizar a 0-1 dentro de los primeros 45vh del paso final anterior
        setFinalStepOpacity(Math.min(1, finalStepProgress * 2)); // Fade in rápido en los primeros 45vh
      } else {
        setFinalStepOpacity(0);
      }
      
      // Detectar si el contenedor ya pasó completamente
      const containerBottom = containerTop + (windowHeight * 7.2);
      const hasPassed = containerBottom < 0;
      setIsContainerPassed(hasPassed);
      
      // Calcular opacidad de los textos finales (4 cuadrantes)
      // Solo se muestran en el último paso (700-800vh) o después de haber pasado completamente el scrolly (si ya llegamos al paso final)
      if (isInFinalStep) {
        const finalTextsProgress = (scrollProgress - (7/8)) / (1/8); // Normalizar a 0-1 dentro del paso final
        setFinalTextsOpacity(Math.min(1, finalTextsProgress * 2)); // Fade in rápido
      } else if (hasPassed && hasReachedFinalStep) {
        // Solo mantener visibles si ya pasamos por el paso final y ahora el contenedor ya pasó
        setFinalTextsOpacity(1);
      } else {
        // Ocultar en todos los demás casos
        setFinalTextsOpacity(0);
      }

      // Calcular la opacidad de cada sección de texto basándose en su distancia al centro del viewport
      sections.forEach((_, index) => {
        // Si estamos en el último step, primer step o paso de Desorden, ocultar todos los textos laterales
        if (isInFinalStep || isInFirstStep || isInDesordenStep) {
          newOpacities.push(0);
          return;
        }

        const textElement = textRefs.current[index];
        if (!textElement) {
          newOpacities.push(0);
          return;
        }

        const textRect = textElement.getBoundingClientRect();
        const elementCenter = textRect.top + textRect.height / 2;
        const distanceFromCenter = Math.abs(elementCenter - windowCenter);
        
        // Calcular opacidad: máxima cuando está en el centro, muy baja cuando no está en foco
        const focusRange = windowHeight * 0.4;
        let opacity;
        
        if (distanceFromCenter < focusRange) {
          opacity = 1 - (distanceFromCenter / focusRange) * 0.2;
        } else {
          const extraDistance = distanceFromCenter - focusRange;
          const fadeRange = windowHeight * 0.3;
          opacity = Math.max(0, 0.8 - (extraDistance / fadeRange) * 0.7);
        }
        
        newOpacities.push(Math.max(0, Math.min(1, opacity)));
      });

      setOpacities(newOpacities);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Llamar una vez al montar

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative"
      style={{ height: "720vh" }} // 90vh blanco + 90vh desorden + 360vh contenido + 90vh final anterior + 90vh nuevo paso final (10% más pequeño)
    >
      {/* Contenedor fijo para el círculo y títulos */}
      <div 
        className="sticky top-0 h-screen flex items-center justify-center pointer-events-none z-10"
      >
        {/* Imagen superior - fondo estático */}
        <div 
          className="absolute top-[-80vh] left-0 right-0 z-0 pointer-events-none"
          style={{
            opacity: (isContainerPassed && hasReachedFinalStep) ? 0 : imagesOpacity,
            transition: "opacity 0.3s ease-out",
          }}
        >
          <img 
            src={getAssetPath("/scrolly-top.png")} 
            alt="" 
            className="w-full h-auto"
          />
        </div>

        {/* Imagen inferior - fondo estático */}
        <div 
          className="absolute bottom-[-35vh] left-0 right-0 z-8 pointer-events-none"
          style={{
            opacity: imagesOpacity,
            transition: "opacity 0.3s ease-out",
          }}
        >
          <img 
            src={getAssetPath("/scrolly-bot.png")} 
            alt="" 
            className="w-3/5 h-auto"
          />
        </div>

        <div 
          className="relative w-full max-w-[1080px] mx-auto px-8 z-8"
          style={{
            transition: "opacity 0.3s ease-out",
            opacity: isContainerPassed && hasReachedFinalStep ? 0 : 1,
          }}
        >
          {/* Círculo central */}
          <div className="flex justify-center items-center w-6/10 mx-auto">
            <ScrollyCirculo 
              opacities={opacities} 
              isFirstStep={isFirstStep} 
              isFinalStep={isFinalStep} 
              desordenOpacity={desordenOpacity} />
          </div>

          {/* Texto "Desorden" arriba en el medio durante el segundo paso */}
          <div
            className="bg-blue w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1 italic"
            style={{
              opacity: desordenOpacity,
              transition: "opacity 0.3s ease-out",
            }}
          >
            <h2 
              className="text-[61px] font-serif text-center text-ldc-desorden"
            >
              Desorden
            </h2>
          </div>

          {/* Títulos alrededor del círculo */}
          {/* Arriba izquierda: Complejo (sección 2) */}
          <div
            className="absolute top-[7%] left-[50%] -translate-x-1/1 pr-12 italic"
            style={{
              opacity: (opacities[2] || 0),
              transition: "opacity 0.3s ease-out",
            }}
          >
            <h2 
              className="text-[61px] font-serif text-ldc-complejo"
            >
              Complejo
            </h2>
          </div>

          {/* Arriba derecha: Complicado (sección 1) */}
          <div
            className="absolute top-[7%] left-[50%] pl-12 italic"
            style={{
              opacity: (opacities[1] || 0),
              transition: "opacity 0.3s ease-out",
            }}
          >
            <h2 
              className="text-[61px] font-serif text-right text-ldc-complicado"
            >
              Complicado
            </h2>
          </div>

          {/* Abajo derecha: Simple (sección 0) */}
          <div
            className="absolute bottom-[12%] left-[50%] pl-12 italic"
            style={{
              opacity: (opacities[0] || 0),
              transition: "opacity 0.3s ease-out",
            }}
          >
            <h2 
              className="text-[61px] font-serif text-right text-ldc-simple"
            >
              Simple
            </h2>
          </div>

          {/* Abajo izquierda: Caótico (sección 3) */}
          <div
            className="absolute bottom-[12%] left-[50%] -translate-x-1/1 pr-12 italic"
            style={{
              opacity: (opacities[3] || 0),
              transition: "opacity 0.3s ease-out",
            }}
          >
            <h2 
              className="text-[61px] font-serif text-ldc-caotico"
            >
              Caótico
            </h2>
          </div>

          {/* Textos finales alrededor de los 4 cuadrantes */}
          {/* Arriba izquierda: Complejo */}
          <div
            className="absolute top-[25%] left-[10%] w-[162px] italic z-20"
            style={{
              opacity: finalTextsOpacity,
              transition: "opacity 0.3s ease-out",
            }}
          >
            <ul 
              className="text-[16px] text-ldc-complejo leading-5 list-disc flex flex-col gap-4"
            >
              <li>Impredecible</li>
              <li>Enfoques ágiles</li>
              <li>Inspección y adaptación </li>           
            </ul>
          </div>

          {/* Arriba derecha: Complicado */}
          <div
            className="absolute top-[25%] right-[00%] w-[162px] italic z-20"
            style={{
              opacity: finalTextsOpacity,
              transition: "opacity 0.3s ease-out",
            }}
          >
            <ul 
              className="text-[16px] text-ldc-complicado leading-5 list-disc flex flex-col gap-4"
            >
              <li>Causa-efecto no evidentes</li>
              <li>Varias soluciones</li>
              <li>Necesita de profesionales especializados</li>           
            </ul>          </div>

          {/* Abajo derecha: Simple */}
          <div
            className="absolute bottom-[30%] right-[0%] w-[162px] italic z-20"
            style={{
              opacity: finalTextsOpacity,
              transition: "opacity 0.3s ease-out",
            }}
          >
            <ul 
              className="text-[16px] text-ldc-simple leading-5 list-disc flex flex-col gap-4"
            >
              <li>Problemáticas univocas</li>
              <li>Soluciones  claras</li>
              <li>Procesos repetitivos</li>           
            </ul>          
          </div>

          {/* Abajo izquierda: Caótico */}
          <div
            className="absolute bottom-[30%] left-[10%] w-[162px] italic z-20"
            style={{
              opacity: finalTextsOpacity,
              transition: "opacity 0.3s ease-out",
            }}
          >
            <ul 
              className="text-[16px] text-ldc-caotico leading-5 list-disc flex flex-col gap-4"
            >
              <li>Situaciones de crisis</li>
              <li>Velocidad sobre robustez</li>
              <li>Improvisación</li>           
            </ul>  
          </div>
        </div>
      </div>

      {/* Textos que scrollean con el contenido */}
      {/* Orden: Simple (0) en 180vh, Complicado (1) en 270vh, Complejo (2) en 360vh, Caótico (3) en 450vh */}
      {sections.map((section, index) => {
        const opacity = isFinalStep ? 0 : (opacities[index] || 0);
        
        // Mapear índices a posiciones: 0->180vh, 1->270vh, 2->360vh, 3->450vh (10% más pequeño)
        const positionMap: { [key: number]: number } = {
          0: 180, // Simple
          1: 270, // Complicado
          2: 360, // Complejo
          3: 450  // Caótico (tendrá 135vh de altura)
        };
        const sectionTop = positionMap[index] || 180;
        const sectionHeight = index === 3 ? 135 : 90; // Caótico tiene más altura (10% más pequeño)
        
        return (
          <div
            key={index}
            ref={(el) => {
              textRefs.current[index] = el;
            }}
            className="absolute left-0 right-0 flex items-center justify-center"
            style={{
              top: `${sectionTop}vh`,
              height: `${sectionHeight}vh`,
              opacity: opacity,
              transition: "opacity 0.3s ease-out",
            }}
          >
            <div className="relative w-full mx-auto px-8 flex items-center justify-between max-w-[1400px]">
              {/* Texto izquierdo */}
              <div
                className="w-1/4 italic"
                style={{ 
                  transform: `translateX(${opacity < 0.1 ? -20 : 0}px)`,
                  transition: "transform 0.3s ease-out",
                }}
              >
                <p 
                  className="text-[16px] text-left" 
                  style={{
                    textWrap: 'balance',
                  }}
                  dangerouslySetInnerHTML={{ __html: section.left }}
                />
              </div>

              {/* Texto derecho */}
              <div
                className="w-1/4 italic"
                style={{ 
                  transform: `translateX(${opacity < 0.1 ? 20 : 0}px)`,
                  transition: "transform 0.3s ease-out",
                }}
              >
                <p 
                  className="text-[16px]" 
                  style={{
                    textWrap: 'balance',
                  }}
                  dangerouslySetInnerHTML={{ __html: section.right }}
                />
              </div>
            </div>
          </div>
        );
      })}

      {/* Sección de texto de Desorden (90-180vh) */}
      <div
        ref={(el) => {
          desordenTextRef.current = el;
        }}
        className="absolute left-0 right-0 flex items-center justify-center"
        style={{
          top: "90vh",
          height: "90vh",
          opacity: isFinalStep ? 0 : desordenTextOpacity,
          transition: "opacity 0.3s ease-out",
        }}
      >
        <div className="relative w-full mx-auto px-8 flex items-center justify-between">
          {/* Texto centrado debajo del título Desorden */}
          <div
            className="w-full italic text-center"
              style={{
              transform: `translateY(${desordenTextOpacity < 0.1 ? 20 : 0}px)`,
              transition: "transform 0.3s ease-out",
            }}
          >
            <p 
              className="text-[16px] leading-relaxed w-[500px] mx-auto" 
              dangerouslySetInnerHTML={{ __html: "Esta es la zona más peligrosa: no entendemos en qué dominio estamos, y nos exponemos a actuar de manera diferente a la qué se necesita para resolver ciertos problemas. <br/><br/>En estos casos, todos nuestros esfuerzos deben estar centrados en <b>salir de este espacio</b> a uno mejor identificado, para posteriormente adoptar el enfoque correspondiente. " }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

