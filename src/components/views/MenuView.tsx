"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useVocab } from "@/context/VocabContext";
import { Button } from "@/components/ui/Button";

export function MenuView() {
  const { vocabBank, startPracticeMode } = useVocab();
  const router = useRouter();

  return (
    <section className="flex flex-col gap-[15px]">
      <Button variant="primary" onClick={() => router.push("/add")}>
        Add New Vocab
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          if (vocabBank.length === 0) {
            alert("Vocab bank is empty! Please add some words first.");
            return;
          }
          startPracticeMode(vocabBank, true);
          router.push("/practice");
        }}
      >
        Vocab Bank Test
      </Button>
      <Button
        variant="success"
        onClick={() => {
          if (vocabBank.length === 0) {
            alert("Vocab bank is empty! Add words first.");
            return;
          }
          router.push("/typing");
        }}
      >
        Typing Speed Test
      </Button>
      <Button variant="warning" onClick={() => router.push("/dict")}>
        My Personal Dictionary
      </Button>
      <div className="text-center mt-5 font-bold text-[14px]">
        Words in Bank: {vocabBank.length}
      </div>
    </section>
  );
}
