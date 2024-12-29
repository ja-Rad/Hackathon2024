"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "./Sidebar";
import MainContent from "./MainContent";
import { renderBarChart } from "../utils/barChart";
import { generateAiAdvice } from "../utils/generateAiAdvice";
import { fetchMatchesData } from "../lib/dashboardHandler";
import { Match } from "../types/match";

export default function DashboardClient() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [averageMetrics, setAverageMetrics] = useState<Match["metrics"] | null>(null);
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [aiAdvice, setAiAdvice] = useState<string | null>(null);
    const [isAdviceLoading, setIsAdviceLoading] = useState(false); // Loading state for advice
    const chartRef = useRef<HTMLDivElement>(null);
    const metricsRef = useRef<HTMLDivElement>(null);

    // Fetch matches on component mount
    useEffect(() => {
        fetchMatchesData(setMatches, setAverageMetrics, setIsLoading);
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

    // Function to generate advice with loading state
    const handleGenerateAdvice = async () => {
        setIsAdviceLoading(true);
        await generateAiAdvice(matches, setAiAdvice);
        setIsAdviceLoading(false);
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
            <main className="w-3/4 p-4">
                <MainContent
                    selectedMatch={selectedMatch}
                    averageMetrics={averageMetrics}
                    metricsRef={metricsRef}
                    chartRef={chartRef}
                    setSelectedMetric={setSelectedMetric}
                    matches={matches}
                    setAiAdvice={setAiAdvice}
                    generateAiAdvice={handleGenerateAdvice}
                    aiAdvice={aiAdvice}
                    isAdviceLoading={isAdviceLoading} // Pass loading state
                />
            </main>
        </div>
    );
}
