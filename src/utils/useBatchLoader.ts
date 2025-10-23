import { useState, useCallback } from "react";
import VectorSource from "ol/source/Vector";
import {
  loadGeoJSONInBatches,
  BatchLoadOptions,
  BatchLoadingState,
  createProgressMessage,
} from "./batchLoader";

/**
 * Custom React hook for batch loading GeoJSON data
 * Provides state management and progress tracking
 */
export const useBatchLoader = () => {
  const [loadingState, setLoadingState] = useState<BatchLoadingState>({
    isLoading: false,
    loadedCount: 0,
    totalCount: 0,
    currentBatch: 0,
    progressMessage: "",
    error: null,
  });

  const loadData = useCallback(
    async (
      url: string,
      vectorSource: VectorSource,
      options: BatchLoadOptions
    ) => {
      // Reset state
      setLoadingState({
        isLoading: true,
        loadedCount: 0,
        totalCount: 0,
        currentBatch: 0,
        progressMessage: "Starting to load data...",
        error: null,
      });

      try {
        const result = await loadGeoJSONInBatches(url, vectorSource, {
          ...options,
          onBatchLoaded: (loadedCount, totalCount, batchNumber) => {
            const progressMessage = createProgressMessage(
              loadedCount,
              totalCount,
              batchNumber
            );

            setLoadingState((prev) => ({
              ...prev,
              loadedCount,
              totalCount,
              currentBatch: batchNumber,
              progressMessage,
            }));

            // Call original callback if provided
            if (options.onBatchLoaded) {
              options.onBatchLoaded(loadedCount, totalCount, batchNumber);
            }
          },
          onLoadComplete: (totalCount) => {
            setLoadingState((prev) => ({
              ...prev,
              isLoading: false,
              progressMessage: `Completed! Loaded ${totalCount} features in ${result.loadTime.toFixed(
                0
              )}ms`,
            }));

            // Call original callback if provided
            if (options.onLoadComplete) {
              options.onLoadComplete(totalCount);
            }
          },
        });

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";

        setLoadingState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
          progressMessage: `Error: ${errorMessage}`,
        }));

        throw error;
      }
    },
    []
  );

  const resetState = useCallback(() => {
    setLoadingState({
      isLoading: false,
      loadedCount: 0,
      totalCount: 0,
      currentBatch: 0,
      progressMessage: "",
      error: null,
    });
  }, []);

  return {
    loadingState,
    loadData,
    resetState,
  };
};
