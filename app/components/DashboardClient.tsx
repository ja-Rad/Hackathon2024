"use client";

import { useState, useEffect, useRef } from "react";
import { renderBarChart } from "../utils/barChart";

import * as d3 from "d3";
import { MetricCategory } from "./MetricCategory"; // Updated import
import { calculateAverageMetrics } from "../utils/metrics";

interface Match {
    id: string;
    index: string;
    homeTeam: string;
    awayTeam: string;
    score: string;
    date: string;
    metrics: {
        [key: string]: number | string;
    };
}

export default function DashboardClient() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [averageMetrics, setAverageMetrics] = useState<Match["metrics"] | null>(null);
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null); // Track the selected metric for the bar chart
    const chartRef = useRef<HTMLDivElement | null>(null); // Ref for D3.js chart container
    const metricsRef = useRef<HTMLDivElement | null>(null); // Ref for draggable metric container

    useEffect(() => {
        async function fetchMatches() {
            try {
                const response = await fetch("/api/football-matches");
                const data = await response.json();

                const last10Matches = data.slice(0, 10);
                const avgMetrics = calculateAverageMetrics(last10Matches);
                setAverageMetrics(avgMetrics);

                setMatches(data);
            } catch (error) {
                console.error("Error fetching matches:", error);
            }
        }

        fetchMatches();
    }, []);

    useEffect(() => {
        if (selectedMetric && chartRef.current && selectedMatch === null) {
            const last10Matches = matches.slice(0, 10);
            const data = last10Matches.map((match) => ({
                value: parseFloat(match.metrics[selectedMetric] as string) || 0,
                label: match.date,
            }));

            renderBarChart(chartRef.current, data);
        }
    }, [selectedMetric, selectedMatch, matches]);

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100">
            <div className="w-1/4 bg-gray-800 overflow-y-auto border-r border-gray-700">
                <div
                    className={`p-4 cursor-pointer hover:bg-gray-700 ${selectedMatch === null ? "bg-gray-700" : ""}`}
                    onClick={() => {
                        setSelectedMatch(null);
                    }}
                >
                    <div className="font-bold text-gray-200">Most Recent Matches</div>
                    <div className="text-sm text-gray-400">Averages from the last 10 matches</div>
                </div>
                {matches.map((match) => (
                    <div
                        key={match.id}
                        className={`p-4 cursor-pointer hover:bg-gray-700 ${selectedMatch?.id === match.id ? "bg-gray-700" : ""}`}
                        onClick={() => {
                            setSelectedMatch(match);
                            if (chartRef.current) {
                                d3.select(chartRef.current).selectAll("svg").remove();
                            }
                        }}
                    >
                        <div className="font-bold text-gray-200">
                            {match.homeTeam} vs {match.awayTeam}
                        </div>
                        <div className="text-sm text-gray-400">{match.date}</div>
                    </div>
                ))}
            </div>

            <div className="w-3/4 p-4">
                {selectedMatch ? (
                    <>
                        <div className="p-4 bg-gray-800 rounded mb-4">
                            <h2 className="text-xl font-bold text-gray-200 mb-2">
                                {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
                            </h2>
                            <div>
                                Score: <span className="text-gray-300">{selectedMatch.score}</span>
                            </div>
                            <div>
                                Date: <span className="text-gray-300">{selectedMatch.date}</span>
                            </div>
                        </div>

                        <MetricCategory
                            title="General"
                            metrics={{
                                possession: selectedMatch.metrics.possession,
                                fouls: selectedMatch.metrics.fouls,
                                yellowCards: selectedMatch.metrics.yellowCards,
                                passes: selectedMatch.metrics.passes,
                                oppositionPasses: selectedMatch.metrics.oppositionPasses,
                            }}
                            metricsRef={metricsRef}
                            onSelectMetric={setSelectedMetric}
                        />
                        <MetricCategory
                            title="Offense"
                            metrics={{
                                shotsOnTarget: selectedMatch.metrics.shotsOnTarget,
                                xG: selectedMatch.metrics.xG,
                                completedPassesIntoTheBox: selectedMatch.metrics.completedPassesIntoTheBox,
                                xGWithin8SecondsOfCorner: selectedMatch.metrics.xGWithin8SecondsOfCorner,
                                shotsWithin8SecondsOfCorner: selectedMatch.metrics.shotsWithin8SecondsOfCorner,
                            }}
                            metricsRef={metricsRef}
                            onSelectMetric={setSelectedMetric}
                        />
                        <MetricCategory
                            title="Defense"
                            metrics={{
                                tackles: selectedMatch.metrics.tackles,
                                pressures: selectedMatch.metrics.pressures,
                                pressuresRegained: selectedMatch.metrics.pressuresRegained,
                                xGConceded: selectedMatch.metrics.xGConceded,
                                goalsWithin8SecondsOfCorner: selectedMatch.metrics.goalsWithin8SecondsOfCorner,
                            }}
                            metricsRef={metricsRef}
                            onSelectMetric={setSelectedMetric}
                        />
                    </>
                ) : averageMetrics ? (
                    <>
                        <MetricCategory title="General (Averages)" metrics={averageMetrics} metricsRef={metricsRef} onSelectMetric={setSelectedMetric} />
                        <div ref={chartRef} className="mt-6"></div>
                    </>
                ) : (
                    <div className="text-gray-400 text-center">Select a match to see details.</div>
                )}
            </div>
        </div>
    );
}
