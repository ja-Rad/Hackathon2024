import React from "react";
import { MetricCategory } from "./MetricCategory";
import { Match } from "../types/Match";

type AverageMetricsChartProps = Readonly<{
    averageMetrics: Match["metrics"];
    metricsRef: React.RefObject<HTMLDivElement>;
    setSelectedMetric: React.Dispatch<React.SetStateAction<string | null>>;
    chartRef: React.RefObject<HTMLDivElement>;
}>;

export function AverageMetricsChart({ averageMetrics, metricsRef, setSelectedMetric, chartRef }: AverageMetricsChartProps) {
    return (
        <>
            <MetricCategory title="Recent matches metrics" metrics={averageMetrics} metricsRef={metricsRef} onSelectMetric={setSelectedMetric} />
            <div ref={chartRef} className="mt-6"></div>
        </>
    );
}
