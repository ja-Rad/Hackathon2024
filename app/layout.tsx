import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SessionProviderWrapper from "./components/SessionProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "VisionFC",
    description: "VisionFC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col`}>
                <SessionProviderWrapper>
                    <Navbar />
                    <main>{children}</main>
                    <Footer />
                </SessionProviderWrapper>
            </body>
        </html>
    );
}
