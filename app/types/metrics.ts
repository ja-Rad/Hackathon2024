export type Metrics = {
    offensive: { [key: string]: number };
    defensive: { [key: string]: number };
    general: { [key: string]: number };
};

export type KPIMetrics = {
    offensive: number;
    defensive: number;
    general: number;
};

export type DetailedMetrics = {
    goals_scored: number;
    np_xg: number;
    shots_on_target: number;
    completed_passes_into_the_box: number;
    xg_within_8_seconds_of_corner: number;
    goals_conceded: number;
    np_xg_conceded: number;
    tackles: number;
    pressure_regains: number;
    opposition_shots: number;
    possession: number;
    passes: number;
    final_third_possession: number;
    ppda: number;
    hsr: number;
};

export type KpiMetrics = {
    offensiveCPI: number;
    defensiveCPI: number;
    generalCPI: number;
};
