"use client";

import { useState, useEffect, useRef } from "react";
import ScrollyCirculo from "./ScrollyCirculo";

interface TextContent {
  left: string;
  right: string;
}

const sections: TextContent[] = [
  {
    left: "",
    right: "En este dominio se opera con problemáticas univocas: la relación entre causa y efecto es lineal, y las soluciones son claras. <br/><br/>Los procesos mas eficientes en este dominio son aquellos qué especifican una serie de pasos realizados de manera repetitiva. <br/><br/>En este entorno, un protocolo de “mejores practicas”,  esto es, utilizar soluciones conocidas y probadas,  resulta  la mejor estrategia. <br/><br/>Ejemplo: la construccion en serie de un producto, o la instalacion de un mismo sistema para diferentes clientes."
  },
  {
    left: "",
    right: "Aquí tenemos relaciones de causa-efecto que ya no son evidentes. <br/><br/>Hay diversas soluciones correctas para una misma problemática: solo personas expertas pueden identificarlas y optar por la más indicada. <br/><br/>Por este motivo en estos entornos recurrir al conocimiento técnico de profesionales especializados es la mejor opción. <br/><br/>Ejemplos: optimizacion logistica en el envio de paquetes, sincronización de un proceso de produccion con el de ventas. "
  },
  {
    left: "Al movernos en entornos complejos, los resultados son impredecibles: las variables son demasiadas y/o difíciles de aislar, y no existe casuística anterior. <br/><br/>Este es el lugar donde priman los enfoques llamados ágiles o emergentes: dado qué no existen buenas prácticas, la mejor estrategia es inspeccionar y adaptar, realizando pequeños experimentos donde fallar no represente un gran impacto. <br/><br/>El desarrollo de nuevos productos o servicios en mercados desconocidos, es un tipico caso de dominio complejo.<br/><br/>Ejemplo: el desarrollo de nuevos productos o servicios en mercados desconocidos, es un tipico caso de dominio complejo.",
    right: ""
  },
  {
    left: "El dominio caótico es el propio de las situaciones de crisis, donde se requieren respuestas inmediatas: privilegiaremos la velocidad de las soluciones por encima de la robustez de las mismas. No hay espacio para análisis exhaustivos: este es el dominio de personas qué tomen el mando y sepan improvisar. Por ejemplo, una interrupción inesperada (ej  colapso de transporte) impide sacar la producción.",
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
      const totalHeight = windowHeight * 8; // 800vh total: 100vh blanco + 100vh desorden + 400vh contenido + 100vh final anterior + 100vh nuevo paso final
      
      // Paso 1 (0-100vh): Blanco - solo círculo
      const scrollProgress = (windowHeight - containerTop) / totalHeight;
      const isInFirstStep = scrollProgress < (1/8); // 100vh / 800vh = 0.125
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
      
      // Paso 2 (100-200vh): Desorden - aparece y desaparece
      const isInDesordenStep = scrollProgress >= (1/8) && scrollProgress < (2/8); // 100-200vh
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
      
      // Detectar si estamos en el último step (después de Caótico, últimos 100vh)
      // Caótico va de 500-650vh (150vh), entonces el paso final anterior empieza en 650vh
      // El nuevo paso final empieza en 700vh (7/8)
      const isInFinalStep = scrollProgress >= (7/8); // 700vh / 800vh = 0.875
      setIsFinalStep(isInFinalStep);
      
      // Rastrear si alguna vez llegamos al paso final
      if (isInFinalStep) {
        setHasReachedFinalStep(true);
      }

      // Calcular opacidad del último step anterior (todos los títulos visibles)
      if (scrollProgress > (6.5/8) && scrollProgress < (7/8)) {
        const finalStepProgress = (scrollProgress - (6.5/8)) / (0.5/8); // Normalizar a 0-1 dentro de los primeros 50vh del paso final anterior
        setFinalStepOpacity(Math.min(1, finalStepProgress * 2)); // Fade in rápido en los primeros 50vh
      } else {
        setFinalStepOpacity(0);
      }
      
      // Detectar si el contenedor ya pasó completamente
      const containerBottom = containerTop + (windowHeight * 8);
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
      style={{ height: "800vh" }} // 100vh blanco + 100vh desorden + 400vh contenido + 100vh final anterior + 100vh nuevo paso final
    >
      {/* Contenedor fijo para el círculo y títulos */}
      <div 
        className="sticky top-0 h-screen flex items-center justify-center pointer-events-none z-10"
      >
        {/* Imagen superior - fondo estático */}
        <div 
          className="absolute top-[-85vh] left-0 right-0 z-0 pointer-events-none"
          style={{
            opacity: (isContainerPassed && hasReachedFinalStep) ? 0 : imagesOpacity,
            transition: "opacity 0.3s ease-out",
          }}
        >
          <img 
            src="/scrolly-top.png" 
            alt="" 
            className="w-full h-auto"
          />
        </div>

        {/* Imagen inferior - fondo estático */}
        <div 
          className="absolute bottom-[-45vh] left-0 right-0 z-8 pointer-events-none"
          style={{
            opacity: (isContainerPassed && hasReachedFinalStep) ? 0 : imagesOpacity,
            transition: "opacity 0.3s ease-out",
          }}
        >
          <img 
            src="/scrolly-bot.png" 
            alt="" 
            className="w-2/3 h-auto"
          />
        </div>

        <div 
          className="relative w-full max-w-[1200px] mx-auto px-8 z-8"
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
              className="text-[88px] font-serif text-center text-ldc-desorden"
            >
              Desorden
            </h2>
          </div>

          {/* Títulos alrededor del círculo */}
          {/* Arriba izquierda: Complejo (sección 2) */}
          <div
            className="absolute top-0 left-[50%] -translate-x-1/1 pr-12 italic"
            style={{
              opacity: (opacities[2] || 0),
              transition: "opacity 0.3s ease-out",
            }}
          >
            <h2 
              className="text-[88px] font-serif text-ldc-complejo"
            >
              Complejo
            </h2>
          </div>

          {/* Arriba derecha: Complicado (sección 1) */}
          <div
            className="absolute top-0 left-[50%] pl-12 italic"
            style={{
              opacity: (opacities[1] || 0),
              transition: "opacity 0.3s ease-out",
            }}
          >
            <h2 
              className="text-[88px] font-serif text-right text-ldc-complicado"
            >
              Complicado
            </h2>
          </div>

          {/* Abajo derecha: Simple (sección 0) */}
          <div
            className="absolute bottom-0 left-[50%] pl-12 italic"
            style={{
              opacity: (opacities[0] || 0),
              transition: "opacity 0.3s ease-out",
            }}
          >
            <h2 
              className="text-[88px] font-serif text-right text-ldc-simple"
            >
              Simple
            </h2>
          </div>

          {/* Abajo izquierda: Caótico (sección 3) */}
          <div
            className="absolute bottom-0 left-[50%] -translate-x-1/1 pr-12 italic"
            style={{
              opacity: (opacities[3] || 0),
              transition: "opacity 0.3s ease-out",
            }}
          >
            <h2 
              className="text-[88px] font-serif text-ldc-caotico"
            >
              Caótico
            </h2>
          </div>

          {/* Textos finales alrededor de los 4 cuadrantes */}
          {/* Arriba izquierda: Complejo */}
          <div
            className="absolute top-[20%] left-[10%] w-[180px] italic z-20"
            style={{
              opacity: finalTextsOpacity,
              transition: "opacity 0.3s ease-out",
            }}
          >
            <ul 
              className="text-[18px] text-ldc-complejo leading-5 list-disc flex flex-col gap-4"
            >
              <li>Impredecible</li>
              <li>Enfoques ágiles</li>
              <li>Inspección y adaptación </li>           
            </ul>
          </div>

          {/* Arriba derecha: Complicado */}
          <div
            className="absolute top-[20%] right-[00%] w-[180px] italic z-20"
            style={{
              opacity: finalTextsOpacity,
              transition: "opacity 0.3s ease-out",
            }}
          >
            <ul 
              className="text-[18px] text-ldc-complicado leading-5 list-disc flex flex-col gap-4"
            >
              <li>Causa-efecto no evidentes</li>
              <li>Varias soluciones</li>
              <li>Necesita de profesionales especializados</li>           
            </ul>          </div>

          {/* Abajo derecha: Simple */}
          <div
            className="absolute bottom-[30%] right-[0%] w-[180px] italic z-20"
            style={{
              opacity: finalTextsOpacity,
              transition: "opacity 0.3s ease-out",
            }}
          >
            <ul 
              className="text-[18px] text-ldc-simple leading-5 list-disc flex flex-col gap-4"
            >
              <li>Problemáticas univocas</li>
              <li>Soluciones  claras</li>
              <li>Procesos repetitivos</li>           
            </ul>          
          </div>

          {/* Abajo izquierda: Caótico */}
          <div
            className="absolute bottom-[30%] left-[10%] w-[180px] italic z-20"
            style={{
              opacity: finalTextsOpacity,
              transition: "opacity 0.3s ease-out",
            }}
          >
            <ul 
              className="text-[18px] text-ldc-caotico leading-5 list-disc flex flex-col gap-4"
            >
              <li>Situaciones de crisis</li>
              <li>Velocidad sobre robustez</li>
              <li>Improvisación</li>           
            </ul>  
          </div>
        </div>
      </div>

      {/* Textos que scrollean con el contenido */}
      {/* Orden: Simple (0) en 200vh, Complicado (1) en 300vh, Complejo (2) en 400vh, Caótico (3) en 500vh */}
      {sections.map((section, index) => {
        const opacity = isFinalStep ? 0 : (opacities[index] || 0);
        
        // Mapear índices a posiciones: 0->200vh, 1->300vh, 2->400vh, 3->500vh
        const positionMap: { [key: number]: number } = {
          0: 200, // Simple
          1: 300, // Complicado
          2: 400, // Complejo
          3: 500  // Caótico (tendrá 150vh de altura)
        };
        const sectionTop = positionMap[index] || 200;
        const sectionHeight = index === 3 ? 150 : 100; // Caótico tiene más altura
        
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
            <div className="relative w-full mx-auto px-8 flex items-center justify-between">
              {/* Texto izquierdo */}
              <div
                className="w-1/5 italic"
                style={{ 
                  transform: `translateX(${opacity < 0.1 ? -20 : 0}px)`,
                  transition: "transform 0.3s ease-out",
                }}
              >
                <p className="text-[18px] leading-relaxed text-left" dangerouslySetInnerHTML={{ __html: section.left }}/>
              </div>

              {/* Texto derecho */}
              <div
                className="w-1/5 italic"
                style={{ 
                  transform: `translateX(${opacity < 0.1 ? 20 : 0}px)`,
                  transition: "transform 0.3s ease-out",
                }}
              >
                <p 
                  className="text-[18px] leading-relaxed text-right" 
                  dangerouslySetInnerHTML={{ __html: section.right }}
                />
              </div>
            </div>
          </div>
        );
      })}

      {/* Sección de texto de Desorden (100-200vh) */}
      <div
        ref={(el) => {
          desordenTextRef.current = el;
        }}
        className="absolute left-0 right-0 flex items-center justify-center"
        style={{
          top: "100vh",
          height: "100vh",
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
              className="text-[18px] leading-relaxed w-[450px] mx-auto" 
              dangerouslySetInnerHTML={{ __html: "Esta es la zona más peligrosa: no entendemos en qué dominio estamos, y nos exponemos a actuar de manera diferente a la qué se necesita para resolver ciertos problemas. <br/><br/>En estos casos, todos nuestros esfuerzos deben estar centrados en salir de este espacio a uno mejor identificado, para posteriormente adoptar el enfoque correspondiente. " }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

