import './App.css';
import { exampleData } from './data/exampleModels';
import ModelGraph from './ModelGraph';

function App() {
  return (
    <div>
      <h2 style={{ "text-align": "center", "margin-bottom": "1rem" }}>
        bModelTest Substitution Model Graph
      </h2>
      <ModelGraph data={exampleData} />
    </div>
  );
}

export default App;