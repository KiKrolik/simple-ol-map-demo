import React from "react";
import { BatchLoadingState } from "../utils";

interface LoadingProgressProps {
  loadingState: BatchLoadingState;
  layerName?: string;
  style?: React.CSSProperties;
}

const LoadingProgress: React.FC<LoadingProgressProps> = ({
  loadingState,
  layerName = "Layer",
  style = {},
}) => {
  if (!loadingState.isLoading && !loadingState.error) {
    return null;
  }

  const defaultStyle: React.CSSProperties = {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: "8px 12px",
    borderRadius: "4px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    fontSize: "12px",
    color: "#333",
    zIndex: 1000,
    maxWidth: "300px",
    ...style,
  };

  const progressPercentage =
    loadingState.totalCount > 0
      ? Math.round((loadingState.loadedCount / loadingState.totalCount) * 100)
      : 0;

  return (
    <div style={defaultStyle}>
      <div style={{ fontWeight: "bold", marginBottom: "4px" }}>{layerName}</div>

      {loadingState.isLoading && (
        <div>
          <div style={{ marginBottom: "4px" }}>
            {loadingState.progressMessage}
          </div>

          {loadingState.totalCount > 0 && (
            <div
              style={{
                width: "100%",
                backgroundColor: "#e0e0e0",
                borderRadius: "3px",
                height: "6px",
                marginBottom: "4px",
              }}
            >
              <div
                style={{
                  width: `${progressPercentage}%`,
                  backgroundColor: "#4caf50",
                  height: "100%",
                  borderRadius: "3px",
                  transition: "width 0.2s ease",
                }}
              />
            </div>
          )}

          <div style={{ fontSize: "11px", color: "#666" }}>
            Batch {loadingState.currentBatch} • {progressPercentage}%
          </div>
        </div>
      )}

      {loadingState.error && (
        <div style={{ color: "#f44336", fontSize: "11px" }}>
          Error: {loadingState.error}
        </div>
      )}
    </div>
  );
};

export default LoadingProgress;
