import * as d3 from "d3";

type ChartDataPoint = {
    axis: string;
    match: number;
    season: number;
};

export const renderSpiderChart = (container: HTMLElement | null, title: string, data: ChartDataPoint[]): void => {
    if (!container) return;

    const maxValue = Math.max(...data.flatMap((d) => [d.match, d.season]));
    const width = 550;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 40;
    const angleSlice = (Math.PI * 2) / data.length;

    const svg = d3
        .select(container)
        .html("") // Clear previous chart
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2 + 20})`);

    const radialScale = d3.scaleLinear().domain([0, maxValue]).range([0, radius]);

    // Draw circles
    g.selectAll(".levels")
        .data(d3.range(1, 6))
        .enter()
        .append("circle")
        .attr("r", (d) => (radius / 5) * d)
        .attr("fill", "none")
        .attr("stroke", "#ddd");

    // Draw axes
    const axis = g.selectAll(".axis").data(data).enter().append("g").attr("class", "axis");

    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => radialScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y2", (d, i) => radialScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2))
        .attr("stroke", "#ddd");

    axis.append("text")
        .attr("x", (d, i) => radialScale(maxValue * 1.3) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y", (d, i) => radialScale(maxValue * 1.3) * Math.sin(angleSlice * i - Math.PI / 2) + 5)
        .text((d) => d.axis)
        .style("font-size", "12px")
        .style("fill", "white")
        .attr("text-anchor", "middle");

    const line = d3
        .lineRadial<{ axis: string; value: number }>()
        .radius((d) => radialScale(d.value))
        .angle((_, i) => i * angleSlice);

    // Match polygon
    const matchPolygon = g
        .append("path")
        .datum(data.map((d) => ({ axis: d.axis, value: 0 })))
        .attr("d", (d) => line(d as { axis: string; value: number }[]) ?? "")
        .attr("fill", "#ff6666")
        .attr("fill-opacity", 0.5);

    matchPolygon
        .datum(data.map((d) => ({ axis: d.axis, value: d.match })))
        .transition()
        .duration(1000)
        .attr("d", (d) => line(d as { axis: string; value: number }[]) ?? "");

    // Season polygon
    const seasonPolygon = g
        .append("path")
        .datum(data.map((d) => ({ axis: d.axis, value: 0 })))
        .attr("d", (d) => line(d as { axis: string; value: number }[]) ?? "")
        .attr("fill", "#6666ff")
        .attr("fill-opacity", 0.5);

    seasonPolygon
        .datum(data.map((d) => ({ axis: d.axis, value: d.season })))
        .transition()
        .duration(1000)
        .attr("d", (d) => line(d as { axis: string; value: number }[]) ?? "");
};
