import { NextResponse } from "next/server";
import { hashPassword } from "@/app/api/auth/bcrypt";
import clientPromise from "@/app/lib/mongodb";

export async function POST(req: Request) {
    try {
        const { email, newPassword } = await req.json();

        if (!email || !newPassword) {
            return NextResponse.json({ error: "Email and new password are required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("coventryCityDB");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const hashedPassword = await hashPassword(newPassword);

        await usersCollection.updateOne({ email }, { $set: { password: hashedPassword } });

        return NextResponse.json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error during password reset:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
