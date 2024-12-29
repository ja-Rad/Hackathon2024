"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "./Sidebar";
import { MatchDetails } from "./MatchDetails";
import { AverageMetricsChart } from "./AverageMetricsChart";
import { calculateAverageMetrics } from "../utils/metrics";
import { renderBarChart } from "../utils/barChart";
import { generateAiAdvice } from "../utils/generateAiAdvice"; // Import the utility function
import { sortMatchesByDateDescending } from "../utils/sortMatches"; // Import the sorting utility
import { Match } from "../types/match";

export default function DashboardClient() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [averageMetrics, setAverageMetrics] = useState<Match["metrics"] | null>(null);
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [aiAdvice, setAiAdvice] = useState<string | null>(null);
    const chartRef = useRef<HTMLDivElement | null>(null);
    const metricsRef = useRef<HTMLDivElement | null>(null);

    // Fetch matches on component mount
    useEffect(() => {
        async function fetchMatches() {
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
        }

        fetchMatches();
    }, []);

    // Update the bar chart whenever a new metric is selected
    useEffect(() => {
        if (selectedMetric && chartRef.current && selectedMatch === null) {
            const last10Matches = matches.slice(0, 10);
            const data = last10Matches.map((match) => ({
                value: parseFloat(match.metrics[selectedMetric] as string) || 0,
                label: match.date,
            }));

            renderBarChart(chartRef.current, data, selectedMetric.replace(/([A-Z])/g, " $1"));
        }
    }, [selectedMetric, selectedMatch, matches]);

    // Render advice component
    const renderAdvice = (advice: string | null) => {
        if (!advice) {
            return <p className="text-gray-400">Click &quot;Generate Advice&quot; to see AI-driven performance insights.</p>;
        }

        // Split advice into sections
        const sections = advice.split("\n\n").map((section, index) => {
            const isHeading = section.startsWith("###") || section.startsWith("- **");
            const isList = section.startsWith("-");

            return (
                <p key={`section-${index}`} className={isHeading ? "font-bold text-green-400" : isList ? "pl-4 list-disc" : "text-gray-200"}>
                    {section}
                </p>
            );
        });

        return <div className="space-y-2">{sections}</div>;
    };

    // Render the main content of the dashboard
    const renderMainContent = () => {
        if (selectedMatch) {
            return <MatchDetails match={selectedMatch} metricsRef={metricsRef as React.RefObject<HTMLDivElement>} setSelectedMetric={setSelectedMetric} />;
        } else if (averageMetrics) {
            return (
                <div className="flex flex-col w-full">
                    <div>
                        <AverageMetricsChart averageMetrics={averageMetrics} metricsRef={metricsRef as React.RefObject<HTMLDivElement>} setSelectedMetric={setSelectedMetric} chartRef={chartRef as React.RefObject<HTMLDivElement>} />
                    </div>

                    {/* AI Advice Panel */}
                    <div className="p-4 bg-gray-800 text-white mt-4">
                        <h2 className="text-lg font-bold mb-4">AI Performance Advice</h2>
                        <button className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition-all" onClick={() => generateAiAdvice(matches, setAiAdvice)}>
                            Generate Advice
                        </button>
                        <div className="mt-4">{renderAdvice(aiAdvice)}</div>
                    </div>
                </div>
            );
        } else {
            return <div className="text-gray-400 text-center">Select a match to see details.</div>;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-white text-lg">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100">
            <Sidebar matches={matches} selectedMatch={selectedMatch} setSelectedMatch={setSelectedMatch} chartRef={chartRef} />
            <main className="w-3/4 p-4">{renderMainContent()}</main>
        </div>
    );
}
