"use client";

import { useState, useEffect } from "react";
import { SpiderChart } from "@/app/components/SpiderChart";
import { MatchData } from "@/app/types/MatchData";

export default function InsightsPage({ params }: { params: Promise<{ id: string }> }) {
    const [matchMetrics, setMatchMetrics] = useState<{
        offensive: { [key: string]: number };
        defensive: { [key: string]: number };
        general: { [key: string]: number };
    } | null>(null);

    const [seasonMetrics, setSeasonMetrics] = useState<{
        offensive: { [key: string]: number };
        defensive: { [key: string]: number };
        general: { [key: string]: number };
    } | null>(null);

    const [kpiMetrics, setKpiMetrics] = useState<{
        offensive: number;
        defensive: number;
        general: number;
    } | null>(null);

    useEffect(() => {
        async function fetchMetrics() {
            try {
                const { id } = await params; // Await the params Promise

                // Fetch match data
                const matchResponse = await fetch(`/api/football-matches?id=${id}`);
                const matchData: MatchData = await matchResponse.json();

                setMatchMetrics({
                    offensive: {
                        goals_scored: parseFloat(matchData.goals_scored),
                        np_xg: parseFloat(matchData.np_xg),
                        shots_on_target: parseFloat(matchData.shots_on_target),
                        completed_passes_into_the_box: parseFloat(matchData.completed_passes_into_the_box),
                        xg_within_8_seconds_of_corner: parseFloat(matchData.xg_within_8_seconds_of_corner),
                    },
                    defensive: {
                        goals_conceded: parseFloat(matchData.goals_conceded),
                        np_xg_conceded: parseFloat(matchData.np_xg_conceded),
                        tackles: parseFloat(matchData.tackles),
                        pressure_regains: parseFloat(matchData.pressure_regains),
                        opposition_shots: parseFloat(matchData.opposition_shots),
                    },
                    general: {
                        possession: parseFloat(matchData.possession),
                        passes: parseFloat(matchData.passes || "0"),
                        final_third_possession: parseFloat(matchData.final_third_possession),
                        ppda: parseFloat(matchData.ppda),
                        HSR: parseFloat(matchData.hsr || "0"),
                    },
                });

                // Determine the season from the match date
                const [, monthStr, yearStr] = matchData.date.split("/");
                const month = Number(monthStr);
                const year = Number(yearStr);
                const season = `${month >= 8 ? year : year - 1}/${month >= 8 ? year + 1 : year}`;

                // Fetch season metrics
                const seasonResponse = await fetch(`/api/football-matches?season=${season}`);
                const { kpiMetrics, detailedMetrics } = await seasonResponse.json();

                setSeasonMetrics({
                    offensive: {
                        goals_scored: detailedMetrics.goals_scored,
                        np_xg: detailedMetrics.np_xg,
                        shots_on_target: detailedMetrics.shots_on_target,
                        completed_passes_into_the_box: detailedMetrics.completed_passes_into_the_box,
                        xg_within_8_seconds_of_corner: detailedMetrics.xg_within_8_seconds_of_corner,
                    },
                    defensive: {
                        goals_conceded: detailedMetrics.goals_conceded,
                        np_xg_conceded: detailedMetrics.np_xg_conceded,
                        tackles: detailedMetrics.tackles,
                        pressure_regains: detailedMetrics.pressure_regains,
                        opposition_shots: detailedMetrics.opposition_shots,
                    },
                    general: {
                        possession: detailedMetrics.possession,
                        passes: detailedMetrics.passes,
                        final_third_possession: detailedMetrics.final_third_possession,
                        ppda: detailedMetrics.ppda,
                        HSR: detailedMetrics.hsr,
                    },
                });

                setKpiMetrics({
                    offensive: kpiMetrics.offensiveCPI,
                    defensive: kpiMetrics.defensiveCPI,
                    general: kpiMetrics.generalCPI,
                });
            } catch (error) {
                console.error("Error fetching metrics:", error);
            }
        }

        fetchMetrics();
    }, [params]);

    if (!matchMetrics || !seasonMetrics || !kpiMetrics) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Season Insights</h1>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <h4>Offensive KPI: {kpiMetrics.offensive.toFixed(2)}</h4>
                    <SpiderChart title="Offensive Performance" metrics={matchMetrics.offensive} seasonMetrics={seasonMetrics.offensive} />
                </div>
                <div>
                    <h4>Defensive KPI: {kpiMetrics.defensive.toFixed(2)}</h4>
                    <SpiderChart title="Defensive Performance" metrics={matchMetrics.defensive} seasonMetrics={seasonMetrics.defensive} />
                </div>
                <div>
                    <h4>General KPI: {kpiMetrics.general.toFixed(2)}</h4>
                    <SpiderChart title="General Performance" metrics={matchMetrics.general} seasonMetrics={seasonMetrics.general} />
                </div>
            </div>
        </div>
    );
}
