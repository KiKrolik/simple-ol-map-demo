import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import Map from "ol/Map";
import View from "ol/View";
import {
  POLAND_CENTER_MERCATOR,
  POLAND_EXTENT,
  MAP_CONFIG,
} from "../config/poland";
import LoadingProgress from "./LoadingProgress";
import { BatchLoadingState } from "../utils";

// Context to share the map instance and loading states with child layer components
interface MapContextType {
  map: Map | null;
  registerLayerLoading: (
    layerName: string,
    loadingState: BatchLoadingState
  ) => void;
  unregisterLayerLoading: (layerName: string) => void;
}

const MapContext = createContext<MapContextType>({
  map: null,
  registerLayerLoading: () => {},
  unregisterLayerLoading: () => {},
});

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
  const [layerLoadingStates, setLayerLoadingStates] = useState<
    Record<string, BatchLoadingState>
  >({});

  const registerLayerLoading = useCallback(
    (layerName: string, loadingState: BatchLoadingState) => {
      setLayerLoadingStates((prev) => ({
        ...prev,
        [layerName]: loadingState,
      }));
    },
    []
  );

  const unregisterLayerLoading = useCallback((layerName: string) => {
    setLayerLoadingStates((prev) => {
      const { [layerName]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

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
      {loading && <div className="map-loading">Inicjalizacja mapy...</div>}
      <div ref={mapRef} className={className} />

      {/* Show loading progress for each layer */}
      {Object.entries(layerLoadingStates).map(
        ([layerName, loadingState], index) => (
          <LoadingProgress
            key={layerName}
            loadingState={loadingState}
            layerName={layerName}
            style={{
              top: `${10 + index * 80}px`, // Stack multiple progress indicators
              right: "10px",
            }}
          />
        )
      )}

      <MapContext.Provider
        value={{ map, registerLayerLoading, unregisterLayerLoading }}
      >
        {children}
      </MapContext.Provider>
    </div>
  );
};

export default MapComponent;
