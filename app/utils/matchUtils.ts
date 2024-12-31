import { Match } from "../types/match";

export function determineOutcome(match: Match): string {
    const [homeScore, awayScore] = match.score.split(" - ").map(Number);
    if (homeScore > awayScore) return "Won";
    if (homeScore < awayScore) return "Lost";
    return "Draw";
}
