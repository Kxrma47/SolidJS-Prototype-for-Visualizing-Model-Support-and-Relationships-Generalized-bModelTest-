import { createSignal } from "solid-js";
import ModelGraph from "./ModelGraph";
import { exampleData } from "./data/exampleModels";
import "./App.css";

export default function App() {
  const [graphData] = createSignal(exampleData);

  return (
    <main class="app-root">
      <header class="app-header">
        <h1 class="app-title">Bayesian Model Structure Graph</h1>
        <p class="app-subtitle">
          Visual representation of model relationships, support values, and hierarchical connections.
        </p>
      </header>

      <section class="app-graph-section">
        <ModelGraph data={graphData()} width={960} height={600} showSidebar={true} />
      </section>
    </main>
  );
}