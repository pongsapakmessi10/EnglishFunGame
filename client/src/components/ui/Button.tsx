"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "danger" | "warning";
  size?: "default" | "small";
  customStyles?: string; // Additional classes
}

export function Button({
  children,
  variant = "default",
  size = "default",
  customStyles = "",
  className,
  ...props
}: ButtonProps) {
  const baseClasses =
    "font-heading border-4 border-[var(--color-border)] cursor-pointer uppercase transition-all duration-100 block text-center disabled:opacity-50 disabled:cursor-not-allowed";

  let sizeClasses = "";
  if (size === "default") {
    sizeClasses =
      "text-[12px] px-5 py-[15px] shadow-[4px_4px_0px_var(--color-border)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] w-full mb-2.5";
  } else if (size === "small") {
    sizeClasses =
      "text-[10px] px-3 py-2 shadow-[2px_2px_0px_var(--color-border)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] w-auto inline-block";
  }

  let variantClasses = "";
  switch (variant) {
    case "primary":
      variantClasses = "bg-[var(--color-primary)] text-white";
      break;
    case "secondary":
      variantClasses = "bg-[var(--color-secondary)] text-[var(--color-border)]";
      break;
    case "success":
      variantClasses = "bg-[var(--color-success)] text-[var(--color-border)]";
      break;
    case "danger":
      variantClasses = "bg-[var(--color-danger)] text-[var(--color-border)]";
      break;
    case "warning":
      variantClasses = "bg-[var(--color-warning)] text-[var(--color-border)]";
      break;
    default:
      variantClasses = "bg-[#eee] text-[var(--color-border)]";
      break;
  }

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${customStyles} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
