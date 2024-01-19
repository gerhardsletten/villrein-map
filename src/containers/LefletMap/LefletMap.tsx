import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  Pane,
  Polyline,
  CircleMarker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression, canvas } from "leaflet";
import { center, points } from "@turf/turf";
import { maps } from "../../utils/statkart";
import {
  IAnimalPositionDetail,
  useAnimalPosition,
} from "../../hooks/use-animal-position";
import { useAnimalYear } from "../../hooks/use-year";
import { useParams, useNavigate } from "react-router-dom";

const canvasRenderer = canvas({
  tolerance: 5,
});

function LefletMap() {
  const { year: yearSlug } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<IAnimalPositionDetail>("day");
  const year = yearSlug || "2023";
  const years = useAnimalYear();
  const { data } = useAnimalPosition(year, detail);
  const [selected, setSelected] = useState(-1);
  if (!data || !years.data) {
    return "Loading";
  }
  const c = center(points(data[0].positions.map((pos) => pos.point)));

  return (
    <main className="w-screen h-screen relative">
      <aside className="grid grid-cols-1 gap-2 items-center justify-end absolute right-0 top-0 bg-white z-50 w-[200px] p-4">
        <label>Velg år</label>
        <select
          className="bg-stone-200 rounded p-1 px-2"
          value={year}
          onChange={(event) => {
            navigate(`/${event.target.value}`);
          }}
        >
          {years.data.map((y, i) => (
            <option key={i} value={y}>
              {y}
            </option>
          ))}
        </select>
        <label>Velg oppløsning</label>
        <select
          className="bg-stone-200 rounded p-1 px-2"
          value={detail}
          onChange={(event) => {
            const { value } = event.target;
            if (value === "full" || value === "day" || value === "week") {
              setDetail(value);
            }
          }}
        >
          {["week", "day", "full"].map((d, i) => (
            <option key={i} value={d}>
              {d}
            </option>
          ))}
        </select>
      </aside>

      <MapContainer
        className="w-screen h-screen z-0 overflow-hidden"
        center={[c.geometry.coordinates[1], c.geometry.coordinates[0]]}
        zoom={9}
        scrollWheelZoom={false}
        tapTolerance={5}
      >
        <TileLayer attribution={maps[0].attr} url={maps[0].url} />
        <Pane name="popup-pane" style={{ zIndex: 10001 }}></Pane>
        {data.map((animal, i) => {
          const line: LatLngExpression[] = animal.positions.map(({ point }) => [
            point[1],
            point[0],
          ]);
          const isSelected = selected === i;
          return (
            <Pane
              name={animal.id + i}
              key={i}
              style={{ zIndex: isSelected ? 10000 : undefined }}
            >
              {isSelected &&
                animal.positions.map((point, j) => {
                  return (
                    <CircleMarker
                      pathOptions={{
                        color: isSelected ? "red" : `#000`,
                        weight: 2,
                      }}
                      center={[point.point[1], point.point[0]]}
                      key={j}
                      radius={4}
                    >
                      <Popup pane="popup-pane">{point.date}</Popup>
                    </CircleMarker>
                  );
                })}
              <Polyline
                pathOptions={{
                  color: isSelected ? "red" : `#000`,
                  weight: 2,
                }}
                renderer={canvasRenderer}
                positions={line}
                eventHandlers={{
                  click: () => {
                    setSelected(i);
                  },
                }}
              />
            </Pane>
          );
        })}
      </MapContainer>
    </main>
  );
}

export default LefletMap;
