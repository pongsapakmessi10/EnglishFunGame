"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVocab } from "@/context/VocabContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function PracticeView() {
  const router = useRouter();
  const {
    isTestMode,
    practiceQueue,
    setPracticeQueue,
    setTestScore,
    wrongWords,
    setWrongWords,
    totalQuestions,
    playAudio,
  } = useVocab();

  const [inputAnswer, setInputAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackColor, setFeedbackColor] = useState("");
  const [hint, setHint] = useState("");
  const [forceTypingMode, setForceTypingMode] = useState(false);

  const currentWord = practiceQueue[0];
  const currentQuestionIndex = totalQuestions - practiceQueue.length + 1;

  useEffect(() => {
    if (practiceQueue.length === 0 && totalQuestions > 0) {
      router.push("/result");
    } else if (practiceQueue.length === 0 && totalQuestions === 0) {
      // If directly navigated to /practice without starting, redirect back
      router.push("/");
    }
  }, [practiceQueue.length, totalQuestions, router]);

  if (!currentWord) return null;

  const nextQuestion = () => {
    setInputAnswer("");
    setFeedback("");
    setFeedbackColor("");
    setHint("");
    setForceTypingMode(false);
    setPracticeQueue((prev) => prev.slice(1));
    setTimeout(() => {
      document.getElementById("input-answer")?.focus();
    }, 50);
  };

  const checkAnswer = () => {
    const input = inputAnswer.trim();
    if (!input) return;

    let isCorrect = false;
    let correctAnswer = "";

    if (currentWord.step === 0) {
      correctAnswer = currentWord.eng;
      isCorrect = input.toLowerCase() === correctAnswer.toLowerCase();
    } else {
      correctAnswer = currentWord.thai;
      isCorrect = input === correctAnswer;
    }

    if (forceTypingMode) {
      let isForcedCorrect = false;
      if (currentWord.step === 0) {
        isForcedCorrect = input.toLowerCase() === correctAnswer.toLowerCase();
      } else {
        isForcedCorrect = input === correctAnswer;
      }

      if (isForcedCorrect) {
        setFeedback("Good! Keep going.");
        setFeedbackColor("#2e8b57"); // correct
        setTimeout(nextQuestion, 600);
      } else {
        setFeedback("Please type it exactly as shown above.");
        setFeedbackColor("#d11a2a"); // wrong
        setInputAnswer("");
      }
      return;
    }

    if (isCorrect) {
      setFeedback("Correct!");
      setFeedbackColor("#2e8b57");
      if (isTestMode) setTestScore((prev) => prev + 1);
      setTimeout(nextQuestion, 500);
    } else {
      setFeedback("Incorrect!");
      setFeedbackColor("#d11a2a");
      setHint(`Correct Answer: ${correctAnswer}`);
      setInputAnswer("");

      if (!wrongWords.some((w) => w.eng === currentWord.eng)) {
        setWrongWords((prev) => [...prev, currentWord]);
      }
      setForceTypingMode(true);
    }
  };

  const promptText =
    currentWord.step === 0
      ? `Type English for:\n"${currentWord.thai}"`
      : `Type Thai for:\n"${currentWord.eng}"`;

  return (
    <section className="flex flex-col gap-[15px]">
      <h2 className="font-heading text-[16px] text-center mb-5" id="practice-title">
        {isTestMode ? "Bank Test Mode" : "Practice Mode"}
      </h2>
      <div className="text-center text-[12px] font-heading mb-2.5">
        Question: {currentQuestionIndex} / {totalQuestions}
      </div>

      <Card>
        <div className="flex justify-center items-center gap-[10px]">
          <h3 className="text-[20px] mb-0 font-bold whitespace-pre-line">
            {promptText}
          </h3>
          <Button
            variant="secondary"
            size="small"
            className="!w-auto !mb-0 !text-[16px]"
            onClick={() => playAudio(currentWord.eng)}
          >
            🔊
          </Button>
        </div>
        <div className="text-[#d11a2a] font-bold mb-[15px] mt-[10px] text-[18px]">
          {hint}
        </div>
        <input
          id="input-answer"
          type="text"
          value={inputAnswer}
          onChange={(e) => setInputAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") checkAnswer();
          }}
          autoComplete="off"
          className="mt-[10px] font-body text-[16px] p-3 border-4 border-[var(--color-border)] outline-none bg-[#fafafa] focus:bg-white focus:border-[var(--color-primary)] w-full"
        />
        <Button variant="primary" onClick={checkAnswer} className="mt-[10px]">
          Submit
        </Button>
      </Card>

      <div
        className="font-bold min-h-[24px] text-center text-[16px]"
        style={{ color: feedbackColor }}
      >
        {feedback}
      </div>
      
      <Button variant="danger" onClick={() => router.push("/")} className="mt-4">
        Abort Session
      </Button>
    </section>
  );
}
