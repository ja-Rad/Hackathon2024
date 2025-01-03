"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
    const { data: session, status } = useSession();
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleSignOut = async () => {
        setIsTransitioning(true);
        await signOut();
        setIsTransitioning(false);
    };

    return (
        <nav className="bg-primary text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Image className="unclickable unselectable" src="/images/logo.png" width={32} height={32} alt="VisionFC Logo" />
                        <div className="unselectable text-lg font-semibold">VisionFC</div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center space-x-4 ${isTransitioning || status === "loading" ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                            {!session ? (
                                <>
                                    <Link href="/login" className="px-4 py-2 bg-primary-light hover:bg-primary-hover text-white rounded">
                                        Login
                                    </Link>
                                    <Link href="/register" className="px-4 py-2 bg-primary-light hover:bg-primary-hover text-white rounded">
                                        Signup
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/document-uploader" className="px-4 py-2 bg-primary-light hover:bg-primary-hover text-white rounded">
                                        CSV Upload
                                    </Link>
                                    <Link href="/dashboard" className="px-4 py-2 bg-primary-light hover:bg-primary-hover text-white rounded">
                                        Dashboard
                                    </Link>
                                    <button onClick={handleSignOut} className="px-4 py-2 bg-error text-white rounded">
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                        {(isTransitioning || status === "loading") && <div className="w-6 h-6 border-4 border-primary-light border-dotted rounded-full animate-spin"></div>}
                    </div>
                </div>
            </div>
        </nav>
    );
}
