import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import SessionProviderWrapper from "./components/SessionProviderWrapper";
import { mainFont } from "./lib/fonts";

export const metadata: Metadata = {
    title: "Phantom Hackers - VisionFC",
    description: "Whackwinnerz' Warwick hackathon project",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={`${mainFont.className} bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col`}>
                <SessionProviderWrapper>
                    <Navbar />
                    <main>{children}</main>
                </SessionProviderWrapper>
            </body>
        </html>
    );
}
