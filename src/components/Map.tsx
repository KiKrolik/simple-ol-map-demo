import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Map from "ol/Map";
import View from "ol/View";
import {
  POLAND_CENTER_MERCATOR,
  POLAND_EXTENT,
  MAP_CONFIG,
} from "../config/poland";

// Context to share the map instance with child layer components
interface MapContextType {
  map: Map | null;
}

const MapContext = createContext<MapContextType>({ map: null });

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
};

interface MapProps {
  children?: React.ReactNode;
  className?: string;
}

const MapComponent: React.FC<MapProps> = ({ children, className = "map" }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create the map instance
    const mapInstance = new Map({
      target: mapRef.current,
      layers: [], // Start with no layers, they will be added by child components
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
    mapInstance.getView().fit(POLAND_EXTENT, {
      padding: MAP_CONFIG.padding,
    });

    setMap(mapInstance);
    setLoading(false);

    // Cleanup function
    return () => {
      mapInstance.setTarget(undefined);
      setMap(null);
    };
  }, []);

  return (
    <div
      className="map-wrapper"
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "1rem",
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          Inicjalizacja mapy...
        </div>
      )}
      <div ref={mapRef} className={className} />
      <MapContext.Provider value={{ map }}>{children}</MapContext.Provider>
    </div>
  );
};

export default MapComponent;
