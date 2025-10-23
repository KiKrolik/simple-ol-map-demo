import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

/**
 * Creates the base OSM tile layer
 */
export const createOSMLayer = (): TileLayer<OSM> => {
  return new TileLayer({
    source: new OSM(),
    properties: {
      name: "OSM Base Layer",
    },
  });
};
