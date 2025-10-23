import { useState } from "react";
import Map from "./components/Map";
import {
  OSMLayer,
  VoivodeshipsLayer,
  LinesLayer,
  MaskLayer,
  ChartsLayer,
} from "./components/layers";

interface LayerVisibility {
  osm: boolean;
  voivodeships: boolean;
  lines: boolean;
  charts: boolean;
}

function App() {
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>({
    osm: true,
    voivodeships: true,
    lines: true,
    charts: true,
  });

  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

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
            <label>
              <input
                type="checkbox"
                checked={layerVisibility.charts}
                onChange={() => toggleLayer("charts")}
              />
              Wykresy danych
            </label>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <h4>Typ wykresów:</h4>
            <div style={{ display: "flex", gap: "1rem" }}>
              <label>
                <input
                  type="radio"
                  name="chartType"
                  value="pie"
                  checked={chartType === "pie"}
                  onChange={(e) =>
                    setChartType(e.target.value as "pie" | "bar")
                  }
                />
                Kołowy
              </label>
              <label>
                <input
                  type="radio"
                  name="chartType"
                  value="bar"
                  checked={chartType === "bar"}
                  onChange={(e) =>
                    setChartType(e.target.value as "pie" | "bar")
                  }
                />
                Słupkowy
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="map-container">
        <Map>
          <OSMLayer visible={layerVisibility.osm} />
          <VoivodeshipsLayer visible={layerVisibility.voivodeships} />
          <LinesLayer visible={layerVisibility.lines} />
          <ChartsLayer
            visible={layerVisibility.charts}
            chartType={chartType}
            chartSize={60}
          />
          <MaskLayer />
        </Map>
      </div>
    </div>
  );
}

export default App;
