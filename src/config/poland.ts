import { fromLonLat } from "ol/proj";

// Poland bounding box coordinates (more precise)
export const POLAND_BOUNDS = {
  minLon: 14.0,
  minLat: 48.2,
  maxLon: 24.9,
  maxLat: 55.6,
};

// Calculate center of Poland
export const POLAND_CENTER = [
  (POLAND_BOUNDS.minLon + POLAND_BOUNDS.maxLon) / 2,
  (POLAND_BOUNDS.minLat + POLAND_BOUNDS.maxLat) / 2,
];

// Convert bounds to Web Mercator projection
const southWest = fromLonLat([POLAND_BOUNDS.minLon, POLAND_BOUNDS.minLat]);
const northEast = fromLonLat([POLAND_BOUNDS.maxLon, POLAND_BOUNDS.maxLat]);

export const POLAND_EXTENT = [
  southWest[0],
  southWest[1],
  northEast[0],
  northEast[1],
];

// Poland center in Web Mercator
export const POLAND_CENTER_MERCATOR = fromLonLat(POLAND_CENTER);

// Map configuration
export const MAP_CONFIG = {
  minZoom: 3,
  maxZoom: 18,
  bufferDistance: 50000, // 50km buffer around Poland
  padding: [20, 20, 20, 20] as [number, number, number, number],
};
