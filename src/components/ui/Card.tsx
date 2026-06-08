import React from "react";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-4 border-dashed border-[var(--color-border)] p-5 text-center bg-[#fffdf5] mb-[15px] ${className}`}
    >
      {children}
    </div>
  );
}
