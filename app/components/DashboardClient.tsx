"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "./Sidebar";
import { MatchDetails } from "./MatchDetails";
import { AverageMetricsChart } from "./AverageMetricsChart";
import { calculateAverageMetrics } from "../utils/metrics";
import { renderBarChart } from "../utils/barChart";
import { Match } from "../types/Match";

export default function DashboardClient() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [averageMetrics, setAverageMetrics] = useState<Match["metrics"] | null>(null);
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
    const chartRef = useRef<HTMLDivElement | null>(null);
    const metricsRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        async function fetchMatches() {
            try {
                const response = await fetch("/api/football-matches");
                const data: Match[] = await response.json(); // Ensure fetched data is typed as Match[]
                console.log("Fetched Data:", data);

                // Use the separate function to sort matches by date
                const sortedData = sortMatchesByDateDescending(data);
                console.log("Sorted Data:", sortedData);

                const last10Matches = sortedData.slice(0, 10);
                const avgMetrics = calculateAverageMetrics(last10Matches);
                setAverageMetrics(avgMetrics);

                setMatches(sortedData); // Set sorted data as matches
            } catch (error) {
                console.error("Error fetching matches:", error);
            }
        }

        fetchMatches();
    }, []);

    // Helper method to sort matches by date
    function sortMatchesByDateDescending<T extends { date: string }>(data: T[]): T[] {
        return data.sort((a, b) => {
            const [dayA, monthA, yearA] = a.date.split("/").map(Number);
            const [dayB, monthB, yearB] = b.date.split("/").map(Number);

            // Subtract 1 from the month because the JavaScript Date object uses 0-based months
            const dateA = new Date(yearA, monthA - 1, dayA);
            const dateB = new Date(yearB, monthB - 1, dayB);

            return dateB.getTime() - dateA.getTime(); // Latest date first
        });
    }

    useEffect(() => {
        if (selectedMetric && chartRef.current && selectedMatch === null) {
            const last10Matches = matches.slice(0, 10);
            const data = last10Matches.map((match) => ({
                value: parseFloat(match.metrics[selectedMetric] as string) || 0,
                label: match.date,
            }));

            renderBarChart(chartRef.current, data, selectedMetric.replace(/([A-Z])/g, " $1")); // Pass a human-readable metric label
        }
    }, [selectedMetric, selectedMatch, matches]);

    const renderMainContent = () => {
        if (selectedMatch) {
            return <MatchDetails match={selectedMatch} metricsRef={metricsRef as React.RefObject<HTMLDivElement>} setSelectedMetric={setSelectedMetric} />;
        } else if (averageMetrics) {
            return <AverageMetricsChart averageMetrics={averageMetrics} metricsRef={metricsRef as React.RefObject<HTMLDivElement>} setSelectedMetric={setSelectedMetric} chartRef={chartRef as React.RefObject<HTMLDivElement>} />;
        } else {
            return <div className="text-gray-400 text-center">Select a match to see details.</div>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100">
            <Sidebar matches={matches} selectedMatch={selectedMatch} setSelectedMatch={setSelectedMatch} chartRef={chartRef} />
            <main className="w-3/4 p-4">{renderMainContent()}</main>
        </div>
    );
}
