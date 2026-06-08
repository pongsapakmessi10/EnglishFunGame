import type { Metadata } from "next";
import { Press_Start_2P, Space_Mono } from "next/font/google";
import "./globals.css";
import { VocabProvider } from "@/context/VocabContext";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/views/Navbar";

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
        className={`${pressStart2P.variable} ${spaceMono.variable} font-body bg-[#f4ecd8] text-[#2d2a2e] m-0 flex flex-col items-center min-h-screen`}
      >
        <AuthProvider>
          <VocabProvider>
            <Navbar />
            <main className="w-full flex-1 flex justify-center items-center p-5">
              <div className="w-full max-w-[600px] bg-white border-4 border-[var(--color-border)] shadow-[8px_8px_0px_var(--color-border)] p-[30px] flex flex-col h-fit">
                {children}
              </div>
            </main>
          </VocabProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
