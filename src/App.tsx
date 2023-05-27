import "./App.css";
import { DataTable } from "./components/DataTable";
import { DataProviderContexts } from "./contexts/DataContexts";

function App() {
  return (
    <div className="App">
      <h1> ManuFac </h1>
      <h3> Data Visualization App </h3>
      <DataProviderContexts>
        <DataTable keyToCalculate="Flavanoids" showChange={true} />
        <DataTable keyToCalculate="Gamma" />
      </DataProviderContexts>
    </div>
  );
}

export default App;
