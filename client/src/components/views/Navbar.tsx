"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();

  if (loading) return <div className="text-center mb-5">Loading...</div>;

  return (
    <nav className="w-full bg-white border-b-4 border-[var(--color-border)] px-5 md:px-[40px] py-4 flex justify-between items-center shadow-[0_4px_0_var(--color-border)] sticky top-0 z-50">
      <div 
        className="font-heading text-[18px] md:text-[24px] text-[var(--color-primary)] drop-shadow-[2px_2px_0px_var(--color-border)] cursor-pointer"
        onClick={() => router.push("/")}
      >
        Retro Vocab
      </div>
      
      <div className="flex items-center gap-2.5">
        {isAuthenticated ? (
          <>
            <span className="font-bold text-[14px]">
              Welcome, <span className="text-[#4ecdc4]">{user?.username}</span>
            </span>
            <Button
              variant="danger"
              size="small"
              className="!mb-0 !ml-2"
              onClick={logout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="secondary"
              size="small"
              className="!mb-0"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
            <Button
              variant="primary"
              size="small"
              className="!mb-0"
              onClick={() => router.push("/register")}
            >
              Register
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
