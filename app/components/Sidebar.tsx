import React from "react";
import * as d3 from "d3";
import { Match } from "../types/match";
import { SidebarItem } from "./SidebarItem";
import { calculateCPI, evaluateCPI } from "../utils/metrics";

type SidebarProps = Readonly<{
    matches: Match[];
    selectedMatch: Match | null;
    setSelectedMatch: (match: Match | null) => void;
    chartRef: React.RefObject<HTMLDivElement | null>;
}>;

function determineOutcome(match: Match): string {
    const [homeScore, awayScore] = match.score.split(" - ").map(Number);
    if (homeScore > awayScore) return "Won";
    if (homeScore < awayScore) return "Lost";
    return "Draw";
}

export function Sidebar({ matches, selectedMatch, setSelectedMatch, chartRef }: SidebarProps) {
    return (
        <aside className="w-1/4 bg-gray-800 overflow-y-auto border-r border-gray-700">
            {/* Default option for recent matches */}
            <SidebarItem isActive={selectedMatch === null} onClick={() => setSelectedMatch(null)} title="Most Recent Matches" subtitle="Averages from the last 10 matches" cpi={""} />

            {/* List matches with CPI */}
            {matches.map((match) => {
                const cpi = calculateCPI(match);
                const cpiText = cpi === "N/A" ? "Not enough data" : `${cpi.toFixed(2)} (${evaluateCPI(cpi)})`;
                const outcome = determineOutcome(match);

                return (
                    <SidebarItem
                        key={match.id}
                        isActive={selectedMatch?.id === match.id}
                        onClick={() => {
                            setSelectedMatch(match);
                            if (chartRef?.current) {
                                d3.select(chartRef.current).selectAll("svg").remove();
                            }
                        }}
                        title={`${match.homeTeam} vs ${match.awayTeam}`}
                        subtitle={`Date: ${match.date} | Score: ${match.score} (${outcome})`}
                        cpi={`Coventry Performance Index (CPI): ${cpiText}`}
                    />
                );
            })}
        </aside>
    );
}
