"use client";

import React, { useState, useEffect } from "react";
import { useVocab, Word } from "@/context/VocabContext";
import { Button } from "@/components/ui/Button";

interface EditModalProps {
  word: Word | null;
  onClose: () => void;
}

export function EditModal({ word, onClose }: EditModalProps) {
  const { updateWord } = useVocab();

  const [formData, setFormData] = useState<Partial<Word>>({});

  useEffect(() => {
    if (word) {
      setFormData({ ...word });
    }
  }, [word]);

  if (!word) return null;

  const handleChange = (field: keyof Word, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateWord(word.id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[rgba(0,0,0,0.6)] flex items-center justify-center p-5 overflow-auto">
      <div className="bg-[var(--color-bg)] w-[90%] max-w-[800px] border-4 border-[var(--color-border)] shadow-[8px_8px_0px_var(--color-border)] p-5 max-h-[90vh] overflow-y-auto m-auto">
        <h2 className="font-heading text-[16px] text-center mb-5">Edit Word Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] text-left">
          {/* Basic Info */}
          <div>
            <div className="flex flex-col gap-2 mb-2.5">
              <label className="font-bold text-[14px]">English:</label>
              <input
                type="text"
                value={formData.eng || ""}
                onChange={(e) => handleChange("eng", e.target.value)}
                autoComplete="off"
                className="font-body text-[16px] p-3 border-4 border-[var(--color-border)] outline-none bg-[#fafafa] focus:bg-white focus:border-[var(--color-primary)] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 mb-2.5">
              <label className="font-bold text-[14px]">Thai Meaning:</label>
              <input
                type="text"
                value={formData.thai || ""}
                onChange={(e) => handleChange("thai", e.target.value)}
                autoComplete="off"
                className="font-body text-[16px] p-3 border-4 border-[var(--color-border)] outline-none bg-[#fafafa] focus:bg-white focus:border-[var(--color-primary)] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 mb-2.5">
              <label className="font-bold text-[14px]">IPA Pronunciation:</label>
              <input
                type="text"
                value={formData.ipa || ""}
                onChange={(e) => handleChange("ipa", e.target.value)}
                placeholder="e.g., /həˈloʊ/"
                autoComplete="off"
                className="font-body text-[16px] p-3 border-4 border-[var(--color-border)] outline-none bg-[#fafafa] focus:bg-white focus:border-[var(--color-primary)] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 mb-2.5">
              <label className="font-bold text-[14px]">Part of Speech:</label>
              <input
                type="text"
                value={formData.pos || ""}
                onChange={(e) => handleChange("pos", e.target.value)}
                placeholder="e.g., n., v., adj."
                autoComplete="off"
                className="font-body text-[16px] p-3 border-4 border-[var(--color-border)] outline-none bg-[#fafafa] focus:bg-white focus:border-[var(--color-primary)] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 mb-2.5">
              <label className="font-bold text-[14px]">Synonyms:</label>
              <input
                type="text"
                value={formData.synonyms || ""}
                onChange={(e) => handleChange("synonyms", e.target.value)}
                autoComplete="off"
                className="font-body text-[16px] p-3 border-4 border-[var(--color-border)] outline-none bg-[#fafafa] focus:bg-white focus:border-[var(--color-primary)] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 mb-2.5">
              <label className="font-bold text-[14px]">Tenses (V1, V2, V3):</label>
              <input
                type="text"
                value={formData.tenses || ""}
                onChange={(e) => handleChange("tenses", e.target.value)}
                placeholder="-"
                autoComplete="off"
                className="font-body text-[16px] p-3 border-4 border-[var(--color-border)] outline-none bg-[#fafafa] focus:bg-white focus:border-[var(--color-primary)] w-full"
              />
            </div>
          </div>

          {/* Advanced Info */}
          <div>
            <div className="flex flex-col gap-2 mb-2.5">
              <label className="font-bold text-[14px]">English Definition:</label>
              <textarea
                rows={2}
                value={formData.enDefinition || ""}
                onChange={(e) => handleChange("enDefinition", e.target.value)}
                className="font-body text-[16px] p-3 border-4 border-[var(--color-border)] outline-none bg-[#fafafa] focus:bg-white focus:border-[var(--color-primary)] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 mb-2.5">
              <label className="font-bold text-[14px]">Thai Definition:</label>
              <textarea
                rows={2}
                value={formData.thaiDef || ""}
                onChange={(e) => handleChange("thaiDef", e.target.value)}
                className="font-body text-[16px] p-3 border-4 border-[var(--color-border)] outline-none bg-[#fafafa] focus:bg-white focus:border-[var(--color-primary)] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 mb-2.5">
              <label className="font-bold text-[14px]">English Example:</label>
              <textarea
                rows={2}
                value={formData.example || ""}
                onChange={(e) => handleChange("example", e.target.value)}
                className="font-body text-[16px] p-3 border-4 border-[var(--color-border)] outline-none bg-[#fafafa] focus:bg-white focus:border-[var(--color-primary)] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 mb-2.5">
              <label className="font-bold text-[14px]">Thai Example:</label>
              <textarea
                rows={2}
                value={formData.exThai || ""}
                onChange={(e) => handleChange("exThai", e.target.value)}
                className="font-body text-[16px] p-3 border-4 border-[var(--color-border)] outline-none bg-[#fafafa] focus:bg-white focus:border-[var(--color-primary)] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 mb-2.5">
              <label className="font-bold text-[14px]">Word Family:</label>
              <input
                type="text"
                value={formData.wordFamily || ""}
                onChange={(e) => handleChange("wordFamily", e.target.value)}
                placeholder="-"
                autoComplete="off"
                className="font-body text-[16px] p-3 border-4 border-[var(--color-border)] outline-none bg-[#fafafa] focus:bg-white focus:border-[var(--color-primary)] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 mb-2.5">
              <label className="font-bold text-[14px]">Prefix / Suffix:</label>
              <input
                type="text"
                value={formData.affixes || ""}
                onChange={(e) => handleChange("affixes", e.target.value)}
                placeholder="-"
                autoComplete="off"
                className="font-body text-[16px] p-3 border-4 border-[var(--color-border)] outline-none bg-[#fafafa] focus:bg-white focus:border-[var(--color-primary)] w-full"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-2.5">
          <Button variant="primary" onClick={handleSave} className="flex-1">
            Save Changes
          </Button>
          <Button variant="danger" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
