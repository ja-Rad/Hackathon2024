/*
    Route to test the connection to DB: 
    http://localhost:3000/api/test-mongo-connection
*/

import clientPromise from "@/app/lib/mongodb";
import { CollectionInfo } from "mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("coventryCityDB");

        // Fetch list of collections
        const collections: CollectionInfo[] = await db.listCollections().toArray();

        // Fetch all documents from the "football_matches" collection
        const footballMatches = await db.collection("football_matches").find({}).toArray();

        return Response.json({
            message: "Connected to MongoDB",
            collections: collections.map((collection) => collection.name),
            footballMatches, // Include all documents from the collection
        });
    } catch (error: unknown) {
        let errorMessage = "An unknown error occurred";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return Response.json({ message: "Error connecting to MongoDB", error: errorMessage }, { status: 500 });
    }
}
