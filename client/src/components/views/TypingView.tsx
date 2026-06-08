"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useVocab } from "@/context/VocabContext";
import { Button } from "@/components/ui/Button";

export function TypingView() {
  const router = useRouter();
  const { vocabBank } = useVocab();

  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [targetText, setTargetText] = useState("");
  const [definitionQueue, setDefinitionQueue] = useState<string[]>([]);
  const [currentDefIndex, setCurrentDefIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [charStates, setCharStates] = useState<string[]>([]); // "current", "correct", "wrong", ""

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      endTest();
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => {
          const newTime = prev + 1;
          const minutesPassed = newTime / 60;
          let newWpm = 0;
          if (minutesPassed > 0) {
            newWpm = Math.round(correctChars / 5 / minutesPassed);
          }
          setWpm(newWpm);
          return newTime;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, correctChars]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return;

      // prevent scrolling with spacebar
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault(); 
      }

      // If at the end of the current definition, wait for Enter
      if (currentIndex === targetText.length) {
        if (e.key === "Enter") {
          const nextIndex = currentDefIndex + 1;
          if (nextIndex < definitionQueue.length) {
            setCurrentDefIndex(nextIndex);
            const nextDef = definitionQueue[nextIndex].toLowerCase();
            setTargetText(nextDef);
            setCurrentIndex(0);
            const initialStates = new Array(nextDef.length).fill("");
            if (nextDef.length > 0) initialStates[0] = "current";
            setCharStates(initialStates);
          } else {
            endTest();
            const minutesPassed = timeElapsed / 60;
            const finalWpm = minutesPassed > 0 ? Math.round(correctChars / 5 / minutesPassed) : 0;
            setWpm(finalWpm);
            setTimeout(() => alert(`Awesome! You finished all definitions. Your speed is ${finalWpm} WPM.`), 100);
          }
        }
        return;
      }

      if (e.key.length !== 1) return; // ignore shift, ctrl, etc.

      const expectedChar = targetText[currentIndex];

      if (e.key.toLowerCase() === expectedChar.toLowerCase()) {
        setCharStates((prev) => {
          const newStates = [...prev];
          newStates[currentIndex] = "correct";
          if (currentIndex + 1 < targetText.length) {
            newStates[currentIndex + 1] = "current";
          }
          return newStates;
        });
        setCorrectChars((c) => c + 1);
        setCurrentIndex((i) => i + 1);
      } else {
        setCharStates((prev) => {
          const newStates = [...prev];
          newStates[currentIndex] = "wrong";
          return newStates;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, targetText, currentIndex, timeElapsed, correctChars, currentDefIndex, definitionQueue]);

  const startTest = () => {
    let defs = [...vocabBank]
      .filter(w => w.enDefinition && w.enDefinition.trim().length > 0)
      .sort(() => 0.5 - Math.random())
      .slice(0, 10) // Let's do 10 definitions per test to keep it reasonable
      .map(w => w.enDefinition!);

    if (defs.length === 0) {
      alert("No English definitions found in your vocab bank! Please add some words with definitions.");
      return;
    }

    setDefinitionQueue(defs);
    setCurrentDefIndex(0);
    
    const firstDef = defs[0].toLowerCase();
    setTargetText(firstDef);
    setCurrentIndex(0);
    setTimeElapsed(0);
    setCorrectChars(0);
    setWpm(0);

    const initialStates = new Array(firstDef.length).fill("");
    if (firstDef.length > 0) initialStates[0] = "current";
    setCharStates(initialStates);

    setIsActive(true);
  };

  const endTest = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Split target text into words for proper wrapping
  const renderTextDisplay = () => {
    if (!targetText) return "Click Start to begin typing test.";

    const wordElements = [];
    let currentWordChars = [];
    let charGlobalIndex = 0;

    for (let i = 0; i < targetText.length; i++) {
      const char = targetText[i];
      const state = charStates[i];

      let className = "inline-block text-[#555] border-b-4 border-transparent ";
      if (state === "correct") className += "text-[#0ff] drop-shadow-[0_0_8px_#0ff] ";
      if (state === "wrong")
        className += "text-[#ff0055] drop-shadow-[0_0_10px_#ff0055] ";
      if (state === "current")
        className += "text-white border-[#ff00ff] animate-blink-caret-cyber ";

      if (char === " ") {
        currentWordChars.push(
          <span key={charGlobalIndex} className={className} dangerouslySetInnerHTML={{ __html: "&nbsp;" }} />
        );
        wordElements.push(
          <span key={`word-${i}`} className="inline-block whitespace-nowrap">
            {currentWordChars}
          </span>
        );
        currentWordChars = [];
      } else {
        currentWordChars.push(
          <span key={charGlobalIndex} className={className}>
            {char}
          </span>
        );
      }
      charGlobalIndex++;
    }

    if (currentWordChars.length > 0) {
      wordElements.push(
        <span key="word-last" className="inline-block whitespace-nowrap">
          {currentWordChars}
        </span>
      );
    }

    if (currentIndex === targetText.length && targetText.length > 0) {
      wordElements.push(
        <span key="enter-prompt" className="inline-block whitespace-nowrap ml-3 text-[#ff00ff] animate-blink-caret-cyber font-bold">
          [Press Enter]
        </span>
      );
    }

    return wordElements;
  };

  return (
    <section className="flex flex-col gap-[15px] bg-[#0b0c10] text-[#0ff] p-[30px] rounded-[12px] relative overflow-hidden bg-cyberpunk">
      <h2 className="text-[#ff00ff] drop-shadow-[0_0_10px_#ff00ff] font-mono uppercase tracking-[3px] mb-5 text-center text-[16px] font-bold">
        Cyber Typing Speed Test
      </h2>
      
      <div className="flex justify-between mb-[15px] px-[10px]">
        <div className="text-[20px] font-bold text-[#0ff] drop-shadow-[0_0_5px_#0ff]">
          {timeElapsed}s
        </div>
        <div className="text-[20px] font-bold text-[#ff00ff] drop-shadow-[0_0_5px_#ff00ff]">
          {wpm} WPM
        </div>
      </div>

      <div className="bg-[rgba(10,10,10,0.8)] border-2 border-[#0ff] rounded-[8px] p-[20px] shadow-[0_0_10px_#0ff,inset_0_0_10px_#0ff] animate-rgb-glow text-white font-mono text-[24px] text-left leading-[1.6] tracking-[2px] font-bold select-none">
        {renderTextDisplay()}
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        <Button
          onClick={isActive ? endTest : startTest}
          customStyles="!bg-[#0ff] !text-[#000] !shadow-[0_0_10px_#0ff] !font-bold !border-none"
        >
          {isActive ? "Stop Test" : targetText ? "Restart Test" : "Start Typing"}
        </Button>
        <Button
          onClick={() => {
            endTest();
            router.push("/");
          }}
          customStyles="!bg-[#222] !text-[#fff] !border !border-[#555] !shadow-none"
        >
          Back to Menu
        </Button>
      </div>
    </section>
  );
}
