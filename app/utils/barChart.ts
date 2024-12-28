import * as d3 from "d3";

export const renderBarChart = (container: HTMLElement, data: { value: number; label: string }[], metricLabel: string): void => {
    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    const svg = d3
        .select(container)
        .html("") // Clear previous chart
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2) // Adjust the y-position to avoid overlap
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "#fff")
        .style("dominant-baseline", "middle")
        .text(metricLabel);

    const x = d3
        .scaleBand()
        .domain(data.map((d) => d.label))
        .range([0, width])
        .padding(0.2);

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value) ?? 0])
        .nice()
        .range([height, 0]);

    // X-axis
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).tickSize(0)).selectAll("text").attr("transform", "rotate(-45)").style("text-anchor", "end");

    // Y-axis
    svg.append("g").call(d3.axisLeft(y));

    // Bars with animation
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => x(d.label) ?? 0)
        .attr("width", x.bandwidth())
        .attr("y", height) // Start at the bottom of the chart
        .attr("height", 0) // Start with a height of 0
        .attr("fill", "#4F46E5")
        .attr("opacity", 0.8)
        .transition() // Add transition for animation
        .delay((_, i) => i * 100) // Delay each bar based on its index
        .duration(800) // Duration of the animation
        .attr("y", (d) => y(d.value)) // Final y position
        .attr("height", (d) => height - y(d.value)); // Final height

    // Labels with animation
    svg.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", (d) => (x(d.label) ?? 0) + x.bandwidth() / 2)
        .attr("y", height) // Start at the bottom of the chart
        .attr("text-anchor", "middle")
        .attr("opacity", 0) // Start with invisible labels
        .transition() // Add transition for animation
        .delay((_, i) => i * 100) // Delay each label based on its index
        .duration(800) // Duration of the animation
        .attr("y", (d) => y(d.value) - 5) // Final y position
        .attr("opacity", 1) // Fade in
        .text((d) => d.value.toFixed(2))
        .attr("fill", "#fff");
};
