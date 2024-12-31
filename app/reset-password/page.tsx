"use client";

import React, { useState } from "react";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Password reset failed");
            }

            setIsSuccess(true);
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background-dark">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-dotted rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-text-light text-lg">Resetting Password...</p>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="flex items-center justify-center h-screen bg-background-dark">
                <div className="p-6 bg-background-card shadow-md rounded text-center">
                    <h2 className="text-lg font-bold text-text-light mb-4">Password Reset Successful</h2>
                    <a href="/login" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-all">
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen bg-background-dark">
            <form className="p-6 bg-background-card shadow-md rounded w-full max-w-md" onSubmit={handleResetPassword}>
                <h2 className="text-2xl font-bold mb-4 text-text-light">Reset Password</h2>

                {error && <p className="text-error text-sm mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block text-text-muted">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded bg-background-input text-text-light border-border-muted" required />
                </div>

                <div className="mb-4">
                    <label className="block text-text-muted">New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 border rounded bg-background-input text-text-light border-border-muted" required />
                </div>

                <div className="mb-4">
                    <label className="block text-text-muted">Confirm New Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 border rounded bg-background-input text-text-light border-border-muted" required />
                </div>

                <button type="submit" className="w-full p-2 bg-primary text-white rounded hover:bg-primary-hover transition-all">
                    Reset Password
                </button>
            </form>
        </div>
    );
}
