import { NextResponse } from "next/server";
import { hashPassword } from "@/app/api/auth/bcrypt";
import clientPromise from "@/app/lib/mongodb";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const client = await clientPromise;
        const db = client.db("coventryCityDB");
        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        await usersCollection.insertOne({ email, password: hashedPassword });

        return NextResponse.json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error during signup:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
