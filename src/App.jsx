// START DER DATEI: src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { LucideDices, LucideCrown, LucideArrowLeft, LucideUsers, LucidePlay, LucideStar, LucideHelpCircle, LucideGamepad2, LucideShuffle, LucideCircleDot, LucideBrainCircuit, LucideShield, LucideDelete } from 'lucide-react';

// --- Helper-Funktionen & Konfiguration ---

const COLORS = ['red', 'green', 'yellow', 'blue'];

const START_POSITIONS = {
  red: [0, 1, 11, 12], green: [9, 10, 20, 21], blue: [99, 100, 110, 111], yellow: [108, 109, 119, 120],
};

const PATH = [
  44, 45, 46, 47, 48, 37, 26, 15, 4, 5, 6, 17, 28, 39, 50, 51, 52, 53, 54, 65,
  76, 75, 74, 73, 72, 83, 94, 105, 116, 115, 114, 103, 92, 81, 70, 69, 68, 67, 66, 55
];

const PATH_START_CELL = { red: 44, green: 6, yellow: 76, blue: 114 };
const PATH_START_INDEX = { red: 0, green: 10, yellow: 20, blue: 30 };

const FINISH_LINE_CELLS = {
  red: [56, 57, 58, 59], green: [16, 27, 38, 49], yellow: [64, 63, 62, 61], blue: [104, 93, 82, 71],
};

// --- New Field Distribution ---
const IMMUNITY_FIELDS = [PATH[4], PATH[14], PATH[24], PATH[34]];
const MEMORYGAME_FIELDS = [PATH[1], PATH[11], PATH[21], PATH[31]];
const TICTACTOE_FIELDS = [PATH[3], PATH[13], PATH[23], PATH[33]];
const EVENT_FIELDS = [PATH[6], PATH[16], PATH[26], PATH[36]];
const QUIZ_FIELDS = [PATH[7], PATH[17], PATH[27], PATH[37]];
const SHELLGAME_FIELDS = [PATH[9], PATH[19], PATH[29], PATH[39]];

const EVENTS = [
    { name: 'Flugzeugfeld', emoji: '✈️', effect: 'fly', description: 'Du fliegst 5 Felder weiter nach vorne! Steht dort jemand, wird er rausgeworfen.' },
    { name: 'Tauschfeld', emoji: '🔄', effect: 'swap', description: 'Tausche deine Position mit einer beliebigen anderen Figur auf dem Feld.' },
    { name: 'Polizeikontrolle', emoji: '👮', effect: 'police', description: 'Du wurdest geblitzt! Gehe 3 Felder zurück.' },
    { name: 'Chaosfeld', emoji: '🎲', effect: 'chaos', description: 'Würfle nochmal! Gerade Zahl: vorwärts, ungerade Zahl: rückwärts.' },
];

