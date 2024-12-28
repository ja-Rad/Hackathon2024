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
            index: match.id,
            homeTeam: match.team || "Unknown Team",
            awayTeam: match.opposition_team || "Unknown Opposition",
            score: `${match.goals_scored || "0"} - ${match.goals_conceded || "0"}`,
            date: match.date || "Unknown Date",
            metrics: {
                shotsOnTarget: parseInt(match.shots_on_target || "0", 10),
                possession: match.possession ? `${match.possession}%` : "Unknown",
                fouls: parseInt(match.fouls || "0", 10),
                yellowCards: parseInt(match.yellow_cards || "0", 10),
                completedPassesIntoTheBox: parseInt(match.completed_passes_into_the_box || "0", 10),
                pressures: parseInt(match.pressures || "0", 10),
                xG: match.np_xg || "0.0",
                xGConceded: match.np_xg_conceded || "0.0",
                tackles: parseInt(match.tackles || "0", 10),
                passes: parseInt(match.passes || "0", 10),
                oppositionPasses: parseInt(match.opposition_passes || "0", 10),
                xGWithin8SecondsOfCorner: match.xg_within_8_seconds_of_corner || "0.0",
                shotsWithin8SecondsOfCorner: parseInt(match.shots_within_8_seconds_of_corner || "0", 10),
                goalsWithin8SecondsOfCorner: parseInt(match.goals_within_8_seconds_of_corner || "0", 10),
                decelerations: parseInt(match.Decelerations || "0", 10),
                accelerations: parseInt(match.Accelerations || "0", 10),
                hsr: parseFloat(match.HSR || "0"),
                sprints: parseFloat(match.Sprint || "0"),
                jumps: parseInt(match.Jumps || "0", 10),
                xGWithin8SecondsOfFreeKick: match.xg_within_8_seconds_of_indirect_free_kick || "0.0",
                shotsWithin8SecondsOfFreeKick: parseInt(match.shots_within_8_seconds_of_indirect_free_kick || "0", 10),
                goalsWithin8SecondsOfFreeKick: parseInt(match.goals_within_8_seconds_of_indirect_free_kick || "0", 10),
                pressuresRegained: parseInt(match.pressure_regains || "0", 10),
                monteCarloWinProb: match.monte_carlo_win_prob || "0.0",
                monteCarloDrawProb: match.monte_carlo_draw_prob || "0.0",
                monteCarloLossProb: match.monte_carlo_loss_prob || "0.0",
            },
        }));
    } finally {
        await client.close();
    }
}
