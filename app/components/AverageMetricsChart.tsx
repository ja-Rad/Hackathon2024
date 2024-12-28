import React from "react";
import { MetricCategory } from "./MetricCategory";
import { Match } from "../types/match";

type AverageMetricsChartProps = Readonly<{
    averageMetrics: Match["metrics"];
    metricsRef: React.RefObject<HTMLDivElement>;
    setSelectedMetric: React.Dispatch<React.SetStateAction<string | null>>;
    chartRef: React.RefObject<HTMLDivElement>;
}>;

export function AverageMetricsChart({ averageMetrics, metricsRef, setSelectedMetric, chartRef }: AverageMetricsChartProps) {
    return (
        <>
            <MetricCategory title="Average metrics from the last 10 matches" metrics={averageMetrics} metricsRef={metricsRef} onSelectMetric={setSelectedMetric} />
            <div ref={chartRef} className="mt-6"></div>
        </>
    );
}
