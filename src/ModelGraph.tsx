// @ts-ignore
import * as d3 from "https://cdn.skypack.dev/d3";
import { createSignal, onMount, Show } from "solid-js";

interface Model {
  id: string;
  label: string;
  support: number;
  inHPD?: boolean | null;
}

interface Link {
  source: string;
  target: string;
}

type NodeDatum = Model & {
  r: number;
  labelRadius: number;
  generality: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
};

type SimLink = Link & d3.SimulationLinkDatum<NodeDatum>;

export default function ModelGraph(props: {
  data: { models: Model[]; links: Link[] };
  width?: number;
  height?: number;
  aspect?: number;
  showSidebar?: boolean;
  pinX?: boolean;
  colors?: {
    inHPD?: string;
    notInHPD?: string;
    unknown?: string;
    arrow?: string;
    stroke?: string;
    focusSource?: string;
    focusTarget?: string;
  };
}) {
  let svgRef: SVGSVGElement | undefined;
  const [selectedModel, setSelectedModel] = createSignal<NodeDatum | null>(null);

  const aspect = props.aspect ?? 2;
  const W = props.width ?? 800;
  const H = props.height ?? W / aspect;
  const color = {
    inHPD: props.colors?.inHPD ?? "#0074D9",       // Blue
    notInHPD: props.colors?.notInHPD ?? "#FF4136", // Red
    unknown: props.colors?.unknown ?? "#CCCCCC",   // Gray
    arrow: props.colors?.arrow ?? "#333",          // Arrowhead
    stroke: props.colors?.stroke ?? "#999",        // Line
    focusSource: props.colors?.focusSource ?? "#ff4444", // Red focus
    focusTarget: props.colors?.focusTarget ?? "#4444ff"  // Blue focus
  };


  const g = (id: string) => new Set(id).size;

  onMount(() => {
    const svg = d3
      .select(svgRef)
      .attr("width", W)
      .attr("height", H)
      .style("background", "#fff");

    svg.selectAll("*").remove();
    renderGraph(svg);
  });

  function renderGraph(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 10)
      .attr("refY", 5)
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .attr("orient", "auto")
      .attr("markerUnits", "userSpaceOnUse")
      .append("path")
      .attr("d", "M0,0 L10,5 L0,10 Z")
      .attr("fill", color.arrow);

    const container = svg.append("g");

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("padding", "6px 8px")
      .style("background", "#222")
      .style("color", "#fff")
      .style("font", "12px sans-serif")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("z-index", "1000");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .filter(e => !e.button)
      .on("zoom", e => container.attr("transform", e.transform));

    svg.call(zoom);

    const nodes: NodeDatum[] = props.data.models.map(m => {
      const r = Math.max(200 * m.support, 4);
      const labelW = (m.label.length + 6) * 5;
      return {
        ...m,
        r,
        labelRadius: Math.max(r, labelW / 2),
        generality: g(m.id),
      };
    });

    const links: SimLink[] = props.data.links.map(l => ({ ...l }));


    const indeg = new Map<string, number>();
    nodes.forEach(n => indeg.set(n.id, 0));
    links.forEach(l => indeg.set(l.target, (indeg.get(l.target) || 0) + 1));
    const queue: NodeDatum[] = nodes.filter(n => indeg.get(n.id) === 0);
    const levels = new Map<string, number>();
    queue.forEach(n => levels.set(n.id, 0));
    while (queue.length) {
      const n = queue.shift()!;
      const lvl = levels.get(n.id)!;
      links.filter(l => l.source === n.id).forEach(l => {
        const tgt = nodes.find(x => x.id === l.target)!;
        if (!levels.has(tgt.id) || levels.get(tgt.id)! < lvl + 1) levels.set(tgt.id, lvl + 1);
        indeg.set(tgt.id, indeg.get(tgt.id)! - 1);
        if (indeg.get(tgt.id) === 0) queue.push(tgt);
      });
    }
    const maxLevel = Math.max(...Array.from(levels.values()));
    const layerH = (H - 40) / (maxLevel || 1);

    const sim = d3
      .forceSimulation<NodeDatum>(nodes)
      .force(
        "link",
        d3
          .forceLink<NodeDatum, SimLink>(links)
          .id(d => d.id)
          .distance(120),
      )
      .force("charge", d3.forceManyBody<NodeDatum>().strength(-250))
      .force("collision", d3.forceCollide<NodeDatum>().radius(d => d.labelRadius + 20))
      .force(
        "x",
        d3
          .forceX<NodeDatum>()
          .strength(0.25)
          .x(d =>
            props.pinX
              ? W / 2
              : d.id.startsWith("121")
              ? W / 3
              : d.id.startsWith("123")
              ? (2 * W) / 3
              : W / 2
          )
      )
      .force("y", d3.forceY<NodeDatum>().strength(1).y(d => {
        const ly = levels.get(d.id) || 0;
        return 20 + ly * layerH;
      }));

    const link = container
      .append("g")
      .selectAll<SVGLineElement, SimLink>("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", color.stroke)
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d =>
        (d.source as NodeDatum).id === selectedModel()?.id || (d.target as NodeDatum).id === selectedModel()?.id
          ? 3.5
          : 2.5
      )
      .attr("marker-end", () => `url(#arrow)`);

    const node = container
      .append("g")
      .selectAll<SVGCircleElement, NodeDatum>("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", d => d.r)
      .attr("fill", d =>
        d.inHPD === true ? color.inHPD : d.inHPD === false ? color.notInHPD : color.unknown
      )
      .style("cursor", "pointer")
      .on("mouseenter", (_e, d) => {
        tooltip
          .html(`${d.label}<br/>Support ${(d.support * 100).toFixed(1)} %`)
          .style("visibility", "visible");
        spotlight(d);
      })
      .on("mousemove", e => tooltip.style("left", `${e.clientX + 12}px`).style("top", `${e.clientY + 12}px`))
      .on("mouseleave", () => {
        tooltip.style("visibility", "hidden");
        if (!selectedModel()) clearHighlight();
      })
      .on("click", (_e, d) => {
        const repeat = selectedModel()?.id === d.id;
        repeat ? resetView(svg, zoom) : focusOn(d, svg, zoom);
      })
      .call(
        d3
          .drag<SVGCircleElement, NodeDatum>()
          .on("start", (e, d) => {
            if (!e.active) sim.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (e, d) => {
            d.fx = e.x;
            d.fy = e.y;
          })
          .on("end", (e, d) => {
            if (!e.active) sim.alphaTarget(0);
            // Lock position
            d.fx = d.x;
            d.fy = d.y;
          }),
      );

    const label = container
      .append("g")
      .selectAll<SVGTextElement, NodeDatum>("text")
      .data(nodes)
      .enter()
      .append("text")
      .text(d => `${d.label} (${(d.support * 100).toFixed(1)} %)`)
      .attr("text-anchor", "middle")
      .style("pointer-events", "none")
      .style("font", "12px sans-serif")
      .style("fill", "#333");

const legendData = [
  { txt: "In HPD", col: color.inHPD },
  { txt: "Not in HPD", col: color.notInHPD },
  { txt: "Unknown", col: color.unknown },
];

    const legend = svg.append("g").attr("transform", "translate(16,16)");
    legend
      .selectAll("rect")
      .data(legendData)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (_, i) => i * 20)
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", d => d.col);
    legend
      .selectAll("text")
      .data(legendData)
      .enter()
      .append("text")
      .text(d => d.txt)
      .attr("x", 18)
      .attr("y", (_, i) => i * 20 + 10)
      .attr("font-size", "12px")
      .attr("fill", "#333")
      .attr("alignment-baseline", "middle");

    svg.on("dblclick", () => resetView(svg, zoom));

    sim.on("tick", () => {
      link
        .attr("x1", d => {
          const s = d.source as NodeDatum;
          const t = d.target as NodeDatum;
          const dx = t.x! - s.x!;
          const dy = t.y! - s.y!;
          const dist = Math.sqrt(dx * dx + dy * dy);
          return s.x! + (dx * s.r) / dist;
        })
        .attr("y1", d => {
          const s = d.source as NodeDatum;
          const t = d.target as NodeDatum;
          const dx = t.x! - s.x!;
          const dy = t.y! - s.y!;
          const dist = Math.sqrt(dx * dx + dy * dy);
          return s.y! + (dy * s.r) / dist;
        })
        .attr("x2", d => {
          const s = d.source as NodeDatum;
          const t = d.target as NodeDatum;
          const dx = t.x! - s.x!;
          const dy = t.y! - s.y!;
          const dist = Math.sqrt(dx * dx + dy * dy);
          return t.x! - (dx * (t.r + 4)) / dist;
        })
        .attr("y2", d => {
          const s = d.source as NodeDatum;
          const t = d.target as NodeDatum;
          const dx = t.x! - s.x!;
          const dy = t.y! - s.y!;
          const dist = Math.sqrt(dx * dx + dy * dy);
          return t.y! - (dy * (t.r + 4)) / dist;
        });

      node
        .attr("cx", d => d.x!)
        .attr("cy", d => {
          const ly = levels.get(d.id) || 0;
          const fy = 20 + ly * layerH;
          d.y = fy;
          return fy;
        });

      label
        .attr("x", d => {
          const related = links.filter(l => l.source === d || l.target === d);
          const avg = related.reduce(
            (acc, l) => {
              const other = l.source === d ? (l.target as NodeDatum) : (l.source as NodeDatum);
              acc.dx += d.x! - other.x!;
              acc.dy += d.y! - other.y!;
              return acc;
            },
            { dx: 0, dy: 0 },
          );
          const count = related.length || 1;
          const dx = avg.dx / count;
          const dy = avg.dy / count;
          const norm = Math.sqrt(dx * dx + dy * dy) || 1;
          const offset = d.r + 18;
          return d.x! + (dx / norm) * offset;
        })
        .attr("y", d => d.y - d.r - 6)
        .style("font-size", () => `${Math.min(12 / d3.zoomTransform(svg.node()!).k, 14)}px`);
    });

    function spotlight(target: NodeDatum) {
      const neighborIds = new Set(
        links
          .filter(l => l.source === target || l.target === target)
          .flatMap(l => [(l.source as NodeDatum).id, (l.target as NodeDatum).id]),
      );

      node.style("opacity", n => (n.id === target.id || neighborIds.has(n.id) ? 1 : 0.5));
      label.style("opacity", n => (n.id === target.id || neighborIds.has(n.id) ? 1 : 0.5));
      link
        .style("opacity", l => ((l.source as NodeDatum).id === target.id || (l.target as NodeDatum).id === target.id ? 1 : 0.2))
        .attr("stroke", l =>
          (l.source as NodeDatum).id === target.id
            ? color.focusSource
            : (l.target as NodeDatum).id === target.id
            ? color.focusTarget
            : color.stroke
        )
    }

    function clearHighlight() {
      node.style("opacity", 1);
      label.style("opacity", 1);
      link.style("opacity", 0.6).attr("stroke", color.stroke);
    }

    function fit(nodesFit: NodeDatum[]) {
      const pad = 60;
      const xE = d3.extent(nodesFit, n => n.x);
      const yE = d3.extent(nodesFit, n => n.y);
      const dx = (xE[1] ?? 0) - (xE[0] ?? 0) + pad;
      const dy = (yE[1] ?? 0) - (yE[0] ?? 0) + pad;
      const scale = Math.min(2.5, 0.85 / Math.max(dx / W, dy / H));
      const tx = (W - scale * ((xE[0] ?? 0) + (xE[1] ?? 0))) / 2;
      const ty = (H - scale * ((yE[0] ?? 0) + (yE[1] ?? 0))) / 2;
      return { scale, tx, ty };
    }

    function focusOn(d: NodeDatum, svgSel: any, zoomSel: any) {
      const neigh = links
        .filter(l => l.source === d || l.target === d)
        .map(l => ((l.source === d ? l.target : l.source) as NodeDatum).id);

      setSelectedModel({ ...d, neighbors: neigh });

      const { scale, tx, ty } = fit(nodes.filter(n => n.id === d.id || neigh.includes(n.id)));

      svgSel
        .transition()
        .duration(1200)
        .ease(d3.easeCubicInOut)
        .call(zoomSel.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
    }

    function resetView(svgSel: any, zoomSel: any) {
      setSelectedModel(null);
      clearHighlight();
      svgSel
        .transition()
        .duration(1200)
        .ease(d3.easeCubicInOut)
        .call(zoomSel.transform, d3.zoomIdentity);
    }
  }

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
        overflow: "hidden",
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
      <div class={`sidebar-panel ${selectedModel() ? "show" : ""}`}>
        <Show when={selectedModel()}>
          <div>
            <h3 style={{ marginTop: 0 }}>{selectedModel()!.label}</h3>
            <p>
              <strong>Support:</strong> {(selectedModel()!.support * 100).toFixed(2)} %
            </p>
            <p>
              <strong>In HPD:</strong>{" "}
              {selectedModel()!.inHPD === undefined
                ? "Unknown"
                : selectedModel()!.inHPD
                ? "Yes"
                : "No"}
            </p>
            <p>
              <strong>Connected Models:</strong>
            </p>
            <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
              {selectedModel()!.neighbors.map(id => (
                <li>{id}</li>
              ))}
            </ul>
          </div>
        </Show>
      </div>
    </div>
  );
}
