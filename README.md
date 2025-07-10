

# bModel Visualizer

**Bayesian Substitution Model Support Graph** — an interactive SolidJS + D3 component for visualizing posterior model support and relationships between DNA substitution models (e.g., from bModelTest, BEAST2, or MrBayes).

This tool improves traditional static graphs by offering a responsive layout, zoomable interface, and clarity in support values and hierarchical model transitions.

---

## Features

* **Aspect-Ratio-Aware Layout**: Automatically adapts to container dimensions.
* **Interactive Zoom & Pan**: Freely explore dense graphs.
* **Posterior Support Encoding**: Node size, color, and tooltips reflect posterior support.
* **Model Focus + Neighborhood**: Click a node to highlight its links and connections.
* **Collision-Aware Force Layout**: Prevents label overlap in dense graphs.
* **Reset & Toggle**: Click again to deselect, or double-click to reset view.
* **Legend + HPD Indicator**: Color-coded support categories, with 95% HPD inclusion.
* **Sidebar Panel**: Shows metadata and links for the selected model.
* **Dark & Light Theme**: Respects system preferences or manual toggle.

---

## Usage Example

```tsx
import { createSignal } from "solid-js";
import ModelGraph from "./ModelGraph";
import { exampleData } from "./data/exampleModels";

export default function App() {
  const [graphData] = createSignal(exampleData);

  return (
    <main>
      <h1>Bayesian Model Structure Graph</h1>
      <ModelGraph
        data={graphData()}
        width={960}
        height={600}
        showSidebar={true}
        aspect={2}
      />
    </main>
  );
}
```

---

## Project Structure

```
src/
├── App.tsx              # Main entry point, handles theme and layout
├── ModelGraph.tsx       # Core visualization component using D3
├── data/
│   └── exampleModels.ts # Mock dataset defining models and links
├── assets/
│   └── solid.svg        # App logo
├── index.css            # Global theme and layout styling
├── App.css              # Page-level and component-specific styles
├── index.tsx            # App bootstrapping for SolidJS
└── vite-env.d.ts        # Type definitions for Vite environment
```

---

## JSON Data Format

The component accepts data in this format:

```json
{
  "models": [
    { "id": "121131", "support": 0.28, "inHPD": true, "label": "TN93" },
    { "id": "123456", "support": 0.09, "inHPD": false, "label": "GTR" }
  ],
  "links": [
    { "source": "121131", "target": "123456" }
  ]
}
```

**Model fields:**

* `support`: Float (0–1), posterior probability.
* `inHPD`: Boolean, whether part of the 95% HPD set.
* `label`: Human-readable model name.
* `links`: Show parent–child model transitions.

---

## Design Principles

| Goal            | Description                                       |
| --------------- | ------------------------------------------------- |
| Readable Layout | Scales to 100+ models with non-overlapping labels |
| Input Agnostic  | Works with arbitrary model IDs                    |
| Customizable    | Fully themeable and embeddable                    |
| Interactive     | Zoom, pan, focus, metadata sidebar                |
| Lightweight     | Uses SolidJS + D3 with minimal dependencies       |

---

## Intern Project Timeline

### Phase 1: Domain Analysis (July 1–2)

* Reviewed bModelTest, BEAST2, and MrBayes.
* Identified key flaws: static layout, no zoom, no metadata.
* Drafted extensible JSON format for graphs.

### Phase 2: Component Development (July 3–7)

* Built `ModelGraph.tsx` using SolidJS and embedded D3.
* Implemented:

  * Zoom, pan, tooltip, and force layout
  * Radius and color based on support
  * Sidebar with metadata
  * Label scaling and node focus

### Phase 3: Refinement & Appearance (July 8–10)

* Added dynamic styling:

  * Legend and clustering tweaks
  * Dark/light mode with CSS variables
  * Animated sidebar, styled container
  * Improved tooltip and zoom behavior

---

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

