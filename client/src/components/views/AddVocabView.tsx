"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useVocab } from "@/context/VocabContext";
import { Button } from "@/components/ui/Button";

export function AddVocabView() {
  const { newVocabList, setNewVocabList, startPracticeMode } = useVocab();
  const router = useRouter();
  const [eng, setEng] = useState("");
  const [thai, setThai] = useState("");
  const [status, setStatus] = useState({ msg: "", color: "" });

  const handleEngBlur = async () => {
    const trimmedEng = eng.trim();
    if (!trimmedEng || thai.trim() !== "") return;

    setStatus({ msg: "Translating...", color: "var(--color-border)" });

    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          trimmedEng
        )}&langpair=en|th`
      );
      const data = await res.json();
      if (data?.responseData?.translatedText) {
        setThai(data.responseData.translatedText);
        setStatus({ msg: "", color: "" });
      }
    } catch (err) {
      setStatus({ msg: "", color: "" });
    }
  };

  const handleAddWord = () => {
    const trimmedEng = eng.trim();
    const trimmedThai = thai.trim();

    if (!trimmedEng || !trimmedThai) {
      setStatus({ msg: "Please fill in both fields.", color: "var(--color-danger)" });
      return;
    }

    setNewVocabList((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random().toString().slice(2, 6),
        eng: trimmedEng,
        thai: trimmedThai,
      },
    ]);
    setEng("");
    setThai("");
    document.getElementById("input-eng")?.focus();

    setStatus({ msg: `Added: ${trimmedEng} = ${trimmedThai}`, color: "#2e8b57" });
  };

  return (
    <section className="flex flex-col gap-[15px]">
      <h2 className="font-heading text-[16px] text-center mb-5">Add Vocabulary</h2>
      
      <div className="flex flex-col gap-2 mb-2.5">
        <label className="font-bold text-[14px]">English Word:</label>
        <input
          id="input-eng"
          type="text"
          value={eng}
          onChange={(e) => setEng(e.target.value)}
          onBlur={handleEngBlur}
          placeholder="e.g. Apple"
          autoComplete="off"
          className="font-body text-[16px] p-3 border-4 border-[var(--color-border)] outline-none bg-[#fafafa] focus:bg-white focus:border-[var(--color-primary)] w-full"
        />
      </div>

      <div className="flex flex-col gap-2 mb-2.5">
        <label className="font-bold text-[14px]">Thai Meaning:</label>
        <input
          type="text"
          value={thai}
          onChange={(e) => setThai(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddWord();
          }}
          placeholder="e.g. แอปเปิ้ล"
          autoComplete="off"
          className="font-body text-[16px] p-3 border-4 border-[var(--color-border)] outline-none bg-[#fafafa] focus:bg-white focus:border-[var(--color-primary)] w-full"
        />
      </div>

      <Button variant="primary" onClick={handleAddWord}>
        Add Word
      </Button>

      <div
        className="min-h-[20px] text-[14px] font-bold text-center"
        style={{ color: status.color }}
      >
        {status.msg}
      </div>

      <hr className="border-none border-t-4 border-dashed border-[var(--color-border)] w-full my-5" />

      <div className="text-[14px] text-[#555] text-center mb-2.5 font-bold">
        Words added this session: {newVocabList.length}
      </div>

      {newVocabList.length > 0 && (
        <Button
          variant="success"
          onClick={() => {
            startPracticeMode(newVocabList, false);
            router.push("/practice");
          }}
        >
          Finish & Go Practice
        </Button>
      )}

      <Button
        variant="danger"
        onClick={() => {
          if (newVocabList.length > 0) {
            if (
              confirm("You have unsaved words. Go back anyway? They will be lost.")
            ) {
              setNewVocabList([]);
              router.push("/");
            }
          } else {
            router.push("/");
          }
        }}
      >
        Back to Menu
      </Button>
    </section>
  );
}
