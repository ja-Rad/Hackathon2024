import { calculateAverageMetrics } from "../../utils/metrics";
import { sortMatchesByDateDescending } from "../../utils/sortMatches";
import { Match } from "../../types/match";

export const fetchMatchesData = async (setMatches: React.Dispatch<React.SetStateAction<Match[]>>, setAverageMetrics: React.Dispatch<React.SetStateAction<Match["metrics"] | null>>, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
        const response = await fetch("/api/football-matches");
        const data: Match[] = await response.json();

        const sortedData = sortMatchesByDateDescending(data);
        const last10Matches = sortedData.slice(0, 10);
        const avgMetrics = calculateAverageMetrics(last10Matches);
        setAverageMetrics(avgMetrics);

        setMatches(sortedData);
    } catch (error) {
        console.error("Error fetching matches:", error);
    } finally {
        setIsLoading(false);
    }
};
