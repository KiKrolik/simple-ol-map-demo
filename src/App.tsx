import { useState } from "react";
import Map from "./components/Map";
import {
  OSMLayer,
  VoivodeshipsLayer,
  LinesLayer,
  MaskLayer,
} from "./components/layers";

interface LayerVisibility {
  osm: boolean;
  voivodeships: boolean;
  lines: boolean;
}

function App() {
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>({
    osm: true,
    voivodeships: true,
    lines: true,
  });

  const toggleLayer = (layerName: keyof LayerVisibility) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [layerName]: !prev[layerName],
    }));
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Mapa Polski</h1>

        <div className="layer-controls" style={{ marginTop: "1rem" }}>
          <h3>Warstwy:</h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <label>
              <input
                type="checkbox"
                checked={layerVisibility.voivodeships}
                onChange={() => toggleLayer("voivodeships")}
              />
              Województwa
            </label>
            <label>
              <input
                type="checkbox"
                checked={layerVisibility.lines}
                onChange={() => toggleLayer("lines")}
              />
              Linie
            </label>
          </div>
        </div>
      </div>

      <div className="map-container">
        <Map>
          <OSMLayer visible={layerVisibility.osm} />
          <VoivodeshipsLayer visible={layerVisibility.voivodeships} />
          <LinesLayer visible={layerVisibility.lines} />
          <MaskLayer />
        </Map>
      </div>
    </div>
  );
}

export default App;
