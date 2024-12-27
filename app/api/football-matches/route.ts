import clientPromise from "@/app/lib/mongodb";
import { MongoClient } from "mongodb";
const client = new MongoClient(process.env.MONGODB_URI || "");

export async function DELETE() {
    try {
        const client = await clientPromise;
        const db = client.db("coventryCityDB");
        const result = await db.collection("football_matches").deleteMany({});

        return Response.json({ message: "All documents deleted", deletedCount: result.deletedCount });
    } catch (error: unknown) {
        let errorMessage = "An unknown error occurred";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return Response.json({ message: errorMessage }, { status: 500 });
    }
}

export async function GET() {
    try {
        const matches = await getMatches();
        return Response.json(matches);
    } catch (error: unknown) {
        let errorMessage = "An unknown error occurred";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return Response.json({ message: errorMessage }, { status: 500 });
    }
}

export async function getMatches() {
    try {
        await client.connect();
        const db = client.db("coventryCityDB");
        const collection = db.collection("football_matches");

        const matches = await collection.find({}).toArray();
        return matches.map((match) => ({
            id: match._id.toString(),
            homeTeam: match.team || "Unknown Team",
            awayTeam: match.opposition_team || "Unknown Opposition",
            score: `${match.goals_scored || "0"} - ${match.goals_conceded || "0"}`,
            date: match.date || "Unknown Date",
            metrics: {
                shotsOnTarget: parseInt(match.shots_on_target || "0", 10),
                possession: match.possession ? `${match.possession}%` : "Unknown",
                fouls: parseInt(match.fouls || "0", 10),
            },
        }));
    } finally {
        await client.close();
    }
}
