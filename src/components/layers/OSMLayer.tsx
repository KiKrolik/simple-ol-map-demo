import React, { useEffect, useState } from "react";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { useMap } from "../Map";

interface OSMLayerProps {
  visible?: boolean;
}

const OSMLayer: React.FC<OSMLayerProps> = ({ visible = true }) => {
  const { map } = useMap();
  const [layer, setLayer] = useState<TileLayer<OSM> | null>(null);

  useEffect(() => {
    if (!map) return;

    // Create the OSM layer
    const osmLayer = new TileLayer({
      source: new OSM(),
      properties: {
        name: "OSM Base Layer",
        type: "base",
      },
      zIndex: 0,
    });

    // Add layer to map
    map.addLayer(osmLayer);
    setLayer(osmLayer);

    // Cleanup function
    return () => {
      if (osmLayer) {
        map.removeLayer(osmLayer);
      }
    };
  }, [map]);

  // Handle visibility changes
  useEffect(() => {
    if (layer) {
      layer.setVisible(visible);
    }
  }, [layer, visible]);

  return null; // This component doesn't render anything visual
};

export default OSMLayer;
