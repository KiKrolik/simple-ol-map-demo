import React, { useEffect, useState, useMemo } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Fill, Stroke } from "ol/style";
import { register } from "ol/proj/proj4";
import proj4 from "proj4";
import { useMap } from "../Map";

// Register coordinate systems with proj4 (if not already registered)
if (!proj4.defs("EPSG:4258")) {
  proj4.defs(
    "EPSG:4258",
    "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs"
  );
  register(proj4);
}

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
  const [layer, setLayer] = useState<VectorLayer<VectorSource> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!map) return;

    const loadLayer = async () => {
      setLoading(true);
      setError(null);

      try {
        // Create vector source
        const vectorSource = new VectorSource();

        // Load GeoJSON data
        const response = await fetch("/data/wojewodztwa.geojson");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const geojsonData = await response.json();

        // Parse features and add to source
        const features = new GeoJSON().readFeatures(geojsonData, {
          dataProjection: "EPSG:4258", // Source projection (ETRS89)
          featureProjection: "EPSG:3857", // Target projection (Web Mercator)
        });

        console.log(`Loaded ${features.length} voivodeships features`);
        vectorSource.addFeatures(features);

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
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Unknown error loading voivodeships";
        console.error("Error loading voivodeships:", err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadLayer();

    // Cleanup function
    return () => {
      if (layer) {
        map.removeLayer(layer);
      }
    };
  }, [map]);

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
  }, [layer, finalStyle.fillColor, finalStyle.strokeColor, finalStyle.strokeWidth]);

  // Log status for debugging
  useEffect(() => {
    if (loading) console.log("Loading voivodeships layer...");
    if (error) console.error("Voivodeships layer error:", error);
  }, [loading, error]);

  return null; // This component doesn't render anything visual
};

export default VoivodeshipsLayer;
