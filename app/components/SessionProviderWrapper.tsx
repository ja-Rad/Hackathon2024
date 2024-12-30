"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

type Props = {
    children: React.ReactNode;
    initialSession?: Session | null;
};

export default function SessionProviderWrapper({ children, initialSession }: Props) {
    return (
        <SessionProvider
            session={initialSession}
            refetchOnWindowFocus={true} // Synchronize session on focus
        >
            {children}
        </SessionProvider>
    );
}
