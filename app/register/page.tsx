"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Signup failed");
            }

            // Redirect to login page on successful signup
            router.push("/login");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Full-page loading animation
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background-dark">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-dotted rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-text-light text-lg">Please wait...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen bg-background-dark">
            <form className="p-6 bg-background-card shadow-md rounded w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-text-light">Sign Up</h2>

                {error && <p className="text-error text-sm mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block text-text-muted">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded bg-background-input input-text-color border-border-muted" required />
                </div>

                <div className="mb-4">
                    <label className="block text-text-muted">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded bg-background-input input-text-color border-border-muted" required />
                </div>

                <div className="mb-4">
                    <label className="block text-text-muted">Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 border rounded bg-background-input input-text-color border-border-muted" required />
                </div>

                <button type="submit" onClick={handleSignup} className="w-full p-2 bg-primary text-white rounded hover:bg-primary-hover transition-all">
                    Sign Up
                </button>

                <div className="text-center mt-4">
                    <p className="text-text-muted">
                        Already have an account?{" "}
                        <button type="button" onClick={() => router.push("/login")} className="text-primary hover:underline">
                            Login
                        </button>
                    </p>
                </div>
            </form>
        </div>
    );
}