const QUIZ_QUESTIONS = [
    { question: 'Wie viele Liter Bier trinken die Deutschen durchschnittlich pro Kopf und Jahr?', answers: [{text: 'Ca. 100 Liter', isCorrect: true}, {text: 'Ca. 50 Liter', isCorrect: false}, {text: 'Ca. 150 Liter', isCorrect: false}] },
    { question: 'Wie hoch ist der Eiffelturm in Paris (inkl. Antennen)?', answers: [{text: '286 Meter', isCorrect: false}, {text: '330 Meter', isCorrect: true}, {text: '381 Meter', isCorrect: false}] },
    { question: 'Wie viele Herzen hat ein Oktopus?', answers: [{text: 'Eins', isCorrect: false}, {text: 'Zwei', isCorrect: false}, {text: 'Drei', isCorrect: true}] },
    { question: 'Wie lange dauert es, bis das Licht von der Sonne die Erde erreicht?', answers: [{text: '8 Minuten', isCorrect: true}, {text: '30 Sekunden', isCorrect: false}, {text: '2 Stunden', isCorrect: false}] },
    { question: 'Welches Land hat die meisten Inseln?', answers: [{text: 'Indonesien', isCorrect: false}, {text: 'Schweden', isCorrect: true}, {text: 'Kanada', isCorrect: false}] },
    { question: 'Welcher Planet in unserem Sonnensystem ist der größte?', answers: [{text: 'Erde', isCorrect: false}, {text: 'Jupiter', isCorrect: true}, {text: 'Saturn', isCorrect: false}]},
    { question: 'Wie viele Knochen hat ein erwachsener menschlicher Körper?', answers: [{text: '206', isCorrect: true}, {text: '300', isCorrect: false}, {text: '152', isCorrect: false}]},
    { question: 'Was ist die Hauptstadt von Australien?', answers: [{text: 'Sydney', isCorrect: false}, {text: 'Melbourne', isCorrect: false}, {text: 'Canberra', isCorrect: true}]},
    { question: 'Welches Tier ist das schnellste Landtier?', answers: [{text: 'Löwe', isCorrect: false}, {text: 'Gepard', isCorrect: true}, {text: 'Antilope', isCorrect: false}]},
    { question: 'In welchem Jahr fiel die Berliner Mauer?', answers: [{text: '1989', isCorrect: true}, {text: '1991', isCorrect: false}, {text: '1987', isCorrect: false}]},
    { question: 'Welcher Ozean ist der größte der Welt?', answers: [{text: 'Atlantischer Ozean', isCorrect: false}, {text: 'Indischer Ozean', isCorrect: false}, {text: 'Pazifischer Ozean', isCorrect: true}]},
    { question: 'Wer schrieb "Harry Potter"?', answers: [{text: 'J.R.R. Tolkien', isCorrect: false}, {text: 'J.K. Rowling', isCorrect: true}, {text: 'George R.R. Martin', isCorrect: false}]},
    { question: 'Welches Element hat das chemische Symbol "Au"?', answers: [{text: 'Silber', isCorrect: false}, {text: 'Gold', isCorrect: true}, {text: 'Kupfer', isCorrect: false}]},
    { question: 'Wie heißt der höchste Berg der Welt?', answers: [{text: 'K2', isCorrect: false}, {text: 'Mount Everest', isCorrect: true}, {text: 'Kangchendzönga', isCorrect: false}]},
    { question: 'In welchem Land wurde das Schachspiel erfunden?', answers: [{text: 'Indien', isCorrect: true}, {text: 'China', isCorrect: false}, {text: 'Ägypten', isCorrect: false}]},
    { question: 'Welches ist das einzige Säugetier, das fliegen kann?', answers: [{text: 'Flughörnchen', isCorrect: false}, {text: 'Fledermaus', isCorrect: true}, {text: 'Pinguin', isCorrect: false}]},
    { question: 'Wer malte die Mona Lisa?', answers: [{text: 'Vincent van Gogh', isCorrect: false}, {text: 'Leonardo da Vinci', isCorrect: true}, {text: 'Pablo Picasso', isCorrect: false}]},
    { question: 'Was ist die Währung von Japan?', answers: [{text: 'Yuan', isCorrect: false}, {text: 'Yen', isCorrect: true}, {text: 'Won', isCorrect: false}]},
    { question: 'Welches ist das längste Fluss der Welt?', answers: [{text: 'Amazonas', isCorrect: false}, {text: 'Nil', isCorrect: true}, {text: 'Jangtse', isCorrect: false}]},
    { question: 'Wer war der erste Mensch im Weltraum?', answers: [{text: 'Neil Armstrong', isCorrect: false}, {text: 'Yuri Gagarin', isCorrect: true}, {text: 'Buzz Aldrin', isCorrect: false}]},
    { question: 'Welches Gas atmen Pflanzen ein?', answers: [{text: 'Sauerstoff', isCorrect: false}, {text: 'Kohlendioxid', isCorrect: true}, {text: 'Stickstoff', isCorrect: false}]},
    { question: 'Welche Farbe hat eine "Black Box" in einem Flugzeug?', answers: [{text: 'Schwarz', isCorrect: false}, {text: 'Orange', isCorrect: true}, {text: 'Rot', isCorrect: false}]},
    { question: 'Welches ist das härteste bekannte natürliche Material?', answers: [{text: 'Stahl', isCorrect: false}, {text: 'Diamant', isCorrect: true}, {text: 'Titan', isCorrect: false}]},
    { question: 'Welcher Komponist war taub?', answers: [{text: 'Mozart', isCorrect: false}, {text: 'Beethoven', isCorrect: true}, {text: 'Bach', isCorrect: false}]},
    { question: 'Welches Meer hat den höchsten Salzgehalt?', answers: [{text: 'Mittelmeer', isCorrect: false}, {text: 'Totes Meer', isCorrect: true}, {text: 'Rotes Meer', isCorrect: false}]},
    { question: 'Welche Stadt ist als "Die Stadt der Liebe" bekannt?', answers: [{text: 'Rom', isCorrect: false}, {text: 'Paris', isCorrect: true}, {text: 'Venedig', isCorrect: false}]},
    { question: 'Was bedeutet das portugiesische Wort "obrigado"?', answers: [{text: 'Bitte', isCorrect: false}, {text: 'Danke', isCorrect: true}, {text: 'Hallo', isCorrect: false}]},
    { question: 'Wie viele Zeitzo­nen gibt es in Russland?', answers: [{text: '8', isCorrect: false}, {text: '11', isCorrect: true}, {text: '14', isCorrect: false}]},
    { question: 'Welches Land ist der größte Kaffeeproduzent der Welt?', answers: [{text: 'Kolumbien', isCorrect: false}, {text: 'Vietnam', isCorrect: false}, {text: 'Brasilien', isCorrect: true}]},
    { question: 'Wie viele Beine hat ein Hummer?', answers: [{text: '8', isCorrect: false}, {text: '10', isCorrect: true}, {text: '12', isCorrect: false}]},
    { question: 'Welcher US-Bundesstaat ist der größte (nach Fläche)?', answers: [{text: 'Texas', isCorrect: false}, {text: 'Alaska', isCorrect: true}, {text: 'Kalifornien', isCorrect: false}]},
    { question: 'Was ist ein "Sommelier" Experte für?', answers: [{text: 'Käse', isCorrect: false}, {text: 'Wein', isCorrect: true}, {text: 'Brot', isCorrect: false}]},
    { question: 'Wie viele Zwerge gibt es in "Schneewittchen"?', answers: [{text: '6', isCorrect: false}, {text: '7', isCorrect: true}, {text: '8', isCorrect: false}]},
    { question: 'Welches Instrument hat 6 Saiten und wird gezupft?', answers: [{text: 'Violine', isCorrect: false}, {text: 'Gitarre', isCorrect: true}, {text: 'Cello', isCorrect: false}]},
    { question: 'Wie nennt man die Angst vor Spinnen?', answers: [{text: 'Klaustrophobie', isCorrect: false}, {text: 'Arachnophobie', isCorrect: true}, {text: 'Agoraphobie', isCorrect: false}]},
    { question: 'Aus wie vielen Kräutern besteht die "Frankfurter Grüne Soße" traditionell?', answers: [{text: 'Fünf', isCorrect: false}, {text: 'Sieben', isCorrect: true}, {text: 'Neun', isCorrect: false}]},
    { question: 'Welches Tier kann seinen Kopf um bis zu 270 Grad drehen?', answers: [{text: 'Katze', isCorrect: false}, {text: 'Eule', isCorrect: true}, {text: 'Fledermaus', isCorrect: false}]},
    { question: 'Was ist die Hauptzutat von Guacamole?', answers: [{text: 'Tomate', isCorrect: false}, {text: 'Avocado', isCorrect: true}, {text: 'Zwiebel', isCorrect: false}]},
    { question: 'Wie viele Punkte hat ein Basketball-Freiwurf?', answers: [{text: 'Einen', isCorrect: true}, {text: 'Zwei', isCorrect: false}, {text: 'Drei', isCorrect: false}]},
    { question: 'Was bedeutet das italienische Wort "prego"?', answers: [{text: 'Gern geschehen / Bitte', isCorrect: true}, {text: 'Entschuldigung', isCorrect: false}, {text: 'Guten Tag', isCorrect: false}]},
    { question: 'Welcher Ozean liegt zwischen Europa und Amerika?', answers: [{text: 'Pazifik', isCorrect: false}, {text: 'Atlantik', isCorrect: true}, {text: 'Indischer Ozean', isCorrect: false}]},
    { question: 'Wer war der erste Bundeskanzler der Bundesrepublik Deutschland?', answers: [{text: 'Helmut Kohl', isCorrect: false}, {text: 'Konrad Adenauer', isCorrect: true}, {text: 'Willy Brandt', isCorrect: false}]},
    { question: 'Wie viele Karten hat ein Standard-Skatspiel?', answers: [{text: '32', isCorrect: true}, {text: '52', isCorrect: false}, {text: '36', isCorrect: false}]},
    { question: 'Welche Stadt ist als "The Big Apple" bekannt?', answers: [{text: 'Los Angeles', isCorrect: false}, {text: 'New York City', isCorrect: true}, {text: 'Chicago', isCorrect: false}]},
    { question: 'Wie lange dauert ein normales Fußballspiel (ohne Nachspielzeit/Verlängerung)?', answers: [{text: '80 Minuten', isCorrect: false}, {text: '90 Minuten', isCorrect: true}, {text: '100 Minuten', isCorrect: false}]},
    { question: 'In welchem Land befindet sich die Große Mauer?', answers: [{text: 'Japan', isCorrect: false}, {text: 'China', isCorrect: true}, {text: 'Indien', isCorrect: false}]},
    { question: 'Was bedeutet das spanische Wort "cerveza"?', answers: [{text: 'Wasser', isCorrect: false}, {text: 'Bier', isCorrect: true}, {text: 'Wein', isCorrect: false}]},
    { question: 'Wofür steht die Abkürzung "UNESCO"?', answers: [{text: 'Organisation der Vereinten Nationen für Erziehung, Wissenschaft und Kultur', isCorrect: true}, {text: 'Union Europäischer Fußballverbände', isCorrect: false}, {text: 'Weltgesundheitsorganisation', isCorrect: false}]},
    { question: 'Wie viele Arme hat ein Seestern typischerweise?', answers: [{text: 'Fünf', isCorrect: true}, {text: 'Sechs', isCorrect: false}, {text: 'Acht', isCorrect: false}]},
    { question: 'Welcher Maler schnitt sich einen Teil seines eigenen Ohres ab?', answers: [{text: 'Pablo Picasso', isCorrect: false}, {text: 'Vincent van Gogh', isCorrect: true}, {text: 'Salvador Dalí', isCorrect: false}]},
    { question: 'Wie heißt die Währung im Vereinigten Königreich?', answers: [{text: 'Euro', isCorrect: false}, {text: 'Pfund Sterling', isCorrect: true}, {text: 'Dollar', isCorrect: false}]},
    { question: 'Welche ist die kleinste Primzahl?', answers: [{text: 'Eins', isCorrect: false}, {text: 'Zwei', isCorrect: true}, {text: 'Drei', isCorrect: false}]},
];

