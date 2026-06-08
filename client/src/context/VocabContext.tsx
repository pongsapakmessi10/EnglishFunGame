"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

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
  const { isAuthenticated, token } = useAuth();
  const [vocabBank, setVocabBank] = useState<Word[]>([]);
  const [newVocabList, setNewVocabList] = useState<Word[]>([]);
  
  // Practice state
  const [isTestMode, setIsTestMode] = useState(false);
  const [practiceQueue, setPracticeQueue] = useState<PracticeWord[]>([]);
  const [testScore, setTestScore] = useState(0);
  const [wrongWords, setWrongWords] = useState<Word[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Load from Backend
  useEffect(() => {
    if (isAuthenticated && token) {
      fetch("http://localhost:5000/api/vocab", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setVocabBank(data);
      })
      .catch(console.error);
    } else {
      setVocabBank([]);
    }
  }, [isAuthenticated, token]);

  const addWordsToBank = async (words: Word[]) => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/vocab/bulk", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ words }),
      });
      if (res.ok) {
        const addedWords = await res.json();
        setVocabBank((prev) => [...prev, ...addedWords]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateWord = async (id: string, updatedWord: Partial<Word>) => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/vocab/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(updatedWord),
      });
      if (res.ok) {
        setVocabBank((prev) =>
          prev.map((w) => (w.id === id ? { ...w, ...updatedWord } : w))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteWord = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/vocab/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setVocabBank((prev) => prev.filter((w) => w.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
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
