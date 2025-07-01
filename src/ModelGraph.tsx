// @ts-ignore
import * as d3 from "https://cdn.skypack.dev/d3";
import { onMount } from "solid-js";

export default function ModelGraph(props: { data: any }) {
  let svgRef: SVGSVGElement | undefined;

  onMount(() => {
    const width = 600, height = 400;

    const svg = d3.select(svgRef)
      .attr("width", width)
      .attr("height", height)
      .style("border", "1px solid #ccc");

    svg.selectAll("*").remove();

    const nodes = props.data.models.map((d: any) => ({ ...d }));
    const links = props.data.links.map((d: any) => ({ ...d }));

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-width", 2);

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", d => 30 * d.support)
      .attr("fill", d => d.inHPD ? "#1f77b4" : "#ff7f0e")
      .call(d3.drag()
        .on("start", (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .enter().append("text")
      .text(d => `${d.label} (${(d.support * 100).toFixed(1)}%)`)
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("dy", -10);

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      label
        .attr("x", d => d.x)
        .attr("y", d => d.y - 35 * d.support);
    });
  });

  return <svg ref={svgRef}></svg>;
}