// --- Animations-Hook ---
const useAnimation = () => {
    const [animatedPawn, setAnimatedPawn] = useState(null);
    const triggerCaptureAnimation = (player, index) => {
        setAnimatedPawn({ player, index, state: 'captured' });
        setTimeout(() => setAnimatedPawn(null), 500);
    };
    return { animatedPawn, triggerCaptureAnimation };
};

// --- Komponenten ---

const Pawn = ({ color, isHighlighted, animationState, isSelectable }) => {
    const animationClass = animationState === 'captured' ? 'animate-shake' : '';
    const highlightStyle = isHighlighted || isSelectable ? { filter: 'drop-shadow(0 0 6px #fff)' } : {};
    const selectableStyle = isSelectable ? { filter: 'drop-shadow(0 0 8px #a855f7)' } : {};
    const headStrokeColor = color.toLowerCase() === 'yellow' ? '#4b5563' : '#ffffff';

    return (
      <div className={`w-full h-full transition-all duration-300 ${isHighlighted ? 'scale-110' : ''} ${animationClass}`} style={{...highlightStyle, ...selectableStyle}}>
        <svg viewBox="0 0 100 120" className="w-full h-full">
            <defs>
                <radialGradient id={`grad-${color}`} cx="50%" cy="40%" r="50%" fx="50%" fy="30%">
                    <stop offset="0%" style={{stopColor: '#ffffff', stopOpacity: 0.7}} />
                    <stop offset="100%" style={{stopColor: color, stopOpacity: 1}} />
                </radialGradient>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="2" dy="4" stdDeviation="2.5" floodColor="#000" floodOpacity="0.3"/>
                </filter>
            </defs>
            <g style={{filter: 'url(#shadow)'}}>
                <path d="M 50,118 C 20,118 10,100 10,100 L 25,60 C 25,60 15,40 50,15 C 85,40 75,60 75,60 L 90,100 C 90,100 80,118 50,118 Z" fill={`url(#grad-${color})`} stroke="#000" strokeWidth="2"/>
                <circle cx="50" cy="35" r="18" fill={color} stroke={headStrokeColor} strokeWidth="3" />
            </g>
        </svg>
      </div>
    );
};

const Cell = ({ type, color, children, isEvent, isQuiz, isTicTacToe, isShellGame, isMemoryGame, isImmunity }) => {
  const baseClasses = "rounded-sm md:rounded-md transition-colors duration-200 relative aspect-square";
  
  const typeColorStyles = {
    start_cell: {
        red: 'bg-gradient-to-br from-red-300 to-red-400', green: 'bg-gradient-to-br from-green-300 to-green-400',
        blue: 'bg-gradient-to-br from-blue-300 to-blue-400', yellow: 'bg-gradient-to-br from-yellow-300 to-yellow-400',
    },
    start_area: {
        red: 'bg-red-100 border-2 border-dashed border-red-300', green: 'bg-green-100 border-2 border-dashed border-green-300',
        blue: 'bg-blue-100 border-2 border-dashed border-blue-300', yellow: 'bg-yellow-100 border-2 border-dashed border-yellow-300',
    },
    finish: {
        red: 'bg-gradient-to-br from-red-200 to-red-300', green: 'bg-gradient-to-br from-green-200 to-green-300',
        blue: 'bg-gradient-to-br from-blue-200 to-blue-300', yellow: 'bg-gradient-to-br from-yellow-200 to-yellow-300',
    }
  };
  
  let styleClasses = '';
  if (type === 'path') styleClasses = 'bg-stone-200 shadow-inner';
  else if (type === 'empty') styleClasses = 'bg-transparent pointer-events-none';
  else if (typeColorStyles[type] && typeColorStyles[type][color]) {
    styleClasses = typeColorStyles[type][color];
  } else {
    styleClasses = 'bg-gray-100';
  }

  return (
    <div className={`${baseClasses} ${styleClasses}`}>
      {isEvent && <LucideStar className="absolute w-3/5 h-3/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-400 opacity-80" style={{filter: 'drop-shadow(0 0 3px #000)'}} />}
      {isQuiz && <LucideHelpCircle className="absolute w-3/5 h-3/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-400 opacity-90" style={{filter: 'drop-shadow(0 0 3px #000)'}} />}
      {isTicTacToe && <LucideGamepad2 className="absolute w-3/5 h-3/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 opacity-90" style={{filter: 'drop-shadow(0 0 3px #000)'}} />}
      {isShellGame && <LucideShuffle className="absolute w-3/5 h-3/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500 opacity-90" style={{filter: 'drop-shadow(0 0 3px #000)'}} />}
      {isMemoryGame && <LucideBrainCircuit className="absolute w-3/5 h-3/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-500 opacity-90" style={{filter: 'drop-shadow(0 0 3px #000)'}} />}
      {isImmunity && <LucideShield className="absolute w-3/5 h-3/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-teal-500 opacity-90" style={{filter: 'drop-shadow(0 0 3px #000)'}} />}
      <div className="relative z-10 w-full h-full overflow-visible">{children}</div>
    </div>
  );
};

const Dice = ({ value, onRoll, isRolling, canRoll }) => (
  <button onClick={onRoll} disabled={!canRoll || isRolling} className={`w-24 h-24 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-6xl font-bold text-gray-800 transform transition-transform duration-300 ${canRoll ? 'hover:scale-110 hover:rotate-6' : 'opacity-50 cursor-not-allowed'} ${isRolling ? 'animate-spin' : ''}`}>
    {isRolling ? <LucideDices className="animate-ping" /> : value}
  </button>
);

