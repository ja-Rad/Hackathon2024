"use client";

import React, { useState } from "react";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false); // For loading animation in modal
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

    const handleRedirectToLogin = () => {
        setIsRedirecting(true);
        setTimeout(() => {
            window.location.href = "/login"; // Redirect to login after animation
        }, 1000); // Adjust delay as needed
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-white text-lg">Resetting Password...</p>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Password Reset Successful</h2>
                    {isRedirecting ? (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-700 dark:text-gray-300">Redirecting to login...</p>
                        </div>
                    ) : (
                        <button onClick={handleRedirectToLogin} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Go to Login
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <form className="p-6 bg-white dark:bg-gray-800 shadow-md rounded" onSubmit={handleResetPassword}>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Reset Password</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">Confirm New Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required />
                </div>

                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600" disabled={isLoading}>
                    {isLoading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
}
