import React, { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import {
  POLAND_CENTER_MERCATOR,
  POLAND_EXTENT,
  MAP_CONFIG,
} from "../config/poland";
import { createOSMLayer } from "../layers/baseLayers";

interface MapComponentProps {
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ className = "map" }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create the map instance
    const map = new Map({
      target: mapRef.current,
      layers: [createOSMLayer()],
      view: new View({
        center: POLAND_CENTER_MERCATOR,
        minZoom: MAP_CONFIG.minZoom,
        maxZoom: MAP_CONFIG.maxZoom,
        // Constrain the view to Poland area with buffer
        extent: [
          POLAND_EXTENT[0] - MAP_CONFIG.bufferDistance,
          POLAND_EXTENT[1] - MAP_CONFIG.bufferDistance,
          POLAND_EXTENT[2] + MAP_CONFIG.bufferDistance,
          POLAND_EXTENT[3] + MAP_CONFIG.bufferDistance,
        ],
      }),
    });

    // Fit the view to Poland's extent
    map.getView().fit(POLAND_EXTENT, {
      padding: MAP_CONFIG.padding,
    });

    // Store map instance for potential future use
    mapInstanceRef.current = map;

    // Cleanup function
    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
    };
  }, []);

  return <div ref={mapRef} className={className} />;
};

export default MapComponent;
