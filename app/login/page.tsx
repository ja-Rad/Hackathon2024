"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
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
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            // Redirect to the document uploader page on success
            router.push("/document-uploader");
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
                    <p className="mt-4 text-text-light text-lg">Processing your request, please wait...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen bg-background-dark">
            <form className="p-6 bg-background-card shadow-md rounded w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-text-light">Sign In</h2>

                {error && <p className="text-error text-sm mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block text-text-muted">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded bg-background-input text-text-light border-border-muted" required />
                </div>

                <div className="mb-4">
                    <label className="block text-text-muted">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded bg-background-input text-text-light border-border-muted" required />
                </div>

                <button type="submit" onClick={handleLogin} className="w-full p-2 bg-primary text-white rounded hover:bg-primary-hover transition-all">
                    Sign In
                </button>

                <div className="text-center mt-4">
                    <button type="button" onClick={() => router.push("/reset-password")} className="text-primary hover:underline">
                        Forgot Password?
                    </button>
                </div>

                <div className="text-center mt-4">
                    <p className="text-text-muted">
                        Don&apos;t have an account?{" "}
                        <button type="button" onClick={() => router.push("/register")} className="text-primary hover:underline">
                            Sign Up
                        </button>
                    </p>
                </div>
            </form>
        </div>
    );
}
