import NextAuth from "next-auth";
import { authOptions } from "@/app/lib/auth";

export const GET = NextAuth(authOptions); // Handle GET requests
export const POST = NextAuth(authOptions); // Handle POST requests
