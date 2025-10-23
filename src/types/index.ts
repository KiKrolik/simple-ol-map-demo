// Layer visibility interface
export interface LayerVisibility {
  osm: boolean;
  voivodeships: boolean;
  lines: boolean;
  charts: boolean;
}

// Chart types
export type ChartType = "pie" | "bar";

// Voivodeship data structure
export interface VoivodeshipData {
  id: number;
  dane1: number;
  dane2: number;
  dane3: number;
  dane4: number;
}
