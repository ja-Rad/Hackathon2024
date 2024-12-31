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
    generateAiAdvice: () => void;
    aiAdvice: string | null;
    isAdviceLoading: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ selectedMatch, averageMetrics, metricsRef, chartRef, setSelectedMetric, generateAiAdvice, aiAdvice, isAdviceLoading }) => {
    const renderAdvice = (advice: string | null) => {
        if (isAdviceLoading) {
            return (
                <div className="flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary-light border-dotted rounded-full animate-spin"></div>
                    <p className="ml-2 text-text-light">Generating advice...</p>
                </div>
            );
        }

        if (!advice) {
            return <p className="text-text-light">Click &quot;Generate Advice&quot; to see AI-driven performance insights.</p>;
        }

        // Split advice into sections
        return (
            <div className="space-y-2">
                {advice.split("\n\n").map((section, index) => {
                    let className = "text-text-light"; // Default class
                    if (section.startsWith("###") || section.startsWith("- **")) {
                        className = "font-bold text-success"; // Heading style
                    } else if (section.startsWith("-")) {
                        className = "pl-4 list-disc"; // List style
                    }

                    return (
                        <p key={`${section}-${index}`} className={className}>
                            {section}
                        </p>
                    );
                })}
            </div>
        );
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
                <div className="p-4 bg-background-card text-text-light mt-4 rounded">
                    <h2 className="text-lg font-bold mb-4">AI Performance Advice</h2>
                    <button className="px-4 py-2 bg-primary hover:bg-primary-hover rounded text-white" onClick={generateAiAdvice} disabled={isAdviceLoading}>
                        {isAdviceLoading ? "Loading..." : "Generate Advice"}
                    </button>
                    <div className="mt-4">{renderAdvice(aiAdvice)}</div>
                </div>
            </div>
        );
    }

    return <div className="text-text-light text-center">Select a match to see details.</div>;
};

export default MainContent;