const EventSlotMachine = ({ onFinish }) => {
    const [isSpinning, setIsSpinning] = useState(true);
    const [finalEvent, setFinalEvent] = useState(null);
    const reelRef = useRef(null);
    const repeatedEvents = useRef([...EVENTS, ...EVENTS, ...EVENTS, ...EVENTS, ...EVENTS]).current;

    const stopSpinning = () => {
        if (!isSpinning) return;
        setIsSpinning(false);
        const eventIndex = Math.floor(Math.random() * EVENTS.length);
        const chosenEvent = EVENTS[eventIndex];
        const elementHeight = 80;
        const targetSetIndex = 2; 
        const finalElementIndex = (targetSetIndex * EVENTS.length) + eventIndex;
        const finalPosition = finalElementIndex * elementHeight;
        if (reelRef.current) {
            reelRef.current.style.transition = 'transform 3s cubic-bezier(0.25, 1, 0.5, 1)';
            reelRef.current.style.transform = `translateY(-${finalPosition}px)`;
        }
        setTimeout(() => { setFinalEvent(chosenEvent); }, 3000);
    };
    
    useEffect(() => {
        if(finalEvent) { setTimeout(() => onFinish(finalEvent), 2500); }
    }, [finalEvent, onFinish]);

    return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-gray-700 to-gray-900 rounded-2xl shadow-2xl p-6 text-center max-w-sm w-full border-4 border-yellow-400">
                <h2 className="text-3xl font-bold text-white mb-4">Ereignisfeld!</h2>
                <div className="h-20 w-full bg-gray-800 rounded-lg overflow-hidden relative border-2 border-gray-500 my-4">
                    <div ref={reelRef} className={`flex flex-col items-center justify-center ${isSpinning ? 'animate-slot-machine' : ''}`}>{repeatedEvents.map((event, i) => (<div key={i} className="h-20 flex items-center justify-center text-6xl">{event.emoji}</div>))}</div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-gray-800"></div>
                    <div className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2 bg-red-500 opacity-50"></div>
                </div>
                {finalEvent ? (<div className="h-24 flex flex-col items-center justify-center"><p className="text-2xl font-bold text-yellow-400 animate-pulse">{finalEvent.name}</p><p className="text-white mt-2">{finalEvent.description}</p></div>) : (<button onClick={stopSpinning} disabled={!isSpinning} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-2xl transition-all transform hover:scale-105 disabled:opacity-50">STOP</button>)}
            </div>
        </div>
    );
};

const QuizModal = ({ question, onAnswer }) => {
    const [answered, setAnswered] = useState(false);
    const [result, setResult] = useState(null);

    const handleAnswerClick = (answer) => {
        if (answered) return;
        setAnswered(true);
        setResult(answer.isCorrect ? 'correct' : 'incorrect');
        setTimeout(() => onAnswer(answer.isCorrect), 2000);
    };

    return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full">
                <LucideHelpCircle className="mx-auto text-purple-500 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Schätzfrage!</h2>
                <p className="text-lg text-gray-600 mb-6 min-h-[56px]">{question.question}</p>
                <div className="space-y-3">
                    {question.answers.map((ans, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleAnswerClick(ans)}
                            disabled={answered}
                            className={`w-full p-4 rounded-lg font-semibold text-lg transition-all duration-300 ${!answered ? 'bg-gray-200 hover:bg-purple-200' : ''} ${answered && ans.isCorrect ? 'bg-green-500 text-white scale-105' : ''} ${answered && !ans.isCorrect ? 'bg-red-500 text-white' : ''} ${answered ? 'opacity-70' : ''}`}
                        >
                            {ans.text}
                        </button>
                    ))}
                </div>
                {result === 'correct' && <p className="mt-4 text-xl font-bold text-green-600 animate-pulse">Richtig! Du gehst 4 Felder vor.</p>}
                {result === 'incorrect' && <p className="mt-4 text-xl font-bold text-red-600 animate-pulse">Falsch! Du gehst 2 Felder zurück.</p>}
            </div>
        </div>
    );
};

const TicTacToeModal = ({ onFinish }) => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [winner, setWinner] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    
    const checkWinner = (currentBoard) => {
        const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                return currentBoard[a];
            }
        }
        if (currentBoard.every(square => square !== null)) return 'draw';
        return null;
    };

    const minimax = (newBoard, player) => {
        const availSpots = newBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
        const winner = checkWinner(newBoard);
        if (winner === 'X') return { score: -10 };
        if (winner === 'O') return { score: 10 };
        if (availSpots.length === 0) return { score: 0 };
        
        const moves = [];
        for (let i = 0; i < availSpots.length; i++) {
            const move = {};
            move.index = availSpots[i];
            newBoard[availSpots[i]] = player;
            if (player === 'O') {
                const result = minimax(newBoard, 'X');
                move.score = result.score;
            } else {
                const result = minimax(newBoard, 'O');
                move.score = result.score;
            }
            newBoard[availSpots[i]] = null;
            moves.push(move);
        }
        
        let bestMove;
        if (player === 'O') {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    };

    const handlePlayerMove = (index) => {
        if (board[index] || !isPlayerTurn || gameOver) return;
        const newBoard = [...board];
        newBoard[index] = 'X';
        setBoard(newBoard);
        setIsPlayerTurn(false);
        
        const gameWinner = checkWinner(newBoard);
        if (gameWinner) {
            setWinner(gameWinner);
            setGameOver(true);
        }
    };
    
    useEffect(() => {
        if (!isPlayerTurn && !gameOver) {
            const emptySquares = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
            if(emptySquares.length > 0) {
                 const bestMove = minimax(board, 'O').index;
                 setTimeout(() => {
                    const newBoard = [...board];
                    if(newBoard[bestMove] === null) {
                        newBoard[bestMove] = 'O';
                        setBoard(newBoard);
                        setIsPlayerTurn(true);
                        const gameWinner = checkWinner(newBoard);
                        if (gameWinner) {
                            setWinner(gameWinner);
                            setGameOver(true);
                        }
                    }
                }, 500);
            }
        }
    }, [isPlayerTurn, board, gameOver]);

    useEffect(() => {
        if (gameOver) {
            const result = winner === 'X' ? 'win' : winner === 'O' ? 'loss' : 'draw';
            setTimeout(() => onFinish(result), 2000);
        }
    }, [gameOver, winner, onFinish]);

    const getResultMessage = () => {
        if (!gameOver) return "Du bist am Zug!";
        switch (winner) {
            case 'X': return "Gewonnen! (5 Felder vor)";
            case 'O': return "Verloren! (5 Felder zurück)";
            case 'draw': return "Unentschieden! (2 Felder vor)";
            default: return "";
        }
    };

    return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full">
                <LucideGamepad2 className="mx-auto text-indigo-500 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Tic-Tac-Toe Duell!</h2>
                <div className="grid grid-cols-3 gap-2 my-6">
                    {board.map((value, index) => (
                        <button key={index} onClick={() => handlePlayerMove(index)} className={`w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-5xl font-bold ${value === 'X' ? 'text-blue-500' : 'text-red-500'}`}>
                            {value}
                        </button>
                    ))}
                </div>
                <p className="text-xl font-semibold h-8">{getResultMessage()}</p>
            </div>
        </div>
    );
};

