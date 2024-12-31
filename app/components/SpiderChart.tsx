"use client";

import React, { useRef, useEffect } from "react";
import { renderSpiderChart } from "../utils/spiderChart";

type SpiderChartProps = {
    title: string;
    metrics: { [key: string]: number };
    seasonMetrics: { [key: string]: number };
};

export const SpiderChart: React.FC<SpiderChartProps> = ({ title, metrics, seasonMetrics }) => {
    const chartRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const data = Object.keys(metrics).map((key) => ({
            axis: key,
            match: metrics[key],
            season: seasonMetrics[key] || 0,
        }));

        renderSpiderChart(chartRef.current, title, data);
    }, [title, metrics, seasonMetrics]);

    return (
        <div className="flex flex-col justify-center items-center">
            <div>
                <h3 className="text-lg font-bold mb-2 text-center text-text-light">{title}</h3>
                <div ref={chartRef}></div>
            </div>
            <div className="flex justify-center items-center mt-4">
                <div className="mr-4 flex items-center">
                    <span className="w-4 h-4 block" style={{ backgroundColor: "#ff6666", marginRight: "8px" }}></span>
                    <span className="text-sm text-text-light">Current Match</span>
                </div>
                <div className="flex items-center">
                    <span className="w-4 h-4 block" style={{ backgroundColor: "#6666ff", marginRight: "8px" }}></span>
                    <span className="text-sm text-text-light">Season Average</span>
                </div>
            </div>
        </div>
    );
};
