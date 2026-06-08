"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useVocab, Word } from "@/context/VocabContext";
import { Button } from "@/components/ui/Button";

interface DictViewProps {
  onEdit: (word: Word) => void;
}

export function DictView({ onEdit }: DictViewProps) {
  const router = useRouter();
  const { vocabBank, deleteWord, playAudio } = useVocab();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const displayList = [...vocabBank].reverse();

  return (
    <section className="flex flex-col gap-[15px]">
      <h2 className="font-heading text-[16px] text-center mb-5">
        Personal Dictionary
      </h2>
      
      <div className="max-h-[450px] overflow-y-auto mb-5 pr-1.5 dict-list-scroll">
        {displayList.length === 0 ? (
          <p className="text-center">Your dictionary is empty. Add some words first!</p>
        ) : (
          displayList.map((word) => {
            const isExpanded = expandedIds.has(word.id);
            const synArr = word.synonyms
              ? word.synonyms.split(",").map((s) => s.trim()).filter((s) => s)
              : [];

            return (
              <div
                key={word.id}
                className="border-4 border-[var(--color-border)] p-[15px] mb-[15px] bg-[#fffdf5] relative shadow-[4px_4px_0px_var(--color-border)] text-left"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-heading text-[14px] text-[var(--color-primary)] mb-2 uppercase">
                      {word.eng}
                    </div>
                    <div className="font-bold mb-2.5 text-[16px] text-[#4ecdc4]">
                      {word.thai}
                    </div>
                    {synArr.length > 0 && (
                      <div className="text-[12px] mb-2 leading-tight">
                        <strong>Synonyms:</strong>{" "}
                        {synArr.map((s, idx) => (
                          <span
                            key={idx}
                            className="bg-[#eee] px-1.5 py-0.5 border border-[var(--color-border)] rounded mr-1 inline-block mb-1"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-2.5 flex flex-col items-end">
                    {word.ipa && <div className="text-[12px] text-[#555] mb-1">{word.ipa}</div>}
                    {word.pos && <div className="text-[12px] font-bold mb-1">({word.pos})</div>}
                    <Button
                      variant="secondary"
                      size="small"
                      className="mt-1"
                      onClick={() => playAudio(word.eng.replace(/'/g, "\\'"))}
                    >
                      🔊 Listen
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 text-[12px] leading-tight">
                    {word.enDefinition && (
                      <div className="mb-2">
                        <span className="font-bold">EN Def:</span> {word.enDefinition}
                      </div>
                    )}
                    {word.thaiDef && (
                      <div className="mb-2">
                        <span className="font-bold">TH Def:</span> {word.thaiDef}
                      </div>
                    )}
                    {word.example && (
                      <div className="mb-2 italic text-[#555] bg-[#eee] p-1.5 border-l-[3px] border-[var(--color-primary)]">
                        <span className="font-bold not-italic text-[var(--color-border)]">EN Ex:</span> "{word.example}"
                      </div>
                    )}
                    {word.exThai && (
                      <div className="mb-2 italic text-[#555] bg-[#eee] p-1.5 border-l-[3px] border-[var(--color-secondary)]">
                        <span className="font-bold not-italic text-[var(--color-border)]">TH Ex:</span> "{word.exThai}"
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2.5 mt-4 pt-2.5 border-t border-dashed border-[#ccc]">
                      <div>
                        <span className="font-bold">Tenses:</span> {word.tenses || "-"}
                      </div>
                      <div>
                        <span className="font-bold">Family:</span> {word.wordFamily || "-"}
                      </div>
                      <div className="col-span-2">
                        <span className="font-bold">Prefix/Suffix:</span> {word.affixes || "-"}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2.5 mt-4">
                      <Button variant="warning" size="small" onClick={() => onEdit(word)}>
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this word?")) {
                            deleteWord(word.id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => toggleExpand(word.id)}
                  className={`absolute bottom-[-15px] right-[15px] bg-[var(--color-border)] text-white w-[30px] height-[30px] rounded-full text-[12px] flex items-center justify-center cursor-pointer border-2 border-white transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  style={{ width: "30px", height: "30px" }}
                >
                  ▼
                </button>
              </div>
            );
          })
        )}
      </div>

      <Button variant="secondary" onClick={() => router.push("/")}>
        Back to Menu
      </Button>
    </section>
  );
}
