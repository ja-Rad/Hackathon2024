import { MatchData } from "@/app/types/matchData";
import { DetailedMetrics, KpiMetrics } from "../../../types/metrics";

export async function fetchMatchData(id: string): Promise<MatchData> {
    const response = await fetch(`/api/football-matches?id=${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch match data");
    }
    return response.json();
}

export async function fetchSeasonMetrics(season: string): Promise<{ kpiMetrics: KpiMetrics; detailedMetrics: DetailedMetrics }> {
    const response = await fetch(`/api/football-matches?season=${season}`);
    if (!response.ok) {
        throw new Error("Failed to fetch season metrics");
    }
    const data = await response.json();

    // Explicitly validate or transform the response to match the expected structure
    const detailedMetrics: DetailedMetrics = {
        goals_scored: data.detailedMetrics.goals_scored,
        np_xg: data.detailedMetrics.np_xg,
        shots_on_target: data.detailedMetrics.shots_on_target,
        completed_passes_into_the_box: data.detailedMetrics.completed_passes_into_the_box,
        xg_within_8_seconds_of_corner: data.detailedMetrics.xg_within_8_seconds_of_corner,
        goals_conceded: data.detailedMetrics.goals_conceded,
        np_xg_conceded: data.detailedMetrics.np_xg_conceded,
        tackles: data.detailedMetrics.tackles,
        pressure_regains: data.detailedMetrics.pressure_regains,
        opposition_shots: data.detailedMetrics.opposition_shots,
        possession: data.detailedMetrics.possession,
        passes: data.detailedMetrics.passes,
        final_third_possession: data.detailedMetrics.final_third_possession,
        ppda: data.detailedMetrics.ppda,
        hsr: data.detailedMetrics.hsr,
    };

    return {
        kpiMetrics: data.kpiMetrics,
        detailedMetrics,
    };
}
