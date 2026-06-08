"use client";

import { useState } from "react";
import { DictView } from "@/components/views/DictView";
import { EditModal } from "@/components/modals/EditModal";
import { Word } from "@/context/VocabContext";

export default function DictPage() {
  const [editingWord, setEditingWord] = useState<Word | null>(null);

  return (
    <>
      <DictView onEdit={(word) => setEditingWord(word)} />
      <EditModal word={editingWord} onClose={() => setEditingWord(null)} />
    </>
  );
}
