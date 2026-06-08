"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export function RegisterView() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user);
        router.push("/");
      } else {
        setError(data.error ? `${data.message}: ${data.error}` : (data.message || "Registration failed"));
      }
    } catch (err) {
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-[15px]">
      <h2 className="font-heading text-[16px] text-center mb-5">Create Account</h2>
      
      <form onSubmit={handleRegister} className="flex flex-col gap-[15px]">
        <div className="flex flex-col gap-2 mb-2.5">
          <label className="font-bold text-[14px]">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="off"
            className="font-body text-[16px] p-3 border-4 border-[var(--color-border)] outline-none bg-[#fafafa] focus:bg-white focus:border-[var(--color-primary)] w-full"
          />
        </div>
        <div className="flex flex-col gap-2 mb-2.5">
          <label className="font-bold text-[14px]">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="font-body text-[16px] p-3 border-4 border-[var(--color-border)] outline-none bg-[#fafafa] focus:bg-white focus:border-[var(--color-primary)] w-full"
          />
        </div>

        {error && <div className="text-[var(--color-danger)] font-bold text-center">{error}</div>}

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
      
      <div className="text-center mt-4">
        <p>Already have an account?</p>
        <Button variant="secondary" onClick={() => router.push("/login")}>
          Login Here
        </Button>
      </div>
    </section>
  );
}
