import { MatchData } from "../types/MatchData";

export const fetchMatchById = async (id: string): Promise<MatchData> => {
    const response = await fetch(`/api/football-matches/${id}`);
    if (!response.ok) throw new Error("Failed to fetch match data");
    return await response.json();
};

export async function calculateSeasonAverageMetrics(season: string) {
    const response = await fetch(`/api/football-matches/season/${season}`);
    if (!response.ok) throw new Error("Failed to fetch season metrics");
    return await response.json();
}
