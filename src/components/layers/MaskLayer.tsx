import React, { useEffect, useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Polygon } from "ol/geom";
import { Style, Fill } from "ol/style";
import { fromLonLat } from "ol/proj";
import { useMap } from "../Map";
import { POLAND_BOUNDS } from "../../config/poland";

interface MaskLayerProps {
  /**
   * Color of the mask (should be white or light color)
   * @default 'rgba(255, 255, 255, 0.8)'
   */
  maskColor?: string;
}

const MaskLayer: React.FC<MaskLayerProps> = ({
  maskColor = "rgba(255, 255, 255, 0.8)",
}) => {
  const { map } = useMap();
  const [, setLayer] = useState<VectorLayer<VectorSource> | null>(null);

  useEffect(() => {
    if (!map) return;

    // Create a large polygon covering the whole world
    const worldBounds = [-180, -85, 180, 85]; // [minLon, minLat, maxLon, maxLat]

    // Convert world bounds to Web Mercator
    const worldSW = fromLonLat([worldBounds[0], worldBounds[1]]);
    const worldNE = fromLonLat([worldBounds[2], worldBounds[3]]);

    // Create the outer ring (world extent)
    const outerRing = [
      [worldSW[0], worldSW[1]], // Southwest
      [worldNE[0], worldSW[1]], // Southeast
      [worldNE[0], worldNE[1]], // Northeast
      [worldSW[0], worldNE[1]], // Northwest
      [worldSW[0], worldSW[1]], // Close the ring
    ];

    // Create the inner ring (Poland bounds - this will be a hole in the mask)
    // Add a small buffer around Poland to make the mask edge look better
    const buffer = 0.1; // degrees
    const polandSW = fromLonLat([
      POLAND_BOUNDS.minLon - buffer,
      POLAND_BOUNDS.minLat - buffer,
    ]);
    const polandNE = fromLonLat([
      POLAND_BOUNDS.maxLon + buffer,
      POLAND_BOUNDS.maxLat + buffer,
    ]);

    // Inner ring (hole for Poland) - must be in opposite direction (clockwise)
    const innerRing = [
      [polandSW[0], polandSW[1]], // Southwest
      [polandSW[0], polandNE[1]], // Northwest
      [polandNE[0], polandNE[1]], // Northeast
      [polandNE[0], polandSW[1]], // Southeast
      [polandSW[0], polandSW[1]], // Close the ring
    ];

    // Create polygon with hole
    const maskGeometry = new Polygon([outerRing, innerRing]);

    // Create feature with the mask geometry
    const maskFeature = new Feature({
      geometry: maskGeometry,
      name: "Poland Mask",
    });

    // Create vector source and add the mask feature
    const vectorSource = new VectorSource({
      features: [maskFeature],
    });

    // Create the mask layer
    const maskLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({
          color: maskColor,
        }),
      }),
      properties: {
        name: "Poland Mask",
        type: "mask",
      },
      zIndex: 1000, // High z-index to ensure it's on top
    });

    // Add layer to map
    map.addLayer(maskLayer);
    setLayer(maskLayer);

    console.log(
      "Poland mask layer created - areas outside Poland are now masked"
    );

    // Cleanup function
    return () => {
      if (maskLayer) {
        map.removeLayer(maskLayer);
      }
    };
  }, [map, maskColor]);

  return null; // This component doesn't render anything visual
};

export default MaskLayer;
