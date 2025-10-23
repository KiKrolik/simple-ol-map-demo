import MapComponent from "./components/MapComponent";

function App() {
  return (
    <div className="app">
      <div className="header">
        <h1>Mapa Polski</h1>
      </div>
      <div className="map-container">
        <MapComponent />
      </div>
    </div>
  );
}

export default App;
