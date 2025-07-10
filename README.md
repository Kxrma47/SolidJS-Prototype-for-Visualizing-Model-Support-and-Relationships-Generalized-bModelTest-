🧬 bModel Visualizer

Bayesian Substitution Model Support Graph — an interactive SolidJS + D3 component for visualizing posterior model support and relationships between DNA substitution models (e.g., from bModelTest, BEAST, or MrBayes).

This tool improves on traditional static model graphs by offering a responsive layout, zoomable interface, and clarity for support values and hierarchical model relationships.

⸻

📌 Features
	•	📐 Aspect-Ratio-Aware Layout — automatically adapts to container dimensions
	•	🧭 Interactive Zoom & Pan — explore dense graphs fluidly
	•	📊 Posterior Support Encoding — node size, color, and tooltips indicate model support
	•	🔍 Model Focus + Neighborhood — click a model to highlight its links and connections
	•	🧱 Collision-Aware Force Layout — avoids label overlaps for high-density graphs
	•	🧭 Reset & Toggle — click again to deselect or double-click to reset view
	•	🖼️ Legend + HPD Indicator — color-based legend for intuitive interpretation
	•	🧩 Sidebar Panel — shows metadata and connected models for selected node
	•	💡 Dark & Light Theme Support — based on system preferences

⸻

🛠️ Usage Example

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


⸻

📁 Project Structure

src/
├── App.tsx              # Main entry point
├── ModelGraph.tsx       # Visualization component
├── data/
│   └── exampleModels.ts # Mock dataset (models + links)
├── assets/
│   └── solid.svg        # Logo
├── index.css            # Theme + layout styling
├── App.css              # Title bar / demo styles
├── index.tsx            # App bootstrapping
└── vite-env.d.ts


⸻

🧩 JSON Data Format

The ModelGraph component takes an input of this format:

{
  "models": [
    { "id": "121131", "support": 0.28, "inHPD": true, "label": "TN93" },
    { "id": "123456", "support": 0.09, "inHPD": false, "label": "GTR" }
  ],
  "links": [
    { "source": "121131", "target": "123456" }
  ]
}

	•	support: Float (0–1), posterior probability
	•	inHPD: Boolean, whether part of the 95% HPD set
	•	label: Human-readable model name
	•	links: Show parent–child model transitions

⸻

🎯 Design Principles

Goal	Description
Readable Layout	Scales to 100+ models with non-overlapping text
Input Agnostic	Does not rely on model ID structure
Customizable	Themeable, embeddable, and responsive
Interactive	Zoom, pan, highlight, and sidebar info
Lightweight	Built using SolidJS + D3 with minimal dependencies


⸻

🔍 Intern Project Phases Summary

Phase 1: Domain Analysis (July 1–2)
	•	Reviewed model structure visualizations in bModelTest, BEAST2, and MrBayes
	•	Identified key problems:
	•	Static and dense layouts in bModelTest
	•	Lack of interactive exploration
	•	No model metadata view (support, HPD, ID)
	•	Outlined JSON-based model format for extensible graph rendering

Phase 2: Component Development (July 3–7)
	•	Initialized SolidJS project and created ModelGraph.tsx component
	•	Embedded D3.js logic for:
	•	Force-directed layout with ID-based clustering
	•	Node radius based on support
	•	Text labels scaled with zoom
	•	Click-to-focus behavior with zoom/pan
	•	Sidebar with selected model metadata
	•	Hover tooltip with model info

Phase 3: Refinement & Appearance (July 8–10)
	•	Enhanced visual clarity with:
	•	Dynamic link opacity for inactive edges
	•	Color-coded nodes (high/medium/low support)
	•	Tooltip polish and positioning
	•	Dark/light mode toggle (theme-sensitive styles)
	•	Container styling with shadows and rounded corners
	•	Improved readability:
	•	Sidebar animation
	•	Graph padding and zoom reset
	•	Legend block added to graph area

⸻

⚙️ Technical Stack

Technology	Use
SolidJS	Component reactivity, signals
D3.js	Force-directed layout, zoom, tooltips
Vite	Build system
CSS Variables	Theme and layout customization


⸻

📸 Screenshots
![Screenshot 2025-07-10 at 9 45 58 AM](https://github.com/user-attachments/assets/1b254175-98d5-4f0c-9d2a-a22feac81332)
![Screenshot 2025-07-10 at 9 46 08 AM](https://github.com/user-attachments/assets/27d3bf30-bd1d-480b-ae98-327404b458b9)
![Screenshot 2025-07-10 at 9 46 43 AM](https://github.com/user-attachments/assets/2885de35-8269-4503-b83b-152b70ad3c3e)


⸻

📦 Installation & Run

git clone https://github.com/your-username/bmodel-visualizer
cd bmodel-visualizer
npm install
npm run dev


⸻

 Todos & Future Work
	•	Add filters (e.g., min support threshold)
	•	Export as PNG/SVG
	•	Animate MCMC samples or time series
	•	Add search by label or model ID
	•	Integration with BEAST2 outputs

⸻

📄 License

MIT — free to use, modify, and extend. Please cite if used in academic projects.

