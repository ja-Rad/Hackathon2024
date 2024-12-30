"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Login failed");
            }

            router.push("/dashboard"); // Redirect to the dashboard on success
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

    const handleForgotPassword = () => {
        setIsLoading(true);
        router.push("/reset-password");
    };

    const handleSignupRedirect = () => {
        setIsLoading(true);
        router.push("/register");
    };

    // Show a full-page loading animation while performing actions
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-white text-lg">Please wait...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <form className="p-6 bg-white dark:bg-gray-800 shadow-md rounded" onSubmit={handleLogin}>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Login</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required />
                </div>

                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600" disabled={isLoading}>
                    Login
                </button>

                <div className="text-center mt-4">
                    <button type="button" onClick={handleForgotPassword} className="text-blue-500 hover:underline" disabled={isLoading}>
                        Forgot Password?
                    </button>
                </div>

                <div className="text-center mt-4">
                    <p className="text-gray-500 dark:text-gray-400">
                        Don&apos;t have an account?{" "}
                        <button type="button" onClick={handleSignupRedirect} className="text-blue-500 hover:underline" disabled={isLoading}>
                            Sign Up
                        </button>
                    </p>
                </div>
            </form>
        </div>
    );
}
