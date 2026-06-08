import type { Metadata } from "next";
import { Press_Start_2P, Space_Mono } from "next/font/google";
import "./globals.css";
import { VocabProvider } from "@/context/VocabContext";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Retro Vocab Practice",
  description: "A retro-themed vocabulary practice game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pressStart2P.variable} ${spaceMono.variable} font-body bg-[#f4ecd8] text-[#2d2a2e] m-0 p-5 flex justify-center items-start min-h-screen`}
      >
        <VocabProvider>
          <div className="w-full max-w-[600px] bg-white border-4 border-[var(--color-border)] shadow-[8px_8px_0px_var(--color-border)] p-[30px] flex flex-col mt-[40px] mb-[40px]">
            <header className="text-center mb-[30px] border-b-4 border-[var(--color-border)] pb-[20px]">
              <h1 className="font-heading text-[24px] uppercase leading-[1.4] text-[var(--color-primary)] drop-shadow-[3px_3px_0px_var(--color-border)] m-0">
                Retro Vocab
              </h1>
            </header>
            {children}
          </div>
        </VocabProvider>
      </body>
    </html>
  );
}
