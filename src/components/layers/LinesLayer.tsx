import React, { useEffect, useState } from "react";
import WebGLVectorLayer from "ol/layer/WebGLVector";
import VectorSource from "ol/source/Vector";
import { register } from "ol/proj/proj4";
import proj4 from "proj4";
import { useMap } from "../Map";
import { useBatchLoader } from "../../utils/useBatchLoader";

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
  const { map, registerLayerLoading, unregisterLayerLoading } = useMap();
  const [layer, setLayer] = useState<WebGLVectorLayer | null>(null);
  const { loadingState, loadData } = useBatchLoader();

  useEffect(() => {
    if (!map) return;

    const loadLayer = async () => {
      try {
        // Create vector source
        const vectorSource = new VectorSource();

        // Create the WebGL layer first (empty)
        // WebGL rendering provides much better performance for large datasets
        // - GPU-accelerated rendering
        // - Better performance with many features (thousands of lines)
        // - Smoother pan/zoom interactions
        const linesLayer = new WebGLVectorLayer({
          source: vectorSource,
          style: {
            "stroke-color": style.strokeColor!,
            "stroke-width": style.strokeWidth!,
          },
          properties: {
            name: "Lines (WebGL)",
            type: "lines",
          },
          zIndex: 200,
        });

        // Add layer to map
        map.addLayer(linesLayer);
        setLayer(linesLayer);

        // Load data in batches to avoid UI blocking
        const result = await loadData("/data/linie.geojson", vectorSource, {
          dataProjection: "EPSG:2180", // Source projection (Poland CS92)
          featureProjection: "EPSG:3857", // Target projection (Web Mercator)
          batchSize: 1000, // Process 1000 features at a time
          batchDelay: 10, // 10ms delay between batches
          onBatchLoaded: (loadedCount, totalCount, batchNumber) => {
            console.log(
              `WebGL Lines: Batch ${batchNumber} loaded (${loadedCount}/${totalCount})`
            );
          },
          onLoadComplete: (totalCount) => {
            console.log(
              `WebGL Lines: Completed loading ${totalCount} features`
            );
          },
        });

        // Log final result with timing information
        console.log(
          `WebGL Lines: Loading completed! ${
            result.featureCount
          } features loaded in ${result.loadTime.toFixed(0)}ms`
        );
      } catch (err) {
        console.error("Error loading WebGL lines layer:", err);
      }
    };

    loadLayer();

    // Cleanup function
    return () => {
      if (layer) {
        map.removeLayer(layer);
      }
    };
  }, [map, loadData]);

  // Handle visibility changes
  useEffect(() => {
    if (layer) {
      layer.setVisible(visible);
    }
  }, [layer, visible]);

  // Handle style changes for WebGL layer
  useEffect(() => {
    if (layer) {
      const webglStyle = {
        "stroke-color": style.strokeColor!,
        "stroke-width": style.strokeWidth!,
      };
      layer.setStyle(webglStyle);
    }
  }, [layer, style]);

  // Register loading state with map context for progress display
  useEffect(() => {
    const layerName = "Lines (WebGL)";

    if (loadingState.isLoading || loadingState.error) {
      registerLayerLoading(layerName, loadingState);
    } else if (loadingState.loadedCount > 0 && !loadingState.isLoading) {
      // Keep showing completed state briefly, then remove
      const timer = setTimeout(() => {
        unregisterLayerLoading(layerName);
      }, 2000);

      return () => clearTimeout(timer);
    }

    // Log status for debugging
    if (loadingState.isLoading) {
      console.log("Loading WebGL lines layer:", loadingState.progressMessage);
    }
    if (loadingState.error) {
      console.error("WebGL lines layer error:", loadingState.error);
    }
  }, [loadingState, registerLayerLoading, unregisterLayerLoading]);

  return null; // This component doesn't render anything visual
};

export default LinesLayer;
