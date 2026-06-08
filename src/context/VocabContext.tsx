"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Word {
  id: string;
  eng: string;
  thai: string;
  ipa?: string;
  pos?: string;
  enDefinition?: string;
  thaiDef?: string;
  synonyms?: string;
  example?: string;
  exThai?: string;
  tenses?: string;
  wordFamily?: string;
  affixes?: string;
}

export interface PracticeWord extends Word {
  step: number; // 0: Ask English, 1: Ask Thai
}

interface VocabContextProps {
  vocabBank: Word[];
  addWordsToBank: (words: Word[]) => void;
  updateWord: (id: string, updatedWord: Partial<Word>) => void;
  deleteWord: (id: string) => void;

  newVocabList: Word[];
  setNewVocabList: React.Dispatch<React.SetStateAction<Word[]>>;

  // Practice & Test State
  isTestMode: boolean;
  practiceQueue: PracticeWord[];
  setPracticeQueue: React.Dispatch<React.SetStateAction<PracticeWord[]>>;
  testScore: number;
  setTestScore: React.Dispatch<React.SetStateAction<number>>;
  wrongWords: Word[];
  setWrongWords: React.Dispatch<React.SetStateAction<Word[]>>;
  totalQuestions: number;
  setTotalQuestions: React.Dispatch<React.SetStateAction<number>>;

  startPracticeMode: (wordList: Word[], isTest: boolean) => void;
  playAudio: (text: string) => void;
}

const VocabContext = createContext<VocabContextProps | undefined>(undefined);

export function VocabProvider({ children }: { children: React.ReactNode }) {
  const [vocabBank, setVocabBank] = useState<Word[]>([]);
  const [newVocabList, setNewVocabList] = useState<Word[]>([]);
  
  // Practice state
  const [isTestMode, setIsTestMode] = useState(false);
  const [practiceQueue, setPracticeQueue] = useState<PracticeWord[]>([]);
  const [testScore, setTestScore] = useState(0);
  const [wrongWords, setWrongWords] = useState<Word[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("retroVocabBank");
    if (saved) {
      try {
        setVocabBank(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse vocab bank", e);
      }
    }
  }, []);

  // Save to LocalStorage whenever vocabBank changes
  useEffect(() => {
    localStorage.setItem("retroVocabBank", JSON.stringify(vocabBank));
  }, [vocabBank]);

  const addWordsToBank = (words: Word[]) => {
    setVocabBank((prev) => [...prev, ...words]);
  };

  const updateWord = (id: string, updatedWord: Partial<Word>) => {
    setVocabBank((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updatedWord } : w))
    );
  };

  const deleteWord = (id: string) => {
    setVocabBank((prev) => prev.filter((w) => w.id !== id));
  };

  const startPracticeMode = (wordList: Word[], isTest: boolean) => {
    if (wordList.length === 0) return;

    setIsTestMode(isTest);
    setTestScore(0);
    setWrongWords([]);

    let listToUse = [...wordList];
    if (isTest) {
      listToUse.sort(() => 0.5 - Math.random());
      listToUse = listToUse.slice(0, 10);
    }

    const queue: PracticeWord[] = listToUse.map((word) => ({
      ...word,
      step: Math.random() > 0.5 ? 0 : 1,
    }));

    setPracticeQueue(queue);
    setTotalQuestions(queue.length);
  };

  const playAudio = (text: string) => {
    if (!text || typeof window === "undefined") return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <VocabContext.Provider
      value={{
        vocabBank,
        addWordsToBank,
        updateWord,
        deleteWord,
        newVocabList,
        setNewVocabList,
        isTestMode,
        practiceQueue,
        setPracticeQueue,
        testScore,
        setTestScore,
        wrongWords,
        setWrongWords,
        totalQuestions,
        setTotalQuestions,
        startPracticeMode,
        playAudio,
      }}
    >
      {children}
    </VocabContext.Provider>
  );
}

export const useVocab = () => {
  const context = useContext(VocabContext);
  if (!context) throw new Error("useVocab must be used within VocabProvider");
  return context;
};
