import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/app/lib/mongodb";
import bcrypt from "bcrypt";

export const authOptions = {
    session: {
        strategy: "jwt",
        maxAge: 30 * 60, // 30 minutes
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { db } = await connectToDatabase();
                const user = await db.collection("users").findOne({ email: credentials?.email });

                if (!user) {
                    throw new Error("Invalid email or password");
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                if (!isPasswordValid) {
                    throw new Error("Invalid email or password");
                }

                return { id: user._id.toString(), email: user.email };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = { id: token.id, email: token.email };
            return session;
        },
    },
    pages: {
        signIn: "/login", // Redirect here when not authenticated
    },
    secret: process.env.NEXTAUTH_SECRET,
};
