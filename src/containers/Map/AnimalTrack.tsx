import { Fragment } from "react";
import { Polyline } from "react-leaflet";
import L, { type LatLngExpression } from "leaflet";
import { bearing, distance } from "@turf/turf";
import { type TAnimalTracking } from "../../types/animal-tracking";
import { AnimalCircleMarker, AnimalMarker } from "./AnimalMarkers";
import { canvasRenderer } from "./shared";

type AnimalTrack = {
  num: number;
  animal: TAnimalTracking;
  isSelected: boolean;
  setSelected: (value: number) => void;
};

export const AnimalTrack = ({
  num,
  animal,
  isSelected,
  setSelected,
}: AnimalTrack) => {
  const positions = animal.positions;
  const line: LatLngExpression[] = positions.map(({ point }) => [
    point[1],
    point[0],
  ]);
  return (
    <Fragment>
      {isSelected &&
        positions.map((point, j) => {
          const nextPoint =
            j < positions.length - 1 ? positions[j + 1] : undefined;
          const nextDist = nextPoint
            ? distance(nextPoint.point, point.point, { units: "meters" })
            : 0;
          if (nextDist > 1200) {
            const prevPoint = j > 0 ? positions[j - 1] : undefined;

            const prevNextBearing = bearing(
              prevPoint ? prevPoint.point : point.point,
              nextPoint ? nextPoint.point : point.point
            );
            return (
              <AnimalMarker
                point={point}
                animal={animal}
                bearing={prevNextBearing}
                key={j}
              />
            );
          }
          return <AnimalCircleMarker point={point} animal={animal} key={j} />;
        })}
      <Polyline
        pathOptions={{
          color: isSelected ? "red" : `#000`,
          weight: 1.5,
        }}
        ref={(ref) => {
          if (ref) {
            ref.options.bubblingMouseEvents = false;
            /*
            ref.arrowheads({
              size: "10px",
              frequency: "200px",
            });
            */
          }
        }}
        renderer={canvasRenderer}
        positions={line}
        pane={isSelected ? "selected-pane" : undefined}
        eventHandlers={{
          click: (event) => {
            L.DomEvent.preventDefault(event.originalEvent);
            setSelected(num);
          },
        }}
      />
    </Fragment>
  );
};
