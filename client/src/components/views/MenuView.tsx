"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVocab } from "@/context/VocabContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export function MenuView() {
  const { vocabBank, startPracticeMode } = useVocab();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  useEffect(() => {
    if (searchParams.get("error") === "unauthorized") {
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
      router.replace("/"); // remove query param
    }
  }, [searchParams, router]);

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
          router.push("/typing");
        }}
      >
        Typing Speed Test
      </Button>
      <Button variant="warning" onClick={() => router.push("/dict")}>
        My Personal Dictionary
      </Button>
      <div className="text-center mt-5 font-bold text-[14px]">
        {isAuthenticated ? `Words in Bank: ${vocabBank.length}` : "Log in to see your vocabulary"}
      </div>

      {showErrorPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
          <div className="bg-[var(--color-danger)] text-white border-4 border-white shadow-[8px_8px_0px_#000] p-5 font-heading text-[18px] uppercase animate-rgb-glow pointer-events-auto">
            กรุณา Login ก่อน!
          </div>
        </div>
      )}
    </section>
  );
}
