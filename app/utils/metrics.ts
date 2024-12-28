import { Match } from "../types/match";
import { MatchData } from "../types/MatchData";

export const metricDescriptions = {
    shotsOnTarget: "Number of shots on target during the match.",
    possession: "Percentage of possession held by the team.",
    fouls: "Total number of fouls committed by the team.",
    yellowCards: "Total number of yellow cards received.",
    completedPassesIntoTheBox: "Number of completed passes into the opposition's penalty area.",
    pressures: "Total number of pressures applied to the opposition.",
    xG: "Expected goals scored during the match.",
    xGConceded: "Expected goals conceded during the match.",
    tackles: "Number of tackles made during the match.",
    passes: "Total number of passes completed by the team.",
    oppositionPasses: "Total number of passes completed by the opposition.",
    xGWithin8SecondsOfCorner: "Expected goals within 8 seconds of a corner kick.",
    shotsWithin8SecondsOfCorner: "Shots taken within 8 seconds of a corner kick.",
    goalsWithin8SecondsOfCorner: "Goals scored within 8 seconds of a corner kick.",
    decelerations: "Number of decelerations performed by the team.",
    accelerations: "Number of accelerations performed by the team.",
    hsr: "High-speed runs measured in meters.",
    sprints: "Number of sprints performed by the team.",
    jumps: "Number of jumps performed by the team.",
    xGWithin8SecondsOfFreeKick: "Expected goals within 8 seconds of an indirect free kick.",
    shotsWithin8SecondsOfFreeKick: "Shots taken within 8 seconds of an indirect free kick.",
    goalsWithin8SecondsOfFreeKick: "Goals scored within 8 seconds of an indirect free kick.",
    pressuresRegained: "Number of pressures regained during the match.",
    monteCarloWinProb: "Monte Carlo simulation probability of winning.",
    monteCarloDrawProb: "Monte Carlo simulation probability of drawing.",
    monteCarloLossProb: "Monte Carlo simulation probability of losing.",
};

export const calculateAverageMetrics = <T extends Record<string, number | string>>(matches: { metrics: T }[]): T => {
    if (matches.length === 0) return {} as T;

    const keys = Object.keys(matches[0].metrics) as (keyof T)[];
    const averages = {} as Record<keyof T, number>;

    keys.forEach((key) => {
        const sum = matches.reduce((acc, match) => acc + (parseFloat(match.metrics[key] as string) || 0), 0);
        averages[key] = parseFloat((sum / matches.length).toFixed(2));
    });

    return averages as T; // Ensure type compatibility
};

export const calculateMatchMetrics = (matchData: MatchData) => {
    const offensiveCPI = 3 * parseFloat(matchData.goals_scored || "0") + 2 * parseFloat(matchData.np_xg || "0") + 1.5 * parseFloat(matchData.shots_on_target || "0") + 1.2 * parseFloat(matchData.completed_passes_into_the_box || "0") + 1 * parseFloat(matchData.xg_within_8_seconds_of_corner || "0");

    const defensiveCPI = -2 * parseFloat(matchData.goals_conceded || "0") - 1.5 * parseFloat(matchData.np_xg_conceded || "0") + 1.2 * parseFloat(matchData.tackles || "0") + 1.2 * parseFloat(matchData.pressure_regains || "0") - 1 * parseFloat(matchData.opposition_shots || "0");

    const generalCPI = 2 * parseFloat(matchData.goals_scored || "0") + 1.5 * parseFloat(matchData.np_xg || "0") - 1.5 * parseFloat(matchData.goals_conceded || "0") - 1.2 * parseFloat(matchData.np_xg_conceded || "0") + 0.8 * parseFloat(matchData.possession || "0") + 0.5 * parseFloat(matchData.ppda || "0") + 1 * parseFloat(matchData.final_third_possession || "0");

    return {
        offensive: offensiveCPI,
        defensive: defensiveCPI,
        general: generalCPI,
    };
};

export const calculateDetailedMetrics = (matchData: MatchData) => {
    return {
        offensive: {
            goals_scored: parseFloat(matchData.goals_scored || "0"),
            np_xg: parseFloat(matchData.np_xg || "0"),
            shots_on_target: parseFloat(matchData.shots_on_target || "0"),
            completed_passes_into_the_box: parseFloat(matchData.completed_passes_into_the_box || "0"),
            xg_within_8_seconds_of_corner: parseFloat(matchData.xg_within_8_seconds_of_corner || "0"),
        },
        defensive: {
            goals_conceded: parseFloat(matchData.goals_conceded || "0"),
            np_xg_conceded: parseFloat(matchData.np_xg_conceded || "0"),
            tackles: parseFloat(matchData.tackles || "0"),
            pressure_regains: parseFloat(matchData.pressure_regains || "0"),
            opposition_shots: parseFloat(matchData.opposition_shots || "0"),
        },
        general: {
            goals_scored: parseFloat(matchData.goals_scored || "0"),
            possession: parseFloat(matchData.possession || "0"),
            ppda: parseFloat(matchData.ppda || "0"),
            final_third_possession: parseFloat(matchData.final_third_possession || "0"),
            completed_passes_into_the_box: parseFloat(matchData.completed_passes_into_the_box || "0"),
        },
    };
};

// Function to calculate CPI
export const calculateCPI = (match: Match): number | "N/A" => {
    const metrics = match.metrics || {};

    const goalsScored = parseFloat((metrics["goals_scored"] as string) || "0");
    const goalsConceded = parseFloat((metrics["goals_conceded"] as string) || "0");
    const np_xg = parseFloat((metrics["np_xg"] as string) || "0");
    const np_xg_conceded = parseFloat((metrics["np_xg_conceded"] as string) || "0");
    const possession = parseFloat((metrics["possession"] as string) || "0");
    const hsr = parseFloat((metrics["hsr"] as string) || "0");

    const cpi = 2 * goalsScored + 1.5 * np_xg - 1.5 * goalsConceded - 1.2 * np_xg_conceded + 0.8 * possession + 0.5 * hsr;

    return isNaN(cpi) ? "N/A" : cpi;
};

// Function to evaluate CPI performance
export const evaluateCPI = (cpi: number): string => {
    if (cpi < 3255) {
        return "Bad";
    } else if (cpi >= 3255 && cpi <= 3855) {
        return "Average";
    } else {
        return "Good";
    }
};
