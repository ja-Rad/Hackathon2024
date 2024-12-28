"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") ?? "light";
        setTheme(savedTheme);
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark");
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-gray-800 dark:text-white text-lg font-semibold">
                            CSV Uploader
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                            {theme === "dark" ? "Light Mode" : "Dark Mode"}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
