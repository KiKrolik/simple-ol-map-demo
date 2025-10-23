import React from "react";
import { LayerVisibility, ChartType } from "../types";

interface SidebarProps {
  layerVisibility: LayerVisibility;
  chartType: ChartType;
  onToggleLayer: (layerName: keyof LayerVisibility) => void;
  onChangeChartType: (chartType: ChartType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  layerVisibility,
  chartType,
  onToggleLayer,
  onChangeChartType,
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>Mapa Polski</h1>
        <p>Interaktywna mapa z warstwami danych GIS</p>
      </div>

      <div className="sidebar-content">
        <div className="control-section">
          <h3 className="section-title layers">Warstwy</h3>
          <div className="control-grid">
            <div className="control-item">
              <label>
                <input
                  type="checkbox"
                  checked={layerVisibility.voivodeships}
                  onChange={() => onToggleLayer("voivodeships")}
                />
                Województwa
              </label>
            </div>
            <div className="control-item">
              <label>
                <input
                  type="checkbox"
                  checked={layerVisibility.lines}
                  onChange={() => onToggleLayer("lines")}
                />
                Linie komunikacyjne
              </label>
            </div>
            <div className="control-item">
              <label>
                <input
                  type="checkbox"
                  checked={layerVisibility.charts}
                  onChange={() => onToggleLayer("charts")}
                />
                Wykresy danych
              </label>
            </div>
          </div>
        </div>

        {layerVisibility.charts && (
          <div className="control-section fade-in">
            <h3 className="section-title charts">Typ wykresów</h3>
            <div className="radio-group">
              <div className="radio-item">
                <input
                  type="radio"
                  id="pie-chart"
                  name="chartType"
                  value="pie"
                  checked={chartType === "pie"}
                  onChange={(e) =>
                    onChangeChartType(e.target.value as ChartType)
                  }
                />
                <label htmlFor="pie-chart">🥧 Wykresy kołowe</label>
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  id="bar-chart"
                  name="chartType"
                  value="bar"
                  checked={chartType === "bar"}
                  onChange={(e) =>
                    onChangeChartType(e.target.value as ChartType)
                  }
                />
                <label htmlFor="bar-chart">📊 Wykresy słupkowe</label>
              </div>
            </div>
          </div>
        )}

        <div className="control-section">
          <div className="info-box">
            <h4 className="info-box-title">ℹ️ Informacje</h4>
            <p className="info-box-text">
              Mapa przedstawia województwa Polski z danymi statystycznymi
              wizualizowanymi jako wykresy. Linie przedstawiają sieć
              komunikacyjną.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
