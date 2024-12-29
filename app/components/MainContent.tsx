import React from "react";
import { MatchDetails } from "./MatchDetails";
import { AverageMetricsChart } from "./AverageMetricsChart";
import { Match } from "../types/match";

interface MainContentProps {
    selectedMatch: Match | null;
    averageMetrics: Match["metrics"] | null;
    metricsRef: React.RefObject<HTMLDivElement>;
    chartRef: React.RefObject<HTMLDivElement>;
    setSelectedMetric: React.Dispatch<React.SetStateAction<string | null>>;
    matches: Match[];
    setAiAdvice: React.Dispatch<React.SetStateAction<string | null>>;
    generateAiAdvice: (matches: Match[], setAiAdvice: React.Dispatch<React.SetStateAction<string | null>>) => void;
    aiAdvice: string | null;
}

const MainContent: React.FC<MainContentProps> = ({ selectedMatch, averageMetrics, metricsRef, chartRef, setSelectedMetric, matches, setAiAdvice, generateAiAdvice, aiAdvice }) => {
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

    if (selectedMatch) {
        return <MatchDetails match={selectedMatch} metricsRef={metricsRef} setSelectedMetric={setSelectedMetric} />;
    }

    if (averageMetrics) {
        return (
            <div className="flex flex-col w-full">
                <div>
                    <AverageMetricsChart averageMetrics={averageMetrics} metricsRef={metricsRef} setSelectedMetric={setSelectedMetric} chartRef={chartRef} />
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
    }

    return <div className="text-gray-400 text-center">Select a match to see details.</div>;
};

export default MainContent;
