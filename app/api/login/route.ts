import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import bcrypt from "bcrypt";
import { encode } from "next-auth/jwt"; // Import NextAuth's encode function

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const { db } = await connectToDatabase();
        const user = await db.collection("users").findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        if (!process.env.NEXTAUTH_SECRET) {
            throw new Error("NEXTAUTH_SECRET is not set in environment variables.");
        }

        // Use NextAuth's encode function to create a compatible JWT
        const token = await encode({
            token: { id: user._id.toString(), email: user.email },
            secret: process.env.NEXTAUTH_SECRET,
            maxAge: 30 * 60, // 30 minutes
        });

        const response = NextResponse.json({ message: "Login successful" });

        // Set the token as the same cookie NextAuth uses
        response.cookies.set("next-auth.session-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 60,
        });

        return response;
    } catch (error) {
        console.error("Error in /api/login:", error);
        return NextResponse.json({ error: "Something went wrong. Please try again later." }, { status: 500 });
    }
}
