"use client";

import { useState, useEffect } from "react";
import { useMetrics } from "@/app/hooks/useMetrics";
import { ChartSection } from "@/app/components/ChartSection";
import { fetchMatchData, fetchSeasonMetrics } from "@/app/insights/[id]/services/insightsHandlers";
import { mapMatchMetrics, mapSeasonMetrics, mapKpiMetrics } from "@/app/insights/[id]/services/metricsMapper";
import { determineSeason } from "@/app/utils/dateUtils";
import { calculateMatchMetrics } from "@/app/utils/metrics";

export default function InsightsPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
    const { matchMetrics, setMatchMetrics, seasonMetrics, setSeasonMetrics, kpiMetrics, setKpiMetrics } = useMetrics();
    const [matchDetails, setMatchDetails] = useState<{
        enemyTeam: string;
        date: string;
        season: string;
        kpiMatch: { offensive: number; defensive: number; general: number };
    } | null>(null);

    useEffect(() => {
        async function fetchMetrics() {
            try {
                const { id } = await params;

                // Fetch match data and set metrics
                const matchData = await fetchMatchData(id);
                setMatchMetrics(mapMatchMetrics(matchData));

                // Calculate match-specific KPIs
                const kpiMatch = calculateMatchMetrics(matchData);

                // Determine the season
                const season = determineSeason(matchData.date);
                setMatchDetails({
                    enemyTeam: matchData.Opposition,
                    date: matchData.date,
                    season,
                    kpiMatch,
                });

                // Fetch season metrics and set metrics
                const { kpiMetrics, detailedMetrics } = await fetchSeasonMetrics(season);
                setSeasonMetrics(mapSeasonMetrics(detailedMetrics));
                setKpiMetrics(mapKpiMetrics(kpiMetrics));
            } catch (error) {
                console.error("Error fetching metrics:", error);
            }
        }

        fetchMetrics();
    }, [params, setKpiMetrics, setMatchMetrics, setSeasonMetrics]);

    if (!matchMetrics || !seasonMetrics || !kpiMetrics || !matchDetails) {
        return (
            <div className="flex items-center justify-center h-screen bg-background-dark">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-dotted rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-text-light text-lg">Fetching match insights...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-background-dark min-h-screen text-text-light">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    Insights: {matchDetails.enemyTeam} Match on {matchDetails.date} vs {matchDetails.season} Season Average
                </h1>

                <a href="/dashboard" className="bg-primary text-white hover:bg-primary-hover font-semibold py-2 px-4 rounded transition-all">
                    Back to Dashboard
                </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ChartSection title="Offensive CPI" matchKpiValue={matchDetails.kpiMatch.offensive} seasonKpiValue={kpiMetrics.offensive} tooltipText="Focuses on Coventry's attacking performance: Scoring efficiency, chance creation, and attacking efficiency." matchMetrics={matchMetrics.offensive} seasonMetrics={seasonMetrics.offensive} />
                <ChartSection title="Defensive CPI" matchKpiValue={matchDetails.kpiMatch.defensive} seasonKpiValue={kpiMetrics.defensive} tooltipText="Assesses Coventry's defensive stability: Defensive vulnerabilities, proactive actions, and limiting opponent chances." matchMetrics={matchMetrics.defensive} seasonMetrics={seasonMetrics.defensive} />
                <ChartSection title="General CPI" matchKpiValue={matchDetails.kpiMatch.general} seasonKpiValue={kpiMetrics.general} tooltipText="Combines offensive, defensive, and general metrics for an overall evaluation of team performance." matchMetrics={matchMetrics.general} seasonMetrics={seasonMetrics.general} />
            </div>
        </div>
    );
}
