"use client";

import { useState, useEffect } from "react";

interface Match {
    id: string;
    homeTeam: string;
    awayTeam: string;
    score: string;
    date: string;
    metrics: {
        shotsOnTarget: number;
        possession: string;
        fouls: number;
    };
}

export default function DashboardClient() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

    // Fetch matches from API
    useEffect(() => {
        async function fetchMatches() {
            try {
                const response = await fetch("/api/football-matches");
                const data = await response.json();
                console.log(data);

                setMatches(data);
            } catch (error) {
                console.error("Error fetching matches:", error);
            }
        }

        fetchMatches();
    }, []);

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100">
            {/* Left Panel: Scrollable Matches */}
            <div className="w-1/4 bg-gray-800 overflow-y-auto border-r border-gray-700">
                {matches.map((match) => (
                    <div key={match.id} className={`p-4 cursor-pointer hover:bg-gray-700 ${selectedMatch?.id === match.id ? "bg-gray-700" : ""}`} onClick={() => setSelectedMatch(match)}>
                        <div className="font-bold text-gray-200">
                            {match.homeTeam} vs {match.awayTeam}
                        </div>
                        <div className="text-sm text-gray-400">{match.date}</div>
                    </div>
                ))}
            </div>

            {/* Right Panel: Match Details */}
            <div className="w-3/4 p-4">
                {selectedMatch ? (
                    <>
                        {/* Top Section: Important Metrics */}
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
                            <div>
                                Shots on Target: <span className="text-gray-300">{selectedMatch.metrics.shotsOnTarget}</span>
                            </div>
                            <div>
                                Possession: <span className="text-gray-300">{selectedMatch.metrics.possession}</span>
                            </div>
                            <div>
                                Fouls: <span className="text-gray-300">{selectedMatch.metrics.fouls}</span>
                            </div>
                        </div>

                        {/* Middle Section: Grey Panel */}
                        <div className="flex-1 bg-gray-700 rounded h-64"></div>
                    </>
                ) : (
                    <div className="text-gray-400 text-center">Select a match to see details.</div>
                )}
            </div>
        </div>
    );
}
