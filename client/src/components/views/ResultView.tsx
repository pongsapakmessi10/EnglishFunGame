"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useVocab } from "@/context/VocabContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function ResultView() {
  const router = useRouter();
  const {
    isTestMode,
    testScore,
    totalQuestions,
    wrongWords,
    startPracticeMode,
    newVocabList,
    setNewVocabList,
    addWordsToBank,
  } = useVocab();

  const [savingStatus, setSavingStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveToBank = async () => {
    setSavingStatus("Fetching definitions from API... Please wait.");
    setIsSaving(true);

    const updatedList = [...newVocabList];

    for (let wordObj of updatedList) {
      try {
        const res = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
            wordObj.eng
          )}`
        );
        if (res.ok) {
          const data = await res.json();
          const entry = data[0];
          const meaning = entry.meanings[0];
          const def = meaning?.definitions[0];

          wordObj.ipa = "";
          if (entry.phonetics && entry.phonetics.length > 0) {
            const ph = entry.phonetics.find((p: any) => p.text);
            if (ph) wordObj.ipa = ph.text;
          }

          wordObj.pos = meaning?.partOfSpeech || "";
          wordObj.enDefinition = def?.definition || "";
          wordObj.example = def?.example || "";

          let syns: string[] = [];
          entry.meanings.forEach((m: any) => {
            if (m.synonyms) syns = syns.concat(m.synonyms);
          });
          wordObj.synonyms = [...new Set(syns)].slice(0, 5).join(", ");

          if (wordObj.example) {
            try {
              const exRes = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
                  wordObj.example
                )}&langpair=en|th`
              );
              const exData = await exRes.json();
              if (exData?.responseData?.translatedText) {
                wordObj.exThai = exData.responseData.translatedText;
              }
            } catch (err) {}
          }
        }
      } catch (e) {
        console.error("API fetch failed for " + wordObj.eng, e);
      }

      if (!wordObj.ipa) wordObj.ipa = "";
      if (!wordObj.pos) wordObj.pos = "";
      if (!wordObj.enDefinition) wordObj.enDefinition = "";
      if (!wordObj.thaiDef) wordObj.thaiDef = "";
      if (!wordObj.synonyms) wordObj.synonyms = "";
      if (!wordObj.example) wordObj.example = "";
      if (!wordObj.exThai) wordObj.exThai = "";
      if (!wordObj.tenses) wordObj.tenses = "-";
      if (!wordObj.wordFamily) wordObj.wordFamily = "-";
      if (!wordObj.affixes) wordObj.affixes = "-";
    }

    addWordsToBank(updatedList);
    setNewVocabList([]);
    setSavingStatus("");
    setIsSaving(false);
    router.push("/");
  };

  return (
    <section className="flex flex-col gap-[15px]">
      <h2 className="font-heading text-[16px] text-center mb-5">Results</h2>
      
      <Card>
        {isTestMode ? (
          <>
            <h3 className="text-[20px] font-bold mb-[10px]">Test Complete!</h3>
            <p>
              Your Score: {testScore} / {totalQuestions}
            </p>
            {wrongWords.length > 0 ? (
              <p className="text-[var(--color-danger)] font-bold">
                You missed {wrongWords.length} words.
              </p>
            ) : (
              <p className="text-[var(--color-success)] font-bold">Perfect Score!</p>
            )}
          </>
        ) : (
          <>
            <h3 className="text-[20px] font-bold mb-[10px]">Practice Complete!</h3>
            <p>You have practiced all the words in this set.</p>
            {wrongWords.length > 0 && (
              <p className="text-[var(--color-danger)] font-bold">
                You made mistakes on {wrongWords.length} words.
              </p>
            )}
          </>
        )}
      </Card>

      <div className="min-h-[20px] text-[14px] font-bold text-center text-[var(--color-primary)]">
        {savingStatus}
      </div>

      {!isTestMode && wrongWords.length === 0 && (
        <Button variant="primary" onClick={handleSaveToBank} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save to Bank & Menu"}
        </Button>
      )}

      {wrongWords.length > 0 && (
        <Button
          variant="warning"
          onClick={() => {
            startPracticeMode(wrongWords, false);
            router.push("/practice");
          }}
        >
          {isTestMode
            ? `Practice ${wrongWords.length} Wrong Words`
            : `Retry ${wrongWords.length} Mistakes First`}
        </Button>
      )}

      {(isTestMode || wrongWords.length > 0) && (
        <Button variant="secondary" onClick={() => router.push("/")}>
          Back to Menu
        </Button>
      )}
    </section>
  );
}
