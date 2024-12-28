"use client";

import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { metricDescriptions } from "../utils/metrics";

interface Match {
    id: string;
    index: string;
    homeTeam: string;
    awayTeam: string;
    score: string;
    date: string;
    metrics: {
        [key: string]: number | string;
    };
}

export default function DashboardClient() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [averageMetrics, setAverageMetrics] = useState<Match["metrics"] | null>(null);
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null); // Track the selected metric for the bar chart
    const chartRef = useRef<HTMLDivElement>(null); // Ref for D3.js chart container
    const metricsRef = useRef<HTMLDivElement>(null); // Ref for draggable metric container

    useEffect(() => {
        async function fetchMatches() {
            try {
                const response = await fetch("/api/football-matches");
                const data = await response.json();

                const last10Matches = data.slice(0, 10);
                const avgMetrics = calculateAverageMetrics(last10Matches);
                setAverageMetrics(avgMetrics);

                setMatches(data);
            } catch (error) {
                console.error("Error fetching matches:", error);
            }
        }

        fetchMatches();
    }, []);

    useEffect(() => {
        if (selectedMetric && chartRef.current && selectedMatch === null) {
            const last10Matches = matches.slice(0, 10);
            const data = last10Matches.map((match) => ({
                value: parseFloat(match.metrics[selectedMetric] as string) || 0,
                label: match.date,
            }));

            renderBarChart(data);
        }
    }, [selectedMetric, selectedMatch, matches]);

    const calculateAverageMetrics = (matches: Match[]): Match["metrics"] => {
        if (matches.length === 0) return {};

        const keys = Object.keys(matches[0].metrics);
        const averages: Partial<Match["metrics"]> = {};

        keys.forEach((key) => {
            const sum = matches.reduce((acc, match) => acc + (parseFloat(match.metrics[key] as string) || 0), 0);
            averages[key] = parseFloat((sum / matches.length).toFixed(2));
        });

        return averages as Match["metrics"];
    };

    const renderBarChart = (data: { value: number; label: string }[]) => {
        const width = 500;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };

        const svg = d3
            .select(chartRef.current)
            .html("") // Clear previous chart
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3
            .scaleBand()
            .domain(data.map((d) => d.label))
            .range([0, width])
            .padding(0.2);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.value) || 0])
            .nice()
            .range([height, 0]);

        // X-axis
        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).tickSize(0)).selectAll("text").attr("transform", "rotate(-45)").style("text-anchor", "end");

        // Y-axis
        svg.append("g").call(d3.axisLeft(y));

        // Bars
        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d) => x(d.label) || 0)
            .attr("y", (d) => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", (d) => height - y(d.value))
            .attr("fill", "#4F46E5")
            .attr("opacity", 0.8)
            .on("mouseover", function () {
                d3.select(this).attr("opacity", 1);
            })
            .on("mouseout", function () {
                d3.select(this).attr("opacity", 0.8);
            });

        // Labels
        svg.selectAll(".label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("x", (d) => (x(d.label) || 0) + x.bandwidth() / 2)
            .attr("y", (d) => y(d.value) - 5)
            .attr("text-anchor", "middle")
            .text((d) => d.value.toFixed(2))
            .attr("fill", "#fff");
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const container = metricsRef.current;
        if (!container) return;

        const startX = e.pageX - container.offsetLeft;
        const scrollLeft = container.scrollLeft;

        const handleMouseMove = (event: MouseEvent) => {
            const x = event.pageX - container.offsetLeft;
            const walk = x - startX; // Distance moved
            container.scrollLeft = scrollLeft - walk;
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const renderMetricCategory = (title: string, metrics: { [key: string]: string | number }) => (
        <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-200 mb-2">{title}</h3>
            <div ref={metricsRef} className="overflow-hidden whitespace-nowrap bg-gray-800 rounded p-4 cursor-grab active:cursor-grabbing" onMouseDown={handleMouseDown}>
                {Object.entries(metrics).map(([key, value]) => (
                    <div
                        key={key}
                        onClick={() => setSelectedMetric(key)} // Select metric for bar chart
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

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100">
            <div className="w-1/4 bg-gray-800 overflow-y-auto border-r border-gray-700">
                <div
                    className={`p-4 cursor-pointer hover:bg-gray-700 ${selectedMatch === null ? "bg-gray-700" : ""}`}
                    onClick={() => {
                        setSelectedMatch(null);
                    }}
                >
                    <div className="font-bold text-gray-200">Most Recent Matches</div>
                    <div className="text-sm text-gray-400">Averages from the last 10 matches</div>
                </div>
                {matches.map((match) => (
                    <div
                        key={match.id}
                        className={`p-4 cursor-pointer hover:bg-gray-700 ${selectedMatch?.id === match.id ? "bg-gray-700" : ""}`}
                        onClick={() => {
                            setSelectedMatch(match);
                            // Clear all D3 SVGs when not in "Most Recent Matches"
                            d3.select(chartRef.current).selectAll("svg").remove();
                        }}
                    >
                        <div className="font-bold text-gray-200">
                            {match.homeTeam} vs {match.awayTeam}
                        </div>
                        <div className="text-sm text-gray-400">{match.date}</div>
                    </div>
                ))}
            </div>

            <div className="w-3/4 p-4">
                {selectedMatch ? (
                    <>
                        <div className="p-4 bg-gray-800 rounded mb-4">
                            <h2 className="text-xl font-bold text-gray-200 mb-2">
                                {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
                            </h2>
                            <div>
                                Score: <span className="text-gray-300">{selectedMatch.score}</span>
                            </div>
                            <div>
                                Date: <span className="text-gray-300">{selectedMatch.date}</span>
                            </div>
                        </div>

                        {renderMetricCategory("General", {
                            possession: selectedMatch.metrics.possession,
                            fouls: selectedMatch.metrics.fouls,
                            yellowCards: selectedMatch.metrics.yellowCards,
                            passes: selectedMatch.metrics.passes,
                            oppositionPasses: selectedMatch.metrics.oppositionPasses,
                        })}
                        {renderMetricCategory("Offense", {
                            shotsOnTarget: selectedMatch.metrics.shotsOnTarget,
                            xG: selectedMatch.metrics.xG,
                            completedPassesIntoTheBox: selectedMatch.metrics.completedPassesIntoTheBox,
                            xGWithin8SecondsOfCorner: selectedMatch.metrics.xGWithin8SecondsOfCorner,
                            shotsWithin8SecondsOfCorner: selectedMatch.metrics.shotsWithin8SecondsOfCorner,
                        })}
                        {renderMetricCategory("Defense", {
                            tackles: selectedMatch.metrics.tackles,
                            pressures: selectedMatch.metrics.pressures,
                            pressuresRegained: selectedMatch.metrics.pressuresRegained,
                            xGConceded: selectedMatch.metrics.xGConceded,
                            goalsWithin8SecondsOfCorner: selectedMatch.metrics.goalsWithin8SecondsOfCorner,
                        })}
                    </>
                ) : averageMetrics ? (
                    <>
                        {renderMetricCategory("General (Averages)", averageMetrics)}
                        <div ref={chartRef} className="mt-6"></div>
                    </>
                ) : (
                    <div className="text-gray-400 text-center">Select a match to see details.</div>
                )}
            </div>
        </div>
    );
}
