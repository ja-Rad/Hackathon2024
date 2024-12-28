"use client";

import { useState, useEffect, useRef } from "react";
import { renderBarChart } from "../utils/barChart";

import * as d3 from "d3";
import { MatchDetails } from "./MatchDetails";
import { AverageMetricsChart } from "./AverageMetricsChart";
import { calculateAverageMetrics } from "../utils/metrics";
import { Match } from "../types/Match";

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
            <aside className="w-1/4 bg-gray-800 overflow-y-auto border-r border-gray-700">
                <div className={`p-4 cursor-pointer hover:bg-gray-700 ${selectedMatch === null ? "bg-gray-700" : ""}`} onClick={() => setSelectedMatch(null)}>
                    <h2 className="font-bold text-gray-200">Most Recent Matches</h2>
                    <p className="text-sm text-gray-400">Averages from the last 10 matches</p>
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
                        <h3 className="font-bold text-gray-200">
                            {match.homeTeam} vs {match.awayTeam}
                        </h3>
                        <p className="text-sm text-gray-400">{match.date}</p>
                    </div>
                ))}
            </aside>
            <main className="w-3/4 p-4">{selectedMatch ? <MatchDetails match={selectedMatch} metricsRef={metricsRef as React.RefObject<HTMLDivElement>} setSelectedMetric={setSelectedMetric} /> : averageMetrics ? <AverageMetricsChart averageMetrics={averageMetrics} metricsRef={metricsRef as React.RefObject<HTMLDivElement>} setSelectedMetric={setSelectedMetric} chartRef={chartRef as React.RefObject<HTMLDivElement>} /> : <div className="text-gray-400 text-center">Select a match to see details.</div>}</main>{" "}
        </div>
    );
}
