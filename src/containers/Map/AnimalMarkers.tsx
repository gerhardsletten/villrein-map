import { Popup, Marker, CircleMarker } from "react-leaflet";
import L from "leaflet";

import type { TAnimalTracking, TTrack } from "../../types/animal-tracking";
import { canvasRenderer } from "./shared";

function gradedIcon(deg: number) {
  return L.divIcon({
    html: `<span class="rounded-full overflow-hidden border border-[red] bg-white h-4 w-4 flex items-center justify-center"><img src="/icons/chevron_right.svg" class="border-0 h-full w-full block" style="transform: rotate(${
      deg - 90
    }deg);" /></span>`,
    className: "",
    iconSize: [16, 16],
  });
}

type AnimalMarker = {
  animal: TAnimalTracking;
  point: TTrack;
  bearing: number;
};

export const AnimalMarker = ({ animal, point, bearing }: AnimalMarker) => {
  return (
    <Marker
      ref={(ref) => {
        if (ref) {
          ref.options.bubblingMouseEvents = false;
        }
      }}
      icon={gradedIcon(bearing)}
      position={[point.point[1], point.point[0]]}
    >
      <AnimalPopup animal={animal} point={point} />
    </Marker>
  );
};

type AnimalCircleMarker = {
  animal: TAnimalTracking;
  point: TTrack;
};

export const AnimalCircleMarker = ({ animal, point }: AnimalCircleMarker) => {
  return (
    <CircleMarker
      pathOptions={{
        color: "red",
        fill: true,
        fillColor: "white",
        fillOpacity: 1,
        weight: 1.5,
      }}
      ref={(ref) => {
        if (ref) {
          ref.options.bubblingMouseEvents = false;
        }
      }}
      renderer={canvasRenderer}
      center={[point.point[1], point.point[0]]}
      radius={6}
      pane="marker-pane"
    >
      <div className="rounded-full border-2 border-black h-2 w-2 bg-red-500"></div>
      <AnimalPopup animal={animal} point={point} />
    </CircleMarker>
  );
};

export const AnimalPopup = ({
  animal,
  point,
}: {
  animal: TAnimalTracking;
  point: TTrack;
}) => (
  <Popup pane="popup-pane">
    Dyr: {animal.name} {animal.ageString}
    <br />
    Dato: {point.date}
    <br />
    Dist: {point.dist} m
  </Popup>
);
