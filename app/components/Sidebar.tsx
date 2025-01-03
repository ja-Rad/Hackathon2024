import React from "react";
import * as d3 from "d3";
import { Match } from "../types/match";
import { SidebarItem } from "./SidebarItem";
import { calculateCPI, evaluateCPI } from "../utils/metrics";
import { determineOutcome } from "../utils/matchUtils";

type SidebarProps = Readonly<{
    matches: Match[];
    selectedMatch: Match | null;
    setSelectedMatch: (match: Match | null) => void;
    chartRef: React.RefObject<HTMLDivElement | null>;
}>;

export function Sidebar({ matches, selectedMatch, setSelectedMatch, chartRef }: SidebarProps) {
    return (
        <aside className="w-1/4 bg-background-dark overflow-y-auto border-r border-border-dark">
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
