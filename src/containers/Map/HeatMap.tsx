import type { TAnimalTracking } from "../../types/animal-tracking";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import { useEffect } from "react";

type THeadTuple = [number, number, number];

type HeatMap = {
  tracks: TAnimalTracking[];
};

export const HeatMap = ({ tracks }: HeatMap) => {
  const map = useMap();
  useEffect(() => {
    const points: THeadTuple[] = tracks.reduce(
      (allPoints: THeadTuple[], item) => {
        const p: THeadTuple[] = item.positions.map(({ point }) => [
          point[1],
          point[0],
          1,
        ]);
        return allPoints.concat(p);
      },
      []
    );
    const heat = L.heatLayer(points, {
      radius: 25,
      blur: 20,
      gradient: { 0.4: "blue", 0.65: "lime", 1: "red" },
    });
    heat.addTo(map);
    return () => {
      heat.removeFrom(map);
    };
  }, [tracks, map]);
  return null;
};
