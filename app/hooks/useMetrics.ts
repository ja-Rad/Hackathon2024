import { useState } from "react";
import { KPIMetrics, Metrics } from "../types/metrics";

export function useMetrics() {
    const [matchMetrics, setMatchMetrics] = useState<Metrics | null>(null);
    const [seasonMetrics, setSeasonMetrics] = useState<Metrics | null>(null);
    const [kpiMetrics, setKpiMetrics] = useState<KPIMetrics | null>(null);

    return { matchMetrics, setMatchMetrics, seasonMetrics, setSeasonMetrics, kpiMetrics, setKpiMetrics };
}
