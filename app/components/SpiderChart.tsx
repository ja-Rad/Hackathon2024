"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

type SpiderChartProps = {
    title: string;
    metrics: { [key: string]: number };
    seasonMetrics: { [key: string]: number };
};

export const SpiderChart: React.FC<SpiderChartProps> = ({ title, metrics, seasonMetrics }) => {
    const chartRef = useRef(null);

    type ChartDataPoint = {
        axis: string;
        value: number;
    };

    useEffect(() => {
        const data = Object.keys(metrics).map((key) => ({
            axis: key,
            match: metrics[key],
            season: seasonMetrics[key] || 0,
        }));

        const maxValue = Math.max(...data.flatMap((d) => [d.match, d.season]));

        const width = 550, // Adjusted width for better layout
            height = 400; // Adjusted height for better layout
        const radius = Math.min(width, height) / 2 - 40; // Adjust radius for proper padding
        const angleSlice = (Math.PI * 2) / data.length;

        const svg = d3.select(chartRef.current).attr("width", width).attr("height", height);

        svg.selectAll("*").remove();

        const g = svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2 + 20})`); // Move down by 20px

        const radialScale = d3.scaleLinear().domain([0, maxValue]).range([0, radius]);

        // Draw circles
        g.selectAll(".levels")
            .data(d3.range(1, 6))
            .enter()
            .append("circle")
            .attr("r", (d) => (radius / 5) * d)
            .attr("fill", "none")
            .attr("stroke", "#ddd");

        // Draw axes
        const axis = g.selectAll(".axis").data(data).enter().append("g").attr("class", "axis");

        axis.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", (d, i) => radialScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("y2", (d, i) => radialScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2))
            .attr("stroke", "#ddd");

        axis.append("text")
            .attr("x", (d, i) => radialScale(maxValue * 1.3) * Math.cos(angleSlice * i - Math.PI / 2)) // Adjust scale for labels
            .attr("y", (d, i) => radialScale(maxValue * 1.3) * Math.sin(angleSlice * i - Math.PI / 2) + 5) // Add extra padding to center text
            .text((d) => d.axis)
            .style("font-size", "12px")
            .style("fill", "white") // White labels for better visibility
            .attr("text-anchor", "middle");

        // Draw polygons with animation
        const line = d3
            .lineRadial<ChartDataPoint>() // Specify the type here
            .radius((d) => radialScale(d.value)) // Use the type-safe `d.value`
            .angle((_, i) => i * angleSlice);

        // Add match polygon
        const matchPolygon = g
            .append("path")
            .datum(data.map((d) => ({ axis: d.axis, value: 0 }))) // Start with 0 values for animation
            .attr("d", (d) => (line(d as ChartDataPoint[]) || "") as string) // NOSONAR
            .attr("fill", "#ff6666")
            .attr("fill-opacity", 0.5);

        matchPolygon
            .datum(data.map((d) => ({ axis: d.axis, value: d.match })))
            .transition()
            .duration(1000)
            .attr("d", (d) => (line(d as ChartDataPoint[]) || "") as string); // NOSONAR

        // Add season polygon
        const seasonPolygon = g
            .append("path")
            .datum(data.map((d) => ({ axis: d.axis, value: 0 }))) // Start with 0 values for animation
            .attr("d", (d) => (line(d as ChartDataPoint[]) || "") as string) // NOSONAR
            .attr("fill", "#6666ff")
            .attr("fill-opacity", 0.5);

        seasonPolygon
            .datum(data.map((d) => ({ axis: d.axis, value: d.season })))
            .transition()
            .duration(1000)
            .attr("d", (d) => (line(d as ChartDataPoint[]) || "") as string); // NOSONAR
    }, [metrics, seasonMetrics]);

    return (
        <div className="flex flex-col justify-center items-center">
            <div>
                <h3 className="text-lg font-bold mb-2 text-center">{title}</h3>
                <svg ref={chartRef}></svg>
            </div>
            {/* Add legends below the chart */}
            <div className="flex justify-center items-center mt-4">
                <div className="mr-4 flex items-center">
                    <span className="w-4 h-4 block" style={{ backgroundColor: "#ff6666", marginRight: "8px" }}></span>
                    <span className="text-sm text-white">Current Match</span>
                </div>
                <div className="flex items-center">
                    <span className="w-4 h-4 block" style={{ backgroundColor: "#6666ff", marginRight: "8px" }}></span>
                    <span className="text-sm text-white">Season Average</span>
                </div>
            </div>
        </div>
    );
};
