import { createSignal, onMount } from "solid-js";
import ModelGraph from "./ModelGraph";
import { exampleData } from "./data/exampleModels";
import "./App.css";

export default function App() {
  const [graphData] = createSignal(exampleData);
  const [theme, setTheme] = createSignal<"light" | "dark">("light");

  onMount(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme());
    document.documentElement.setAttribute("data-theme", theme());
  });

  const toggleTheme = () => {
    const newTheme = theme() === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.classList.toggle("light", newTheme === "light");
  };

  return (
    <main class="app-container">
      <header class="app-header">
        <h1 class="app-title">Bayesian Model Structure Graph</h1>
        <p class="app-subtitle">
          Visual representation of model relationships, support values, and hierarchical connections.
        </p>
        <div class="theme-toggle">
          <label>Light</label>
          <label class="theme-switch">
            <input
              type="checkbox"
              checked={theme() === "dark"}
              onInput={toggleTheme}
            />
            <span class="slider" />
          </label>
          <label>Dark</label>
        </div>
      </header>

      <section class="app-graph-section">
        <ModelGraph data={graphData()} width={960} height={600} showSidebar={true} />
      </section>
    </main>
  );
}