const ShellGameModal = ({ onFinish }) => {
    const [cups, setCups] = useState(() => {
        const winningCupId = Math.floor(Math.random() * 3);
        return [
            { id: 0, order: 0, hasBall: winningCupId === 0 },
            { id: 1, order: 1, hasBall: winningCupId === 1 },
            { id: 2, order: 2, hasBall: winningCupId === 2 },
        ];
    });
    const [phase, setPhase] = useState('start'); // start, shuffling, playing, reveal
    const [message, setMessage] = useState('Finde die Kugel!');
    const [selectedCup, setSelectedCup] = useState(null);

    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    useEffect(() => {
        if (phase === 'start') {
            setTimeout(() => setPhase('shuffling'), 2000);
        }
        if (phase === 'shuffling') {
            let shuffleCount = 0;
            const interval = setInterval(() => {
                setCups(prevCups => {
                    const newOrder = shuffle([...prevCups.map(c => c.order)]);
                    return prevCups.map((cup, i) => ({ ...cup, order: newOrder[i] }));
                });
                shuffleCount++;
                if (shuffleCount >= 5) {
                    clearInterval(interval);
                    setPhase('playing');
                }
            }, 600);
        }
    }, [phase]);

    const handleCupClick = (cup) => {
        if (phase !== 'playing') return;
        setSelectedCup(cup.id);
        setPhase('reveal');
        const won = cup.hasBall;
        setMessage(won ? 'Gefunden! 3 Felder vor.' : 'Leider falsch! 3 Felder zurück.');
        setTimeout(() => onFinish(won), 2500);
    }
    
    const getCupPosition = (order) => {
        if (order === 0) return 'translate-x-[-110%]';
        if (order === 1) return 'translate-x-[0%]';
        if (order === 2) return 'translate-x-[110%]';
    }

    return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full">
                <LucideShuffle className="mx-auto text-orange-500 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Hütchenspiel!</h2>
                <div className="relative w-full h-32 my-4 flex justify-center items-center">
                    {cups.map((cup) => (
                        <div key={cup.id} 
                            onClick={() => handleCupClick(cup)}
                            className={`absolute w-24 h-24 transition-transform duration-500 ease-in-out ${getCupPosition(cup.order)} ${phase === 'playing' ? 'cursor-pointer hover:scale-110' : ''} ${phase === 'reveal' && selectedCup === cup.id ? 'translate-y-[-30px]' : ''}`}
                        >
                            <div className="w-full h-full bg-red-500 rounded-t-full shadow-lg"></div>
                            {((phase === 'start' || phase === 'reveal') && cup.hasBall) && <LucideCircleDot className="absolute bottom-1 left-1/2 -translate-x-1/2 text-yellow-300" size={32}/> }
                        </div>
                    ))}
                </div>
                 <p className="text-xl font-semibold h-8">{message}</p>
            </div>
        </div>
    )
}

