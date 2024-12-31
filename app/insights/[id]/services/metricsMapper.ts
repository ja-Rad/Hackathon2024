import { MatchData } from "@/app/types/matchData";
import { DetailedMetrics, KpiMetrics } from "../../../types/metrics";

export function mapMatchMetrics(matchData: MatchData) {
    return {
        offensive: {
            goals_scored: parseFloat(matchData.goals_scored),
            np_xg: parseFloat(matchData.np_xg),
            shots_on_target: parseFloat(matchData.shots_on_target),
            completed_passes_into_the_box: parseFloat(matchData.completed_passes_into_the_box),
            xg_within_8_seconds_of_corner: parseFloat(matchData.xg_within_8_seconds_of_corner),
        },
        defensive: {
            goals_conceded: parseFloat(matchData.goals_conceded),
            np_xg_conceded: parseFloat(matchData.np_xg_conceded),
            tackles: parseFloat(matchData.tackles),
            pressure_regains: parseFloat(matchData.pressure_regains),
            opposition_shots: parseFloat(matchData.opposition_shots),
        },
        general: {
            possession: parseFloat(matchData.possession),
            passes: parseFloat(matchData.passes || "0"),
            final_third_possession: parseFloat(matchData.final_third_possession),
            ppda: parseFloat(matchData.ppda),
            HSR: parseFloat(matchData.hsr || "0"),
        },
    };
}

export function mapSeasonMetrics(detailedMetrics: DetailedMetrics) {
    return {
        offensive: {
            goals_scored: detailedMetrics.goals_scored,
            np_xg: detailedMetrics.np_xg,
            shots_on_target: detailedMetrics.shots_on_target,
            completed_passes_into_the_box: detailedMetrics.completed_passes_into_the_box,
            xg_within_8_seconds_of_corner: detailedMetrics.xg_within_8_seconds_of_corner,
        },
        defensive: {
            goals_conceded: detailedMetrics.goals_conceded,
            np_xg_conceded: detailedMetrics.np_xg_conceded,
            tackles: detailedMetrics.tackles,
            pressure_regains: detailedMetrics.pressure_regains,
            opposition_shots: detailedMetrics.opposition_shots,
        },
        general: {
            possession: detailedMetrics.possession,
            passes: detailedMetrics.passes,
            final_third_possession: detailedMetrics.final_third_possession,
            ppda: detailedMetrics.ppda,
            HSR: detailedMetrics.hsr,
        },
    };
}

export function mapKpiMetrics(kpiMetrics: KpiMetrics) {
    return {
        offensive: kpiMetrics.offensiveCPI,
        defensive: kpiMetrics.defensiveCPI,
        general: kpiMetrics.generalCPI,
    };
}
