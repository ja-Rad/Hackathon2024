import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/app/lib/mongodb";
import { verifyPassword } from "@/app/utils/bcrypt";

export const authOptions: AuthOptions = {
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
                if (!credentials?.email || !credentials.password) {
                    throw new Error("Email and password are required");
                }

                const { db } = await connectToDatabase();
                const user = await db.collection("users").findOne({ email: credentials.email });

                if (!user) {
                    throw new Error("No user found");
                }

                const isPasswordValid = await verifyPassword(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id; // Add `id` to the token
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                id: token.id as string, // Use the `id` from the token
                email: token.email as string,
            };
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
