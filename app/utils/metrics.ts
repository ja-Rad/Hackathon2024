export const metricDescriptions = {
    shotsOnTarget: "Number of shots on target during the match.",
    possession: "Percentage of possession held by the team.",
    fouls: "Total number of fouls committed by the team.",
    yellowCards: "Total number of yellow cards received.",
    completedPassesIntoTheBox: "Number of completed passes into the opposition's penalty area.",
    pressures: "Total number of pressures applied to the opposition.",
    xG: "Expected goals scored during the match.",
    xGConceded: "Expected goals conceded during the match.",
    tackles: "Number of tackles made during the match.",
    passes: "Total number of passes completed by the team.",
    oppositionPasses: "Total number of passes completed by the opposition.",
    xGWithin8SecondsOfCorner: "Expected goals within 8 seconds of a corner kick.",
    shotsWithin8SecondsOfCorner: "Shots taken within 8 seconds of a corner kick.",
    goalsWithin8SecondsOfCorner: "Goals scored within 8 seconds of a corner kick.",
    decelerations: "Number of decelerations performed by the team.",
    accelerations: "Number of accelerations performed by the team.",
    hsr: "High-speed runs measured in meters.",
    sprints: "Number of sprints performed by the team.",
    jumps: "Number of jumps performed by the team.",
    xGWithin8SecondsOfFreeKick: "Expected goals within 8 seconds of an indirect free kick.",
    shotsWithin8SecondsOfFreeKick: "Shots taken within 8 seconds of an indirect free kick.",
    goalsWithin8SecondsOfFreeKick: "Goals scored within 8 seconds of an indirect free kick.",
    pressuresRegained: "Number of pressures regained during the match.",
    monteCarloWinProb: "Monte Carlo simulation probability of winning.",
    monteCarloDrawProb: "Monte Carlo simulation probability of drawing.",
    monteCarloLossProb: "Monte Carlo simulation probability of losing.",
};

export const calculateAverageMetrics = <T extends Record<string, number | string>>(matches: { metrics: T }[]): T => {
    if (matches.length === 0) return {} as T;

    const keys = Object.keys(matches[0].metrics) as (keyof T)[];
    const averages = {} as Record<keyof T, number>;

    keys.forEach((key) => {
        const sum = matches.reduce((acc, match) => acc + (parseFloat(match.metrics[key] as string) || 0), 0);
        averages[key] = parseFloat((sum / matches.length).toFixed(2));
    });

    return averages as T; // Ensure type compatibility
};
