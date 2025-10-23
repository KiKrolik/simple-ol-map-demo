import React, { useEffect, useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Stroke } from "ol/style";
import { register } from "ol/proj/proj4";
import proj4 from "proj4";
import { useMap } from "../Map";

// Register coordinate systems with proj4 (if not already registered)
if (!proj4.defs("EPSG:2180")) {
  proj4.defs(
    "EPSG:2180",
    "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
  );
  register(proj4);
}

interface LinesLayerProps {
  visible?: boolean;
  style?: {
    strokeColor?: string;
    strokeWidth?: number;
  };
}

const LinesLayer: React.FC<LinesLayerProps> = ({
  visible = true,
  style = {
    strokeColor: "#ff6600",
    strokeWidth: 1.5,
  },
}) => {
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
        const response = await fetch("/data/linie.geojson");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const geojsonData = await response.json();

        // Parse features and add to source
        const features = new GeoJSON().readFeatures(geojsonData, {
          dataProjection: "EPSG:2180", // Source projection (Poland CS92)
          featureProjection: "EPSG:3857", // Target projection (Web Mercator)
        });

        console.log(`Loaded ${features.length} lines features`);
        vectorSource.addFeatures(features);

        // Create the layer
        const linesLayer = new VectorLayer({
          source: vectorSource,
          style: new Style({
            stroke: new Stroke({
              color: style.strokeColor!,
              width: style.strokeWidth!,
            }),
          }),
          properties: {
            name: "Lines",
            type: "lines",
          },
          zIndex: 200,
        });

        // Add layer to map
        map.addLayer(linesLayer);
        setLayer(linesLayer);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error loading lines";
        console.error("Error loading lines:", err);
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
        stroke: new Stroke({
          color: style.strokeColor!,
          width: style.strokeWidth!,
        }),
      });
      layer.setStyle(newStyle);
    }
  }, [layer, style]);

  // Log status for debugging
  useEffect(() => {
    if (loading) console.log("Loading lines layer...");
    if (error) console.error("Lines layer error:", error);
  }, [loading, error]);

  return null; // This component doesn't render anything visual
};

export default LinesLayer;
