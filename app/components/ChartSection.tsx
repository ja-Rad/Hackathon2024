import React from "react";
import { SpiderChart } from "@/app/components/SpiderChart";
import TooltipIcon from "@/app/components/TooltipIcon";

type ChartSectionProps = {
    title: string;
    kpiValue: number;
    tooltipText: string;
    matchMetrics: { [key: string]: number };
    seasonMetrics: { [key: string]: number };
};

export const ChartSection: React.FC<ChartSectionProps> = ({ title, kpiValue, tooltipText, matchMetrics, seasonMetrics }) => {
    return (
        <div>
            <h4 className="flex items-center">
                {title}: {kpiValue.toFixed(2)}
                <TooltipIcon tooltipText={tooltipText} />
            </h4>
            <SpiderChart title={`${title} Performance`} metrics={matchMetrics} seasonMetrics={seasonMetrics} />
        </div>
    );
};
