import { useState } from "react";
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";
import {
  OSMLayer,
  VoivodeshipsLayer,
  LinesLayer,
  MaskLayer,
  ChartsLayer,
} from "./components/layers";
import { LayerVisibility, ChartType } from "./types";

function App() {
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>({
    osm: true,
    voivodeships: true,
    lines: true,
    charts: true,
  });

  const [chartType, setChartType] = useState<ChartType>("pie");

  const toggleLayer = (layerName: keyof LayerVisibility) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [layerName]: !prev[layerName],
    }));
  };

  return (
    <div className="app">
      <Sidebar
        layerVisibility={layerVisibility}
        chartType={chartType}
        onToggleLayer={toggleLayer}
        onChangeChartType={setChartType}
      />

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
