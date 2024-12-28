import clientPromise from "@/app/lib/mongodb";
import { calculateMatchMetrics } from "@/app/utils/metrics";
import { MongoClient, ObjectId } from "mongodb";

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

export async function GET(request: Request) {
    const url = new URL(request.url);

    // Extract query parameters
    const matchId = url.searchParams.get("id");
    const season = url.searchParams.get("season");

    try {
        if (matchId) {
            return await getMatchById(matchId);
        } else if (season) {
            return await getSeasonAverageMetrics(season);
        } else {
            const matches = await getMatches();
            return Response.json(matches);
        }
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

async function getMatchById(id: string) {
    try {
        const client = await clientPromise;
        const db = client.db("coventryCityDB");
        const match = await db.collection("football_matches").findOne({ _id: new ObjectId(id) });

        if (!match) {
            return new Response(JSON.stringify({ error: "Match not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(match), { status: 200 });
    } catch (error) {
        let errorMessage = "An unknown error occurred";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}

async function getSeasonAverageMetrics(season: string) {
    try {
        const client = await clientPromise;
        const db = client.db("coventryCityDB");

        // Fetch all matches
        const matches = await db.collection("football_matches").find({}).toArray();

        // Filter matches for the given season
        const seasonMatches = matches.filter((match) => {
            const [day, month, year] = match.date?.split("/").map(Number) || [];
            if (!day || !month || !year) {
                console.warn("Invalid date format for match:", match);
                return false; // Skip matches with invalid or missing dates
            }
            const matchYear = month >= 8 ? year : year - 1; // Determine the starting year of the season
            return `${matchYear}/${matchYear + 1}` === season;
        });

        if (!seasonMatches.length) {
            return new Response(JSON.stringify({ error: "No matches found for this season" }), { status: 404 });
        }

        const totalMatches = seasonMatches.length;

        // Accumulate both CPI and detailed metrics
        const totals = seasonMatches.reduce(
            (acc, match) => {
                // Fetch KPIs (CPI metrics)
                const { offensive, defensive, general } = calculateMatchMetrics(match);
                acc.kpiMetrics.offensiveCPI += offensive;
                acc.kpiMetrics.defensiveCPI += defensive;
                acc.kpiMetrics.generalCPI += general;

                // Accumulate detailed metrics
                acc.detailedMetrics.goals_scored += parseFloat(match.goals_scored || "0");
                acc.detailedMetrics.np_xg += parseFloat(match.np_xg || "0");
                acc.detailedMetrics.shots_on_target += parseFloat(match.shots_on_target || "0");
                acc.detailedMetrics.completed_passes_into_the_box += parseFloat(match.completed_passes_into_the_box || "0");
                acc.detailedMetrics.xg_within_8_seconds_of_corner += parseFloat(match.xg_within_8_seconds_of_corner || "0");

                acc.detailedMetrics.goals_conceded += parseFloat(match.goals_conceded || "0");
                acc.detailedMetrics.np_xg_conceded += parseFloat(match.np_xg_conceded || "0");
                acc.detailedMetrics.tackles += parseFloat(match.tackles || "0");
                acc.detailedMetrics.pressure_regains += parseFloat(match.pressure_regains || "0");
                acc.detailedMetrics.opposition_shots += parseFloat(match.opposition_shots || "0");

                acc.detailedMetrics.possession += parseFloat(match.possession || "0");
                acc.detailedMetrics.passes += parseFloat(match.passes || "0");
                acc.detailedMetrics.final_third_possession += parseFloat(match.final_third_possession || "0");
                acc.detailedMetrics.ppda += parseFloat(match.ppda || "0");
                acc.detailedMetrics.hsr += parseFloat(match.hsr || "0");

                return acc;
            },
            {
                kpiMetrics: { offensiveCPI: 0, defensiveCPI: 0, generalCPI: 0 },
                detailedMetrics: {
                    goals_scored: 0,
                    np_xg: 0,
                    shots_on_target: 0,
                    completed_passes_into_the_box: 0,
                    xg_within_8_seconds_of_corner: 0,

                    goals_conceded: 0,
                    np_xg_conceded: 0,
                    tackles: 0,
                    pressure_regains: 0,
                    opposition_shots: 0,

                    possession: 0,
                    passes: 0,
                    final_third_possession: 0,
                    ppda: 0,
                    hsr: 0,
                },
            }
        );

        // Calculate averages for KPI metrics
        (Object.keys(totals.kpiMetrics) as (keyof typeof totals.kpiMetrics)[]).forEach((key) => {
            totals.kpiMetrics[key] /= totalMatches;
        });

        // Calculate averages for detailed metrics
        (Object.keys(totals.detailedMetrics) as (keyof typeof totals.detailedMetrics)[]).forEach((key) => {
            totals.detailedMetrics[key] /= totalMatches;
        });

        return new Response(
            JSON.stringify({
                kpiMetrics: totals.kpiMetrics,
                detailedMetrics: totals.detailedMetrics,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching season average metrics:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
