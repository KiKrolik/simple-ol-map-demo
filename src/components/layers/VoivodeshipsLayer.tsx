import React, { useEffect, useState, useMemo } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Fill, Stroke } from "ol/style";
import { useMap } from "../Map";
import { useData } from "../../contexts/DataContext";

// Coordinate system registration is handled in DataContext

const DEFAULT_STYLE = {
  fillColor: "rgba(0, 100, 200, 0.2)",
  strokeColor: "#0066cc",
  strokeWidth: 2,
};

interface VoivodeshipsLayerProps {
  visible?: boolean;
  style?: {
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
  };
}

const VoivodeshipsLayer: React.FC<VoivodeshipsLayerProps> = ({
  visible = true,
  style,
}) => {
  const finalStyle = useMemo(() => ({ ...DEFAULT_STYLE, ...style }), [style]);
  const { map } = useMap();
  const {
    voivodeshipsFeatures,
    loading: dataLoading,
    error: dataError,
  } = useData();
  const [layer, setLayer] = useState<VectorLayer<VectorSource> | null>(null);

  useEffect(() => {
    if (!map || !voivodeshipsFeatures) return;

    // Create vector source and add features from shared data
    const vectorSource = new VectorSource();
    vectorSource.addFeatures([...voivodeshipsFeatures]); // Clone the features array

    // Create the layer
    const voivodeshipsLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({
          color: finalStyle.fillColor,
        }),
        stroke: new Stroke({
          color: finalStyle.strokeColor,
          width: finalStyle.strokeWidth,
        }),
      }),
      properties: {
        name: "Voivodeships",
        type: "voivodeships",
      },
      zIndex: 100,
    });

    // Add layer to map
    map.addLayer(voivodeshipsLayer);
    setLayer(voivodeshipsLayer);

    console.log(
      `✅ Voivodeships layer created with ${voivodeshipsFeatures.length} features (using shared data)`
    );

    // Cleanup function
    return () => {
      if (voivodeshipsLayer) {
        map.removeLayer(voivodeshipsLayer);
      }
    };
  }, [map, voivodeshipsFeatures, finalStyle]);

  // Handle visibility changes
  useEffect(() => {
    if (layer) {
      layer.setVisible(visible);
    }
  }, [layer, visible]);

  // Handle style changes
  useEffect(() => {
    if (layer) {
      const newStyle = new Style({
        fill: new Fill({
          color: finalStyle.fillColor,
        }),
        stroke: new Stroke({
          color: finalStyle.strokeColor,
          width: finalStyle.strokeWidth,
        }),
      });
      layer.setStyle(newStyle);
    }
  }, [
    layer,
    finalStyle.fillColor,
    finalStyle.strokeColor,
    finalStyle.strokeWidth,
  ]);

  // Log status for debugging
  useEffect(() => {
    if (dataLoading) console.log("Loading voivodeships data...");
    if (dataError) console.error("Voivodeships data error:", dataError);
  }, [dataLoading, dataError]);

  return null; // This component doesn't render anything visual
};

export default VoivodeshipsLayer;
