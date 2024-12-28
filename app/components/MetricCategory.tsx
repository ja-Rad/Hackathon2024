// components/MetricCategory.tsx

import React, { RefObject } from "react";
import { handleMouseDown } from "../utils/mouseInteraction";
import { metricDescriptions } from "../utils/metrics";

interface MetricCategoryProps {
    title: string;
    metrics: { [key: string]: string | number };
    metricsRef: RefObject<HTMLDivElement | null>;
    onSelectMetric: (key: string) => void;
}

export const MetricCategory: React.FC<MetricCategoryProps> = ({ title, metrics, metricsRef, onSelectMetric }) => (
    <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-200 mb-2">{title}</h3>
        <div
            ref={metricsRef}
            role="scrollbar"
            tabIndex={0}
            className="overflow-hidden whitespace-nowrap bg-gray-800 rounded p-4 cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => {
                if (metricsRef.current) {
                    handleMouseDown(e, metricsRef);
                }
            }}
        >
            {Object.entries(metrics).map(([key, value]) => (
                <div
                    key={key}
                    onClick={() => onSelectMetric(key)} // Select metric for bar chart
                    className="inline-block px-4 py-2 m-2 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer text-sm text-gray-200 group relative"
                >
                    <span className="font-medium">{key.replace(/([A-Z])/g, " $1")}: </span>
                    <span className="text-gray-300">{value}</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 z-10 whitespace-nowrap">{metricDescriptions[key as keyof typeof metricDescriptions] || "No description available."}</div>
                </div>
            ))}
        </div>
    </div>
);
