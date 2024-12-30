"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <Link href="/" className="text-gray-800 dark:text-white text-lg font-semibold">
                            Vision FC
                        </Link>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center space-x-4">
                        {/* Link to Document Uploader */}
                        <Link href="/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all">
                            Login
                        </Link>
                        <Link href="/document-uploader" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all">
                            CSV Upload
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
