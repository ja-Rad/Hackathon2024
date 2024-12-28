export interface Match {
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