const MemoryGameModal = ({ onFinish }) => {
    const [sequence, setSequence] = useState('');
    const [phase, setPhase] = useState('showing'); // showing, input, result
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState(null); // 'correct' | 'incorrect'

    useEffect(() => {
        let newSequence = '';
        for (let i = 0; i < 6; i++) {
            newSequence += Math.floor(Math.random() * 10);
        }
        setSequence(newSequence);

        const timer = setTimeout(() => {
            setPhase('input');
        }, 4000); 

        return () => clearTimeout(timer);
    }, []);

    const handleInput = (char) => {
        if (inputValue.length < 6) {
            setInputValue(inputValue + char);
        }
    };
    
    const handleDelete = () => {
        setInputValue(inputValue.slice(0, -1));
    };

    const handleSubmit = () => {
        if (phase !== 'input') return;
        
        const isCorrect = inputValue === sequence;
        setResult(isCorrect ? 'correct' : 'incorrect');
        setPhase('result');

        setTimeout(() => {
            onFinish(isCorrect);
        }, 2000);
    };

    const keypad = ['1','2','3','4','5','6','7','8','9','0'];

    return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full">
                <LucideBrainCircuit className="mx-auto text-pink-500 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Gedächtnisspiel!</h2>
                {phase === 'showing' && (
                    <div>
                        <p className="text-lg text-gray-600 mb-4">Merke dir diese Zahlenfolge:</p>
                        <p className="text-5xl font-bold tracking-widest text-gray-800 p-4 bg-gray-100 rounded-lg">{sequence}</p>
                    </div>
                )}
                {(phase === 'input' || phase === 'result') && (
                    <div>
                        <p className="text-lg text-gray-600 mb-4">{phase === 'input' ? 'Gib die Zahlenfolge ein:' : 'Deine Eingabe:'}</p>
                         <div className="w-full text-center text-4xl font-bold tracking-widest p-4 h-20 border-2 border-gray-300 rounded-lg bg-gray-100 mb-4 flex items-center justify-center">
                            {inputValue}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                           {keypad.map(key => <button key={key} onClick={() => handleInput(key)} className="py-4 text-2xl font-bold bg-gray-200 rounded-lg hover:bg-pink-200 transition">{key}</button>)}
                           <button onClick={handleDelete} className="py-4 text-2xl font-bold bg-gray-300 rounded-lg hover:bg-red-300 transition col-span-2"><LucideDelete className="mx-auto"/></button>
                        </div>
                        <button onClick={handleSubmit} className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg text-lg">Prüfen</button>
                    </div>
                )}
                {phase === 'result' && (
                     <div>
                        {result === 'correct' && <p className="mt-4 text-xl font-bold text-green-600 animate-pulse">Richtig! 4 Felder vorwärts.</p>}
                        {result === 'incorrect' && <p className="mt-4 text-xl font-bold text-red-600 animate-pulse">Falsch! 2 Felder zurück.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};


const LudoGame = ({ onBack, players: playerConfig }) => {
  if (!playerConfig || playerConfig.length === 0) return null;

  const [pawns, setPawns] = useState(() => initializePawnState());
  const [diceValue, setDiceValue] = useState(0);
  const [activePlayers, setActivePlayers] = useState(() => playerConfig.map(p => p.color));
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [message, setMessage] = useState(() => `${playerConfig[0].name}, bitte würfeln!`);
  const [winner, setWinner] = useState(null);
  const [rollAttempts, setRollAttempts] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { animatedPawn, triggerCaptureAnimation } = useAnimation();
  
  const [showEventModal, setShowEventModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showTicTacToeModal, setShowTicTacToeModal] = useState(false);
  const [showShellGameModal, setShowShellGameModal] = useState(false);
  const [showMemoryGameModal, setShowMemoryGameModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [eventPawn, setEventPawn] = useState(null);
  const [gameState, setGameState] = useState('normal');
  const [usedQuestionIndices, setUsedQuestionIndices] = useState(new Set());

  const currentPlayerColor = activePlayers[currentPlayerIndex];
  const currentPlayerName = playerConfig.find(p => p.color === currentPlayerColor).name;
  
  const allPawnsHome = pawns[currentPlayerColor].every(p => p.state === 'home');
  const canAttemptAgain = allPawnsHome && diceValue !== 6 && rollAttempts < 3;
  const canRoll = !isRolling && !winner && !isAnimating && !showEventModal && !showQuizModal && !showTicTacToeModal && !showShellGameModal && !showMemoryGameModal && (diceValue === 0 || canAttemptAgain);


  function initializePawnState() {
    const state = {};
    playerConfig.forEach(({ color }) => {
      state[color] = START_POSITIONS[color].map(pos => ({ position: pos, state: 'home' }));
    });
    return state;
  }

  const nextPlayer = () => {
    const nextIndex = (currentPlayerIndex + 1) % activePlayers.length;
    setCurrentPlayerIndex(nextIndex);
    setDiceValue(0);
    setRollAttempts(0);
    const nextPlayerName = playerConfig.find(p => p.color === activePlayers[nextIndex]).name;
    setMessage(`${nextPlayerName}, bitte würfeln!`);
  };

  const handleRollDice = () => {
    if (!canRoll) return;

    setIsRolling(true);
    setMessage('');
    setTimeout(() => {
        let roll;
        if (allPawnsHome) {
            roll = Math.random() < 0.25 ? 6 : Math.floor(Math.random() * 5) + 1;
        } else {
            roll = Math.floor(Math.random() * 6) + 1;
        }

      setIsRolling(false);

      if (gameState === 'awaitingChaosRoll') {
          setDiceValue(roll);
          setGameState('chaosMovePending');
          setMessage('Wähle die Chaos-Figur zum Ziehen.');
          return;
      }
      
      setDiceValue(roll);
      
      const newAttempts = rollAttempts + 1;

      if (allPawnsHome && roll !== 6) {
        if (newAttempts < 3) {
          setRollAttempts(newAttempts);
          setMessage(`Versuch ${newAttempts}/3. Würfle nochmal!`);
        } else {
          setRollAttempts(newAttempts); // Set to 3 to disable button
          setMessage(`${currentPlayerName} konnte nicht rauskommen.`);
          setTimeout(nextPlayer, 1500);
        }
        return;
      }
      
      const movablePawns = getMovablePawns(currentPlayerColor, roll);
      if (movablePawns.length === 0) {
        setMessage(`${currentPlayerName} kann nicht ziehen.`);
        setTimeout(() => (roll !== 6) ? nextPlayer() : (setMessage("6 gewürfelt, aber kein Zug möglich. Würfle nochmal!"), setDiceValue(0)), 1500);
      } else {
        setMessage("Wähle eine Figur zum Ziehen.");
      }
    }, 500);
  };
    
  const getMovablePawns = (player, roll) => {
    if (gameState === 'chaosMovePending') {
        return eventPawn && eventPawn.player === player ? [{ ...pawns[player][eventPawn.index], index: eventPawn.index }] : [];
    }

    const playerPawns = pawns[player];
    const startCell = PATH_START_CELL[player];

    const calculateDestination = (pawn, r) => {
        if (pawn.state === 'home') return { pos: startCell, isFinish: false };
        if (pawn.state === 'path') {
            const currentPathIdx = PATH.indexOf(pawn.position);
            const stepsFromStart = (currentPathIdx - PATH_START_INDEX[player] + 40) % 40;
            const newSteps = stepsFromStart + r;
            if (newSteps >= 40) {
                const finishIdx = newSteps - 40;
                return finishIdx < FINISH_LINE_CELLS[player].length ? { pos: FINISH_LINE_CELLS[player][finishIdx], isFinish: true } : { pos: -1, isFinish: false };
            }
            return { pos: PATH[(PATH_START_INDEX[player] + newSteps) % 40], isFinish: false };
        }
        if (pawn.state === 'finish') {
            const currentFinishIdx = FINISH_LINE_CELLS[player].indexOf(pawn.position);
            const newFinishIdx = currentFinishIdx + r;
            return newFinishIdx < FINISH_LINE_CELLS[player].length ? { pos: FINISH_LINE_CELLS[player][newFinishIdx], isFinish: true } : { pos: -1, isFinish: false };
        }
        return { pos: -1, isFinish: false };
    };

    const isOccupiedBySelf = (pos, selfIndex) => playerPawns.some((p, i) => i !== selfIndex && p.position === pos);

    let allPossibleMoves = playerPawns.map((pawn, index) => {
        if ((pawn.state === 'home' && roll !== 6) || pawn.state === 'finished') return null;
        const { pos: dest } = calculateDestination(pawn, roll);
        if (dest === -1 || isOccupiedBySelf(dest, index)) return null;
        return { ...pawn, index };
    }).filter(Boolean);

    const pawnOnStart = allPossibleMoves.find(p => p.position === startCell);
    const pawnFromHome = allPossibleMoves.find(p => p.state === 'home');
    const startCellOccupiedByOwn = playerPawns.some(p => p.position === startCell);

    if (pawnOnStart) {
        return [pawnOnStart];
    }
    if (roll === 6 && pawnFromHome && !startCellOccupiedByOwn) {
        return [pawnFromHome];
    }
    
    return allPossibleMoves.filter(p => !(roll === 6 && p.state === 'home' && startCellOccupiedByOwn));
};

  const performCapture = async (newPawns, landingPosition, attackerColor, attackerIndex) => {
    for (const defenderColor of activePlayers) {
        if (defenderColor !== attackerColor) {
            for (let defenderIndex = 0; defenderIndex < newPawns[defenderColor].length; defenderIndex++) {
                const defenderPawn = newPawns[defenderColor][defenderIndex];
                if (defenderPawn.position === landingPosition && defenderPawn.state === 'path') {
                    if (IMMUNITY_FIELDS.includes(landingPosition)) {
                        triggerCaptureAnimation(attackerColor, attackerIndex);
                        await new Promise(res => setTimeout(res, 500));
                        newPawns[attackerColor][attackerIndex] = { position: START_POSITIONS[attackerColor][attackerIndex], state: 'home' };
                        setMessage(`🛡️ ${playerConfig.find(p=>p.color===defenderColor).name} war immun! ${currentPlayerName} wurde geschlagen!`);
                        return newPawns;
                    }
                    triggerCaptureAnimation(defenderColor, defenderIndex);
                    await new Promise(res => setTimeout(res, 500));
                    newPawns[defenderColor][defenderIndex] = { position: START_POSITIONS[defenderColor][defenderIndex], state: 'home' };
                    setMessage(`${currentPlayerName} hat einen Stein von ${playerConfig.find(p=>p.color===defenderColor).name} geschlagen!`);
                    return newPawns;
                }
            }
        }
    }
    return newPawns;
  };

  const movePawnBySteps = async (player, pawnIndex, steps) => {
    setIsAnimating(true);
    let tempPawns = JSON.parse(JSON.stringify(pawns));
    let pawnToMove = tempPawns[player][pawnIndex];
    
    if (pawnToMove.state !== 'path') {
        setMessage("Figur im Haus/Ziel kann nicht durch Ereignis bewegt werden.");
        setIsAnimating(false);
        setTimeout(nextPlayer, 1500);
        return;
    }

    const currentPathIndex = PATH.indexOf(pawnToMove.position);
    const stepsFromStart = (currentPathIndex - PATH_START_INDEX[player] + 40) % 40;
    let newStepsFromStart = stepsFromStart + steps;
    
    if (steps < 0 && newStepsFromStart < 0) {
        newStepsFromStart = 0; 
    }
    
    const newPathIndex = (PATH_START_INDEX[player] + newStepsFromStart) % 40;
    const finalPosition = PATH[newPathIndex];
    pawnToMove.position = finalPosition;
    
    tempPawns = await performCapture(tempPawns, finalPosition, player, pawnIndex);

    setPawns(tempPawns);
    setIsAnimating(false);
    setTimeout(nextPlayer, 1000);
  };

  const handleEventEffect = async (event) => {
      setShowEventModal(false);
      const { player, index } = eventPawn;
      switch(event.effect) {
          case 'fly': await movePawnBySteps(player, index, 5); break;
          case 'police': await movePawnBySteps(player, index, -3); break;
          case 'chaos': setGameState('awaitingChaosRoll'); setMessage(`${currentPlayerName}, würfle für den Chaos-Effekt!`); setDiceValue(0); break;
          case 'swap':
              const swappablePawnsExist = activePlayers.some(pColor => pawns[pColor].some((pawn, pIndex) => (pColor !== player || pIndex !== index) && (pawn.state === 'path' || pawn.state === 'finish')));
              if (swappablePawnsExist) {
                  setGameState('awaitingSwap');
                  setMessage(`${currentPlayerName}, wähle eine Figur zum Tauschen!`);
              } else {
                  setMessage("Kein Tausch möglich, da keine anderen Figuren auf dem Feld sind!");
                  setTimeout(nextPlayer, 2000);
              }
              break;
          default: nextPlayer();
      }
  };
  
  const handleQuizAnswer = async (isCorrect) => {
      setShowQuizModal(false);
      setCurrentQuestion(null);
      const { player, index } = eventPawn;
      const steps = isCorrect ? 4 : -2;
      await movePawnBySteps(player, index, steps);
  };

    const handleTicTacToeFinish = async (result) => {
        setShowTicTacToeModal(false);
        const { player, index } = eventPawn;
        let steps = 0;
        if (result === 'win') steps = 5;
        else if (result === 'loss') steps = -5;
        else if (result === 'draw') steps = 2;
        await movePawnBySteps(player, index, steps);
    };

    const handleShellGameFinish = async (won) => {
        setShowShellGameModal(false);
        const { player, index } = eventPawn;
        const steps = won ? 3 : -3;
        await movePawnBySteps(player, index, steps);
    };

    const handleMemoryGameFinish = async (isCorrect) => {
        setShowMemoryGameModal(false);
        const { player, index } = eventPawn;
        const steps = isCorrect ? 4 : -2;
        await movePawnBySteps(player, index, steps);
    };

  const handleSwap = (targetPlayer, targetIndex) => {
      if (gameState !== 'awaitingSwap') return;
      const sourcePawn = pawns[eventPawn.player][eventPawn.index];
      const targetPawn = pawns[targetPlayer][targetIndex];
      if (sourcePawn.position === targetPawn.position) return;
      setIsAnimating(true);
      let newPawns = JSON.parse(JSON.stringify(pawns));
      newPawns[eventPawn.player][eventPawn.index] = { position: targetPawn.position, state: targetPawn.state };
      newPawns[targetPlayer][targetIndex] = { position: sourcePawn.position, state: sourcePawn.state };
      setPawns(newPawns);
      setTimeout(() => { setIsAnimating(false); setGameState('normal'); nextPlayer(); }, 500);
  };

  const animateAndMovePawn = async (player, pawnIndex, roll) => {
    if (player !== currentPlayerColor || isRolling || winner || isAnimating) return;
    if (gameState === 'chaosMovePending') {
        if (pawnIndex !== eventPawn.index) { setMessage("Du musst die Figur bewegen, die das Ereignis ausgelöst hat."); return; }
        const direction = roll % 2 === 0 ? 1 : -1;
        await movePawnBySteps(player, pawnIndex, roll * direction);
        setGameState('normal');
        return;
    }
    if (diceValue === 0) return;
    const movablePawns = getMovablePawns(player, roll);
    if (!movablePawns.some(p => p.index === pawnIndex)) return setMessage("Dieser Spielstein kann nicht bewegt werden.");
    
    setIsAnimating(true);
    setMessage('');
    const pawnToMove = pawns[player][pawnIndex];
    let pathOfAnimation = [], finalState = { ...pawnToMove };
    if (pawnToMove.state === 'home' && roll === 6) {
        pathOfAnimation.push(PATH_START_CELL[player]);
        finalState = { position: PATH_START_CELL[player], state: 'path' };
    } else if (pawnToMove.state === 'path') {
        const currentPathIndex = PATH.indexOf(pawnToMove.position);
        const stepsFromStart = (currentPathIndex - PATH_START_INDEX[player] + 40) % 40;
        for (let i = 1; i <= roll; i++) {
            const nextSteps = stepsFromStart + i;
            if (nextSteps >= 40) {
                const stepsIntoFinish = nextSteps - 40;
                if (stepsIntoFinish < FINISH_LINE_CELLS[player].length) pathOfAnimation.push(FINISH_LINE_CELLS[player][stepsIntoFinish]);
            } else pathOfAnimation.push(PATH[(PATH_START_INDEX[player] + nextSteps) % 40]);
        }
        finalState = { position: pathOfAnimation.length > 0 ? pathOfAnimation.at(-1) : pawnToMove.position, state: pathOfAnimation.some(p => FINISH_LINE_CELLS[player].includes(p)) ? 'finish' : 'path' };
    } else if (pawnToMove.state === 'finish') {
        const currentFinishIndex = FINISH_LINE_CELLS[player].indexOf(pawnToMove.position);
        for(let i = 1; i <= roll; i++) {
            if (currentFinishIndex + i < FINISH_LINE_CELLS[player].length) {
                pathOfAnimation.push(FINISH_LINE_CELLS[player][currentFinishIndex + i]);
            }
        }
        finalState = { position: pathOfAnimation.length > 0 ? pathOfAnimation.at(-1) : pawnToMove.position, state: 'finish' };
    }

    for (const pos of pathOfAnimation) {
        setPawns(prev => ({ ...prev, [player]: prev[player].map((p, i) => i === pawnIndex ? { ...p, position: pos } : p) }));
        await new Promise(res => setTimeout(res, 200));
    }
    let finalPawns = JSON.parse(JSON.stringify(pawns));
    finalPawns[player][pawnIndex] = finalState;
    if (finalState.state === 'path') { finalPawns = await performCapture(finalPawns, finalState.position, player, pawnIndex); }
    setPawns(finalPawns);
    setIsAnimating(false);
    
    if (finalPawns[player].every(p => p.state === 'finish')) { 
        setWinner(player); 
        return setMessage(`🎉 ${currentPlayerName} hat gewonnen! 🎉`); 
    }
    
    setEventPawn({ player, index: pawnIndex });
    if (EVENT_FIELDS.includes(finalState.position)) { setShowEventModal(true); return; }
    if (QUIZ_FIELDS.includes(finalState.position)) { 
        let availableIndices = QUIZ_QUESTIONS.map((_, i) => i).filter(i => !usedQuestionIndices.has(i));
        if (availableIndices.length === 0) {
            setUsedQuestionIndices(new Set());
            availableIndices = QUIZ_QUESTIONS.map((_, i) => i);
        }
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        setUsedQuestionIndices(prev => new Set(prev).add(randomIndex));
        setCurrentQuestion(QUIZ_QUESTIONS[randomIndex]);
        setShowQuizModal(true); 
        return; 
    }
    if (TICTACTOE_FIELDS.includes(finalState.position)) { setShowTicTacToeModal(true); return; }
    if (SHELLGAME_FIELDS.includes(finalState.position)) { setShowShellGameModal(true); return; }
    if (MEMORYGAME_FIELDS.includes(finalState.position)) { setShowMemoryGameModal(true); return; }
    
    if (roll !== 6) nextPlayer();
    else { setMessage("6 gewürfelt! Würfle nochmal."); setDiceValue(0); setRollAttempts(0); }
  };
  
  const boardCells = [];
  for (let i = 0; i < 121; i++) {
    let type = 'empty', color = '', children = null;
    if (PATH.includes(i)) type = 'path';
    if (Object.values(START_POSITIONS).flat().includes(i)) type = 'start_area';
    if (Object.values(FINISH_LINE_CELLS).flat().includes(i)) type = 'finish';
    COLORS.forEach(c => {
      if (START_POSITIONS[c].includes(i)) color = c;
      if (FINISH_LINE_CELLS[c].includes(i)) color = c;
      if (PATH_START_CELL[c] === i) { type = 'start_cell'; color = c; }
    });
    let pawnsOnCell = [];
    for (const pColor of activePlayers) {
      if(pawns[pColor]) {
        pawns[pColor].forEach((pawn, pawnIndex) => {
          if (pawn.position === i) {
            pawnsOnCell.push({pColor, pawn, pawnIndex});
          }
        });
      }
    }
    if (pawnsOnCell.length > 0) {
        children = pawnsOnCell.map(({pColor, pawn, pawnIndex}) => {
            const isMovable = getMovablePawns(pColor, diceValue).some(mp => mp.index === pawnIndex);
            const isSelectableForSwap = gameState === 'awaitingSwap' && pColor !== currentPlayerColor && (pawn.state === 'path' || pawn.state === 'finish');
            const animState = animatedPawn && animatedPawn.player === pColor && animatedPawn.index === pawnIndex ? animatedPawn.state : null;
            const pawnOnClick = () => gameState === 'awaitingSwap' ? (isSelectableForSwap && handleSwap(pColor, pawnIndex)) : animateAndMovePawn(pColor, pawnIndex, diceValue);
            return (
              <div key={`${pColor}-${pawnIndex}`} className="absolute w-[110%] h-[130%] -bottom-[10%] left-1/2 -translate-x-1/2 cursor-pointer z-20" onClick={pawnOnClick}>
                <Pawn color={pColor} isHighlighted={pColor === currentPlayerColor && isMovable && !isAnimating} animationState={animState} isSelectable={isSelectableForSwap} />
              </div>
            );
        });
    }
    boardCells.push(<Cell key={i} type={type} color={color} isEvent={EVENT_FIELDS.includes(i)} isQuiz={QUIZ_FIELDS.includes(i)} isTicTacToe={TICTACTOE_FIELDS.includes(i)} isShellGame={SHELLGAME_FIELDS.includes(i)} isMemoryGame={MEMORYGAME_FIELDS.includes(i)} isImmunity={IMMUNITY_FIELDS.includes(i)}>{children}</Cell>);
  }

  return (
    <div className="p-2 md:p-4 flex flex-col items-center justify-center w-full min-h-screen bg-gray-100">
      {showEventModal && <EventSlotMachine onFinish={handleEventEffect} />}
      {showQuizModal && currentQuestion && <QuizModal question={currentQuestion} onAnswer={handleQuizAnswer} />}
      {showTicTacToeModal && <TicTacToeModal onFinish={handleTicTacToeFinish} />}
      {showShellGameModal && <ShellGameModal onFinish={handleShellGameFinish} />}
      {showMemoryGameModal && <MemoryGameModal onFinish={handleMemoryGameFinish} />}
      {winner && <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"><div className="bg-white p-8 rounded-2xl shadow-2xl text-center"><p className="text-3xl font-bold mb-6">{message}</p><button onClick={onBack} className="bg-blue-500 text-white px-8 py-3 rounded-full text-lg">Neues Spiel</button></div></div>}
      
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 lg:gap-8">
        <div className="w-full lg:w-auto flex-shrink-0 flex items-center justify-center">
             <div className="grid grid-cols-11 gap-px md:gap-1 bg-gray-400 p-2 md:p-3 rounded-2xl shadow-lg aspect-square w-full max-w-lg lg:max-w-[70vh] lg:max-h-[90vh]">
                {boardCells}
             </div>
        </div>
        <div className="flex flex-col items-center gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg w-full max-w-xs lg:w-64 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-700">Am Zug:</h2>
          <div className="flex items-center gap-4 p-3 rounded-full" style={{backgroundColor: `${currentPlayerColor}33`}}>
            <div className="w-8 h-8 rounded-full" style={{backgroundColor: currentPlayerColor}}></div>
            <span className="text-2xl font-bold truncate" style={{color: currentPlayerColor}}>{currentPlayerName}</span>
          </div>
          <Dice value={diceValue || '?'} onRoll={handleRollDice} isRolling={isRolling} canRoll={canRoll} />
          <p className="text-md text-gray-600 h-10 text-center px-2">{message}</p>
          <button onClick={onBack} className="mt-4 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"><LucideArrowLeft size={18} />Zurück zum Setup</button>
        </div>
      </div>
    </div>
  );
};

const GameSetup = ({ onStartGame }) => {
    const [playerCount, setPlayerCount] = useState(2);
    const [players, setPlayers] = useState([{ name: 'Spieler 1', color: 'red' }, { name: 'Spieler 2', color: 'green' }]);
    useEffect(() => setPlayers(Array.from({ length: playerCount }, (_, i) => ({ name: `Spieler ${i + 1}`, color: COLORS[i] }))), [playerCount]);
    const handleNameChange = (index, newName) => { const updatedPlayers = [...players]; updatedPlayers[index].name = newName; setPlayers(updatedPlayers); };
    return (
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <LucideUsers className="mx-auto text-blue-500 mb-4" size={48} />
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Spiel einrichten</h2>
            <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-700 mb-2">Anzahl der Spieler</label>
                <div className="flex justify-center gap-4">{[2, 3, 4].map(count => (<button key={count} onClick={() => setPlayerCount(count)} className={`w-16 h-16 rounded-full text-2xl font-bold transition-all ${playerCount === count ? 'bg-blue-500 text-white scale-110 shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{count}</button>))}</div>
            </div>
            <div className="space-y-4 mb-8">{players.map((player, index) => (<div key={player.color} className="flex items-center gap-4"><div className="w-8 h-8 rounded-full" style={{backgroundColor: player.color}}></div><input type="text" value={player.name} onChange={(e) => handleNameChange(index, e.target.value)} className="flex-grow p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/></div>))}</div>
            <button onClick={() => onStartGame(players)} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-xl flex items-center justify-center gap-3 transition-transform transform hover:scale-105"><LucidePlay />Spiel starten</button>
        </div>
    );
};

const App = () => {
  const [gameState, setGameState] = useState('setup'); // 'setup', 'playing'
  const [players, setPlayers] = useState([]);
  const handleStartGame = (playerConfig) => { setPlayers(playerConfig); setGameState('playing'); };
  const handleBackToSetup = () => { setGameState('setup'); setPlayers([]); }
  const renderContent = () => {
    switch(gameState) {
        case 'playing': return <LudoGame onBack={handleBackToSetup} players={players} />;
        case 'setup': default: return <GameSetup onStartGame={handleStartGame} />;
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen w-full flex items-center justify-center font-sans p-4">
      <style>{`
        .animate-slot-machine { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: translateY(0); } to { transform: translateY(-50%); } }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; } 
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
      `}</style>
      {renderContent()}
    </div>
  );
};

// ENDE DER DATEI: src/App.jsx
export default App;

