// @ts-ignore
import * as d3 from "https://cdn.skypack.dev/d3";
import { createSignal, onMount, Show } from "solid-js";

export default function ModelGraph(props: {
  data: { models: any[]; links: any[] };
  width?: number;
  height?: number;
  aspect?: number;
  showSidebar?: boolean;
}) {
  let svgRef: SVGSVGElement | undefined;
  const [selectedModel, setSelectedModel] = createSignal<any>(null);

  const aspect           = props.aspect ?? 2;                 // width : height ratio
  const W                = props.width  ?? 800;
  const H                = props.height ?? W / aspect;
  const showPanel        = props.showSidebar !== false;
  const g                = (id: string) => new Set(id).size;

  onMount(() => {
    const svg        = d3.select(svgRef).attr("width", W).attr("height", H).style("background", "#fff");
    svg.selectAll("*").remove();
    const container  = svg.append("g");

    const tooltip = d3.select("body").append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("padding", "6px 8px")
      .style("background", "#222")
      .style("color", "#fff")
      .style("font", "12px sans-serif")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("z-index", "1000");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .filter(e => !e.button)
      .on("zoom", e => container.attr("transform", e.transform));

    svg.call(zoom);

    const nodes = props.data.models.map(d => {
      const r = 30 * d.support;
      const labelW = (d.label.length + 6) * 5;
      return {
        ...d,
        r,
        labelRadius: Math.max(r, labelW / 2),
        generality: g(d.id),
        y: H * (0.1 + 0.8 * (g(d.id) - 1) / 5),
      };
    });

    const links = props.data.links.map(d => ({ ...d }));

    const sim = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links as any).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-250))
      .force("collision", d3.forceCollide().radius((d: any) => d.labelRadius + 20))
      .force("x", d3.forceX().strength(0.25).x((d: any) =>
        d.id.startsWith("121") ? W / 3 : d.id.startsWith("123") ? (2 * W) / 3 : W / 2))
      .force("y", d3.forceY().strength(1).y((d: any) => H * (0.1 + 0.8 * (d.generality - 1) / 5)));

    const link = container.append("g").selectAll("line")
      .data(links).enter().append("line")
      .attr("stroke", "#999").attr("stroke-opacity", 0.6).attr("stroke-width", 1.5);

    const node = container.append("g").selectAll("circle")
      .data(nodes).enter().append("circle")
      .attr("r", (d: any) => d.r)
      .attr("fill", (d: any) => d.support > 0.1 ? "#ff6600" : d.support > 0.05 ? "#ffaa00" : "#cccccc")
      .style("cursor", "pointer")
      .on("mouseenter", (e, d: any) => {
        tooltip.html(`${d.label}<br/>Support ${(d.support * 100).toFixed(1)} %`)
               .style("visibility", "visible");
        spotlight(d);
      })
      .on("mousemove", e => tooltip.style("left", `${e.clientX + 12}px`).style("top", `${e.clientY + 12}px`))
      .on("mouseleave", () => {
        tooltip.style("visibility", "hidden");
        if (!selectedModel()) clearHighlight();
      })
      .on("click", (_, d: any) => {
        const repeat = selectedModel()?.id === d.id;
        repeat ? resetView() : focusOn(d);
      })
      .call(
        d3.drag<SVGCircleElement, any>()
          .on("start", (e, d: any) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
          .on("drag", (e, d: any) => { d.fx = e.x; d.fy = e.y; })
          .on("end",  (e, d: any) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
      );

    const label = container.append("g").selectAll("text")
      .data(nodes).enter().append("text")
      .text((d: any) => `${d.label} (${(d.support * 100).toFixed(1)} %)`)
      .attr("text-anchor", "middle")
      .style("pointer-events", "none")
      .style("font", "12px sans-serif")
      .style("fill", "#333");

    const legendData = [
      { txt: "High > 10 %", col: "#ff6600" },
      { txt: "Medium 5–10 %", col: "#ffaa00" },
      { txt: "Low < 5 %", col: "#cccccc" }
    ];

    const legend = svg.append("g").attr("transform", "translate(16,16)");
    legend.selectAll("rect").data(legendData).enter()
      .append("rect").attr("x", 0).attr("y", (_, i) => i * 20)
      .attr("width", 12).attr("height", 12).attr("fill", d => d.col);
    legend.selectAll("text").data(legendData).enter()
      .append("text").text(d => d.txt)
      .attr("x", 18).attr("y", (_, i) => i * 20 + 10)
      .attr("font-size", "12px").attr("fill", "#333")
      .attr("alignment-baseline", "middle");

    function spotlight(d: any) {
      const nbs = links.filter((l: any) => l.source.id === d.id || l.target.id === d.id)
                       .flatMap((l: any) => [l.source.id, l.target.id]);
      d3.selectAll("circle")
        .style("opacity", (n: any) => (n.id === d.id || nbs.includes(n.id) ? 1 : 0.15))
        .attr("r", (n: any) => (n.id === d.id ? n.r + 6 : n.r));
      d3.selectAll("line")
        .style("opacity", (l: any) => (l.source.id === d.id || l.target.id === d.id ? 1 : 0.05))
        .attr("stroke", (l: any) => (l.source.id === d.id || l.target.id === d.id ? "#4444ff" : "#999"));
    }

    function clearHighlight() {
      d3.selectAll("circle").style("opacity", 1).attr("r", (d: any) => d.r);
      d3.selectAll("line").style("opacity", 0.6).attr("stroke", "#999");
    }

    function fit(nodesFit: any[]) {
      const pad = 60;
      const xE = d3.extent(nodesFit, (n: any) => n.x);
      const yE = d3.extent(nodesFit, (n: any) => n.y);
      const dx = (xE[1] ?? 0) - (xE[0] ?? 0) + pad;
      const dy = (yE[1] ?? 0) - (yE[0] ?? 0) + pad;
      const scale = Math.min(2.5, 0.85 / Math.max(dx / W, dy / H));
      const tx = (W - scale * ((xE[0] ?? 0) + (xE[1] ?? 0))) / 2;
      const ty = (H - scale * ((yE[0] ?? 0) + (yE[1] ?? 0))) / 2;
      return { scale, tx, ty };
    }

    function focusOn(d: any) {
      const neigh = links.filter((l: any) => l.source.id === d.id || l.target.id === d.id)
                         .map((l: any) => (l.source.id === d.id ? l.target.id : l.source.id));
      setSelectedModel({ ...d, neighbors: neigh });

      const { scale, tx, ty } = fit(nodes.filter((n: any) => n.id === d.id || neigh.includes(n.id)));

      svg.transition().duration(1200).ease(d3.easeCubicInOut)
         .call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));

      d3.selectAll("circle").attr("stroke", null).attr("stroke-width", null);
      d3.selectAll("circle")
        .style("opacity", (n: any) => (n.id === d.id || neigh.includes(n.id) ? 1 : 0.1))
        .attr("stroke", (n: any) => (n.id === d.id ? "#fff" : null))
        .attr("stroke-width", (n: any) => (n.id === d.id ? 3 : null));

      d3.selectAll("line")
        .style("opacity", (l: any) => (l.source.id === d.id || l.target.id === d.id ? 1 : 0.05))
        .attr("stroke", (l: any) => (l.source.id === d.id ? "#ff4444" : l.target.id === d.id ? "#4444ff" : "#999"));
    }

    function resetView() {
      setSelectedModel(null);
      clearHighlight();
      d3.selectAll("circle").attr("stroke", null).attr("stroke-width", null);
      svg.transition().duration(1200).ease(d3.easeCubicInOut)
         .call(zoom.transform, d3.zoomIdentity);
    }

    svg.on("dblclick", resetView);

    sim.on("tick", () => {
      link.attr("x1", (d: any) => d.source.x).attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x).attr("y2", (d: any) => d.target.y);
      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
      label.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y - d.r - 6)
           .style("font-size", () => `${Math.min(12 / d3.zoomTransform(svg.node()!).k, 14)}px`);
    });
  });

  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        alignItems: "stretch",
        height: props.height ? `${H}px` : "100%",
        backgroundColor: "var(--graph-bg)",
        borderRadius: "var(--border-radius)",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      <svg
        ref={svgRef}
        style={{
          flex: 1,
          width: props.width ? `${W}px` : "100%",
          height: props.height ? `${H}px` : "100%",
          borderRadius: "var(--border-radius)",
        }}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
      />
      {showPanel && (
        <Show when={selectedModel()}>
          <div
            style={{
              width: "280px",
              fontSize: "0.95rem",
              lineHeight: 1.6,
              padding: "16px",
              border: "1px solid var(--text-muted)",
              backgroundColor: "var(--container-bg)",
              color: "var(--text-title)",
              overflowY: "auto",
              borderRadius: "var(--border-radius)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>{selectedModel().label}</h3>
            <p><strong>Support:</strong> {(selectedModel().support * 100).toFixed(2)} %</p>
            <p><strong>In HPD:</strong> {selectedModel().inHPD ? "Yes" : "No"}</p>
            <p><strong>Connected Models:</strong></p>
            <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
              {selectedModel().neighbors.map((id: string) => <li>{id}</li>)}
            </ul>
          </div>
        </Show>
      )}
    </div>
  );
}