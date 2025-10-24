import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import GeoJSON from "ol/format/GeoJSON";
import { register } from "ol/proj/proj4";
import proj4 from "proj4";
import { Feature } from "ol";
import { VoivodeshipData } from "../types";

// Register coordinate systems with proj4 (if not already registered)
if (!proj4.defs("EPSG:4258")) {
  proj4.defs(
    "EPSG:4258",
    "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs"
  );
  register(proj4);
}

interface DataContextType {
  voivodeshipsFeatures: Feature[] | null;
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType>({
  voivodeshipsFeatures: null,
  loading: false,
  error: null,
});

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [voivodeshipsFeatures, setVoivodeshipsFeatures] = useState<
    Feature[] | null
  >(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dataLoadedRef = useRef(false);

  useEffect(() => {
    console.log("🔄 DataContext useEffect triggered");

    // AbortController to cancel request if component unmounts
    const abortController = new AbortController();

    const loadDataWithAbort = async () => {
      if (dataLoadedRef.current) {
        console.log("📌 Data already loaded, skipping fetch");
        return;
      }

      console.log("🔄 Starting voivodeships data fetch...");
      setLoading(true);
      setError(null);

      try {
        // Load GeoJSON data with abort signal
        const response = await fetch("/data/wojewodztwa.geojson", {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const geojsonData = await response.json();

        // Check if component is still mounted
        if (abortController.signal.aborted) {
          console.log("🚫 Request aborted");
          return;
        }

        // Parse features and transform coordinates
        const features = new GeoJSON().readFeatures(geojsonData, {
          dataProjection: "EPSG:4258", // Source projection (ETRS89)
          featureProjection: "EPSG:3857", // Target projection (Web Mercator)
        });

        setVoivodeshipsFeatures(features);
        dataLoadedRef.current = true;

        console.log(`✅ Voivodeships data loaded: ${features.length} features`);

        // Log sample data for debugging
        if (features.length > 0) {
          const sampleProperties =
            features[0].getProperties() as VoivodeshipData;
          console.log("Sample voivodeship data:", {
            id: sampleProperties.id,
            dane1: sampleProperties.dane1,
            dane2: sampleProperties.dane2,
            dane3: sampleProperties.dane3,
            dane4: sampleProperties.dane4,
          });
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("🚫 Fetch aborted");
          return;
        }

        const errorMessage =
          err instanceof Error
            ? err.message
            : "Unknown error loading voivodeships data";
        console.error("Error loading voivodeships data:", err);
        setError(errorMessage);
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadDataWithAbort();

    // Cleanup function to abort request
    return () => {
      console.log("🧹 Aborting fetch request");
      abortController.abort();
    };
  }, []); // Empty dependency array

  return (
    <DataContext.Provider
      value={{
        voivodeshipsFeatures,
        loading,
        error,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
