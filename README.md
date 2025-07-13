
# bModel Visualizer

**Bayesian Substitution Model Support Graph** — an interactive SolidJS + D3 visualization tool for exploring posterior model support and structural relationships among DNA substitution models (e.g., from bModelTest, BEAST2, or MrBayes).

This component improves upon static diagrams by offering intelligent layout, interactivity, and full support interpretation.

---

## 🔍 Key Features

* **Responsive Layout**: Adapts to container width, height, and aspect ratio.
* **Zoom & Pan**: Mouse/touch-based zooming and panning using `d3.zoom()`.
* **Force-Directed Graph**:

  * Links and collisions managed via `d3.forceSimulation`.
  * Horizontal layout can optionally "pin" nodes using `pinX` prop.
* **Layered Vertical Levels**:

  * Automatic topological sorting from DAG structure.
  * Each node placed on a vertical level (layer) based on graph depth.
* **Node Size = Posterior Support**:

  * Radius scales with support values: `r = max(200 * support, 4)`.
* **Color Encoding**:

  * Green: `inHPD = true`
  * Red: `inHPD = false`
  * Gray: `inHPD = undefined`
* **Smart Label Placement**:

  * Automatically avoids overlap using average vector away from neighbors.
  * Responsive font size based on zoom scale.
* **Interactive Tooltips**:

  * Mouse hover reveals label and posterior support.
* **Focus Mode**:

  * Click a node to highlight all its direct links and neighbors.
  * Sidebar shows metadata (support, HPD status, neighbors).
* **Reset View**:

  * Double-click on background or reclick selected node.
* **Drag & Lock**:

  * Drag any node to a fixed position. Reposition freely.
* **Legend**:

  * Color-coded box in top-left corner for HPD interpretation.
* **Dark/Light Theme**:

  * Controlled via global CSS variables or manual toggle.
* **Configurable Props**:

  * `pinX`: boolean to control whether nodes are grouped horizontally.
  * `colors`: full theme customization for nodes, links, arrowheads, and focus.

---

## 🛠️ Example Usage

```tsx
<ModelGraph
  data={graphData}
  width={960}
  height={600}
  aspect={2}
  showSidebar={true}
  pinX={true}
  colors={{
    inHPD: "#009966",
    notInHPD: "#CC3333",
    unknown: "#999999",
    arrow: "#333",
    stroke: "#AAA",
    focusSource: "#cc0000",
    focusTarget: "#0000cc",
  }}
/>
```

---

## ⚙️ Input Format

```ts
interface Model {
  id: string;            // Unique identifier
  label: string;         // Display name
  support: number;       // Posterior probability (0–1)
  inHPD?: boolean | null // Optional: 95% HPD inclusion
}

interface Link {
  source: string; // ID of parent model
  target: string; // ID of child model
}
```

---

## 📁 File Structure Summary

```
src/
├── App.tsx               # Main entry with theme toggle and container
├── ModelGraph.tsx        # Full D3-based visualization logic
├── data/exampleModels.ts # Sample model/link dataset
├── App.css, index.css    # Styling for layout and themes
└── index.tsx             # SolidJS entrypoint
```

---

## ✅ Improvements over Existing Tools

| Feature              | Existing Tools | This Component |
| -------------------- | -------------- | -------------- |
| Static layout        | ✅              | ✅              |
| Zoom & Pan           | ❌              | ✅              |
| Posterior-based size | ❌              | ✅              |
| Sidebar metadata     | ❌              | ✅              |
| Tooltip + Focus view | ❌              | ✅              |
| Label spacing logic  | ❌              | ✅              |
| Clustering heuristic | ❌              | ✅ (via `pinX`) |
| Themeable            | ❌              | ✅              |
| Dragging nodes       | ❌              | ✅              |

---

## 🧪 Intern Development Log

### Phase 1 – Domain Research (July 1–2)

* Surveyed model selection tools: bModelTest, BEAST2, MrBayes.
* Identified need for interactive visualization of posterior support.
* Designed input JSON schema and layout logic.

### Phase 2 – Functional MVP (July 3–7)

* Implemented SolidJS component with D3 logic.
* Features: zoom, drag, layout, labels, node coloring.

### Phase 3 – Visual & Usability Polish (July 8–13)

* Added:

  * Sidebar
  * Arrow markers
  * Topological sorting for vertical layering
  * `pinX` boolean clustering
  * Theme system (color props, dark mode)
  * Force tuning and label avoidance
  * Tooltip enhancements and view reset

---
## Screenshots
<img width="1209" height="874" alt="Screenshot 2025-07-13 at 12 53 02 PM" src="https://github.com/user-attachments/assets/8eadacaf-cf9f-40c7-8836-d62ee1ddb305" />
<img width="1114" height="825" alt="Screenshot 2025-07-13 at 12 53 24 PM" src="https://github.com/user-attachments/assets/80922cb1-cd90-48fb-a791-870fed25e1e7" />
<img width="1118" height="820" alt="Screenshot 2025-07-13 at 12 53 40 PM" src="https://github.com/user-attachments/assets/e784aa85-d144-4026-bfa8-5e6597be4d19" />
<img width="1160" height="862" alt="Screenshot 2025-07-13 at 12 54 06 PM" src="https://github.com/user-attachments/assets/9381aaa6-99ff-405e-9c95-df70d532eedb" />


## Technical Stack

| Technology | Purpose                               |
| ---------- | ------------------------------------- |
| SolidJS    | UI components and reactive state      |
| D3.js      | Force-directed layout, zoom, tooltips |
| Vite       | Build and dev server                  |
| CSS Vars   | Theme and container styling           |

---

## Installation

```bash
git clone https://github.com/your-username/bmodel-visualizer
cd bmodel-visualizer
npm install
npm run dev
```

---

## Todos & Future Work

* Add filters (e.g., minimum support threshold)
* Export graph as PNG/SVG
* Animate over MCMC samples
* Implement search by model label or ID
* Integrate with BEAST2 or MrBayes outputs

---

## License

MIT — free to use, modify, and distribute. Please cite if used in academic research.

