"use client";

import { useState, useEffect, useRef } from "react";
import { metricDescriptions } from "../utils/metrics";

interface Match {
    id: string;
    index: string;
    homeTeam: string;
    awayTeam: string;
    score: string;
    date: string;
    metrics: {
        shotsOnTarget: number;
        possession: string;
        fouls: number;
        yellowCards: number;
        completedPassesIntoTheBox: number;
        pressures: number;
        xG: string;
        xGConceded: string;
        tackles: number;
        passes: number;
        oppositionPasses: number;
        xGWithin8SecondsOfCorner: string;
        shotsWithin8SecondsOfCorner: number;
        goalsWithin8SecondsOfCorner: number;
        decelerations: number;
        accelerations: number;
        hsr: number;
        sprints: number;
        jumps: number;
        xGWithin8SecondsOfFreeKick: string;
        shotsWithin8SecondsOfFreeKick: number;
        goalsWithin8SecondsOfFreeKick: number;
        pressuresRegained: number;
        monteCarloWinProb: string;
        monteCarloDrawProb: string;
        monteCarloLossProb: string;
    };
}

export default function DashboardClient() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [averageMetrics, setAverageMetrics] = useState<Match["metrics"] | null>(null);

    const metricsRef = useRef<HTMLDivElement>(null); // Ref for draggable metric container

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

    const calculateAverageMetrics = (matches: Match[]): Match["metrics"] => {
        if (matches.length === 0) return {} as Match["metrics"];

        const keys = Object.keys(matches[0].metrics) as Array<keyof Match["metrics"]>;
        const averages: Partial<Match["metrics"]> = {};

        keys.forEach((key) => {
            const sum = matches.reduce((acc, match) => acc + (parseFloat(match.metrics[key] as string) || 0), 0);
            averages[key] = parseFloat((sum / matches.length).toFixed(2));
        });

        return averages as Match["metrics"];
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const container = metricsRef.current;
        if (!container) return;

        const startX = e.pageX - container.offsetLeft;
        const scrollLeft = container.scrollLeft;

        const handleMouseMove = (event: MouseEvent) => {
            const x = event.pageX - container.offsetLeft;
            const walk = x - startX; // Distance moved
            container.scrollLeft = scrollLeft - walk;
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const renderMetricCategory = (title: string, metrics: { [key: string]: string | number }) => (
        <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-200 mb-2">{title}</h3>
            <div ref={metricsRef} className="overflow-hidden whitespace-nowrap bg-gray-800 rounded p-4 cursor-grab active:cursor-grabbing" onMouseDown={handleMouseDown}>
                {Object.entries(metrics).map(([key, value]) => (
                    <div key={key} className="inline-block px-4 py-2 m-2 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer text-sm text-gray-200 group relative">
                        <span className="font-medium">{key.replace(/([A-Z])/g, " $1")}: </span>
                        <span className="text-gray-300">{value}</span>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 z-10 whitespace-nowrap">{metricDescriptions[key as keyof typeof metricDescriptions] || "No description available."}</div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100">
            <div className="w-1/4 bg-gray-800 overflow-y-auto border-r border-gray-700">
                <div className={`p-4 cursor-pointer hover:bg-gray-700 ${selectedMatch === null ? "bg-gray-700" : ""}`} onClick={() => setSelectedMatch(null)}>
                    <div className="font-bold text-gray-200">Most Recent Matches</div>
                    <div className="text-sm text-gray-400">Averages from the last 10 matches</div>
                </div>
                {matches.map((match) => (
                    <div key={match.id} className={`p-4 cursor-pointer hover:bg-gray-700 ${selectedMatch?.id === match.id ? "bg-gray-700" : ""}`} onClick={() => setSelectedMatch(match)}>
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

                        {renderMetricCategory("General", {
                            possession: selectedMatch.metrics.possession,
                            fouls: selectedMatch.metrics.fouls,
                            yellowCards: selectedMatch.metrics.yellowCards,
                            passes: selectedMatch.metrics.passes,
                            oppositionPasses: selectedMatch.metrics.oppositionPasses,
                        })}
                        {renderMetricCategory("Offense", {
                            shotsOnTarget: selectedMatch.metrics.shotsOnTarget,
                            xG: selectedMatch.metrics.xG,
                            completedPassesIntoTheBox: selectedMatch.metrics.completedPassesIntoTheBox,
                            xGWithin8SecondsOfCorner: selectedMatch.metrics.xGWithin8SecondsOfCorner,
                            shotsWithin8SecondsOfCorner: selectedMatch.metrics.shotsWithin8SecondsOfCorner,
                        })}
                        {renderMetricCategory("Defense", {
                            tackles: selectedMatch.metrics.tackles,
                            pressures: selectedMatch.metrics.pressures,
                            pressuresRegained: selectedMatch.metrics.pressuresRegained,
                            xGConceded: selectedMatch.metrics.xGConceded,
                            goalsWithin8SecondsOfCorner: selectedMatch.metrics.goalsWithin8SecondsOfCorner,
                        })}
                    </>
                ) : averageMetrics ? (
                    <>{renderMetricCategory("General (Averages)", averageMetrics)}</>
                ) : (
                    <div className="text-gray-400 text-center">Select a match to see details.</div>
                )}
            </div>
        </div>
    );
}
