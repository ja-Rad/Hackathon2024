import React from "react";
import { MetricCategory } from "./MetricCategory";
import { Match } from "../types/Match";

type MatchDetailsProps = Readonly<{
    match: Match;
    metricsRef: React.RefObject<HTMLDivElement>;
    setSelectedMetric: React.Dispatch<React.SetStateAction<string | null>>;
}>;

export function MatchDetails({ match, metricsRef, setSelectedMetric }: MatchDetailsProps) {
    return (
        <>
            <div className="p-4 bg-gray-800 rounded mb-4">
                <h2 className="text-xl font-bold text-gray-200 mb-2">
                    {match.homeTeam} vs {match.awayTeam}
                </h2>
                <p>
                    Score: <span className="text-gray-300">{match.score}</span>
                </p>
                <p>
                    Date: <span className="text-gray-300">{match.date}</span>
                </p>
            </div>
            <MetricCategory
                title="General"
                metrics={{
                    possession: match.metrics.possession,
                    fouls: match.metrics.fouls,
                    yellowCards: match.metrics.yellowCards,
                    passes: match.metrics.passes,
                    oppositionPasses: match.metrics.oppositionPasses,
                }}
                metricsRef={metricsRef}
                onSelectMetric={setSelectedMetric}
            />
            <MetricCategory
                title="Offense"
                metrics={{
                    shotsOnTarget: match.metrics.shotsOnTarget,
                    xG: match.metrics.xG,
                    completedPassesIntoTheBox: match.metrics.completedPassesIntoTheBox,
                    xGWithin8SecondsOfCorner: match.metrics.xGWithin8SecondsOfCorner,
                    shotsWithin8SecondsOfCorner: match.metrics.shotsWithin8SecondsOfCorner,
                }}
                metricsRef={metricsRef}
                onSelectMetric={setSelectedMetric}
            />
            <MetricCategory
                title="Defense"
                metrics={{
                    tackles: match.metrics.tackles,
                    pressures: match.metrics.pressures,
                    pressuresRegained: match.metrics.pressuresRegained,
                    xGConceded: match.metrics.xGConceded,
                    goalsWithin8SecondsOfCorner: match.metrics.goalsWithin8SecondsOfCorner,
                }}
                metricsRef={metricsRef}
                onSelectMetric={setSelectedMetric}
            />
        </>
    );
}
