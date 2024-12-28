import React from "react";
import * as d3 from "d3";
import { Match } from "../types/Match";
import { SidebarItem } from "./SidebarItem";

type SidebarProps = Readonly<{
    matches: Match[];
    selectedMatch: Match | null;
    setSelectedMatch: (match: Match | null) => void;
    chartRef: React.RefObject<HTMLDivElement | null>; // Allow nullable ref
}>;

export function Sidebar({ matches, selectedMatch, setSelectedMatch, chartRef }: SidebarProps) {
    return (
        <aside className="w-1/4 bg-gray-800 overflow-y-auto border-r border-gray-700">
            <SidebarItem isActive={selectedMatch === null} onClick={() => setSelectedMatch(null)} title="Most Recent Matches" subtitle="Averages from the last 10 matches" />
            {matches.map((match) => (
                <SidebarItem
                    key={match.id}
                    isActive={selectedMatch?.id === match.id}
                    onClick={() => {
                        setSelectedMatch(match);
                        if (chartRef?.current) {
                            // Remove d3 plot when selecting different match item besides Most Recent Matches
                            d3.select(chartRef.current).selectAll("svg").remove();
                        }
                    }}
                    title={`${match.homeTeam} vs ${match.awayTeam}`}
                    subtitle={match.date}
                />
            ))}
        </aside>
    );
}
