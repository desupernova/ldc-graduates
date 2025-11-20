"use client";

import { useState, useEffect } from "react";
import CynefinSelector from "./CynefinSelector";
import TriviaResults from "./TriviaResults";

interface TriviaQuestion {
  id: number;
  question: string;
  correctAnswer: "simple" | "complicado" | "complejo" | "caotico";
  feedback: string;
}

const triviaQuestions: TriviaQuestion[] = [
  {
    id: 1,
    question: "Nos solicitan liderar un proyecto de implementación de control de calidad: su objetivo es validar qué los empaques cumplan la normativa estándar (peso y tamaño).",
    correctAnswer: "simple",
    feedback: "Parece ser un entorno simple. Se aplica una lista de chequeo y el resultado es binario (cumple / no cumple).",
  },
  {
    id: 2,
    question: "El sistema tradicional de riego ya no resulta efectivo porque las lluvias son impredecibles y los patrones hídricos cambiaron. Te ponen al frente de una iniciativa para buscar nuevos enfoques.",
    correctAnswer: "complejo",
    feedback: "Se trata de un entorno complejo. No alcanza con la pericia técnica: hay que experimentar con nuevos esquemas, sensores, inteligencia climática o incluso rediseñar cultivos. Resta aprender aprender haciendo, probando y ajustando.",
  },
  {
    id: 3,
    question: "Participamos de una iniciativa para diseñar una estrategia de seguridad informática. ",
    correctAnswer: "complicado",
    feedback: "Estamos en un entorno complicado. Las amenazas son conocidas, pero requieren evaluación técnica y decisiones informadas.",
  },
  {
    id: 4,
    question: "Un granizo o inundación destruye la cosecha en pleno ciclo productivo. Te piden coordinar un comité para hacer frente a la situación.",
    correctAnswer: "caotico",
    feedback: "Claramente, es un contexto caótico. No hay tiempo para análisis: se debe actuar de inmediato para rescatar lo posible, proteger al personal y asegurar infraestructura.Recién después se analiza el impacto y se planifican respuestas.",
  },
  {
    id: 5,
    question: "Estás al frente de un equipo qué tiene a cargo determinar las dosis y combinaciones óptimas de nutrientes según análisis de suelo y rendimiento esperado.",
    correctAnswer: "complicado",
    feedback: "Con seguridad, es un entorno complicado. No hay una receta universal: depende del diagnóstico experto,  una persona capacitada puede identificar soluciones y asesorarnos para optar por la mejor.",
  },
  {
    id: 6,
    question: "La organización quiere entender qué ganancia podría obtener implementando sensores IoT, drones o plataformas de datos para toma de decisiones.",
    correctAnswer: "complejo",
    feedback: "Parece ser un entorno complejo.  El desafío no es sólo técnico, sino cultural y organizacional. No hay una idea clara de cuál sería el outcome esperable. Las resistencias, los aprendizajes y los efectos emergen a medida que se experimenta con el sistema.", 
  }
];

// Función para mezclar un array usando el algoritmo Fisher-Yates
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface TriviaProps {
  resultsText?: string;
}

export default function Trivia({ resultsText = "En apenas unos minutos ya fortaleciste tus competencias para diagnosticar escenarios y desarrollar estrategias posibles. <br/><br/>Ahora imaginate todo lo qué vas a poder aprender en nuestro taller de graduates.<br/><br/>Te esperamos para seguir entrenando!" }: TriviaProps) {
  // Mezclar las preguntas una sola vez al montar el componente
  const [shuffledQuestions] = useState<TriviaQuestion[]>(() => shuffleArray(triviaQuestions));
  
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const handleAnswer = (domain: string) => {
    if (!showFeedback) {
      setSelectedDomain(domain);
      const isCorrect = domain === currentQuestion.correctAnswer;
      setAnswers(prev => [...prev, isCorrect]);
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedDomain(null);
        setShowFeedback(false);
        // Pequeño delay para que la nueva pregunta aparezca
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
    }
  };

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const isCorrect = selectedDomain === currentQuestion.correctAnswer;

  // Avance automático después de 2.5 segundos cuando se muestra el feedback
  useEffect(() => {
    if (showFeedback) {
      const timer = setTimeout(() => {
        if (currentQuestionIndex < shuffledQuestions.length - 1) {
          // Primero ocultar la pregunta y el feedback
          setIsTransitioning(true);
          // Luego cambiar la pregunta después de la animación de fade out
          setTimeout(() => {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedDomain(null);
            setShowFeedback(false);
            // Pequeño delay para que la nueva pregunta aparezca
            setTimeout(() => {
              setIsTransitioning(false);
            }, 50);
          }, 300); // Tiempo de la animación de fade out
        } else {
          // Última pregunta completada
          setIsFinished(true);
        }
      }, 5500); // Esperar 2.5 segundos mostrando el feedback

      return () => clearTimeout(timer);
    }
  }, [showFeedback, currentQuestionIndex, shuffledQuestions.length]);


  const finalScore = answers.filter(Boolean).length;

  return (
    <div className="relative overflow-hidden mb-24" style={{ minHeight: '400px' }}>
      <div 
        key={currentQuestionIndex}
        className={`bg-white rounded-[24px] p-8 flex gap-16 relative z-10 will-change-transform max-w-[1200px] mx-auto ${isFinished ? 'mb-12' : ''}`}
      >
        {/* Texto de la pregunta - 2/3 del ancho */}
        <div className={`w-2/3 text-[18px] leading-relaxed mt-4`}>
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-2">
              Pregunta {currentQuestionIndex + 1} de {shuffledQuestions.length}
            </div>
            {/* Barra de progreso */}
            <div className="w-full bg-gray-200 h-2 overflow-hidden">
              <div 
                className="bg-black h-2 rounded-full transition-all duration-300 ease-out"
                style={{ 
                  width: `${((currentQuestionIndex + 1) / shuffledQuestions.length) * 100}%` 
                }}
              />
            </div>
          </div>
          <p className={`mt-12 italic transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}>
            {currentQuestion.question}
            <br /><br />
            ¿En qué dominio nos encontramos?
          </p>

          {/* Feedback */}
          {showFeedback && (
            <div className={`mt-6 rounded-lg transition-all duration-300`}>
              <p className={`italic text-md ${'text-ldc-' + currentQuestion.correctAnswer}`}>
                {isCorrect ? "¡Correcto! " : "Incorrecto. "} {currentQuestion.feedback}
              </p>
            </div>
          )}
        </div>

        {/* Selector Cynefin - 1/3 del ancho */}
        <div className="w-1/3 flex-shrink-0">
          <CynefinSelector 
            handleClick={handleAnswer}
            disabled={showFeedback || isFinished}
            highlightDomain={showFeedback || isFinished ? (currentQuestion.correctAnswer as any) : null}
            selectedDomain={showFeedback || isFinished ? (selectedDomain as any) : null}
          />
        </div>
      </div>

      {/* Sección de resultados debajo del cuadrito */}
      {isFinished && (
        <TriviaResults
          finalScore={finalScore}
          totalQuestions={shuffledQuestions.length}
          resultsText={resultsText}
        />
      )}
    </div>
  );
}

