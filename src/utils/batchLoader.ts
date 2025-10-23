import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";

export interface BatchLoadOptions {
  /**
   * Number of features to process in each batch
   * @default 1000
   */
  batchSize?: number;

  /**
   * Delay between batches in milliseconds
   * @default 0
   */
  batchDelay?: number;

  /**
   * Source projection (EPSG code)
   * @example "EPSG:4258", "EPSG:2180"
   */
  dataProjection: string;

  /**
   * Target projection (usually Web Mercator)
   * @default "EPSG:3857"
   */
  featureProjection?: string;

  /**
   * Callback function called after each batch is loaded
   * @param loadedCount - Number of features loaded so far
   * @param totalCount - Total number of features to load
   * @param batchNumber - Current batch number (1-based)
   */
  onBatchLoaded?: (
    loadedCount: number,
    totalCount: number,
    batchNumber: number
  ) => void;

  /**
   * Callback function called when loading is complete
   * @param totalCount - Total number of features loaded
   */
  onLoadComplete?: (totalCount: number) => void;
}

export interface LoadGeoJSONResult {
  /**
   * Total number of features loaded
   */
  featureCount: number;

  /**
   * Time taken to load all features (in milliseconds)
   */
  loadTime: number;
}

/**
 * Loads GeoJSON data in batches to avoid blocking the UI thread
 * @param url - URL to fetch GeoJSON data from
 * @param vectorSource - OpenLayers VectorSource to add features to
 * @param options - Batch loading options
 * @returns Promise that resolves with loading statistics
 */
export const loadGeoJSONInBatches = async (
  url: string,
  vectorSource: VectorSource,
  options: BatchLoadOptions
): Promise<LoadGeoJSONResult> => {
  const {
    batchSize = 1000,
    batchDelay = 0,
    dataProjection,
    featureProjection = "EPSG:3857",
    onBatchLoaded,
    onLoadComplete,
  } = options;

  const startTime = performance.now();

  try {
    // Fetch GeoJSON data
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const geojsonData = await response.json();

    // Parse all features at once (this is fast, it's the DOM manipulation that's slow)
    const allFeatures = new GeoJSON().readFeatures(geojsonData, {
      dataProjection,
      featureProjection,
    });

    const totalCount = allFeatures.length;
    let loadedCount = 0;

    // Process features in batches
    for (let i = 0; i < totalCount; i += batchSize) {
      const batch = allFeatures.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;

      // Add batch to vector source
      vectorSource.addFeatures(batch);

      loadedCount += batch.length;

      // Call progress callback
      if (onBatchLoaded) {
        onBatchLoaded(loadedCount, totalCount, batchNumber);
      }

      // Yield control back to browser between batches (if not the last batch)
      if (i + batchSize < totalCount && batchDelay >= 0) {
        await new Promise((resolve) => setTimeout(resolve, batchDelay));
      }
    }

    const loadTime = performance.now() - startTime;

    // Call completion callback
    if (onLoadComplete) {
      onLoadComplete(totalCount);
    }

    return {
      featureCount: totalCount,
      loadTime,
    };
  } catch (error) {
    console.error("Error in batch loading:", error);
    throw error;
  }
};

/**
 * Creates a simple progress message for batch loading
 * @param loadedCount - Number of features loaded
 * @param totalCount - Total features to load
 * @param batchNumber - Current batch number
 * @returns Formatted progress message
 */
export const createProgressMessage = (
  loadedCount: number,
  totalCount: number,
  batchNumber: number
): string => {
  const percentage = Math.round((loadedCount / totalCount) * 100);
  return `Loading batch ${batchNumber}: ${loadedCount}/${totalCount} features (${percentage}%)`;
};

/**
 * Utility type for batch loading state management in React components
 */
export interface BatchLoadingState {
  isLoading: boolean;
  loadedCount: number;
  totalCount: number;
  currentBatch: number;
  progressMessage: string;
  error: string | null;
}
