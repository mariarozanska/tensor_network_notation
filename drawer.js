function draw(tensors, contractions) {

    const shifts = {
        up: [0, -0.75],
        down: [0, 0.75],
        left: [-0.75, 0],
        right: [0.75, 0]
    };

    contractions.forEach((d) => {
        if (typeof d.target === 'string') {
            const dv = shifts[d.target];
            d.target = {
                x: d.source.x + dv[0],
                y: d.source.y + dv[1]
            };
            d.labelPosition = {
                x: d.source.x + 1.4 * dv[0],
                y: d.source.y + 1.4 * dv[1]
            };
        }
    });


    const xScale = d3.scaleLinear()
        .domain([0, 8])
        .range([100, 500]);

    const yScale = d3.scaleLinear()
        .domain([0, 8])
        .range([100, 500]);

    const lineFunction = d3.line()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y));

    //const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const colorScale = d3.scaleOrdinal()
        .range(["#763E9B", "#00882B", "#C82505", "#EEEEEE", "#0165C0"]);

    const svg = d3.select("svg");
    svg.selectAll("*").remove();

    svg.selectAll(".contraction")
        .data(contractions)
        .enter().append("path")
        .attr("class", "contraction")
        .attr("d", (d) => lineFunction([d.source, d.target]));

    svg.selectAll(".tensor")
        .data(tensors)
        .enter().append("circle")
        .attr("class", "tensor")
        .attr("r", 12)
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .style("fill", (d) => colorScale(d.name));

    svg.selectAll(".tensor-label")
        .data(tensors)
        .enter().append("text")
        .attr("class", "tensor-label")
        .attr("x", (d) => xScale(d.x))
        .attr("y", (d) => yScale(d.y + 0.1))
        .text((d) => d.name);

    svg.selectAll(".contraction-label")
        .data(contractions.filter((d) => !!d.labelPosition))
        .enter().append("text")
        .attr("class", "contraction-label")
        .attr("x", (d) => xScale(d.labelPosition.x))
        .attr("y", (d) => yScale(d.labelPosition.y))
        .text((d) => d.name);

}