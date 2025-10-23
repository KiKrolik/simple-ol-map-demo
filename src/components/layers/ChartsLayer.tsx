import React, { useEffect, useState, useMemo, useRef } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { useMap } from "../Map";
import { useData } from "../../contexts/DataContext";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { getCenter } from "ol/extent";
import { Style, Icon } from "ol/style";

// Coordinate system registration is handled in DataContext

interface ChartsLayerProps {
  visible?: boolean;
  chartType?: "pie" | "bar";
  chartSize?: number;
}

interface VoivodeshipData {
  id: number;
  dane1: number;
  dane2: number;
  dane3: number;
  dane4: number;
}

interface ChartConfig {
  type: "pie" | "bar";
  size: number;
  colors: string[];
  labels: string[];
}

// Custom chart style creator using Canvas
const createCustomChartStyle = (data: number[], config: ChartConfig): Style => {
  const canvas = document.createElement("canvas");
  const size = config.size;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Clear canvas
  ctx.clearRect(0, 0, size, size);

  if (config.type === "pie") {
    // Draw pie chart
    const total = data.reduce((sum, value) => sum + value, 0);
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 3;

    let currentAngle = -Math.PI / 2; // Start from top

    data.forEach((value, index) => {
      if (value > 0) {
        const sliceAngle = (value / total) * 2 * Math.PI;

        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(
          centerX,
          centerY,
          radius,
          currentAngle,
          currentAngle + sliceAngle
        );
        ctx.closePath();
        ctx.fillStyle = config.colors[index];
        ctx.fill();

        // Draw border
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.stroke();

        currentAngle += sliceAngle;
      }
    });
  } else {
    // Draw bar chart
    const maxValue = Math.max(...data);
    const barWidth = size / (data.length + 1);
    const maxBarHeight = size * 0.7;

    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * maxBarHeight;
      const x = (index + 0.5) * barWidth;
      const y = size - barHeight - 5;

      // Draw bar
      ctx.fillStyle = config.colors[index];
      ctx.fillRect(x - barWidth / 3, y, barWidth / 1.5, barHeight);

      // Draw border
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1;
      ctx.strokeRect(x - barWidth / 3, y, barWidth / 1.5, barHeight);
    });
  }

  // Convert canvas to data URL and create Icon style
  const dataURL = canvas.toDataURL();

  return new Style({
    image: new Icon({
      src: dataURL,
      scale: 1,
      anchor: [0.5, 0.5],
      anchorXUnits: "fraction",
      anchorYUnits: "fraction",
    }),
  });
};

const ChartsLayer: React.FC<ChartsLayerProps> = ({
  visible = true,
  chartType = "pie",
  chartSize = 40,
}) => {
  const { map } = useMap();
  const {
    voivodeshipsFeatures,
    loading: dataLoading,
    error: dataError,
  } = useData();
  const [layer, setLayer] = useState<VectorLayer<VectorSource> | null>(null);
  const currentLayerRef = useRef<VectorLayer<VectorSource> | null>(null);

  // Memoize chart configuration to prevent re-renders
  const chartConfig = useMemo(
    () => ({
      type: chartType,
      size: chartSize,
      colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"], // Colors for dane1, dane2, dane3, dane4
      labels: ["Dane 1", "Dane 2", "Dane 3", "Dane 4"],
    }),
    [chartType, chartSize]
  );

  useEffect(() => {
    if (!map || !voivodeshipsFeatures) return;

    // First, clean up any existing layer
    if (currentLayerRef.current) {
      map.removeLayer(currentLayerRef.current);
      currentLayerRef.current = null;
      setLayer(null);
    }

    // Create vector source for chart features
    const chartSource = new VectorSource();

    console.log(
      `Creating charts for ${voivodeshipsFeatures.length} voivodeships (using shared data)`
    );

    // Create chart features for each voivodeship
    voivodeshipsFeatures.forEach((feature) => {
      const properties = feature.getProperties() as VoivodeshipData;
      const geometry = feature.getGeometry();

      if (!geometry) return;

      // Get the center point of the voivodeship for chart placement
      const extent = geometry.getExtent();
      const center = getCenter(extent);

      // Create data array for the chart
      const chartData = [
        properties.dane1 || 0,
        properties.dane2 || 0,
        properties.dane3 || 0,
        properties.dane4 || 0,
      ];

      // Only create chart if there's data to show
      const totalValue = chartData.reduce((sum, value) => sum + value, 0);
      if (totalValue === 0) return;

      // Create chart feature at the center of the voivodeship
      const chartFeature = new Feature({
        geometry: new Point(center),
        voivodeshipId: properties.id,
        chartData: chartData,
        totalValue: totalValue,
        name: `Voivodeship ${properties.id} Chart`,
      });

      // Create custom chart style using Canvas rendering
      const chartStyle = createCustomChartStyle(chartData, chartConfig);

      chartFeature.setStyle(chartStyle);
      chartSource.addFeature(chartFeature);
    });

    // Create the charts layer
    const chartsLayer = new VectorLayer({
      source: chartSource,
      properties: {
        name: "Data Charts",
        type: "charts",
      },
      zIndex: 300, // Above other layers but below mask
    });

    // Add layer to map
    map.addLayer(chartsLayer);
    currentLayerRef.current = chartsLayer;
    setLayer(chartsLayer);

    console.log(
      `✅ Charts layer created with ${
        chartSource.getFeatures().length
      } charts (${chartConfig.type} type, using shared data)`
    );

    // Cleanup function
    return () => {
      if (currentLayerRef.current) {
        map.removeLayer(currentLayerRef.current);
        currentLayerRef.current = null;
      }
    };
  }, [map, voivodeshipsFeatures, chartConfig]);

  // Handle visibility changes
  useEffect(() => {
    if (layer) {
      layer.setVisible(visible);
    }
  }, [layer, visible]);

  // Log status for debugging
  useEffect(() => {
    if (dataLoading) console.log("Loading charts data...");
    if (dataError) console.error("Charts data error:", dataError);
  }, [dataLoading, dataError]);

  return null; // This component doesn't render anything visual
};

export default ChartsLayer;
